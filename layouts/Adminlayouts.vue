<template>
  <div class="flex flex-col h-full">
    <div class="flex justify-center mt-2">
      <nav class="w-full mt-2 ml-4 mr-4 bg-slate-600 p-4 flex justify-between items-center rounded-2xl h-14">
        <div class="flex">
          <div class=" hidden sm:block">
            <div class="flex">
              <h1 class="font-bold text-2xl mt-2 ml-2 text-white">MyPOS</h1>
            </div>
          </div>

          <button class="sm:hidden btn btn-ghost btn-circle text-white" @click="toggleMobileNav">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor"
              class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <!-- Sidebar for Mobile Navigation -->
          <div v-if="mobileNavOpen" class="fixed inset-0 bg-gray-800 bg-opacity-75 z-40 sm:hidden"
            @click="toggleMobileNav">
            <div class="absolute left-0 top-0 h-full w-60 bg-white font-kanit p-2 overflow-auto" @click.stop>
              <div class="flex justify-center mt-4">
                <p class="text-2xl font-bold text-orange-500">MyPOS</p>
              </div>
              <div class="divider pr-4 pl-4"></div>
              <ul class="flex flex-col">
                <li class="">
                  <RouterLink to="/dashboard"
                    class="block py-2 px-4 hover:bg-gray-200 rounded-full border-2 border-accent"
                    @click="toggleMobileNav">
                    <p class="text-center text-orange-400 font-bold">หน้าแรกas</p>
                  </RouterLink>
                </li>
              </ul>

              <ul class="menu bg-base-100 rounded-box w-70 mt-2 border-2 -mx-0 border-accent">
                <li>
                  <RouterLink to="/admin/users">
                    <Users />
                    <p class="text-base text-zinc-800">ผู้ใช้ทั้งหมด</p>
                  </RouterLink>
                </li>
                <li>
                  <RouterLink to="/admin/products">
                    <POS />
                    <p class="text-base text-zinc-800">สินค้าทั้งหมด</p>
                  </RouterLink>
                </li>

                <li>
                  <RouterLink to="/admin/approve" class="flex justify-between">
                    <div class="flex gap-2">
                      <UserCog />
                      <p class="text-base text-zinc-800">รอการยืนยัน</p>
                    </div>

                    <div class=" rounded-full bg-red-500 w-5">
                      <p class="text-white text-center">{{ fetusers.length }}</p>
                    </div>
                  </RouterLink>
                </li>
              </ul>

            </div>
          </div>
        </div>

        <div class="flex items-center space-x-4 ">

          <div class="dropdown dropdown-end">
            <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar online">
              <div class="w-10 rounded-full">
                <img alt="Tailwind CSS Navbar component"
                  src="https://img5.pic.in.th/file/secure-sv1/profile1f5c63b4f5aa038d.png" />
              </div>
            </div>
            <ul tabindex="0" class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
              <li @click="authStore.logout">
                <a class="justify-between">
                  ออกจากระบบ
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>

    <div class="flex h-full mt-2">
      <!-- Sidebar / Aside -->
      <aside class="w-72 bg-slate-500 rounded-xl h-full hidden sm:block mx-4">
        <div class="w-full h-26 bg-slate-600 rounded-t-xl flex justify-start items-center p-4 gap-4">

          <div>
            <img src="https://img5.pic.in.th/file/secure-sv1/profile1f5c63b4f5aa038d.png" alt="logo-user"
              class="w-14 h-14">
          </div>

          <div>
            <p class="text-white">{{ firstname }} {{ lastname }}</p>
            <p class=" font-semibold text-orange-400">ROLE : {{ role }}</p>
          </div>

        </div>


        <div class="pr-2 pl-2">
          <RouterLink to="/admin"
            class="flex items-center mt-3 p-2 bg-base-100 rounded-xl hover:bg-gray-100 transition-colors duration-200">
            <Dashboard />
            <p class="text-base ml-2">หน้าแรก </p>
          </RouterLink>

          <ul class="menu bg-base-100 rounded-box w-70 mt-2 mb-2">
            <li>
              <ul>
                <li>
                  <RouterLink to="/admin/users">
                    <Users />
                    <p class="text-base text-zinc-800">ผู้ใช้ทั้งหมด</p>
                  </RouterLink>
                </li>
                <li>
                  <RouterLink to="/admin/products">
                    <POS />
                    <p class="text-base text-zinc-800">สินค้าทั้งหมด</p>
                  </RouterLink>
                </li>

                <li>
                  <RouterLink to="/admin/approve" class="flex justify-between">
                    <div class="flex gap-2">
                      <UserCog />
                      <p class="text-base text-zinc-800">รอการยืนยัน</p>
                    </div>

                    <div class=" rounded-full bg-red-500 w-5">
                      <p class="text-white text-center">{{ fetusers.length }}</p>
                    </div>
                  </RouterLink>
                </li>

              </ul>
            </li>
          </ul>

        </div>
      </aside>
      <!-- Main Content -->
      <div class="flex-1 p-4  rounded-xl mx-auto w-full">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import Dashboard from '~/components/icons/Dashboard.vue';
import Users from '~/components/icons/Users.vue';
import Products from '~/components/icons/Products.vue';
import POS from '~/components/icons/POS.vue';
import UserCog from '~/components/icons/UserCog.vue';
import axios from 'axios';

import { useAuthStore } from '#build/imports';
import Cookies from 'js-cookie';

const users = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;
const firstname = users ? users.firstname : 'Unknown';
const lastname = users ? users.lastname : 'User';
const role = users ? users.role : 'Guest';

const mobileNavOpen = ref(false);
const authStore = useAuthStore()

const fetusers = ref([])

const toggleMobileNav = () => {
  mobileNavOpen.value = !mobileNavOpen.value;
};

const fetchUsers = async () => {
  try {
    const response = await axios.get('/api/users');
    const data = response.data

    fetusers.value = data.filter(users => users.status === 'รอยืนยัน');
  } catch (err) {
    console.error('Error fetching Product:', err);
  }
};

onMounted(async () => {
  await fetchUsers()
})
</script>

<style scoped></style>
