<script setup lang="ts">
import { computed } from 'vue';
import type { StyleValue } from 'vue';
import { RouterView, useRouter } from 'vue-router'
import { useDisplay } from "vuetify";

const display = useDisplay();
const router = useRouter();

const backButtonStyle = computed((): StyleValue => router.currentRoute.value.name === "home" ? { visibility: "hidden" } : {})
const pictureOfTheDayClass = computed(() => ({ "text-blue-lighten-1": router.currentRoute.value.name === "picture-of-the-day" }))
const youOnEarthClass = computed(() => ({ "text-blue-lighten-1": router.currentRoute.value.name === "you-on-earth" }))
const earthEnhancedClass = computed(() => ({ "text-blue-lighten-1": router.currentRoute.value.name === "earth-enhanced" }))

</script>

<template>
  <VLayout>
    <VAppBar>
      <VSheet class="ma-auto d-flex flex-1-1 flex-row justify-space-between" :max-width="display.thresholds.value.md">

        <VSheet class="d-flex align-center">
          <VBtn :style="backButtonStyle" class="v-hidden ma-1" icon="mdi-arrow-left" @click="router.go(-1)" />

          <RouterLink to="/home" class="ma-1 text-decoration-none text-light-blue">
            <h2>Space Explorer</h2>
          </RouterLink>
        </VSheet>

        <VSheet v-if="display.smAndUp.value" class="d-flex align-center">
          <VBtn class="ma-1" color="blue" variant="elevated" prepend-icon="mdi-login">Login</VBtn>

          <RouterLink to="/picture-of-the-day" class="ma-1">
            <VBtn v-if="display.mdAndUp.value" variant="flat" :class="pictureOfTheDayClass">Picture of the Day</VBtn>
            <VBtn v-else icon="mdi-earth" variant="flat" :class="pictureOfTheDayClass" />
          </RouterLink>

          <RouterLink to="/you-on-earth" class="ma-1">
            <VBtn v-if="display.mdAndUp.value" variant="flat" :class="youOnEarthClass">You on Earth</VBtn>
            <VBtn v-else icon="mdi-map-marker" variant="flat" :class="youOnEarthClass" />
          </RouterLink>

          <RouterLink to="/earth-enhanced" class="ma-1">
            <VBtn v-if="display.mdAndUp.value" variant="flat" :class="earthEnhancedClass">Earth Enhanced</VBtn>
            <VBtn v-else icon="mdi-earth-plus" variant="flat" :class="earthEnhancedClass" />
          </RouterLink>
        </VSheet>

        <VSheet v-else>
          <VBtn icon="mdi-menu" class="ma-1" />
        </VSheet>

      </VSheet>
    </VAppBar>

    <VMain class="w-sm">
      <RouterView />
    </VMain>
  </VLayout>
</template>
