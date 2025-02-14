<template>
  <Userlayouts>
    <div
      class="relative overflow-hidden bg-gradient-to-r from-orange-400 to-orange-600 w-full h-20 md:h-24 shadow-lg rounded-xl">
      <div class="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
      <div class="relative flex justify-center items-center h-full">
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-md">
          ขายสินค้า
        </h2>
      </div>
    </div>


    <div class="bg-white shadow-lg rounded-xl mt-6 overflow-hidden">
      <div class="flex flex-col lg:flex-row">
        <div class="w-full lg:w-3/5 p-4 md:p-6">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <p class="text-2xl md:text-3xl font-bold text-gray-800">สินค้าของคุณ</p>
            <div class="relative w-full md:w-64">
              <input v-model="searchQuery" type="text" placeholder="ค้นหาสินค้า..."
                class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 pl-10"
                @input="handleSearch" />
              <svg xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div class="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-6"></div>

          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div v-for="product in filteredProducts"
              class="group bg-white rounded-xl border border-gray-200 p-3 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer"
              @click="selectProduct(product)">
              <div class="flex justify-end">
                <p class="text-sm text-gray-600">
                  ขายไปแล้ว <span class="text-green-500 font-semibold">{{ product.count }}</span>
                </p>
              </div>
              <div class="mt-3 aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img v-if="product.imageUrl" :src="product.imageUrl" :alt="product.name"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                  ไม่มีรูปภาพ
                </div>
              </div>
              <div class="mt-3">
                <p class="font-medium text-gray-800 line-clamp-2 h-12">
                  {{ product.name }}
                </p>
                <p class="mt-2 text-right font-bold text-orange-600">
                  ฿{{ product.price.toLocaleString() }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="w-full lg:w-2/5 p-4 md:p-6 bg-gray-50">
          <p class="text-2xl md:text-3xl font-bold text-gray-800">รายการสินค้าที่เลือก</p>
          <div class="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-6"></div>

          <div v-if="selectedProducts.length === 0" class="text-center py-10">
            <div class="text-gray-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p class="text-gray-500">ยังไม่มีสินค้าในรายการที่เลือก</p>
          </div>

          <div v-else class="space-y-4">
            <div v-for="product in selectedProducts" :key="product.uuid" class="bg-white rounded-xl p-4 shadow-sm">
              <div class="flex gap-4">
                <div class="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img :src="product.imageUrl" :alt="product.name" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1">
                  <p class="font-medium text-gray-800 line-clamp-2">{{ product.name }}</p>
                  <div class="mt-2 flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <button @click="decreaseQuantity(product)"
                        class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                        -
                      </button>
                      <span class="w-8 text-center">{{ product.quantity }}</span>
                      <button @click="increaseQuantity(product)"
                        class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                        +
                      </button>
                    </div>
                    <p class="font-bold text-orange-600">
                      ฿{{ (product.price * product.quantity).toLocaleString() }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center">
                  <button @click="removeProduct(product)"
                    class="btn bg-red-500 hover:bg-red-700 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash class="" />
                  </button>
                </div>
              </div>
            </div>

            <div class="mt-6 p-4 bg-white rounded-xl shadow-sm">
              <div class="flex justify-between items-center">
                <p class="text-lg font-semibold text-gray-800">รวมทั้งหมด:</p>
                <p class="text-2xl font-bold text-orange-600">฿{{ totalPrice.toLocaleString() }}</p>
              </div>
              <button
                class="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg transition-colors"
                onclick="my_modal_3.showModal()">
                ชำระเงิน
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <dialog id="my_modal_3" class="modal">
      <div class="modal-box max-w-sm md:max-w-md bg-white rounded-xl p-6">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">✕</button>
        </form>
        <h3 class="text-xl font-bold text-center text-gray-800">รูปแบบการชำระเงิน</h3>

        <div class="mt-6">
          <select
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            v-model="selectedPaymentMethod">
            <option disabled selected>เลือกรูปแบบการชำระเงิน</option>
            <option v-for="payment in payments" :key="payment.id" :value="payment.name">
              {{ payment.name }}
            </option>
          </select>

          <div v-if="payments.length === 0" class="mt-4">
            <p class="text-red-500 text-center mb-4">กรุณาเพิ่มรูปแบบการชำระเงินก่อนทำรายการสินค้า</p>
            <RouterLink to="/paymentmethod"
              class="block w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg text-center transition-colors">
              เพิ่มรูปแบบการชำระเงิน
            </RouterLink>
          </div>

          <div v-if="payments.length !== 0" class="mt-4">
            <button @click="handlePayment"
              class="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg transition-colors">
              ชำระเงิน
            </button>
          </div>
        </div>
      </div>
    </dialog>

    <div v-if="loading" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center">
      <div class="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
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
const searchQuery = ref('');
const products = ref([]);
const payments = ref([])
const selectedProducts = ref([]);
const selectedPaymentMethod = ref('')

const totalPrice = computed(() => {
  return selectedProducts.value.reduce((total, product) => {
    return total + (product.price * product.quantity);
  }, 0);
});

const filteredProducts = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return products.value;

  return products.value.filter(product => {
    return (
      product.name.toLowerCase().includes(query) ||
      product.price.toString().includes(query)
    );
  });
});

const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

const handleSearch = debounce(() => {
  // You can add additional search logic here if needed
  console.log('Searching for:', searchQuery.value);
}, 300);



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