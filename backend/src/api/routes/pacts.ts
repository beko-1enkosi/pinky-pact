/** Routes for pact metadata (off-chain), including creation details and habit tracking status. */
import { Router } from 'express';
const router = Router();

/** TODO: Implement real pact creation logic */
router.post('/create', (req, res) => {
  console.log("Pact creation triggered, but not implemented yet.");
  res.status(501).json({ 
    message: "Pact creation is still under development. Check back soon!" 
  });
});

export default router;