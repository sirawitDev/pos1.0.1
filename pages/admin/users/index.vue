<template>
  <Adminlayouts>
    <div class="flex justify-center items-center bg-[#FF8128] w-full h-16 md:h-20 shadow-md rounded-full bg-opacity-50">
      <h2 class="text-2xl md:text-3xl lg:text-5xl font-bold text-[#fefeff] text-stroke tracking-wide">
        จัดการผู้ใช้บริการ
      </h2>
    </div>

    <div class="max-w-5xl mx-auto">
      <div class="overflow-x-auto rounded-lg border-4 border-slate-500 mb-5 mt-5">
        <table class="table">
          <!-- head -->
          <thead>
            <tr class="bg-slate-500 text-white text-base">
              <th>
                <p>UUID</p>
              </th>
              <th>
                <p>ชื่อ</p>
              </th>
              <th>
                <p>เบอร์โทรศัพท์</p>
              </th>
              <th>
                <p>บทบาท</p>
              </th>
              <th>
                <p>สถานะ</p>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <!-- row 1 -->
            <tr v-for="user in users">
              <th>
                <p>{{ user.uuid }}</p>
              </th>
              <td>
                <p>{{ user.firstname }} {{ user.lastname }}</p>
              </td>
              <td>
                <p>{{ user.phone }}</p>
              </td>
              <td>
                <p>{{ user.role }}</p>
              </td>
              <td>
                <p>{{ user.status }}</p>
              </td>
              <td>
                <div class="btn bg-red-500 hover:bg-red-300">
                  <Trash />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </Adminlayouts>
</template>

<script setup>
import Adminlayouts from '~/layouts/Adminlayouts.vue';
import axios from 'axios';
import Trash from '~/components/icons/Trash.vue';

const isLoading = ref(false)
const users = ref([])

const fetchUsers = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('/api/users');
    users.value = response.data
  } catch (err) {
    console.error('Error fetching Product:', err);
  } finally {
    isLoading.value = false;
  }
};
onMounted(async () => {
  await fetchUsers()
  console.log('users : ', users.value)
})
</script>

<style></style>