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
import { api } from '@/lib/api';

const display = useDisplay();

const loading = ref(true);
const error = ref(false);

const instance = ref<PanZoom | undefined>(undefined);
const coords = ref<{ lat: number, lon: number } | undefined>(undefined);

/**
 * Initializes and starts pan zoom, only call once.
 */
function startPanZoom() {
  const elem = document.getElementById("panzoom");
  if (!elem) return;

  if (instance.value) return;
  instance.value = panzoom(elem, { bounds: true });
}

/**
 * Stops and disposes pan zoom, only call once.
 */
function stopPanZoom() {
  instance.value?.dispose();
}

/**
 * Called whenever the you on earth image is loaded.
 */
function onLoad() {
  startPanZoom();
  loading.value = false;
}

/**
 * Called whenever the you on earth image fails to load.
 */
function onError() {
  loading.value = false;
  error.value = true;
}

/**
 * Start or stop trying to load the you on earth image.
 */
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

/**
 * Pause/resume pan zoom depending on the loading status.
 */
watch(loading, () => {
  if (loading.value) instance.value?.pause();
  else instance.value?.resume();
})

/**
 * Image src of the you on earth image, falls back to default image if error.
 */
const imageSrc = computed(() => {
  if (error.value) return examplePNG;
  if (!coords.value) return undefined;

  const { lon, lat } = coords.value;
  return api.youOnEarthSrc(lon, lat);
})

/**
 * Get longitude and latitude on mounted.
 */
onMounted(async () => {
  const location = await util.getLocation();
  if (!location) return;

  const { longitude: lon, latitude: lat } = location.coords;
  coords.value = { lon, lat };
})

/**
 * Dispose pan zoom on unmounted.
 */
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
