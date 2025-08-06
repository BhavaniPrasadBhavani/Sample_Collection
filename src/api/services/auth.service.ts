import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const createAgent = async (name: string, phone: string, password: string) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  
  const agent = await prisma.agent.create({
    data: {
      name,
      phone,
      password: hashedPassword,
    },
  });

  return agent;
};

export const loginAgent = async (phone: string, password: string) => {
  const agent = await prisma.agent.findUnique({
    where: {
      phone,
    },
  });

  if (!agent) {
    throw new Error('Agent not found');
  }

  const isPasswordValid = await bcrypt.compare(password, agent.password);

  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET not configured');
  }

  const token = jwt.sign(
    { agentId: agent.id },
    jwtSecret,
    { expiresIn: '24h' }
  );

  return { token, agent: { id: agent.id, name: agent.name, phone: agent.phone } };
};
