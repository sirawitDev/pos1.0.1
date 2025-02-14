<template>
  <Userlayouts>
    <div class="relative overflow-hidden bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl shadow-lg mb-8">
      <div class="absolute inset-0 bg-pattern opacity-10"></div>
      <div class="flex justify-center items-center h-32 px-6">
        <h1 class="text-4xl md:text-6xl font-extrabold text-white tracking-wider">
          DASHBOARD
        </h1>
      </div>
    </div>
    <div class="p-6 bg-gray-50 rounded-2xl shadow-sm">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="relative group">
          <div class="absolute inset-0 bg-blue-600 rounded-2xl transform transition-transform group-hover:scale-[1.02]">
          </div>
          <div
            class="relative p-6 bg-[#2584FF] rounded-2xl transform transition-all duration-300 hover:translate-x-[2px] hover:-translate-y-[2px]">
            <div class="space-y-4">
              <h2 class="text-xl text-white/90 font-light">รายได้ทั้งหมด</h2>
              <div class="flex justify-between items-end">
                <p class="text-3xl font-bold text-white">{{ totalRevenue }} บาท</p>
                <img src="/public/moneytotal.png" alt="revenue" class="w-16 h-16 opacity-80" />
              </div>
            </div>
          </div>
        </div>

        <div class="relative group">
          <div class="absolute inset-0 bg-teal-600 rounded-2xl transform transition-transform group-hover:scale-[1.02]">
          </div>
          <div
            class="relative p-6 bg-[#00AC97] rounded-2xl transform transition-all duration-300 hover:translate-x-1 hover:-translate-y-1">
            <div class="space-y-4">
              <h2 class="text-xl text-white/90 font-light">รายได้วันนี้</h2>
              <div class="flex justify-between items-end">
                <p class="text-3xl font-bold text-white">{{ todayRevenue }} บาท</p>
                <img src="/public/moneyday.png" alt="today" class="w-16 h-16 opacity-80" />
              </div>
            </div>
          </div>
        </div>

        <div class="relative group">
          <div class="absolute inset-0 bg-gray-700 rounded-2xl transform transition-transform group-hover:scale-[1.02]">
          </div>
          <div
            class="relative p-6 bg-[#515262] rounded-2xl transform transition-all duration-300 hover:translate-x-1 hover:-translate-y-1">
            <div class="space-y-4">
              <h2 class="text-xl text-white/90 font-light">จำนวนการทำรายการวันนี้</h2>
              <div class="flex justify-between items-end">
                <p class="text-3xl font-bold text-white">{{ todayOrderCount }} รายการ</p>
                <img src="/public/document.png" alt="orders" class="w-16 h-16 opacity-80" />
              </div>
            </div>
          </div>
        </div>

        <div class="relative group">
          <div
            class="absolute inset-0 bg-yellow-500 rounded-2xl transform transition-transform group-hover:scale-[1.02]">
          </div>
          <div
            class="relative p-6 bg-[#f0ae2b] rounded-2xl transform transition-all duration-300 hover:translate-x-1 hover:-translate-y-1">
            <div class="space-y-4">
              <h2 class="text-xl text-white/90 font-light">รายการทั้งหมด</h2>
              <div class="flex justify-between items-end">
                <p class="text-3xl font-bold text-white">{{ totalOrderCount }} รายการ</p>
                <img src="/public/docall.png" alt="total" class="w-16 h-16 opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Chart Section -->
    <div class="mt-8 p-6 bg-white rounded-2xl shadow-sm">
      <div class="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4 md:mb-0">รายงานรายได้รายสัปดาห์</h2>
        <div class="flex flex-col sm:flex-row items-center space-x-4">
          <label for="week-selector" class="text-gray-600 font-medium">เลือกสัปดาห์:</label>
          <select id="week-selector" v-model="selectedWeek"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors">
            <option v-for="week in availableWeeks" :key="week" :value="week">
              {{ formatDateRange(week) }}
            </option>
          </select>
        </div>
      </div>

      <div class="w-full h-[400px]">
        <canvas id="revenueChart"></canvas>
      </div>
    </div>
  </Userlayouts>
</template>

<script setup>
import Userlayouts from '~/layouts/Userlayouts.vue';
import axios from 'axios';
import Cookies from 'js-cookie';
import Chart from "chart.js/auto";

const users = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;
const userUUID = users ? users.uuid : null;

const orders = ref([])
const selectedWeek = ref("");
const chartInstance = ref(null);

const totalRevenue = computed(() => {
  return orders.value.reduce((sum, order) => sum + order.totalAmount, 0);
});

const todayRevenue = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  return orders.value
    .filter(order => order.createdAt.startsWith(today))
    .reduce((sum, order) => sum + order.totalAmount, 0);
});

const totalOrderCount = computed(() => {
  return orders.value.length;
});


const isMobile = window.innerWidth <= 768;

const todayOrderCount = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  return orders.value.filter(order => order.createdAt.startsWith(today)).length;
});

const formatDateRange = (startDate) => {
  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);

  const formatDate = (date) => {
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return `${formatDate(start)} - ${formatDate(end)}`;
};

const getFormattedDate = (date) => {
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  });
};

const fetchOrder = async () => {
  try {
    const response = await axios.get('/api/order', {
      params: { userUUID },
    });
    orders.value = response.data
  } catch (err) {
    console.error('Error fetching Product:', err);
  }
};

const availableWeeks = computed(() => {
  const weeks = new Set(
    orders.value.map((order) => {
      const date = new Date(order.createdAt);
      const startOfWeek = new Date(
        date.setDate(date.getDate() - date.getDay())
      )
        .toISOString()
        .split("T")[0];
      return startOfWeek;
    })
  );
  return Array.from(weeks).sort();
});

const weekLabels = computed(() => {
  if (!selectedWeek.value) return [];

  const startOfWeek = new Date(selectedWeek.value);
  const labels = [];

  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(startOfWeek);
    currentDay.setDate(startOfWeek.getDate() + i);

    const dayOfWeek = currentDay.toLocaleDateString('th-TH', { weekday: 'long' });

    const dayNumber = currentDay.getDate();

    labels.push(`${dayOfWeek} (ที่ ${dayNumber})`);
  }

  return labels;
});

const dailyRevenueForSelectedWeek = computed(() => {
  if (!selectedWeek.value) return [];

  const startOfWeek = new Date(selectedWeek.value);
  const dailyRevenue = Array(7).fill(0);

  orders.value.forEach((order) => {
    const orderDate = new Date(order.createdAt);
    const dayIndex = Math.floor(
      (orderDate - startOfWeek) / (1000 * 60 * 60 * 24)
    );

    if (dayIndex >= 0 && dayIndex < 7) {
      dailyRevenue[dayIndex] += order.totalAmount;
    }
  });

  return dailyRevenue;
});

const updateChart = () => {
  const ctx = document.getElementById("revenueChart").getContext("2d");

  if (chartInstance.value) {
    chartInstance.value.data.labels = weekLabels.value;
    chartInstance.value.data.datasets[0].data = dailyRevenueForSelectedWeek.value;
    chartInstance.value.update();
  } else {
    chartInstance.value = new Chart(ctx, {
      type: "bar",
      data: {
        labels: weekLabels.value,
        datasets: [
          {
            label: "รายได้รายวัน",
            data: dailyRevenueForSelectedWeek.value,
            backgroundColor: "#fb923c",
            borderColor: "white",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: !isMobile,
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return "รายได้" + context.raw + " บาท";
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return value + " บาท";
              },
            },
          },
        },
      },
    });
  }
};


watch(selectedWeek, updateChart);

onMounted(async () => {
  await fetchOrder()
  console.log('orders : ', orders.value)
  if (availableWeeks.value.length > 0) {
    selectedWeek.value = availableWeeks.value[0];
  }
})

// definePageMeta({
//   middleware: 'auth',
// });
</script>

<style scoped>
.bg-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}
</style>