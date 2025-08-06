import { Request, Response } from 'express';
import { createAgent, loginAgent } from '../services/auth.service';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, phone, password } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({
        error: 'Name, phone, and password are required',
      });
    }

    const agent = await createAgent(name, phone, password);

    res.status(201).json({
      message: 'Agent registered successfully',
      agent: {
        id: agent.id,
        name: agent.name,
        phone: agent.phone,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint failed')) {
        return res.status(409).json({
          error: 'Agent with this phone number already exists',
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

export const login = async (req: Request, res: Response) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        error: 'Phone and password are required',
      });
    }

    const result = await loginAgent(phone, password);

    res.status(200).json({
      message: 'Login successful',
      token: result.token,
      agent: result.agent,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Agent not found' || error.message === 'Invalid password') {
        return res.status(401).json({
          error: 'Invalid credentials',
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
