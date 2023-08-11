<script setup lang="ts">
import undrawTaken from '@/assets/undraw_taken.svg'
import { useDisplay } from 'vuetify';

const display = useDisplay();
</script>

<template>
  <VSheet :max-width="display.thresholds.value.sm" class="mx-auto my-4 px-4 bg-transparent">
    <VImg class="mx-auto" :src="undrawTaken" maxWidth="300" />

    <div class="text-center my-2">
      <h1 class="text-h3">404</h1>
      <p class="text-body-1">Sorry, couldn't find what you are looking for.</p>
    </div>

    <VSheet class="d-flex justify-center bg-transparent">
      <RouterLink to="/home">
        <VBtn variant="flat">Go to Home</VBtn>
      </RouterLink>
    </VSheet>
  </VSheet>
</template>