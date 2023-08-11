<script setup lang="ts">
import examplePNG from '@/assets/you-on-earth.png'
import Progress from "@/components/Progress.vue"
import { util } from '@/lib/util';
import panzoom, { type PanZoom } from "panzoom";
import { onMounted } from 'vue';
import { ref } from 'vue';
import { onUnmounted } from 'vue';
import { useDisplay } from 'vuetify';

const display = useDisplay();

const instance = ref<PanZoom | undefined>(undefined);
const coords = ref<{ lat: number, lon: number } | undefined>(undefined);

function startPanZoom() {
  const elem = document.getElementById("panzoom");
  if (!elem) return;

  instance.value = panzoom(elem, { bounds: true });
}

function stopPanZoom() {
  instance.value?.dispose();
}

onMounted(async () => {
  const location = await util.getLocation();
  if (location) return;

  const { longitude: lon, latitude: lat } = location.coords;
  coords.value = { lon, lat };
  //console.log(await fetch(`https://api.nasa.gov/planetary/earth/imagery?lon=${lon}&lat=${lat}&api_key=DB0XIxGdcZVdQw6MCa1HQjqehnPxE2NyAdkgfZVS`))
})

onUnmounted(() => {
  stopPanZoom();
})
</script>

<template>
  <VSheet class="mx-4 my-4 bg-transparent">

    <VSheet style="overflow: hidden;">
      <VImg id="panzoom" height="calc(75vh - 64px)" :src="examplePNG" @load="startPanZoom">
        <template v-slot:placeholder><Progress /></template>
      </VImg>
    </VSheet>

    <VSheet :max-width="display.thresholds.value.sm" class="mx-auto bg-transparent text-center">
      <div class="text-h6 my-2">Your coordinates:</div>

      <div v-if="coords" class="text-body-1">
        <div>Longitude: {{ coords.lon }}</div>
        <div>Latitude: {{ coords.lat }}</div>
      </div>
      <Progress v-else />
    </VSheet>

  </VSheet>
</template>
