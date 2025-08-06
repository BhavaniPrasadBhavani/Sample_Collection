import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Priority = 'HIGH' | 'MEDIUM' | 'LOW';
type SampleStatus = 'SCHEDULED' | 'COLLECTED' | 'CANCELLED' | 'DELAYED';

export const findSamplesByAgentId = async (agentId: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const samples = await prisma.sample.findMany({
    where: {
      agentId,
      scheduledDate: {
        equals: today,
      },
      status: {
        in: ['SCHEDULED', 'DELAYED'] as SampleStatus[],
      },
    },
    orderBy: [
      {
        priority: 'desc',
      },
      {
        createdAt: 'asc',
      },
    ],
    include: {
      agent: {
        select: {
          id: true,
          name: true,
          phone: true,
        },
      },
    },
  });

  return samples;
};

export const createNewSample = async (sampleData: {
  patientName: string;
  pickupAddress: string;
  scheduledDate: Date;
  priority?: Priority;
  notes?: string;
  agentId: string;
}) => {
  const sample = await prisma.sample.create({
    data: {
      ...sampleData,
      priority: sampleData.priority || 'MEDIUM',
    },
    include: {
      agent: {
        select: {
          id: true,
          name: true,
          phone: true,
        },
      },
    },
  });

  return sample;
};

export const updateSampleToCollected = async (sampleId: string, agentId: string) => {
  const sample = await prisma.sample.findFirst({
    where: {
      id: sampleId,
      agentId,
    },
  });

  if (!sample) {
    throw new Error('Sample not found or access denied');
  }

  const updatedSample = await prisma.sample.update({
    where: {
      id: sampleId,
    },
    data: {
      status: 'COLLECTED',
      updatedAt: new Date(),
    },
    include: {
      agent: {
        select: {
          id: true,
          name: true,
          phone: true,
        },
      },
    },
  });

  return updatedSample;
};

export const reportSampleDelay = async (sampleId: string, agentId: string, reason: string) => {
  const sample = await prisma.sample.findFirst({
    where: {
      id: sampleId,
      agentId,
    },
  });

  if (!sample) {
    throw new Error('Sample not found or access denied');
  }

  const existingNotes = sample.notes || '';
  const newNotes = `DELAY: ${reason}${existingNotes ? `\n${existingNotes}` : ''}`;

  const updatedSample = await prisma.sample.update({
    where: {
      id: sampleId,
    },
    data: {
      status: 'DELAYED',
      notes: newNotes,
      updatedAt: new Date(),
    },
    include: {
      agent: {
        select: {
          id: true,
          name: true,
          phone: true,
        },
      },
    },
  });

  return updatedSample;
};
