import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { email, password, firstname , lastname , phone } = await readBody(event);

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw createError({
      statusCode: 400,
      message: 'User already exists.',
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const lastUser = await prisma.user.findFirst({
    orderBy: { id: 'desc' },
  });

  let newUuid = 'M0001';
  if (lastUser) {
    const lastUuidNumber = parseInt(lastUser.uuid.substring(1), 10);
    newUuid = `M${String(lastUuidNumber + 1).padStart(4, '0')}`;
  }

  const newUser = await prisma.user.create({
    data: {
      email,
      uuid: newUuid,
      password: hashedPassword,
      firstname,
      lastname,
      phone
    },
  });

  return {
    message: 'User registered successfully',
    user: newUser,
  };
});
