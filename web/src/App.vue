<script setup lang="ts">
import { computed } from 'vue';
import { RouterView, useRouter } from 'vue-router'
import { useDisplay } from "vuetify";

const display = useDisplay();
const router = useRouter();

const pictureOfTheDayClass = computed(() => ({ "text-blue-lighten-1": router.currentRoute.value.name === "picture-of-the-day" }))
const youOnEarthdClass = computed(() => ({ "text-blue-lighten-1": router.currentRoute.value.name === "you-on-earth" }))
const earthEnhancedClass = computed(() => ({ "text-blue-lighten-1": router.currentRoute.value.name === "earth-enhanced" }))

</script>

<template>
  <VLayout>
    <VAppBar>
      <VSheet class="ma-auto d-flex flex-1-1 flex-row justify-space-between" :max-width="display.thresholds.value.md">
        <VSheet class="d-flex align-center">
          <VBtn icon="mdi-arrow-left" @click="router.go(-1)" />

          <RouterLink to="/home" class="text-decoration-none text-light-blue">
            <h2>Space Explorer</h2>
          </RouterLink>
        </VSheet>

        <VSheet class="d-flex align-center">
          <VBtn color="blue" variant="elevated">Login</VBtn>

          <RouterLink to="/picture-of-the-day">
            <VBtn variant="flat" :class="pictureOfTheDayClass">Picture of the Day</VBtn>
          </RouterLink>

          <RouterLink to="/you-on-earth">
            <VBtn variant="flat" :class="youOnEarthdClass">You on Earth</VBtn>
          </RouterLink>

          <RouterLink to="/earth-enhanced">
            <VBtn variant="flat" :class="earthEnhancedClass">Earth Enhanced</VBtn>
          </RouterLink>
        </VSheet>
      </VSheet>
    </VAppBar>

    <VMain class="w-sm">
      <RouterView />
    </VMain>
  </VLayout>
</template>
