/** API endpoints for AI interactions, such as requesting a daily voice message or starting a voice chat. */
import { Router } from 'express';
import { getCoachingSession } from '../controllers/coachController';

const router = Router();

router.get('/coach', getCoachingSession);

export default router;