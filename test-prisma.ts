import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testPrismaConnection() {
  try {
    console.log('🔍 Testing Prisma Client connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Prisma Client connected successfully!');
    
    // Test basic query (this will show if enums work)
    console.log('📝 Testing basic queries...');
    const agentCount = await prisma.agent.count();
    const sampleCount = await prisma.sample.count();
    
    console.log(`📊 Database status: ${agentCount} agents, ${sampleCount} samples`);
    
    console.log('🎉 All tests passed!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPrismaConnection();
