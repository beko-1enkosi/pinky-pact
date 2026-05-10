# Pinky 🤙
### Stake your habits. Keep your word. On Solana.

> A mobile-first accountability app where you stake SOL or USDC on your
> personal habits, invite trusted witnesses, and get coached daily by an
> AI voice. Complete your habit — get your money back. Fail — your
> stake goes exactly where you decided it would go when you made the pact.

---

## Refined Concept Paragraph

Pinky is a mobile-first accountability app that turns personal goals into
on-chain commitments. Users create a habit pact, stake SOL or USDC, invite
trusted witnesses, and receive daily AI voice coaching from ElevenLabs.
If they complete the habit, their stake is returned. If they fail, the
stake is redistributed based on the pact rules — to witnesses, a group
pool, a charity wallet, or a burn address. Pinky combines social pressure,
financial commitment, and AI coaching to help people keep their word.

---

## Taglines

**"Your word. On-chain."**
**"Stake your habits. Keep your word."**

---

## How It Works

### Creating a Pact (Voice-First Flow)

The creator can either fill in a form OR speak their pact aloud.

**Voice flow (ElevenLabs flagship feature):**

User taps the microphone and says:
*"I want to run 5 kilometres every day for 7 days and stake 0.5 SOL."*

Pinky's voice agent (ElevenLabs) parses this and responds:
*"Got it. You're creating a 7-day running pact. You'll stake 0.5 SOL.
I'll coach you every morning at 7am. Want to lock it in?"*

User says "Yes" → pact is created → SOL locks into smart contract.

**Form flow (alternative):**
1. Habit name: "Run 5km every day"
2. Category: Fitness / Art / Education / Nutrition / Finance / Other
3. Duration: 7 days / 14 days / 30 days / custom
4. Stake currency: SOL or USDC
5. Stake amount
6. Penalty destination (creator chooses ONE):
   - Split between witnesses
   - Donate to a charity/public goods wallet
   - Burn (send to dead address)
   - Roll into a group challenge prize pool
7. Invite witnesses by wallet address (they must accept)
8. Confirm → stake locks into smart contract escrow

---

## The Witness System

### Why witnesses exist
Witnesses are the social pressure layer. Knowing that real people
you invited are watching makes the commitment feel real.

### Witness flow (3 steps — prevents fake witnesses)

```
Step 1: creator calls invite_witness(witness_pubkey)
Step 2: witness opens app, sees invite, calls accept_witness_role()
Step 3: after deadline, witness calls vote(Complete | Failed)
```

Only wallets that have called accept_witness_role() can vote.
This prevents the creator from adding random wallets as fake witnesses.

### Witness incentive — fairly designed

Witnesses do NOT automatically profit from failure unless the creator
specifically chose "Split between witnesses" as their penalty destination.

If the creator chose "Donate" or "Burn" or "Prize Pool":
- Witnesses have zero financial incentive to vote against the creator
- They're purely accountability partners

If the creator chose "Split between witnesses":
- Witnesses have skin in the game — but the CREATOR made that choice
- The creator knew this when they set it up
- It's consensual and transparent

This design removes the "my friends are trying to profit from my failure"
problem entirely — because the creator controls where their stake goes.

---

## The 3 Outcomes

### Outcome A — Success
All witnesses (or majority, configurable) vote "Completed" →
Smart contract releases stake back to creator's wallet.
ElevenLabs plays: *"You kept your word. Pinky respected. 🤙"*

### Outcome B — Failure
Majority vote "Failed" →
Smart contract executes the creator's chosen penalty:
- Split → witnesses receive equal shares
- Donate → stake sends to pre-set charity wallet address
- Burn → stake sends to dead address (111...111)
- Prize Pool → stake adds to a communal challenge pool

ElevenLabs plays: *"Pact broken. No judgment. Come back stronger."*

### Outcome C — Dispute (no consensus)
Not all witnesses vote, or votes are split →
Pact enters **Dispute Mode** →
Funds remain locked →
After 90 days, if unresolved:
→ Funds sent to the creator's pre-selected penalty destination
(NOT automatically burned — the creator chose this at creation)

---

## Tech Stack

### Mobile Frontend
| Tool | Purpose |
|---|---|
| **Expo + React Native** | Cross-platform mobile app |
| **Solana Mobile Wallet Adapter** | Wallet connection on mobile (Phantom) |
| **NativeWind** | Tailwind CSS for React Native |
| **Expo Notifications** | Daily habit reminder push notifications |
| **Expo ImagePicker** | Photo evidence for check-ins |
| **Expo AV** | Play ElevenLabs audio messages |

### Blockchain
| Tool | Purpose |
|---|---|
| **Solana Devnet** | Test network — free devnet SOL |
| **Anchor (Rust)** | Smart contract framework |
| **@solana/web3.js** | Solana JS SDK |
| **@solana/spl-token** | USDC token support |

### AI Voice (ElevenLabs)
| Integration | Purpose |
|---|---|
| **Conversational AI Agent** | Voice pact creation — user speaks, agent responds |
| **Text-to-Speech** | Daily coaching messages per habit/day |
| **Speech-to-Text** | Transcribe the user's spoken pact |
| **Sound Effects** | Success/failure audio feedback |

### Cross-Chain (LI.FI — bonus track)
| Tool | Purpose |
|---|---|
| **LI.FI Widget** | Fund pact stake from any chain |
| | User arrives with USDC on Solana, no manual bridging |

### AI (Noah AI — trynoah.ai)
| Use | Purpose |
|---|---|
| Habit coaching scripts | Generate personalised daily messages per habit |
| Pact parsing | Extract habit/duration/stake from voice input |
| Difficulty scoring | Suggest realistic stake amounts |

### API Layer
| Tool | Purpose |
|---|---|
| **Next.js API routes** | ElevenLabs + Noah AI API calls |
| **Vercel** | Deploy the API layer |

---

## Smart Contract (Anchor / Rust)

### Accounts

```rust
#[account]
pub struct Pact {
    pub creator: Pubkey,
    pub stake_amount: u64,           // In lamports (SOL) or token units (USDC)
    pub stake_token: PactToken,      // Sol or USDC
    pub habit_name: String,          // Max 100 chars
    pub category: String,
    pub deadline: i64,               // Unix timestamp
    pub created_at: i64,
    pub penalty_destination: PenaltyDestination,
    pub charity_address: Option<Pubkey>, // If penalty = Donate
    pub witnesses: Vec<Pubkey>,      // Accepted witnesses only
    pub pending_witnesses: Vec<Pubkey>, // Invited but not accepted
    pub witness_votes: Vec<Vote>,
    pub status: PactStatus,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum PenaltyDestination {
    SplitWitnesses,
    Donate,
    Burn,
    PrizePool,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum PactToken {
    Sol,
    Usdc,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum Vote {
    NoVote,
    Complete,
    Failed,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum PactStatus {
    PendingWitnesses,   // Waiting for witnesses to accept
    Active,             // All witnesses accepted, pact running
    Voting,             // Deadline passed, waiting for votes
    CompletedSuccess,   // Paid out to creator
    CompletedFailure,   // Penalty executed
    Disputed,           // No consensus, locked
    Burned,             // 90 days passed, penalty executed
}
```

### Instructions

```
create_pact(habit_name, category, deadline, stake_amount,
            stake_token, penalty_destination, charity_address?)
  → Creator stakes SOL/USDC into PDA escrow

invite_witness(pact_address, witness_pubkey)
  → Adds witness to pending_witnesses list

accept_witness_role(pact_address)
  → Witness confirms — moves from pending to witnesses list
  → When all witnesses accept, status → Active

check_in(pact_address, evidence_uri?)
  → Creator logs daily progress (optional photo IPFS link)

vote(pact_address, vote: Complete | Failed)
  → Only accepted witnesses can vote
  → Only callable after deadline
  → Each witness votes once

settle_pact(pact_address)
  → Callable after all witnesses vote
  → Reads votes, executes penalty destination
  → Updates status

resolve_dispute(pact_address)
  → Callable 90 days after deadline if status = Disputed
  → Executes creator's penalty destination
```

---

## ElevenLabs Voice Architecture

### Voice Pact Creation (Conversational Agent)

This is the flagship ElevenLabs integration — it earns the prize.

```
User taps mic → speaks their pact
  ↓
ElevenLabs Speech-to-Text transcribes
  ↓
Noah AI parses: habit / duration / stake / category
  ↓
ElevenLabs Agent responds conversationally:
  "Got it. 7-day running pact. 0.5 SOL on the line.
   Want to choose where your stake goes if you fail?"
  ↓
User responds: "Donate it to charity"
  ↓
Agent confirms: "Locked in. I'll coach you every morning.
   Day 1 starts now. Don't let me down."
  ↓
Smart contract creates pact
```

### Daily Coaching Messages

Generated by Noah AI, voiced by ElevenLabs TTS, delivered as
push notification audio.

| Day / Moment | Tone | Sample |
|---|---|---|
| Pact created | Hype + serious | "Pact locked. Your SOL is on the line. Let's go." |
| Day 1 morning | Fresh start | "Day 1. This is where it begins. Make it count." |
| Day 3-4 (the dip) | Empathetic + firm | "It gets hard around now. That's normal. Push through." |
| Halfway | Pride + urgency | "Halfway there. You've already proved something to yourself." |
| Final day | High urgency | "Last day. Don't throw away everything you've built." |
| Success | Celebration | "You kept your word. Pinky respected. 🤙" |
| Failure | No judgment | "Pact broken. No judgment. Come back stronger." |
| Witness invited | Role explanation | "You've been invited to witness a pact. Your job is to hold them accountable." |

---

## Witness Reputation (Product Vision — not built in MVP)

Witnesses build an on-chain reputation score over time:
- Participated in X pacts as witness
- Voted on Y% of pacts they accepted
- Never voted late
- Creator satisfaction rating

Future users can see a witness's reputation before inviting them.
This makes Pinky feel like a real social accountability protocol
rather than a simple escrow app.

**For the hackathon:** mention this in the pitch as "coming in v2."
One slide. No code needed.

---

## App Screens

### Home / Feed
- Active pacts with countdown timers and stake amounts
- Pacts you're witnessing (with vote pending badges)
- Recent activity feed
- "New Pact" button (opens voice OR form flow)

### Create Pact
- Large microphone button: "Speak your pact"
- OR "Fill in manually" link below
- Penalty destination picker (4 options with clear explanations)
- Witness invite flow

### Active Pact View
- Habit + countdown timer
- Daily check-in button
- Progress photo gallery
- Audio player: today's coaching message
- Witness list + their acceptance status

### Witness View
- Pacts you're witnessing
- Creator's check-in history
- Vote button (appears after deadline, before your vote)

### Settlement Screen
- Outcome announcement
- SOL/USDC transaction confirmation on Solana Explorer
- Shareable result card: "I kept my word. 7-day running pact. ✓"

---

## Devnet Setup — Step by Step

### Important: MetaMask will NOT work

MetaMask is an Ethereum wallet. Solana is a completely separate
blockchain. You need Phantom.

### Step 1 — Install Phantom

Browser: phantom.com → Add to Chrome/Brave
Mobile: App Store / Play Store → "Phantom Crypto Wallet"

Create a new wallet. Write your seed phrase on paper.
Never put it in Notes, Google Docs, or anywhere digital.

### Step 2 — Switch to Devnet

In Phantom browser extension:
Settings (gear icon) → Developer Settings → Change Network → Devnet

Your balance shows 0 SOL — that's correct, it's the test network.

### Step 3 — Get free devnet SOL

Option A (easiest — web browser):
1. Go to faucet.solana.com
2. Paste your Phantom wallet address
3. Select "Devnet"
4. Click "Confirm Airdrop"
5. Wait 10 seconds → 2 SOL appears in Phantom

Option B (terminal):
```bash
solana config set --url devnet
solana airdrop 2 YOUR_WALLET_ADDRESS
solana balance
```

Run the faucet multiple times if you need more.
Devnet SOL is free, fake, and unlimited for testing.

### Step 4 — Verify

Open Phantom → you should see 2 SOL (devnet).
This is your Monopoly money for building. Nothing is real.

---

## Development Phases (3 Days)

### Day 1 — Smart Contract + Setup
Morning:
- [ ] Install Expo CLI, create new project
- [ ] Install Solana Mobile Wallet Adapter
- [ ] Connect Phantom wallet in Expo app (basic screen)

Afternoon:
- [ ] Write Anchor smart contract (all accounts + instructions)
- [ ] anchor build → fix compile errors
- [ ] anchor deploy --provider.cluster devnet
- [ ] Note down Program ID for README

Evening:
- [ ] Test create_pact and settle_pact from terminal
- [ ] Basic home screen UI in React Native

### Day 2 — Core Product Flow
Morning:
- [ ] Create pact screen (form version first)
- [ ] Wire create_pact instruction to UI
- [ ] Witness invite + accept flow UI

Afternoon:
- [ ] Vote flow (witness screen)
- [ ] Settlement flow (SOL distribution)
- [ ] ElevenLabs: first voice message playing in app

Evening:
- [ ] Voice pact creation (microphone → ElevenLabs → pact form)
- [ ] Daily coaching messages (3-4 templates)

### Day 3 — Polish + Demo Prep
Morning:
- [ ] LI.FI widget (bonus track — fund from any chain)
- [ ] Penalty destination UI (4 options clearly explained)
- [ ] Push notification setup for daily messages

Afternoon:
- [ ] Seed devnet with mock pacts for demo
- [ ] Full demo run — time it to 3 minutes
- [ ] Record backup demo video

Evening:
- [ ] README + contract deployment addresses
- [ ] Submit to all eligible tracks

---

## Prize Track Summary

| Track | Prize | Requirement | Status |
|---|---|---|---|
| Solana main | $10,000 | Rust smart contract on devnet | Core |
| Solana Mobile | Seeker Phones | Expo APK + Mobile Wallet Adapter | Core |
| ElevenLabs | $1,980 plan | Voice pact creation + daily coaching | Core |
| LI.FI | $1,000 | Fund stake from any chain | Bonus |

---

## Demo Script (3 minutes)

**00:00 — 00:20** Open Pinky. Connect Phantom.
"I'm training for a marathon. I want to hold myself accountable.
This is Pinky."

**00:20 — 00:50** Tap the mic. Speak the pact.
"I want to run 5km every day for 7 days and stake 0.5 SOL."
ElevenLabs agent responds, confirms, asks about penalty destination.
"Donate to charity." Pact locked.

**00:50 — 01:20** Show witness invite. Friend accepts.
Play today's coaching message — ElevenLabs voice, personalised.

**01:20 — 01:50** Fast forward — 7 days of check-ins shown.
Deadline arrives. Witness votes "Completed."
Smart contract settles. SOL returns to wallet.
Show Solana Explorer transaction.

**01:50 — 02:20** Show failure scenario with different mock pact.
Creator chose "Donate" as penalty destination.
Stake goes to charity wallet. Explorer confirms.

**02:20 — 03:00** Pitch close.
"Pinky works for marathons, painting, saving money, studying —
anything you want to commit to. The smart contract enforces the outcome.
ElevenLabs keeps you accountable every single morning.
And the penalty goes exactly where you decided when you still believed
in yourself — when you made the pact. Your word. On-chain."

---

*Pinky 🤙 — Dev3Pack Hackathon · May 8-10 2025*
*Solana · ElevenLabs · Expo · Anchor · LI.FI*
*Built in South Africa 🇿🇦*
