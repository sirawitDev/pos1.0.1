<template>
  <Userlayouts>
    <div
      class="flex justify-center items-center bg-[#FF8128] w-full h-14 sm:h-16 md:h-20 shadow-md rounded-full bg-opacity-50">
      <h2 class="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold text-[#fefeff] text-stroke tracking-wide">
        รายการขาย
      </h2>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center h-32">
      <span class="loading loading-spinner text-accent"></span>
    </div>

    <div v-else class="w-full max-w-5xl mx-auto px-4 sm:px-6">
      <div class="overflow-x-auto rounded-lg border-4 border-slate-500 mb-5 mt-5">
        <div v-if="orders.length === 0" class="text-center py-10">
          <p class="text-lg text-red-500 font-medium">ยังไม่มีสินค้าในร้าน</p>
        </div>

        <table v-else class="hidden md:table w-full">
          <thead>
            <tr class="bg-slate-500 text-white text-base">
              <th>
                <p class="text-center font-medium">เลขทำรายการ</p>
              </th>
              <th>
                <p class="font-medium">สินค้า</p>
              </th>
              <th>
                <p class="font-medium">ราคารวม</p>
              </th>
              <th>
                <p class="text-center font-medium">รูปแบบการชำระเงิน</p>
              </th>
              <th>
                <p class="text-center font-medium">วันที่ทำรายการ</p>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.orderNumber" class="border-b-4 border-slate-500">
              <th>
                <p class="text-center">{{ order.orderNumber }}</p>
              </th>
              <td class="w-full">
                <div v-for="product in order.products" :key="product.id" class="flex gap-3 py-2">
                  <img :src="product.imageUrl" alt="" class="w-16 h-16 sm:w-24 sm:h-24 rounded-md object-cover">
                  <div class="flex items-center">
                    <p>{{ product.name }}</p>
                    <p>&nbsp; x<span class="text-red-500">{{ product.quantity }}</span></p>
                  </div>
                </div>
              </td>
              <td>
                <p>{{ order.totalAmount }} บาท</p>
              </td>
              <td>
                <p class="text-center">{{ order.paymentMethod }}</p>
              </td>
              <td>
                <p class="text-center">{{ formatDate(order.updatedAt) }}</p>
              </td>
              <td>
                <div class="flex justify-center">
                  <button @click="deleteOrder(order.id)" class="btn bg-red-500 hover:bg-red-300">
                    <Trash />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="md:hidden">
          <div v-for="order in orders" :key="order.orderNumber" class="p-4 border-b-4 border-slate-500">
            <div class="flex justify-between items-center mb-3">
              <p class="font-medium">เลขที่: {{ order.orderNumber }}</p>
              <button @click="deleteOrder(order.id)" class="btn bg-red-500 hover:bg-red-300 p-2">
                <Trash class="" />
              </button>
            </div>

            <div v-for="product in order.products" :key="product.id" class="flex gap-3 mb-3">
              <img :src="product.imageUrl" alt="" class="w-16 h-16 rounded-md object-cover">
              <div class="flex flex-col justify-center">
                <p class="font-medium">{{ product.name }}</p>
                <p>จำนวน: <span class="text-red-500">{{ product.quantity }}</span></p>
              </div>
            </div>

            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <p class="text-gray-600">ราคารวม:</p>
                <p class="font-medium">{{ order.totalAmount }} บาท</p>
              </div>
              <div class="flex justify-between">
                <p class="text-gray-600">การชำระเงิน:</p>
                <p>{{ order.paymentMethod }}</p>
              </div>
              <div class="flex justify-between">
                <p class="text-gray-600">วันที่:</p>
                <p>{{ formatDate(order.updatedAt) }}</p>
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
import Cookies from 'js-cookie';
import axios from 'axios';
import Trash from '~/components/icons/Trash.vue';
import Swal from "sweetalert2";

const isLoading = ref(false);
const users = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;
const userUUID = users ? users.uuid : null;
const orders = ref([]);

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const fetchOrder = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('/api/order', {
      params: { userUUID },
    });
    orders.value = response.data;
  } catch (err) {
    console.error('Error fetching Product:', err);
  } finally {
    isLoading.value = false;
  }
};

const deleteOrder = async (orderId) => {
  const result = await Swal.fire({
    title: 'คุณแน่ใจหรือไม่?',
    text: 'คุณต้องการลบคำสั่งซื้อนี้หรือไม่?',
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
    const response = await fetch(`/api/order/${orderId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete order');
    }

    await fetchOrder();

    await Swal.fire({
      icon: 'success',
      title: 'ลบคำสั่งซื้อเรียบร้อย',
      text: 'คำสั่งซื้อถูกลบสำเร็จ',
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (err) {
    console.error('Error deleting order:', err);
    await Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามารถลบคำสั่งซื้อได้ กรุณาลองใหม่อีกครั้ง',
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await fetchOrder();
  console.log('order : ', orders.value);
});
</script>