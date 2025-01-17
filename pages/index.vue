<template>
  <div class="bg-cover bg-center h-screen flex items-center justify-center"
    style="background-image: url('https://img5.pic.in.th/file/secure-sv1/desk-concept-cyber-monday-Large.png')">
    <div class="bg-white bg-opacity-85 rounded-xl shadow-lg sm:w-[400px] w-[350px]">


      <div class="p-5">
        <div class="flex justify-center">
          <img src="https://img5.pic.in.th/file/secure-sv1/iconMypos.png" alt="logo-mypos" class="w-48 h-48">
        </div>

        <div class="divider"></div>

        <h1 class="font-bold text-3xl mb-5 text-center text-[#2b7b64]">เข้าสู่ระบบ</h1>
        <div class="flex-col flex gap-y-4">

          <div class="flex justify-center">
            <div class="flex flex-col w-full">
              <p>อีเมล</p>
              <input v-model="email" type="text" class="input input-bordered">
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
            </div>
          </div>

          <div v-if="showError">
            <p class="text-red-500">อีเมลหรือรหัสผ่านไม่ถูกต้อง</p>
          </div>


          <div class="flex justify-center mt-2">
            <div class="w-full">
              <button @click="login"
                class="p-3 bg-green-500 w-full text-lg font-medium text-white rounded-full hover:bg-green-600">
                เข้าสู่ระบบ
              </button>
              <RouterLink to="/register" class="flex mt-3 gap-2 justify-center">
                <p>ไม่มีบัญชีผู้ใช้? </p>
                <p class="text-center text-green-600 underline">สมัครสมาชิก</p>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '#build/imports';
import axios from 'axios';
import Swal from 'sweetalert2';

const email = ref('');
const password = ref('');
const authStore = useAuthStore()

const showError = ref(false)

const showPassword = ref(false);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const login = async () => {
  try {
    const response = await axios.post('api/auth/login', {
      email: email.value,
      password: password.value
    })
    console.log(response);
    if (response.status === 200) {
      authStore.login(response.data);
    }
  } catch (error) {
    console.log('Login failed', error);
    showError.value = true

    setTimeout(() => {
      showError.value = false;
    }, 3500);
  }
};
</script>