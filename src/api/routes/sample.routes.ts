import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  getSamplesForAgent,
  addSample,
  markSampleCollected,
  reportDelay,
} from '../controllers/sample.controller';

const router = Router();

// Protect all sample routes with authentication
router.use(authMiddleware);

// GET /api/v1/samples/:agentId - Get samples for an agent
router.get('/:agentId', getSamplesForAgent);

// POST /api/v1/samples - Add a new sample
router.post('/', addSample);

// PATCH /api/v1/samples/:sampleId/collect - Mark sample as collected
router.patch('/:sampleId/collect', markSampleCollected);

// POST /api/v1/samples/:sampleId/report-delay - Report a delay
router.post('/:sampleId/report-delay', reportDelay);

export default router;
