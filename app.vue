<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>
import { useAuthStore } from '#build/imports';

const authStore = useAuthStore()

authStore.initializeAuth();
</script>

<style>
* {
  font-family: 'Prompt', sans-serif;
}

.text-stroke {
    text-shadow: -5px -1px 0 #FF8128, 1px -1px 0 #FF8128, -5px 1px 0 #FF8128, 1px 1px 0 #FF8128;
}
</style>
