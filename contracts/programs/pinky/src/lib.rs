use anchor_lang::prelude::*;
use anchor_lang::system_program;

declare_id!("3UoZ5ixtrtHVPRbsJfb5a9ZPPnXmYjCjcWqDmS3Z33xv");

#[program]
pub mod pinky {
    use super::*;

    pub fn create_pact(
        ctx: Context<CreatePact>,
        pact_id: u64,
        habit_name: String,
        category: String,
        deadline: i64,
        penalty_destination: PenaltyDestination,
        stake_lamports: u64,
    ) -> Result<()> {
        let pact = &mut ctx.accounts.pact;
        let creator = &ctx.accounts.creator;
        let clock = Clock::get()?;

        require!(habit_name.len() <= 100, PinkyError::HabitNameTooLong);
        require!(!habit_name.trim().is_empty(), PinkyError::HabitNameEmpty);

        require!(category.len() <= 50, PinkyError::CategoryTooLong);
        require!(!category.trim().is_empty(), PinkyError::CategoryEmpty);

        require!(
            deadline > clock.unix_timestamp,
            PinkyError::DeadlineInPast
        );

        require!(
            deadline <= clock.unix_timestamp + (365 * 24 * 60 * 60),
            PinkyError::DeadlineTooFar
        );

        require!(
            stake_lamports >= 10_000_000,
            PinkyError::StakeTooLow
        );

        // Transfer SOL from the creator into the pact account.
        // Think of this like locking money into an escrow account.
        let transfer_ctx = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: creator.to_account_info(),
                to: pact.to_account_info(),
            },
        );

        system_program::transfer(transfer_ctx, stake_lamports)?;

        pact.pact_id = pact_id;
        pact.creator = creator.key();
        pact.habit_name = habit_name;
        pact.category = category;
        pact.deadline = deadline;
        pact.created_at = clock.unix_timestamp;
        pact.stake_amount = stake_lamports;
        pact.penalty_destination = penalty_destination;
        pact.witnesses = Vec::new();
        pact.pending_witnesses = Vec::new();
        pact.witness_votes = Vec::new();
        pact.checkins = Vec::new();
        pact.status = PactStatus::Active;
        pact.bump = ctx.bumps.pact;

        Ok(())
    }

    pub fn invite_witness(
        ctx: Context<ModifyPact>,
        witness_pubkey: Pubkey,
    ) -> Result<()> {
        let pact = &mut ctx.accounts.pact;

        require!(pact.status == PactStatus::Active, PinkyError::PactNotActive);

        require!(
            pact.witnesses.len() + pact.pending_witnesses.len() < 5,
            PinkyError::TooManyWitnesses
        );

        require!(
            !pact.pending_witnesses.contains(&witness_pubkey),
            PinkyError::AlreadyInvited
        );

        require!(
            !pact.witnesses.contains(&witness_pubkey),
            PinkyError::AlreadyInvited
        );

        require!(
            witness_pubkey != pact.creator,
            PinkyError::CreatorCannotBeWitness
        );

        pact.pending_witnesses.push(witness_pubkey);

        Ok(())
    }

    pub fn accept_witness_role(ctx: Context<WitnessAction>) -> Result<()> {
        let pact = &mut ctx.accounts.pact;
        let witness = &ctx.accounts.witness;

        require!(pact.status == PactStatus::Active, PinkyError::PactNotActive);

        require!(
            pact.pending_witnesses.contains(&witness.key()),
            PinkyError::NotInvited
        );

        pact.pending_witnesses.retain(|w| w != &witness.key());
        pact.witnesses.push(witness.key());
        pact.witness_votes.push(WitnessVote::NoVote);

        Ok(())
    }

    pub fn check_in(
        ctx: Context<CreatorAction>,
        evidence_uri: Option<String>,
    ) -> Result<()> {
        let pact = &mut ctx.accounts.pact;
        let clock = Clock::get()?;

        require!(pact.status == PactStatus::Active, PinkyError::PactNotActive);

        require!(
            clock.unix_timestamp < pact.deadline,
            PinkyError::DeadlineReached
        );

        require!(
            pact.checkins.len() < 5,
            PinkyError::TooManyCheckins
        );

        if let Some(uri) = &evidence_uri {
            require!(uri.len() <= 100, PinkyError::EvidenceUriTooLong);
        }

        pact.checkins.push(CheckIn {
            timestamp: clock.unix_timestamp,
            evidence_uri,
        });

        Ok(())
    }

    pub fn vote(
        ctx: Context<WitnessAction>,
        vote_choice: WitnessVote,
    ) -> Result<()> {
        let pact = &mut ctx.accounts.pact;
        let witness = &ctx.accounts.witness;
        let clock = Clock::get()?;

        require!(
            clock.unix_timestamp >= pact.deadline,
            PinkyError::DeadlineNotReached
        );

        require!(pact.status == PactStatus::Active, PinkyError::PactNotActive);

        require!(
            vote_choice != WitnessVote::NoVote,
            PinkyError::InvalidVote
        );

        let witness_index = pact
            .witnesses
            .iter()
            .position(|w| w == &witness.key())
            .ok_or(PinkyError::NotAWitness)?;

        require!(
            pact.witness_votes[witness_index] == WitnessVote::NoVote,
            PinkyError::AlreadyVoted
        );

        pact.witness_votes[witness_index] = vote_choice;

        Ok(())
    }

    pub fn settle_pact(ctx: Context<SettlePact>) -> Result<()> {
        let pact = &mut ctx.accounts.pact;
        let clock = Clock::get()?;

        require!(pact.status == PactStatus::Active, PinkyError::PactNotActive);

        require!(
            clock.unix_timestamp >= pact.deadline,
            PinkyError::DeadlineNotReached
        );

        require!(
            !pact.witnesses.is_empty(),
            PinkyError::NoWitnesses
        );

        let total = pact.witnesses.len();

        let complete = pact
            .witness_votes
            .iter()
            .filter(|v| **v == WitnessVote::Complete)
            .count();

        let failed = pact
            .witness_votes
            .iter()
            .filter(|v| **v == WitnessVote::Failed)
            .count();

        if complete > total / 2 {
            // Success: return the staked SOL to the creator.
            pact.status = PactStatus::CompletedSuccess;

            let stake = pact.stake_amount;

            **pact
                .to_account_info()
                .try_borrow_mut_lamports()? -= stake;

            **ctx
                .accounts
                .creator
                .to_account_info()
                .try_borrow_mut_lamports()? += stake;
        } else if failed > total / 2 {
            // For now we only mark failure.
            // Later we will implement split/donate/burn/prize-pool payout logic.
            pact.status = PactStatus::CompletedFailure;
        } else {
            pact.status = PactStatus::Disputed;
        }

        Ok(())
    }
}

// ── Accounts ─────────────────────────────────────────────

#[derive(Accounts)]
#[instruction(pact_id: u64)]
pub struct CreatePact<'info> {
    #[account(
        init,
        payer = creator,
        space = Pact::LEN,
        seeds = [
            b"pact",
            creator.key().as_ref(),
            &pact_id.to_le_bytes()
        ],
        bump
    )]
    pub pact: Account<'info, Pact>,

    #[account(mut)]
    pub creator: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ModifyPact<'info> {
    #[account(
        mut,
        seeds = [
            b"pact",
            pact.creator.as_ref(),
            &pact.pact_id.to_le_bytes()
        ],
        bump = pact.bump,
        has_one = creator
    )]
    pub pact: Account<'info, Pact>,

    pub creator: Signer<'info>,
}

#[derive(Accounts)]
pub struct CreatorAction<'info> {
    #[account(
        mut,
        seeds = [
            b"pact",
            pact.creator.as_ref(),
            &pact.pact_id.to_le_bytes()
        ],
        bump = pact.bump,
        has_one = creator
    )]
    pub pact: Account<'info, Pact>,

    pub creator: Signer<'info>,
}

#[derive(Accounts)]
pub struct WitnessAction<'info> {
    #[account(
        mut,
        seeds = [
            b"pact",
            pact.creator.as_ref(),
            &pact.pact_id.to_le_bytes()
        ],
        bump = pact.bump
    )]
    pub pact: Account<'info, Pact>,

    pub witness: Signer<'info>,
}

#[derive(Accounts)]
pub struct SettlePact<'info> {
    #[account(
        mut,
        seeds = [
            b"pact",
            pact.creator.as_ref(),
            &pact.pact_id.to_le_bytes()
        ],
        bump = pact.bump,
        has_one = creator
    )]
    pub pact: Account<'info, Pact>,

    #[account(mut)]
    pub creator: SystemAccount<'info>,

    pub caller: Signer<'info>,
}

// ── State ─────────────────────────────────────────────────

#[account]
pub struct Pact {
    pub pact_id: u64,
    pub creator: Pubkey,
    pub habit_name: String,
    pub category: String,
    pub deadline: i64,
    pub created_at: i64,
    pub stake_amount: u64,
    pub penalty_destination: PenaltyDestination,
    pub witnesses: Vec<Pubkey>,
    pub pending_witnesses: Vec<Pubkey>,
    pub witness_votes: Vec<WitnessVote>,
    pub checkins: Vec<CheckIn>,
    pub status: PactStatus,
    pub bump: u8,
}

impl Pact {
    pub const LEN: usize = 8          // Anchor account discriminator
        + 8                           // pact_id
        + 32                          // creator
        + 4 + 100                     // habit_name string
        + 4 + 50                      // category string
        + 8                           // deadline
        + 8                           // created_at
        + 8                           // stake_amount
        + 1                           // penalty_destination enum
        + 4 + (32 * 5)                // witnesses vec, max 5
        + 4 + (32 * 5)                // pending_witnesses vec, max 5
        + 4 + (1 * 5)                 // witness_votes vec, max 5
        + 4 + (5 * (8 + 1 + 4 + 100)) // checkins vec, max 5
        + 1                           // status enum
        + 1;                          // bump
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct CheckIn {
    pub timestamp: i64,
    pub evidence_uri: Option<String>,
}

// ── Enums ─────────────────────────────────────────────────

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum PenaltyDestination {
    SplitWitnesses,
    Donate,
    Burn,
    PrizePool,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum WitnessVote {
    NoVote,
    Complete,
    Failed,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum PactStatus {
    Active,
    CompletedSuccess,
    CompletedFailure,
    Disputed,
}

// ── Errors ────────────────────────────────────────────────

#[error_code]
pub enum PinkyError {
    #[msg("Habit name must be 100 characters or less")]
    HabitNameTooLong,

    #[msg("Habit name cannot be empty")]
    HabitNameEmpty,

    #[msg("Category must be 50 characters or less")]
    CategoryTooLong,

    #[msg("Category cannot be empty")]
    CategoryEmpty,

    #[msg("Deadline must be in the future")]
    DeadlineInPast,

    #[msg("Deadline cannot be more than 365 days away")]
    DeadlineTooFar,

    #[msg("Minimum stake is 0.01 SOL")]
    StakeTooLow,

    #[msg("Pact is not active")]
    PactNotActive,

    #[msg("Maximum 5 witnesses allowed")]
    TooManyWitnesses,

    #[msg("This wallet has already been invited or added")]
    AlreadyInvited,

    #[msg("Creator cannot be a witness")]
    CreatorCannotBeWitness,

    #[msg("You were not invited to this pact")]
    NotInvited,

    #[msg("Deadline has not been reached yet")]
    DeadlineNotReached,

    #[msg("Deadline has already been reached")]
    DeadlineReached,

    #[msg("You are not a witness on this pact")]
    NotAWitness,

    #[msg("You have already voted")]
    AlreadyVoted,

    #[msg("Vote must be Complete or Failed")]
    InvalidVote,

    #[msg("Maximum 5 check-ins allowed in MVP")]
    TooManyCheckins,

    #[msg("Evidence URI must be 100 characters or less")]
    EvidenceUriTooLong,

    #[msg("Pact must have at least one accepted witness")]
    NoWitnesses,
}