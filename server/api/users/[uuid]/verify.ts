import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const { uuid } = event.context.params;

    try {
        const updatedUser = await prisma.user.update({
            where: { uuid },
            data: { status: 'ยืนยันแล้ว' },
        });

        return {
            message: 'User status updated successfully',
            user: updatedUser,
        };
    } catch (error) {
        console.error('Error updating user status:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Error updating user status',
            data: error.message,
        });
    }
});
