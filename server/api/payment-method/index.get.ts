// server/api/payment-method/index.get.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  try {
    const { userUUID } = query;

    if (!userUUID) {
      throw new Error('userUUID is required');
    }

    const paymentMethods = await prisma.paymentMedthod.findMany({
      where: { userUUID },
    });

    return { success: true, data: paymentMethods };
  } catch (error) {
    return { success: false, message: error.message };
  }
});
