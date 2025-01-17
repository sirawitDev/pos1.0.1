import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const { id } = event.context.params

  const deletedProduct = await prisma.products.delete({
    where: { id: parseInt(id) },
  })
  return deletedProduct
})
