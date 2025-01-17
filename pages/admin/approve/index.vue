<template>
  <Adminlayouts>
    <div class="flex justify-center items-center bg-[#FF8128] w-full h-16 md:h-20 shadow-md rounded-full bg-opacity-50">
      <h2 class="text-2xl md:text-3xl lg:text-5xl font-bold text-[#fefeff] text-stroke tracking-wide">
        ยืนยันการใช้งาน
      </h2>
    </div>

    <div class="max-w-3xl mx-auto">
      <div v-if="users.length === 0" class="text-center py-10">
        <p class="text-lg text-red-500 font-medium">ไม่มีผู้ใช้บริการให้ยืนยัน</p>
      </div>
      <div v-else class="overflow-x-auto rounded-lg border-4 border-slate-500 mb-5 mt-5">
        <table class="table">
          <thead>
            <tr class="bg-slate-500 text-white text-base">
              <th>UUID</th>
              <th>ชื่อ</th>
              <th>อีเมล</th>
              <th>เบอร์โทรศัพท์</th>
              <th>สถานะ</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.uuid">
              <th>
                <p>{{ user.uuid }}</p>
              </th>
              <td>
                <p>{{ user.firstname }} {{ user.lastname }}</p>
              </td>
              <td>
                <p>{{ user.email }}</p>
              </td>
              <td>
                <p>{{ user.phone }}</p>
              </td>
              <td>
                <p>{{ user.status }}</p>
              </td>
              <td>
                <div class="btn btn-accent" @click="verifyUser(user.uuid)">
                  <p class="font-light text-white">ยืนยันผู้ใช้</p>
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
import Swal from "sweetalert2";

const isLoading = ref(false)
const users = ref([])

const fetchUsers = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('/api/users');
    const data = response.data

    users.value = data.filter(users => users.status === 'รอยืนยัน');
  } catch (err) {
    console.error('Error fetching Product:', err);
  } finally {
    isLoading.value = false;
  }
};

const verifyUser = async (uuid) => {
  try {
    const result = await Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: 'คุณต้องการยืนยันผู้ใช้นี้หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, ยืนยันเลย!',
      cancelButtonText: 'ยกเลิก',
    });

    if (!result.isConfirmed) {
      return;
    }

    isLoading.value = true;

    const response = await $fetch(`/api/users/${uuid}/verify`, {
      method: 'PATCH',
    });

    console.log('User verified:', response);

    await Swal.fire({
      icon: 'success',
      title: 'ยืนยันผู้ใช้สำเร็จ',
      text: 'ผู้ใช้ได้รับการยืนยันเรียบร้อยแล้ว',
      timer: 2000,
      showConfirmButton: false,
    });

    window.location.reload()
  } catch (err) {
    console.error('Error verifying user:', err);

    await Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามารถยืนยันผู้ใช้ได้ กรุณาลองอีกครั้ง',
    });
  } finally {
    isLoading.value = false;
  }
};


onMounted(async () => {
  await fetchUsers()
  console.log('user : ', users.value)
})
</script>

<style></style>