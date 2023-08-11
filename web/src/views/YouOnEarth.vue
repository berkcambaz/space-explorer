<script setup lang="ts">
import examplePNG from '@/assets/you-on-earth.png'
import Progress from "@/components/Progress.vue"
import { util } from '@/lib/util';
import panzoom, { type PanZoom } from "panzoom";
import { watch } from 'vue';
import { onMounted } from 'vue';
import { computed } from 'vue';
import { ref } from 'vue';
import { onUnmounted } from 'vue';
import { useDisplay } from 'vuetify';

const display = useDisplay();

const loading = ref(true);
const error = ref(false);

const instance = ref<PanZoom | undefined>(undefined);
const coords = ref<{ lat: number, lon: number } | undefined>(undefined);

function startPanZoom() {
  const elem = document.getElementById("panzoom");
  if (!elem) return;

  if (instance.value) return;
  instance.value = panzoom(elem, { bounds: true });
}

function stopPanZoom() {
  instance.value?.dispose();
}

function onLoad() {
  startPanZoom();
  loading.value = false;
}

function onError() {
  loading.value = false;
  error.value = true;
}

function toggle() {
  if (loading.value) {
    loading.value = false;
    error.value = true;
  }
  else {
    loading.value = true;
    error.value = false;
  }
}

watch(loading, () => {
  if (loading.value) instance.value?.pause();
  else instance.value?.resume();
})

const imageSrc = computed(() => {
  if (error.value) return examplePNG;
  if (!coords.value) return undefined;

  const { lon, lat } = coords.value;
  return `https://api.nasa.gov/planetary/earth/imagery?lon=${lon}&lat=${lat}&api_key=${import.meta.env.VITE_NASA_API_KEY}`
})

onMounted(async () => {
  const location = await util.getLocation();
  if (!location) return;

  const { longitude: lon, latitude: lat } = location.coords;
  coords.value = { lon, lat };
})

onUnmounted(() => {
  stopPanZoom();
})
</script>

<template>
  <VSheet class="mx-4 my-4 bg-transparent">

    <VSheet style="position: relative; overflow: hidden;">
      <VImg id="panzoom" height="calc(75vh - 64px)" :src="imageSrc" @error="onError" @load="onLoad" />
      <VOverlay v-model="loading" persistent contained class="align-center justify-center"><Progress /></VOverlay>
    </VSheet>

    <VSheet :max-width="display.thresholds.value.sm" class="mx-auto bg-transparent text-center">
      <div class="text-h6 my-2">Your coordinates:</div>

      <div v-if="coords" class="text-body-1">
        <div>Longitude: {{ coords.lon }}</div>
        <div>Latitude: {{ coords.lat }}</div>
      </div>
      <Progress v-else />

      <VBtn class="my-2" @click="toggle">{{ loading ? "Cancel" : "Retry" }}</VBtn>
    </VSheet>

  </VSheet>
</template>
