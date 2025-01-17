<template>
  <div class="flex flex-col h-full">
    <div class="flex justify-center mt-2">
      <nav class="w-full mt-2 ml-4 mr-4 bg-slate-600 p-4 flex justify-between items-center rounded-2xl h-14">
        <div class="flex">
          <div class=" hidden sm:block">
            <div class="flex">
              <!-- <img src="https://img5.pic.in.th/file/secure-sv1/iconMypos.png" alt="logo-mypos" class="w-16 h-16"> -->
              <div class="flex items-center">
                <h1 class="font-bold text-2xl ml-2 text-white">MyPOS</h1>
              </div>
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
            <div class="absolute left-0 top-0 h-full w-92 bg-white font-kanit p-2 overflow-auto" @click.stop>
              <div class="flex justify-center mt-4">
                <p class="text-2xl font-bold text-orange-500">MyPOS</p>
              </div>
              <div class="divider pr-4 pl-4"></div>
              <ul class="flex flex-col">
                <li class="">
                  <RouterLink to="/dashboard"
                    class="block py-2 px-4 hover:bg-gray-200 rounded-full border-2 border-accent"
                    @click="toggleMobileNav">
                    <p class="text-center text-orange-400 font-bold">หน้าแรก</p>
                  </RouterLink>
                </li>
              </ul>

              <!-- ข้อมูลภายในเว็บ -->

              <ul class="menu bg-base-100 rounded-box w-[270px] mt-2 border-2 -mx-0 border-accent">
                <li>
                  <!-- <h2 class="menu-title font-light text-zinc-800 text-center text-base">ข้อมูลภายในเว็บ</h2> -->
                  <ul>
                    <li>
                      <RouterLink to="/products">
                        <Products />
                        <p class="text-base text-zinc-800">ข้อมูลสินค้า</p>
                      </RouterLink>
                    </li>
                    <li>
                      <RouterLink to="/pos">
                        <POS />
                        <p class="text-base text-zinc-800">ขายสินค้า</p>
                      </RouterLink>
                    </li>

                    <li>
                      <RouterLink to="/order">
                        <Clipboard />
                        <p class="text-base text-zinc-800">รายการขาย</p>
                      </RouterLink>
                    </li>

                    <li>
                      <details open>
                        <summary>
                          <Setting />
                          <p class="text-base text-zinc-800">ตั้งค่าร้านค้า</p>
                        </summary>
                        <ul>
                          <li>
                            <RouterLink to="/paymentmethod" class="flex">
                              <CreditCard />
                              <p class="text-base text-nowrap">รูปแบบการชำระเงิน</p>
                            </RouterLink>
                          </li>
                          <!-- <li>
                        <p>Submenu 2</p>
                      </li> -->
                        </ul>
                      </details>
                    </li>
                  </ul>
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
          <RouterLink to="/dashboard"
            class="flex items-center mt-3 p-2 bg-base-100 rounded-xl hover:bg-gray-100 transition-colors duration-200">
            <Dashboard />
            <p class="text-base ml-2">หน้าแรก </p>
          </RouterLink>

          <ul class="menu bg-base-100 rounded-box w-70 mt-2 mb-2">
            <li>
              <!-- <h2 class="menu-title font-light text-zinc-800 text-center text-base">ข้อมูลภายในเว็บ</h2> -->
              <ul>
                <!-- <li>
                  <RouterLink to="/admin/users" class="">
                    <Users />
                    <p class="text-base text-zinc-800">ข้อมูลยูสเซอร์</p>
                  </RouterLink>
                </li> -->
                <li>
                  <RouterLink to="/products">
                    <Products />
                    <p class="text-base text-zinc-800">ข้อมูลสินค้า</p>
                  </RouterLink>
                </li>
                <li>
                  <RouterLink to="/pos">
                    <POS />
                    <p class="text-base text-zinc-800">ขายสินค้า</p>
                  </RouterLink>
                </li>

                <li>
                  <RouterLink to="/order">
                    <Clipboard />
                    <p class="text-base text-zinc-800">รายการขาย</p>
                  </RouterLink>
                </li>

                <li>
                  <details open>
                    <summary>
                      <Setting />
                      <p class="text-base text-zinc-800">ตั้งค่าร้านค้า</p>
                    </summary>
                    <ul>
                      <li>
                        <RouterLink to="/paymentmethod" class="flex">
                          <CreditCard />
                          <p class="text-base">รูปแบบการชำระเงิน</p>
                        </RouterLink>
                      </li>
                      <!-- <li>
                        <p>Submenu 2</p>
                      </li> -->
                    </ul>
                  </details>
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
import Promotion from '~/components/icons/Promotion.vue';
import POS from '~/components/icons/POS.vue';
import Setting from '~/components/icons/Setting.vue';
import CreditCard from '~/components/icons/CreditCard.vue';
import Clipboard from '~/components/icons/Clipboard.vue';

import { useAuthStore } from '#build/imports';
import Cookies from 'js-cookie';

const users = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;
const firstname = users.firstname
const lastname = users.lastname
const role = users.role

const mobileNavOpen = ref(false);
const authStore = useAuthStore()

const toggleMobileNav = () => {
  mobileNavOpen.value = !mobileNavOpen.value;
};
</script>

<style scoped></style>
