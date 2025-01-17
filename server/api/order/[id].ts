// server/api/order/[id].ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const { id } = event.context.params;
    const method = event.req.method;

    if (method === 'GET') {
        return await prisma.orderPos.findUnique({
            where: { id: parseInt(id) },
        });
    }

    if (method === 'PUT') {
        const body = await readBody(event);
        return await prisma.orderPos.update({
            where: { id: parseInt(id) },
            data: body,
        });
    }

    if (method === 'DELETE') {
        return await prisma.orderPos.delete({
            where: { id: parseInt(id) },
        });
    }

    return { message: 'Method not allowed', statusCode: 405 };
});
