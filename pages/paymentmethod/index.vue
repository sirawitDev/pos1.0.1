<template>
  <Userlayouts>
    <div class="flex justify-center items-center bg-[#FF8128] w-full h-20 shadow-md rounded-full bg-opacity-50">
      <h2 class="sm:text-5xl text-3xl font-bold text-[#fefeff] text-stroke tracking-wide">
        รูปแบบการชำเงิน
      </h2>
    </div>

    <div>
      <button class="btn btn-accent w-full mt-5" onclick="my_modal_3.showModal()">
        <p class="text-white font-light">เพิ่มรูปแบบการชำระเงิน</p>
      </button>
      <dialog id="my_modal_3" class="modal">
        <div class="modal-box">
          <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <div class="flex justify-center">
            <h3 class="text-lg font-bold">เพิ่มรูปแบบการชำระเงิน</h3>
          </div>

          <div class="mt-5">
            <input v-model="paymentMethodName" type="text" class="input input-bordered w-full">
            <p class="text-red-500 text-sm">*ตัวอย่าง = เงินสด , โอนเงิน</p>
          </div>

          <div class="mt-3">
            <div @click="addPaymentMethod" class="btn btn-accent w-full">
              <p class="text-white font-light">ยืนยัน</p>
            </div>
          </div>
        </div>
      </dialog>
    </div>

    <div class="max-w-xl mx-auto">
      <div class="overflow-x-auto rounded-lg border-4 border-slate-500 mb-5 mt-5">
        <div v-if="payments.length === 0" class="text-center py-10">
          <p class="text-lg text-red-500 font-medium">คุณยังไม่มีรูปแบบการชำระเงิน</p>
        </div>
        <table v-else class="table">
          <thead>
            <tr class="bg-slate-500 text-white text-base">
              <th>
                <p class="text-center">รูปแบบการชำระเงิน</p>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <!-- row 1 -->
            <tr v-for="payment in payments">
              <td class="border-r-4 border-slate-500">
                <p class="text-center text-lg">{{ payment.name }}</p>
              </td>
              <td>
                <div class="flex justify-center">
                  <div @click="deleteProduct(payment.id)" class="btn bg-red-500 hover:bg-red-300">
                    <Trash />
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="loading" class="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-gray-800">
      <div class="spinner-border animate-spin border-t-4 border-green-500 rounded-full w-12 h-12"></div>
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