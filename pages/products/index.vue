<template>
  <Userlayouts>
    <div class="flex justify-center items-center bg-[#FF8128] w-full h-20 shadow-md rounded-full bg-opacity-50">
      <h2 class="sm:text-5xl text-3xl font-bold text-[#fefeff] text-stroke tracking-wide">
        สินค้าภายในร้าน
      </h2>
    </div>

    <div class="mt-5">
      <RouterLink to="/products/create" class="w-full btn btn-accent">
        <p class="text-white font-light">เพิ่มสินค้า</p>
      </RouterLink>
    </div>
    <div v-if="isLoading" class="flex justify-center items-center h-32">
      <span class="loading loading-spinner text-accent"></span>
    </div>
    <div v-else class="max-w-5xl mx-auto">
      <div class="overflow-x-auto rounded-lg border-4 border-slate-500 mb-5 mt-5">
        <div v-if="products.length === 0" class="text-center py-10">
          <p class="text-lg text-red-500 font-medium">ยังไม่มีสินค้าในร้าน</p>
        </div>
        <table v-else class="hidden md:table">
          <thead>
            <tr class="bg-slate-500 text-white text-base">
              <th>
                <p class="text-center font-medium">ลำดับ</p>
              </th>
              <th>
                <p class="text-center font-medium">รูป</p>
              </th>
              <th>
                <p class="text-center font-medium">ชื่อ</p>
              </th>
              <th>
                <p class="text-center font-medium">ราคา</p>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <!-- row 1 -->
            <tr v-for="(product, index) in products" class="text-base border-b-4 border-slate-500">
              <th class="">
                <p class="text-center">{{ index + 1 }}</p>
              </th>
              <td class="">
                <div class="flex justify-center">
                  <img :src="product.imageUrl" alt="pic-products" class="w-24 h-24 rounded-md">
                </div>
              </td>
              <td class="">
                <p class="text-center">{{ product.name }}</p>
              </td>

              <td class="">
                <p class="text-center">{{ product.price }} บาท</p>
              </td>
              <td>
                <div class="flex justify-center">
                  <div @click="deleteProduct(product.id)" class="btn bg-red-500 hover:bg-red-300">
                    <Trash />
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="md:hidden">
          <div v-for="product in products" :key="product.id" class="p-4 border-b-4 border-slate-500">
            <div class="flex gap-3 mb-3 justify-between">
              <div class="flex gap-3">
                <img :src="product.imageUrl" alt="" class="w-16 h-16 rounded-md object-cover">
                <div class="flex flex-col justify-center">
                  <p class="font-medium">{{ product.name }}</p>
                  <div class="flex gap-2">
                    <p>ขายแล้ว :</p>
                    <p class="text-red-500">{{ product.count }}</p>
                  </div>
                </div>
              </div>

              <button @click="deleteProduct(product.id)" class="btn bg-red-500 hover:bg-red-300 p-2">
                <Trash class="" />
              </button>
            </div>

            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <p class="text-base">ราคา:</p>
                <p class="font-medium text-base"><span class="text-red-500">{{ product.price }}</span> บาท</p>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  </Userlayouts>
</template>

<script setup>
import Userlayouts from '~/layouts/Userlayouts.vue';
import Trash from '~/components/icons/Trash.vue';
import Cookies from 'js-cookie';
import Swal from "sweetalert2";

const isLoading = ref(false)
const products = ref([])

const users = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;
const userUUID = users.uuid

const fetchProduct = async () => {
  isLoading.value = true;
  try {
    const response = await fetch(`/api/getProductUUID/${userUUID}`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch Product');
    }
    const data = await response.json();
    products.value = data.products
  } catch (err) {
    console.error('Error fetching Product:', err);
  } finally {
    isLoading.value = false;
  }
};

const deleteProduct = async (productId) => {
  const result = await Swal.fire({
    title: 'คุณแน่ใจหรือไม่?',
    text: 'คุณต้องการลบสินค้านี้หรือไม่?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'ใช่, ลบเลย!',
    cancelButtonText: 'ยกเลิก',
  });

  if (!result.isConfirmed) {
    return;
  }

  try {
    isLoading.value = true;
    const response = await fetch(`/api/products/${productId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete product');
    }

    await fetchProduct();

    await Swal.fire({
      icon: 'success',
      title: 'ลบสินค้าเรียบร้อย',
      text: 'สินค้าถูกลบสำเร็จ',
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (err) {
    console.error('Error deleting product:', err);
    await Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามารถลบสินค้าได้ กรุณาลองใหม่อีกครั้ง',
    });
  } finally {
    isLoading.value = false;
  }
};


onMounted(async () => {
  await fetchProduct()
  console.log('products : ', products.value)
})

definePageMeta({
  middleware: 'auth',
});
</script>

<style></style>