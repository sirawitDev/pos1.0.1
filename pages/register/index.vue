<template>
  <div class="bg-cover bg-center h-screen flex items-center justify-center" style="
      background-image: url('https://img5.pic.in.th/file/secure-sv1/desk-concept-cyber-monday-Large.png');
    ">
    <div class="bg-white bg-opacity-85 rounded-xl shadow-lg sm:w-[400px] w-[350px]">
      <div class="p-5">
        <div>
          <h1 class="font-bold text-3xl text-center text-[#2b7b64]">สมัครสมาชิก</h1>
          <p class="text-red-500 mb-5 text-sm text-center">รอการยืนยันใช้งานจากแอดมิน</p>
        </div>
        <div class="flex-col flex gap-y-4">
          <div class="flex justify-center">
            <div class="flex flex-col w-full">
              <p>ชื่อ</p>
              <input v-model="firstname" placeholder="ชื่อ" type="text" class="input input-bordered" />
            </div>
          </div>

          <div class="flex justify-center">
            <div class="flex flex-col w-full">
              <p>นามสกุล</p>
              <input v-model="lastname" placeholder="นามสกุล" type="text" class="input input-bordered" />
            </div>
          </div>

          <div class="flex justify-center">
            <div class="flex flex-col w-full">
              <p>เบอร์โทรศัพท์</p>
              <input v-model="formattedPhone" @input="formatPhone" maxlength="12" placeholder="เบอร์โทรศัพท์"
                type="text" class="input input-bordered" />
            </div>
          </div>

          <div class="flex justify-center">
            <div class="flex flex-col w-full">
              <p>อีเมล</p>
              <input v-model="email" placeholder="อีเมล" type="email" class="input input-bordered" />

              <p class="text-sm text-red-500">ใช้ @gmail.com หรือ @hotmail.com เท่านั้น</p>
            </div>
          </div>

          <div class="flex justify-center">
            <div class="flex flex-col w-full">
              <p>รหัสผ่าน</p>
              <div class="relative">
                <input v-model="password" :type="showPassword ? 'text' : 'password'"
                  class="input input-bordered w-full" />
                <button type="button" @click="togglePasswordVisibility"
                  class="absolute inset-y-0 right-3 flex items-center text-gray-600">
                  <span v-if="showPassword">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-6 h-5">
                      <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12" stroke="#808080" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M1 12C1 12 5 20 12 20C19 20 23 12 23 12" stroke="#808080" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round"></path>
                      <circle cx="12" cy="12" r="3" stroke="#808080" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round"></circle>
                    </svg>
                  </span>
                  <span v-else>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-6 h-5">
                      <path d="M2 12C2 12 6 4 12 4C18 4 22 12 22 12C22 12 18 20 12 20C6 20 2 12 2 12Z" stroke="#808080"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <line x1="4.47" y1="4.47" x2="19.53" y2="19.53" stroke="#808080" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round"></line>
                    </svg>
                  </span>
                </button>
              </div>
              <p class="text-red-500 text-sm">รหัสผ่านต้องมีความยาว 6-14 ตัวอักษร และรองรับเฉพาะตัวอักษร a-z, A-Z
                และตัวเลข 0-9</p>
            </div>
          </div>

          <div class="flex justify-center">
            <div class="flex flex-col w-full">
              <p>ยืนยันรหัสผ่าน</p>
              <div class="relative">
                <input v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
                  class="input input-bordered w-full" />
                <button type="button" @click="toggleConfirmPasswordVisibility"
                  class="absolute inset-y-0 right-3 flex items-center text-gray-600">
                  <span v-if="showConfirmPassword">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-6 h-5">
                      <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12" stroke="#808080" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M1 12C1 12 5 20 12 20C19 20 23 12 23 12" stroke="#808080" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round"></path>
                      <circle cx="12" cy="12" r="3" stroke="#808080" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round"></circle>
                    </svg>
                  </span>
                  <span v-else>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-6 h-5">
                      <path d="M2 12C2 12 6 4 12 4C18 4 22 12 22 12C22 12 18 20 12 20C6 20 2 12 2 12Z" stroke="#808080"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <line x1="4.47" y1="4.47" x2="19.53" y2="19.53" stroke="#808080" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round"></line>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div class="flex justify-center">
            <div class="w-full">
              <button @click="submitForm"
                class="p-3 bg-green-500 w-full text-lg font-medium text-white rounded-full hover:bg-green-600">
                สมัครสมาชิก
              </button>
              <RouterLink to="/">
                <p class="text-center mt-2 text-green-600 underline">เข้าสู่ระบบ</p>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="loading" class="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-gray-800">
    <div class="spinner-border animate-spin border-t-4 border-green-500 rounded-full w-12 h-12"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const firstname = ref('');
const lastname = ref('');
const email = ref('');
const password = ref('');
const phone = ref('')
const formattedPhone = ref('');

const loading = ref(false);

const confirmPassword = ref('');
const errorMessage = ref('');
const router = useRouter();

const showConfirmPassword = ref(false);
const showPassword = ref(false);

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const formatPhone = () => {
  let rawPhone = formattedPhone.value.replace(/\D/g, '');

  rawPhone = rawPhone.slice(0, 10);

  formattedPhone.value = rawPhone.replace(/(\d{3})(\d{3})(\d{0,4})/, (match, p1, p2, p3) => {
    return `${p1}-${p2}${p3 ? `-${p3}` : ''}`;
  });

  phone.value = rawPhone;
};

const submitForm = async () => {

  const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com)$/;
  if (!emailRegex.test(email.value)) {
    await Swal.fire({
      icon: 'error',
      title: 'อีเมลไม่ถูกต้อง',
      text: 'กรุณาใช้อีเมลที่ลงท้ายด้วย @gmail.com หรือ @hotmail.com เท่านั้น',
    });
    return;
  }

  if (password.value !== confirmPassword.value) {
    await Swal.fire({
      icon: 'error',
      title: 'รหัสผ่านไม่ตรงกัน',
      text: 'กรุณากรอกรหัสผ่านให้ตรงกัน',
    });
    return;
  }

  if (!email.value || !password.value || !firstname.value || !lastname.value || !confirmPassword.value) {
    await Swal.fire({
      icon: 'error',
      title: 'ข้อมูลไม่ครบถ้วน',
      text: 'กรุณากรอกข้อมูลให้ครบถ้วน',
    });
    return;
  }


  const result = await Swal.fire({
    title: 'ยืนยันการสมัครสมาชิก',
    text: 'คุณต้องการสมัครสมาชิกหรือไม่?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'ใช่, สมัครเลย!',
    cancelButtonText: 'ยกเลิก',
  });

  // หากผู้ใช้ยืนยัน
  if (result.isConfirmed) {
    loading.value = true;
    try {
      await axios.post('/api/auth/register', {
        firstname: firstname.value,
        lastname: lastname.value,
        email: email.value,
        password: password.value,
        phone: phone.value
      });

      await Swal.fire({
        icon: 'success',
        title: 'สำเร็จ!',
        text: 'สมัครสมาชิกสำเร็จ กรุณารอการยืนยันจากแอดมิน',
      });

      router.push('/');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'เกิดข้อผิดพลาด';
      errorMessage.value = errorMsg;

      await Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: errorMsg,
      });
    } finally {
      loading.value = false;
    }
  }
};
</script>
