<template>
  <Userlayouts>
    <div class="flex justify-center items-center bg-[#FF8128] w-full h-20 shadow-md rounded-full mt-1 bg-opacity-70">
      <h2 class="sm:text-6xl text-4xl font-bold text-[#fefeff] text-stroke tracking-wide">DASHBOARD</h2>
    </div>

    <div class="flex justify-center mt-5 p-5 bg-white shadow-md rounded-md">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 w-full">
        <div class="card bg-[#2584FF] w-full shadow-xl h-44 transform-transition bg-opacity-65">
          <h2 class="card-title text-white font-light text-3xl pl-5 pt-5">รายได้ทั้งหมด</h2>
          <div class="flex mt-8">
            <div class="flex ml-5 w-full mt-8">
              <p class="text-white text-4xl mt-1">
                {{ totalRevenue }} บาท
              </p>
            </div>
            <div class="absolute bottom-2 right-1 justify-end mr-5">
              <img src="/public/moneytotal.png" alt="logo_user" class="w-[100px]">
            </div>
          </div>
        </div>

        <div class="card bg-[#00AC97] w-full h-44 shadow-xl transform-transition bg-opacity-65">
          <h2 class="card-title text-white font-light text-3xl pl-5 pt-5">รายได้วันนี้</h2>
          <div class="flex mt-8">
            <div class="flex-1 ml-5 mt-8">
              <p class="text-white text-4xl mt-2">
                {{ todayRevenue }} บาท
              </p>
            </div>
            <div class="absolute bottom-2 right-0 justify-end mr-5">
              <img src="/public/moneyday.png" alt="logo_user" class="w-[100px]">
            </div>
          </div>
        </div>

        <div class="card bg-[#515262] w-full h-44 shadow-xl transform-transition bg-opacity-65">
          <h2 class="card-title text-white font-light text-2xl pl-5 pt-5">จำนวนการทำรายการวันนี้</h2>
          <div class="flex mt-8">
            <div class="flex-1 ml-5 mt-8">
              <p class="text-white text-4xl mt-2">
                {{ todayOrderCount }} รายการ
              </p>
            </div>
            <div class="absolute bottom-2 right-0 justify-end mr-5">
              <img src="/public/document.png" alt="logo_user" class="w-[100px]">
            </div>
          </div>
        </div>

        <div class="card bg-[#f0ae2b] w-full h-44 shadow-xl transform-transition bg-opacity-65">
          <h2 class="card-title text-white font-light text-2xl pl-5 pt-5">รายการทั้งหมด</h2>
          <div class="flex mt-8">
            <div class="flex-1 ml-5 mt-8">
              <p class="text-white text-4xl mt-2">
                {{ totalOrderCount }} รายการ
              </p>
            </div>
            <div class="absolute bottom-2 right-0 justify-end mr-5">
              <img src="/public/docall.png" alt="logo_user" class="w-[100px]">
            </div>
          </div>
        </div>

      </div>
    </div>

    <div class="flex">
      <div class="flex-1 flex flex-col items-center">
        <div class="mt-5">
          <label for="week-selector" class="text-lg font-bold">เลือกสัปดาห์:</label>
          <select id="week-selector" v-model="selectedWeek" class="ml-2 p-2 border rounded-md">
            <option v-for="week in availableWeeks" :key="week" :value="week">
              {{ formatDateRange(week) }}
            </option>
          </select>
        </div>

        <div class="mt-5 w-full">
          <canvas id="revenueChart"></canvas>
        </div>
      </div>

      <div class="flex-1">

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
const userUUID = users.uuid

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
  return orders.value.length; // Total number of orders
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
    chartInstance.value.data.labels = weekLabels.value; // Update labels to include dates
    chartInstance.value.data.datasets[0].data = dailyRevenueForSelectedWeek.value; // Update data
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
              // Format the y-axis values with "บาท" appended
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

definePageMeta({
  middleware: 'auth',
});
</script>

<style></style>