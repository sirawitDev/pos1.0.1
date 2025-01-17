import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const id = parseInt(event.context.params.id);
    try {
        await prisma.paymentMedthod.delete({ where: { id } });
        return { success: true, message: 'Payment method deleted successfully' };
    } catch (error) {
        return { success: false, message: error.message };
    }
});