<template>
  <Userlayouts>
    <div
      class="relative overflow-hidden bg-gradient-to-r from-orange-400 to-orange-600 w-full h-24 shadow-lg rounded-xl">
      <div class="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
      <div class="relative flex justify-center items-center h-full">
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-md">
          สินค้าภายในร้าน
        </h2>
      </div>
    </div>

    <div class="mt-6">
      <RouterLink to="/products/create"
        class="group flex items-center justify-center w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl transition-all duration-300 hover:shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span class="text-lg font-medium">เพิ่มสินค้า</span>
      </RouterLink>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
    </div>

    <div v-else class="mt-6">
      <div v-if="products.length === 0" class="bg-white rounded-xl shadow-md p-8 text-center">
        <div class="text-gray-400 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <p class="text-xl font-medium text-gray-800">ยังไม่มีสินค้าในร้าน</p>
        <p class="text-gray-500 mt-2">เริ่มต้นเพิ่มสินค้าของคุณเลย</p>
      </div>

      <div v-else class="bg-white rounded-xl shadow-md overflow-hidden">
        <table class="hidden md:table w-full">
          <thead>
            <tr class="bg-gray-50 border-b">
              <th class="px-6 py-4 text-sm font-medium text-gray-500">ลำดับ</th>
              <th class="px-6 py-4 text-sm text-center font-medium text-gray-500">รูป</th>
              <th class="px-6 py-4 text-sm text-center font-medium text-gray-500">ชื่อ</th>
              <th class="px-6 py-4 text-sm text-center font-medium text-gray-500">ราคา</th>
              <th class="px-6 py-4 text-sm text-center font-medium text-gray-500">ขายไปแล้ว</th>
              <th class="px-6 py-4 text-sm text-center font-medium text-gray-500">จัดการ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="(product, index) in products" :key="product.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 text-center text-gray-500">{{ index + 1 }}</td>
              <td class="px-6 py-4">
                <img :src="product.imageUrl" :alt="product.name" class="w-20 h-20 object-cover rounded-lg mx-auto">
              </td>
              <td class="px-6 py-4 text-center font-medium text-gray-800">{{ product.name }}</td>
              <td class="px-6 py-4 text-center text-orange-600 font-medium">{{ product.price }} บาท</td>
              <td class="px-6 py-4 text-center text-green-600 font-medium">{{ product.count }}</td>
              <td class="px-6 py-4">
                <div class="flex justify-center">
                  <button @click="deleteProduct(product.id)"
                    class="btn bg-red-500 hover:bg-red-700 text-red-600 transition-colors">
                    <Trash class="" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="md:hidden divide-y divide-gray-200">
          <div v-for="product in products" :key="product.id" class="p-4 space-y-4">
            <div class="flex items-center space-x-4">
              <img :src="product.imageUrl" :alt="product.name" class="w-20 h-20 object-cover rounded-lg">
              <div class="flex-1">
                <h3 class="font-medium text-gray-800">{{ product.name }}</h3>
                <p class="text-orange-600 font-medium mt-1">{{ product.price }} บาท</p>
                <p class="text-sm text-gray-500 mt-1">
                  ขายแล้ว <span class="text-green-600 font-medium">{{ product.count }}</span>
                </p>
              </div>
              <button @click="deleteProduct(product.id)"
                class="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors">
                <Trash class="w-5 h-5" />
              </button>
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
const userUUID = users ? users.uuid : null;

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

// definePageMeta({
//   middleware: 'auth',
// });
</script>

<style></style>