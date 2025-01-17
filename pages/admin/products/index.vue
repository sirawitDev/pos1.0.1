<template>
  <Adminlayouts>
    <div class="flex justify-center items-center bg-[#FF8128] w-full h-16 md:h-20 shadow-md rounded-full bg-opacity-50">
      <h2 class="text-2xl md:text-3xl lg:text-5xl font-bold text-[#fefeff] text-stroke tracking-wide">
        สินค้าทั้งหมด
      </h2>
    </div>

    <div class="max-w-5xl mx-auto">
      <div  class="overflow-x-auto rounded-lg border-4 border-slate-500 mb-5 mt-5">
        <table class="table">
          <!-- head -->
          <thead>
            <tr class="bg-slate-500 text-white text-base">
              <th>
                <p>userUUID</p>
              </th>
              <th>
                <p class="text-center">รูป</p>
              </th>
              <th>
                <p>ชื่อสินค้า</p>
              </th>
              <th>
                <p>ราคา</p>
              </th>
              <th>
                <p>ขายไปแล้ว</p>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <!-- row 1 -->
            <tr v-for="product in products">
              <th class="">
                <p>{{ product.userUUID }}</p>
              </th>
              <th>
                <div class="flex justify-center">
                  <img :src="product.imageUrl" alt="image" class="w-24 h-24 rounded-md">
                </div>
              </th>
              <td>
                <p>{{ product.name }}</p>
              </td>
              <td>
                <p>{{ product.price }}</p>
              </td>
              <td>
                <p class="text-center">{{ product.count }}</p>
              </td>
              <td>
                <div class="btn bg-red-500 hover:bg-red-300">
                  <Trash />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </Adminlayouts>
</template>

<script setup>
import Adminlayouts from '~/layouts/Adminlayouts.vue';
import axios from 'axios';
import Trash from '~/components/icons/Trash.vue';

const isLoading = ref(false)
const products = ref([])

const fetchProducts = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('/api/products');
    products.value = response.data
  } catch (err) {
    console.error('Error fetching Product:', err);
  } finally {
    isLoading.value = false;
  }
};
onMounted(async () => {
  await fetchProducts()
  console.log('users : ', products.value)
})
</script>

<style></style>