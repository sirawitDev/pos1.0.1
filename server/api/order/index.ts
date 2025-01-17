// server/api/order/index.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const method = event.req.method;

    if (method === 'GET') {
        const query = getQuery(event);
        const { userUUID } = query;

        if (userUUID) {
            return await prisma.orderPos.findMany({
                where: {
                    userUUID: String(userUUID),
                },
            });
        }
        return await prisma.orderPos.findMany();
    }

    if (method === 'POST') {
        try {
            const body = await readBody(event);

            const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');

            const latestOrder = await prisma.orderPos.findFirst({
                where: {
                    orderNumber: {
                        startsWith: `POS${currentDate}`
                    }
                },
                orderBy: {
                    orderNumber: 'desc'
                }
            });

            const nextOrderNumber = latestOrder
                ? parseInt(latestOrder.orderNumber.slice(-6)) + 1
                : 1;

            const orderNumber = `POS${currentDate}${String(nextOrderNumber).padStart(6, '0')}`;

            const result = await prisma.$transaction(async (tx) => {
                const order = await tx.orderPos.create({
                    data: {
                        orderNumber,
                        products: body.products,
                        totalAmount: Math.round(body.totalAmount),
                        paymentMethod: body.paymentMethod,
                        userUUID: body.userUUID
                    }
                });

                await Promise.all(
                    body.products.map(async (product) => {
                        await tx.products.update({
                            where: { id: product.id },
                            data: {
                                count: { increment: product.quantity },
                            },
                        });
                    })
                );

                return order;
            });

            return {
                success: true,
                data: result
            };
        } catch (error) {
            console.error('Order creation error:', error);
            return {
                success: false,
                error: 'Failed to create order',
                details: error.message
            };
        }
    }


    return {
        success: false,
        message: 'Method not allowed',
        statusCode: 405
    };
});
