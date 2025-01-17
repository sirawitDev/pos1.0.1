import { PrismaClient } from '@prisma/client'
import { writeFile, mkdir } from 'fs/promises'
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { dirname } from 'path'

const prisma = new PrismaClient()

const s3 = new S3Client({
  region: process.env.AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

const BUCKET_NAME = process.env.AWS_BUCKET;

export default defineEventHandler(async (event) => {
  const { method } = event.req;

  try {
    switch (method) {
      case 'POST': {
        const formData = await readMultipartFormData(event);
        if (!formData) throw new Error('No form data received');

        const imageFile = formData.find(item => item.name === 'image');
        const name = formData.find(item => item.name === 'name')?.data.toString();
        const about = formData.find(item => item.name === 'about')?.data.toString();
        const price = formData.find(item => item.name === 'price')?.data.toString();
        const userUUID = formData.find(item => item.name === 'userUUID')?.data.toString();

        if (!imageFile || !imageFile.filename) throw new Error('No image file received');

        const fileExt = imageFile.filename.split('.').pop();
        const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        await s3.send(
          new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: `productsPOS/${uniqueFilename}`,
            Body: imageFile.data,
            ContentType: imageFile.type,
          })
        );

        return await prisma.products.create({
          data: {
            name,
            imageUrl: `https://${BUCKET_NAME}.s3.${process.env.AWS_DEFAULT_REGION}.amazonaws.com/productsPOS/${uniqueFilename}`,
            about,
            price: parseInt(price),
            userUUID
          },
        });
      }

      case 'PUT': {
        const { id, ...updateData } = await readBody(event);
        if (!id) return { error: 'Product ID is required for update.' };
        return await prisma.products.update({
          where: { id },
          data: updateData,
        });
      }

      case 'DELETE': {
        const { id: deleteId } = await readBody(event);
        if (!deleteId) return { error: 'Promotion ID is required for deletion.' };

        const product = await prisma.products.findUnique({
          where: { id: deleteId },
        });

        if (product?.imageUrl) {
          const key = product.imageUrl.split('.com/')[1];

          try {
            await s3.send(
              new DeleteObjectCommand({
                Bucket: BUCKET_NAME,
                Key: key,
              })
            );
          } catch (error) {
            console.error('Error deleting file from S3:', error);
          }
        }

        await prisma.products.delete({ where: { id: deleteId } });
        return { success: true };
      }

      case 'GET':
        return await prisma.products.findMany();

      default:
        return { error: 'Method not allowed' };
    }
  } catch (error) {
    console.error('Error in Product handler:', error);
    return { error: error.message };
  }
});
