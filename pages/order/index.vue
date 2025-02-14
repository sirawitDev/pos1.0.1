<template>
  <Userlayouts>
    <div class="space-y-6 p-4">
      <div
        class="flex justify-center items-center bg-gradient-to-r from-orange-400 to-orange-600 w-full h-20 shadow-lg rounded-xl">
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-wide">รายการขาย</h2>
      </div>

      <div class="flex flex-wrap gap-4 p-4 bg-white rounded-lg shadow-md">
        <div class="flex-1 min-w-[200px]">
          <div class="flex items-center gap-2">
            <p>ตั้งแต่</p>
            <input type="date" v-model="dateRange.start"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              :max="dateRange.end" />
          </div>
        </div>
        <div class="flex-1 min-w-[200px]">
          <div class="flex items-center gap-2">
            <p>ถึง</p>
            <input type="date" v-model="dateRange.end"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              :min="dateRange.start" />
          </div>
        </div>
        <button @click="filterOrders"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-2 transition-colors">
          ค้นหา
        </button>
        <button @click="exportToExcel"
          class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center gap-2 transition-colors">
          ส่งออก Excel
        </button>
      </div>

      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div v-if="isLoading" class="flex justify-center items-center h-32">
          <span class="loading loading-spinner text-orange-500"></span>
        </div>

        <div v-else-if="filteredOrders.length === 0" class="text-center py-10">
          <p class="text-lg text-red-500 font-medium">ไม่พบรายการขาย</p>
        </div>

        <div v-else>
          <table class="hidden md:table w-full">
            <thead>
              <tr class="bg-gradient-to-r from-orange-400 to-orange-600 text-white">
                <th class="px-4 py-3 text-center font-medium">เลขทำรายการ</th>
                <th class="px-4 py-3 font-medium">สินค้า</th>
                <th class="px-4 py-3 font-medium">ราคารวม</th>
                <th class="px-4 py-3 text-center font-medium">รูปแบบการชำระเงิน</th>
                <th class="px-4 py-3 text-center font-medium">วันที่ทำรายการ</th>
                <th class="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in filteredOrders" :key="order.orderNumber" class="border-b hover:bg-gray-50">
                <td class="px-4 py-3 text-center">{{ order.orderNumber }}</td>
                <td class="px-4 py-3">
                  <div v-for="product in order.products" :key="product.id" class="flex items-center gap-3 py-2">
                    <img :src="product.imageUrl" :alt="product.name" class="w-16 h-16 rounded-md object-cover" />
                    <div>
                      <p class="font-medium">{{ product.name }}</p>
                      <p class="text-sm text-gray-600">
                        จำนวน: <span class="text-red-500">{{ product.quantity }}</span>
                      </p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3">{{ order.totalAmount }} บาท</td>
                <td class="px-4 py-3 text-center">{{ order.paymentMethod }}</td>
                <td class="px-4 py-3 text-center">{{ formatDate(order.updatedAt) }}</td>
                <td class="px-4 py-3">
                  <button @click="deleteOrder(order.id)"
                    class="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors">
                    ลบ
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="md:hidden">
            <div v-for="order in filteredOrders" :key="order.orderNumber" class="p-4 border-b">
              <div class="flex justify-between items-center mb-3">
                <p class="font-medium">เลขที่: {{ order.orderNumber }}</p>
                <button @click="deleteOrder(order.id)" class="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md">
                  ลบ
                </button>
              </div>

              <div v-for="product in order.products" :key="product.id" class="flex gap-3 mb-3">
                <img :src="product.imageUrl" :alt="product.name" class="w-16 h-16 rounded-md object-cover" />
                <div class="flex flex-col justify-center">
                  <p class="font-medium">{{ product.name }}</p>
                  <p>จำนวน: <span class="text-red-500">{{ product.quantity }}</span></p>
                </div>
              </div>

              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <p class="text-gray-600">ราคารวม:</p>
                  <p class="font-medium">{{ order.totalAmount }} บาท</p>
                </div>
                <div class="flex justify-between">
                  <p class="text-gray-600">การชำระเงิน:</p>
                  <p>{{ order.paymentMethod }}</p>
                </div>
                <div class="flex justify-between">
                  <p class="text-gray-600">วันที่:</p>
                  <p>{{ formatDate(order.updatedAt) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Userlayouts>
</template>

<script setup>
import Userlayouts from '~/layouts/Userlayouts.vue'
import { ref, computed } from 'vue'
import * as XLSX from 'xlsx'
import Cookies from 'js-cookie'
import axios from 'axios'
import Swal from 'sweetalert2'

const isLoading = ref(false)
const orders = ref([])
const users = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null
const userUUID = users ? users.uuid : null

const dateRange = ref({
  start: '',
  end: ''
})

const filteredOrders = computed(() => {
  if (!dateRange.value.start && !dateRange.value.end) {
    return orders.value
  }

  return orders.value.filter(order => {
    const orderDate = new Date(order.updatedAt).setHours(0, 0, 0, 0)
    const start = dateRange.value.start ? new Date(dateRange.value.start).setHours(0, 0, 0, 0) : null
    const end = dateRange.value.end ? new Date(dateRange.value.end).setHours(23, 59, 59, 999) : null

    if (start && end) {
      return orderDate >= start && orderDate <= end
    } else if (start) {
      return orderDate >= start
    } else if (end) {
      return orderDate <= end
    }
    return true
  })
})


const formatDate = (date) => {
  return new Date(date).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const filterOrders = () => {
  dateRange.value = { ...dateRange.value }
}

const exportToExcel = () => {
  const data = filteredOrders.value.map(order => ({
    'เลขทำรายการ': order.orderNumber,
    'สินค้า': order.products.map(p => `${p.name} x${p.quantity}`).join(', '),
    'ราคารวม': `${order.totalAmount} บาท`,
    'รูปแบบการชำระเงิน': order.paymentMethod,
    'วันที่ทำรายการ': formatDate(order.updatedAt)
  }))

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'รายการขาย')
  XLSX.writeFile(workbook, 'รายการขาย.xlsx')
}

const fetchOrder = async () => {
  isLoading.value = true
  try {
    const response = await axios.get('/api/order', {
      params: { userUUID },
    })
    orders.value = response.data
  } catch (err) {
    console.error('Error fetching orders:', err)
  } finally {
    isLoading.value = false
  }
}

const deleteOrder = async (orderId) => {
  const result = await Swal.fire({
    title: 'คุณแน่ใจหรือไม่?',
    text: 'คุณต้องการลบคำสั่งซื้อนี้หรือไม่?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'ใช่, ลบเลย!',
    cancelButtonText: 'ยกเลิก',
  })

  if (!result.isConfirmed) {
    return
  }

  try {
    isLoading.value = true
    const response = await fetch(`/api/order/${orderId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Failed to delete order')
    }

    await fetchOrder()

    await Swal.fire({
      icon: 'success',
      title: 'ลบคำสั่งซื้อเรียบร้อย',
      text: 'คำสั่งซื้อถูกลบสำเร็จ',
      timer: 2000,
      showConfirmButton: false,
    })
  } catch (err) {
    console.error('Error deleting order:', err)
    await Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามารถลบคำสั่งซื้อได้ กรุณาลองใหม่อีกครั้ง',
    })
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await fetchOrder()
})
</script>