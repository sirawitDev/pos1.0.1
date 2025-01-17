<template>
  <Userlayouts>
    <div class="flex justify-center items-center bg-[#FF8128] w-full h-16 md:h-20 shadow-md rounded-full bg-opacity-50">
      <h2 class="text-2xl md:text-3xl lg:text-5xl font-bold text-[#fefeff] text-stroke tracking-wide">
        ขายสินค้า
      </h2>
    </div>

    <div class="bg-white shadow-md rounded-md mt-4 md:mt-5">
      <div class="flex flex-col lg:flex-row">
        <div class="w-full lg:w-3/5 p-3 md:p-4">
          <p class="text-xl md:text-2xl font-semibold">สินค้าของคุณ</p>
          <div class="divider"></div>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
            <div v-for="product in products"
              class="border rounded-lg p-2 md:p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              @click="selectProduct(product)">
              <div class="flex justify-end">
                <p class="text-[12px]">ขายไปแล้ว <span class="text-green-500">{{ product.count }}</span></p>
              </div>
              <div class="mt-2 md:mt-3">
                <img v-if="product.imageUrl" :src="product.imageUrl" alt="Product Image"
                  class="w-20 h-16 md:w-28 md:h-24 rounded-md mx-auto shadow-md object-cover" />
                <span v-else class="text-sm md:text-base">ไม่มีรูปภาพ</span>
              </div>
              <div class="mt-2 md:mt-3 h-8 md:h-10">
                <p class="font-semibold text-sm md:text-base line-clamp-2">
                  {{ product.name }}
                </p>
              </div>
              <div class="flex justify-end">
                <p class="text-sm md:text-base">ราคา <span class="text-red-500">{{ product.price }}</span> บาท</p>
              </div>

            </div>
          </div>
        </div>

        <div class="w-full lg:w-2/5 p-3 md:p-4">
          <p class="text-xl md:text-2xl font-semibold">รายการสินค้าที่เลือก</p>
          <div class="divider"></div>
          <div v-if="selectedProducts.length === 0">
            <p class="text-sm md:text-base">ยังไม่มีสินค้าในรายการที่เลือก</p>
          </div>
          <div v-else class="space-y-2">
            <div v-for="product in selectedProducts" :key="product.uuid"
              class="flex flex-col sm:flex-row justify-between items-start sm:items-center p-2 md:p-4 border rounded-md w-full">
              <div class="flex flex-col sm:flex-row items-start sm:items-center w-full gap-2 md:gap-4">
                <div class="w-full sm:w-1/3">
                  <div class="flex justify-center">
                    <img :src="product.imageUrl" alt="product-image" class=" rounded-md w-[50%] sm:w-[80%] h-24">
                  </div>
                  <p class="text-sm md:text-base line-clamp-2 text-center mt-1 font-semibold">{{ product.name }}</p>
                </div>

                <div class="flex justify-between items-center w-full sm:w-2/3">
                  <div class="flex items-center">
                    <button @click="decreaseQuantity(product)"
                      class="px-2 md:px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 text-sm md:text-base">-</button>
                    <p class="w-6 md:w-8 text-center text-sm md:text-base">{{ product.quantity }}</p>
                    <button @click="increaseQuantity(product)"
                      class="px-2 md:px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 text-sm md:text-base">+</button>
                  </div>
                  <p class="text-red-500 text-sm md:text-base ml-2 md:ml-4">
                    {{ (product.price * product.quantity).toLocaleString() }} บาท
                  </p>

                  <button @click="removeProduct(product)" class="btn btn-xs md:btn-sm btn-accent">
                    <Trash />
                  </button>
                </div>
              </div>

            </div>

            <div class="mt-3 md:mt-4 border-t pt-3 md:pt-4">
              <div class="flex justify-between items-center">
                <p class="font-semibold text-base md:text-lg">รวมทั้งหมด:</p>
                <p class="text-lg md:text-xl text-red-500 font-bold">{{ totalPrice.toLocaleString() }} บาท</p>
              </div>
            </div>
            <div class="mt-2 md:mt-3">
              <button class="btn btn-accent w-full text-white text-sm md:text-base" onclick="my_modal_3.showModal()">
                ชำระเงิน
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <dialog id="my_modal_3" class="modal">
      <div class="modal-box max-w-sm md:max-w-md">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <div class="flex justify-center">
          <h3 class="text-base md:text-lg font-bold">รูปแบบการชำระเงิน</h3>
        </div>
        <div>
          <label class="form-control w-full">
            <select class="select select-bordered mt-3 w-full text-sm md:text-base" v-model="selectedPaymentMethod">
              <option disabled selected>เลือกรูปแบบการชำระเงิน</option>
              <option v-for="payment in payments" :key="payment.id" :value="payment.name">
                {{ payment.name }}
              </option>
            </select>
          </label>

          <div v-if="payments.length === 0">
            <p class="text-red-500 text-center">กรุณาเพิ่มรูปแบบการชำระเงินก่อนทำรายการสินค้า</p>

            <RouterLink to="/paymentmethod" class="btn btn-accent w-full mt-3">
              <p class="font-light text-white">เพิ่มรูปแบบการชำระเงิน</p>
            </RouterLink>
          </div>

          <div v-if="payments.length !== 0" class=" mt-3">
            <div @click="handlePayment" class="btn btn-accent w-full">
              <p class="text-white">ชำระเงิน</p>
            </div>
          </div>
        </div>
      </div>
    </dialog>

    <div v-if="loading" class="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-gray-800">
      <div class="spinner-border animate-spin border-t-4 border-green-500 rounded-full w-12 h-12"></div>
    </div>
  </Userlayouts>
</template>

<script setup>
import Userlayouts from '~/layouts/Userlayouts.vue';
import Cookies from 'js-cookie';
import { ref, computed, onMounted } from 'vue';
import Trash from '~/components/icons/Trash.vue';
import Swal from "sweetalert2";
import axios from 'axios';

const users = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;
const userUUID = users ? users.uuid : null;

const loading = ref(false);

const products = ref([]);
const payments = ref([])
const selectedProducts = ref([]);
const selectedPaymentMethod = ref('')

const totalPrice = computed(() => {
  return selectedProducts.value.reduce((total, product) => {
    return total + (product.price * product.quantity);
  }, 0);
});

const fetchProducts = async () => {
  try {
    const response = await fetch(`/api/getProductUUID/${userUUID}`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch promotions');
    }
    const data = await response.json();
    products.value = data.products;
  } catch (err) {
    console.error('Error fetching promotions:', err);
  }
};

const fetchPayment = async () => {
  try {
    const response = await fetch(`/api/payment-method?userUUID=${userUUID}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Product');
    }

    const data = await response.json();
    payments.value = data.data

  } catch (err) {
    console.error('Error fetching Product:', err);
  }
};

const selectProduct = (product) => {
  const existingProduct = selectedProducts.value.find(p => p.id === product.id);
  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    selectedProducts.value.push({
      ...product,
      quantity: 1
    });
  }
};

const increaseQuantity = (product) => {
  const item = selectedProducts.value.find(p => p.id === product.id);
  if (item) {
    item.quantity++;
  }
};

const decreaseQuantity = (product) => {
  const item = selectedProducts.value.find(p => p.id === product.id);
  if (item && item.quantity > 1) {
    item.quantity--;
  }
};

const removeProduct = (product) => {
  const index = selectedProducts.value.findIndex(p => p.id === product.id);
  if (index !== -1) {
    selectedProducts.value.splice(index, 1);
  }
};

const handlePayment = async () => {
  document.getElementById("my_modal_3").close();

  if (selectedProducts.value.length === 0) {
    await Swal.fire({
      icon: "error",
      title: "ไม่พบสินค้า",
      text: "กรุณาเลือกสินค้าอย่างน้อยหนึ่งรายการ"
    });
    return;
  }

  if (!selectedPaymentMethod.value) {
    await Swal.fire({
      icon: "error",
      title: "กรุณาเลือกวิธีการชำระเงิน",
      text: "โปรดเลือกวิธีการชำระเงินก่อนดำเนินการต่อ"
    });
    return;
  }

  const result = await Swal.fire({
    title: "คุณต้องการชำระเงินหรือไม่?",
    text: "โปรดตรวจสอบรายการสินค้าและจำนวนเงินอีกครั้ง",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "ยืนยัน",
    cancelButtonText: "ยกเลิก",
  });

  if (result.isConfirmed) {
    loading.value = true;
    try {
      // Format products for JSON storage
      const products = selectedProducts.value.map(product => ({
        id: product.id,
        name: product.name,
        quantity: product.quantity,
        price: product.price,
        imageUrl: product.imageUrl
      }));

      const paymentData = {
        products,
        totalAmount: Math.round(totalPrice.value),
        userUUID,
        paymentMethod: selectedPaymentMethod.value
      };

      console.log('Sending payment data:', paymentData);
      const response = await axios.post('/api/order', paymentData);

      if (response.data.success) {
        await Swal.fire({
          icon: "success",
          title: "ชำระเงินสำเร็จ",
          text: "การชำระเงินของคุณเสร็จสมบูรณ์แล้ว"
        });

        selectedProducts.value = [];
        selectedPaymentMethod.value = '';

        await fetchProducts()

      } else {
        throw new Error(response.data.error || 'การชำระเงินล้มเหลว');
      }
    } catch (error) {
      console.error("Error during payment:", error);
      await Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาดในการชำระเงิน",
        text: error.message || "กรุณาลองใหม่อีกครั้ง"
      });
    } finally {
      loading.value = false;
    }
  } else {
    await Swal.fire({
      icon: "info",
      title: "ยกเลิกการชำระเงิน",
      text: "คุณยกเลิกการชำระเงินแล้ว"
    });
  }
};

onMounted(async () => {
  await fetchProducts()
  await fetchPayment()
});

// definePageMeta({
//   middleware: 'auth',
// });
</script>