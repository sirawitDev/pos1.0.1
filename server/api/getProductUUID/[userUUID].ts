import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const { userUUID } = event.context.params;

    try {
        const products = await prisma.products.findMany({
            where: { userUUID },
        });

        return { success: true, products };
    } catch (error) {
        return { success: false, error: error.message };
    }
});
