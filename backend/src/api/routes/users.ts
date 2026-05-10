import { Router } from 'express';

const router = Router();

/** * GET /api/users/:address
 * Placeholder for fetching user profile 
 */
router.get('/:address', (req, res) => {
  res.status(501).json({ message: "User profile logic coming soon! 🤙" });
});

export default router;