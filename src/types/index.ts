import { Request } from 'express';

declare global {
  namespace Express {
    export interface Request {
      agent?: {
        agentId: string;
      };
    }
  }
}

export interface AuthenticatedRequest extends Request {
  agent?: {
    agentId: string;
  };
}
