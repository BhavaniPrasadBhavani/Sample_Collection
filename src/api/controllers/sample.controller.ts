import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../../types';
import {
  findSamplesByAgentId,
  createNewSample,
  updateSampleToCollected,
  reportSampleDelay,
} from '../services/sample.service';

type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

export const getSamplesForAgent = async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    
    // Verify the agent can only access their own samples
    if (req.agent?.agentId !== agentId) {
      return res.status(403).json({
        error: 'Access denied',
      });
    }

    const samples = await findSamplesByAgentId(agentId);

    res.status(200).json({
      message: 'Samples retrieved successfully',
      samples,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        error: error.message,
      });
    }
    res.status(500).json({
      error: 'Internal server error',
    });
  }
};

export const addSample = async (req: Request, res: Response) => {
  try {
    const { patientName, pickupAddress, scheduledDate, priority, notes, agentId } = req.body;

    if (!patientName || !pickupAddress || !scheduledDate || !agentId) {
      return res.status(400).json({
        error: 'Patient name, pickup address, scheduled date, and agent ID are required',
      });
    }

    const sampleData = {
      patientName,
      pickupAddress,
      scheduledDate: new Date(scheduledDate),
      priority: priority as Priority,
      notes,
      agentId,
    };

    const sample = await createNewSample(sampleData);

    res.status(201).json({
      message: 'Sample created successfully',
      sample,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        error: error.message,
      });
    }
    res.status(500).json({
      error: 'Internal server error',
    });
  }
};

export const markSampleCollected = async (req: Request, res: Response) => {
  try {
    const { sampleId } = req.params;
    const agentId = req.agent?.agentId;

    if (!agentId) {
      return res.status(401).json({
        error: 'Authentication required',
      });
    }

    const updatedSample = await updateSampleToCollected(sampleId, agentId);

    res.status(200).json({
      message: 'Sample marked as collected',
      sample: updatedSample,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Sample not found or access denied') {
        return res.status(404).json({
          error: error.message,
        });
      }
      return res.status(400).json({
        error: error.message,
      });
    }
    res.status(500).json({
      error: 'Internal server error',
    });
  }
};

export const reportDelay = async (req: Request, res: Response) => {
  try {
    const { sampleId } = req.params;
    const { reason } = req.body;
    const agentId = req.agent?.agentId;

    if (!agentId) {
      return res.status(401).json({
        error: 'Authentication required',
      });
    }

    if (!reason) {
      return res.status(400).json({
        error: 'Delay reason is required',
      });
    }

    const updatedSample = await reportSampleDelay(sampleId, agentId, reason);

    res.status(200).json({
      message: 'Sample delay reported successfully',
      sample: updatedSample,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Sample not found or access denied') {
        return res.status(404).json({
          error: error.message,
        });
      }
      return res.status(400).json({
        error: error.message,
      });
    }
    res.status(500).json({
      error: 'Internal server error',
    });
  }
};
