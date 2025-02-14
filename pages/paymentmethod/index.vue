<template>
  <Userlayouts>
    <div
      class="relative overflow-hidden bg-gradient-to-r from-orange-400 to-orange-600 w-full h-24 shadow-lg rounded-xl">
      <div class="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
      <div class="relative flex justify-center items-center h-full">
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-md">
          รูปแบบการชำระเงิน
        </h2>
      </div>
    </div>

    <div class="mt-6">
      <button
        class="group flex items-center justify-center w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl transition-all duration-300 hover:shadow-lg"
        onclick="my_modal_3.showModal()">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span class="text-lg font-medium">เพิ่มรูปแบบการชำระเงิน</span>
      </button>
    </div>

    <div class="mt-6 max-w-2xl mx-auto">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center h-48">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
      </div>

      <div v-else-if="payments.length === 0" class="bg-white rounded-xl shadow-md p-8 text-center">
        <div class="text-gray-400 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <p class="text-xl font-medium text-gray-800">ยังไม่มีรูปแบบการชำระเงิน</p>
        <p class="text-gray-500 mt-2">เริ่มต้นเพิ่มรูปแบบการชำระเงินของคุณ</p>
      </div>

      <!-- Payment Methods Table -->
      <div v-else class="bg-white rounded-xl shadow-md overflow-hidden">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-50 border-b">
              <th class="px-6 py-4 text-sm font-medium text-gray-500 text-start border-r-2">รูปแบบการชำระเงิน</th>
              <th class="px-6 py-4 text-sm font-medium text-gray-500 w-24 ">จัดการ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="payment in payments" :key="payment.id" class="hover:bg-gray-50 transition-colors">

              <td class="px-6 py-4 border-r-2">
                <div class="flex items-center justify-start">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mr-3" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                  <span class="font-medium text-gray-800">{{ payment.name }}</span>
                </div>
              </td>

              <td class="px-6 py-4">
                <div class="flex justify-center">
                  <button @click="deleteProduct(payment.id)"
                    class="btn bg-red-500 hover:bg-red-700 text-red-600 transition-colors">
                    <Trash class="" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <dialog id="my_modal_3" class="modal">
      <div class="modal-box max-w-sm bg-white rounded-xl p-6">
        <form method="dialog">
          <button class="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </form>

        <div class="text-center mb-6">
          <h3 class="text-xl font-bold text-gray-800">เพิ่มรูปแบบการชำระเงิน</h3>
        </div>

        <div class="space-y-4">
          <div>
            <input v-model="paymentMethodName" type="text" placeholder="ระบุรูปแบบการชำระเงิน"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all">
            <p class="mt-2 text-sm text-gray-500">
              ตัวอย่าง: <span class="text-orange-500">เงินสด, โอนเงิน</span>
            </p>
          </div>

          <button @click="addPaymentMethod"
            class="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg transition-colors">
            ยืนยัน
          </button>
        </div>
      </div>
    </dialog>

    <div v-if="loading" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div class="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
    </div>
  </Userlayouts>
</template>

<script setup>
import Userlayouts from "~/layouts/Userlayouts.vue";
import Trash from "~/components/icons/Trash.vue";
import Cookies from 'js-cookie';
import Swal from "sweetalert2";
import axios from "axios";

const isLoading = ref(false)
const payments = ref([])

const loading = ref(false);

const paymentMethodName = ref('')

const users = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;
const userUUID = users ? users.uuid : null;

const fetchPayment = async () => {
  isLoading.value = true;
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
  } finally {
    isLoading.value = false;
  }
};

const addPaymentMethod = async () => {

  document.getElementById("my_modal_3").close();


  if (!paymentMethodName.value) {
    Swal.fire({
      icon: "warning",
      title: "ข้อผิดพลาดในการตรวจสอบ",
      text: "กรุณากรอกชื่อวิธีการชำระเงิน",
      confirmButtonText: "ตกลง",
      customClass: {
        popup: 'swal-popup'
      }
    });
    return;
  }

  const result = await Swal.fire({
    title: "ยืนยันการดำเนินการ",
    text: "คุณต้องการเพิ่มวิธีการชำระเงินนี้หรือไม่?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "ใช่, เพิ่มเลย",
    cancelButtonText: "ยกเลิก",
    customClass: {
      popup: 'swal-popup'
    }
  });

  if (result.isConfirmed) {
    try {
      loading.value = true;

      const response = await axios.post(`/api/payment-method`, {
        name: paymentMethodName.value,
        userUUID: userUUID,
      });

      document.getElementById("my_modal_3").close();
      paymentMethodName.value = "";

      Swal.fire({
        icon: "success",
        title: "สำเร็จ",
        text: "เพิ่มวิธีการชำระเงินเรียบร้อยแล้ว!",
        confirmButtonText: "ตกลง",
        customClass: {
          popup: 'swal-popup'
        }
      });

      await fetchPayment();
    } catch (error) {
      console.error("Error adding payment method:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "เกิดปัญหาในการเพิ่มวิธีการชำระเงิน กรุณาลองอีกครั้ง",
        confirmButtonText: "ตกลง",
        customClass: {
          popup: 'swal-popup'
        }
      });
    } finally {
      loading.value = false;
    }
  } else {
    Swal.fire({
      icon: "info",
      title: "ยกเลิก",
      text: "การเพิ่มวิธีการชำระเงินถูกยกเลิก",
      confirmButtonText: "ตกลง",
      customClass: {
        popup: 'swal-popup'
      }
    });
  }
};

const deleteProduct = async (paymentId) => {
  const result = await Swal.fire({
    title: 'คุณแน่ใจหรือไม่?',
    text: 'คุณต้องการลบรูปแบบการชำระเงินนี้หรือไม่?',
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
    loading.value = true;
    isLoading.value = true;
    const response = await fetch(`/api/payment-method/${paymentId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete product');
    }

    await fetchPayment();

    await Swal.fire({
      icon: 'success',
      title: 'ลบรูปแบบการชำระเงินเรียบร้อย',
      text: 'รูปแบบการชำระเงินถูกลบสำเร็จ',
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (err) {
    console.error('Error deleting product:', err);
    await Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามารถลบรูปแบบการชำระเงิน กรุณาลองใหม่อีกครั้ง',
    });
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchPayment()
  console.log('payments : ', payments.value)
})
</script>

<style></style>