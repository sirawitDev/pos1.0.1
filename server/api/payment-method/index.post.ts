import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  try {
    const newPaymentMethod = await prisma.paymentMedthod.create({
      data: {
        name: body.name,
        userUUID: body.userUUID,
      },
    });
    return { success: true, data: newPaymentMethod };
  } catch (error) {
    return { success: false, message: error.message };
  }
});