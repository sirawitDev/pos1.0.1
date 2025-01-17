<template>
  <Userlayouts>
    <div class="max-w-2xl mx-auto p-4 bg-zinc-100 rounded-lg">
      <div class="mb-4 flex justify-center">
        <div
          class="flex justify-center items-center bg-[#FF8128] sm:w-full w-full h-20 shadow-md rounded-full mt-5 bg-opacity-70">
          <h2 class="sm:text-5xl text-3xl font-bold text-[#fefeff] text-stroke tracking-wide">เพิ่มข้อมูลสินค้า</h2>
        </div>
      </div>

      <div class="max-w-2xl mx-auto bg-white p-4 rounded-md">
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-lg">ชื่อสินค้า</span>
          </div>
          <input v-model="name" type="text" placeholder="ชื่อสินค้า" class="input input-bordered w-full" />
        </label>

        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-base font-medium">รูปภาพ</span>
          </div>
          <input type="file" @change="handleFileUpload" accept="image/*"
            class="file-input file-input-bordered w-full" />
        </label>

        <div v-if="imagePreview" class="my-4">
          <div class="flex justify-center">
            <img :src="imagePreview" alt="Promotion Image Preview" class="w-48 h-auto border rounded" />
          </div>
        </div>

        <!-- Image Preview -->
        <div v-if="imageUrl" class="my-4">
          <div class="flex justify-center">
            <img :src="imageUrl" alt="" class="w-48 h-auto border rounded" />
          </div>
        </div>

        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-lg">ราคา</span>
          </div>
          <input v-model="price" type="number" placeholder="" class="input input-bordered w-full" />
        </label>

        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-lg">คำอธิบายรายละเอียดสินค้า</span>
          </div>
          <textarea v-model="about" type="text" placeholder="" class="textarea textarea-bordered h-16 w-full" />
        </label>

        <div class="flex justify-center mt-5 gap-3">
          <RouterLink to="/products" class="btn btn-accent sm:w-60 w-36">
            <p class="font-light text-white">ย้อนกลับ</p>
          </RouterLink>
          <button @click="submitForm" class="btn btn-accent sm:w-60 w-36 font-light text-white">เพิ่มสินค้า</button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-gray-800">
      <div class="spinner-border animate-spin border-t-4 border-green-500 rounded-full w-12 h-12"></div>
    </div>

  </Userlayouts>
</template>

<script setup>
import Userlayouts from '~/layouts/Userlayouts.vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

const users = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;
const userUUID = users ? users.uuid : null;

const router = useRouter()

const loading = ref(false);

const name = ref('')
const about = ref('-')
const price = ref(null)

const imageFile = ref(null);
const imagePreview = ref('');

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    imageFile.value = file;
    // Create preview URL
    imagePreview.value = URL.createObjectURL(file);

    console.log('file : ', file)
  }
};

const submitForm = async () => {
  const { isConfirmed } = await Swal.fire({
    title: 'ยืนยันการเพิ่มสินค้า',
    text: 'คุณต้องการเพิ่มสินค้านี้หรือไม่?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'ยืนยัน',
    cancelButtonText: 'ยกเลิก',
    reverseButtons: true,
  });

  if (!isConfirmed) return;

  try {
    loading.value = true;
    const formData = new FormData();
    formData.append('name', name.value);
    formData.append('image', imageFile.value);
    formData.append('about', about.value);
    formData.append('price', price.value);
    formData.append('userUUID', userUUID);

    const response = await $fetch('/api/products', {
      method: 'POST',
      body: formData
    });

    console.log('Response:', response);

    Swal.fire({
      icon: 'success',
      title: 'เพิ่มสินค้าสำเร็จ',
      text: 'สินค้าได้ถูกเพิ่มแล้ว',
    });

    router.push('/products');
  } catch (error) {
    console.error('Error adding promotion:', error);

    Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: 'เกิดข้อผิดพลาดในการเพิ่มสินค้า: ' + error.message,
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  console.log('userUUID : ', userUUID)
})

// definePageMeta({
//   middleware: 'auth',
// });
</script>


<style></style>