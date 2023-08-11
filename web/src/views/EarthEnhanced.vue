<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { IEPIC } from '@/types/epic';
import { useDisplay } from 'vuetify';

const display = useDisplay();
const epic = ref<IEPIC[]>([]);
const epicShown = ref<IEPIC[]>([]);

const API_KEY = import.meta.env.VITE_NASA_API_KEY;

function epicSrc(epic: IEPIC) {
  const date = epic.date.slice(0, 10).replaceAll('-', '/');
  const image = epic.image;
  return `https://api.nasa.gov/EPIC/archive/enhanced/${date}/jpg/${image}.jpg?api_key=${API_KEY}`
}

function showMore() {
  const diff = Math.min(epic.value.length - epicShown.value.length, 3);
  if (diff <= 0) return;

  const currentLength = epicShown.value.length;
  epicShown.value.push(...epic.value.slice(currentLength, currentLength + diff));
}

onMounted(async () => {
  try {
    const result = await fetch(`https://api.nasa.gov/EPIC/api/enhanced?api_key=${API_KEY}`);
    const json = await result.json() as IEPIC[];

    epic.value = json;
    epicShown.value = json.slice(1, 3 + 1);
  } catch (error) {

  }
})

</script>

<template>
  <VSheet class="mx-auto my-4 px-4 bg-transparent" :max-width="display.thresholds.value.md">
    <VImg v-if="epic[0]" class="mb-6" height="calc(75vh - 64px)" :src="epicSrc(epic[0])" />

    <VRow>
      <VCol v-for="data in epicShown" :key="data.identifier" cols="4">
        <VImg :src="epicSrc(data)" aspect-ratio="1" cover />
      </VCol>
    </VRow>

    <div v-if="epicShown.length !== epic.length" class="d-flex align-center my-4">
      <VBtn class="mx-auto" @click="showMore">Load More</VBtn>
    </div>
  </VSheet>
</template>
