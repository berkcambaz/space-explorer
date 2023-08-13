<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { IEPIC } from '@/types/epic';
import { useDisplay } from 'vuetify';
import Progress from "@/components/Progress.vue"
import { VDatePicker } from 'vuetify/labs/VDatePicker'
import { watch } from 'vue';
import { util } from '@/lib/util';

const display = useDisplay();

const dialog = ref(false);
const dateRange = ref<string[]>([]);

const epic = ref<IEPIC[]>([]);
const epicShown = ref<IEPIC[]>([]);

const API_KEY = import.meta.env.VITE_NASA_API_KEY;

function epicSrc(_epic: IEPIC) {
  const date = _epic.date.slice(0, 10).replaceAll('-', '/');
  const image = _epic.image;
  return `https://api.nasa.gov/EPIC/archive/enhanced/${date}/jpg/${image}.jpg?api_key=${API_KEY}`
}

async function showMore() {
  const diff = Math.min(epic.value.length - epicShown.value.length, 3);

  if (diff <= 0 && dateRange.value.length !== 2) return;
  if (diff <= 0 && dateRange.value.length === 2) {
    const lastEPIC = epicShown.value[epicShown.value.length - 1];
    if (!lastEPIC) return;

    const date = new Date(lastEPIC.date);
    date.setDate(date.getDate() + 1);

    const json = await fetchByDate(util.dateToISO(date));
    const count = Math.min(json.length, 3, (epic.value.length - 1) % 3);

    epic.value.push(...json);
    epicShown.value.push(...json.slice(0, count));
    return;
  }

  const currentLength = epicShown.value.length;
  epicShown.value.push(...epic.value.slice(currentLength, currentLength + diff));
}

watch(dateRange, async () => {
  const date = dateRange.value[0] ? new Date(dateRange.value[0]) : new Date();
  const dateText = util.dateToISO(date);

  const json = await fetchByDate(dateText);

  epic.value = json;
  epicShown.value = json.slice(1, 3 + 1);
})

async function fetchByDate(date: string) {
  const result = await fetch(`https://api.nasa.gov/EPIC/api/enhanced/date/${date}?api_key=${API_KEY}`);
  const json = await result.json() as IEPIC[];
  return json;
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

    <VSheet class="d-flex justify-center my-2 bg-transparent">
      <VBtn prepend-icon="mdi-calendar" variant="text">
        Change Date

        <VDialog width="auto" scrollable v-model="dialog" activator="parent">
          <VSheet>
            <VDatePicker v-model="dateRange" multiple />
          </VSheet>
        </VDialog>
      </VBtn>
    </VSheet>

    <VImg class="mb-6" height="calc(75vh - 64px)" :src="epic[0] && epicSrc(epic[0])">
      <template v-slot:placeholder><Progress /></template>
    </VImg>

    <VRow>
      <VCol v-for="data in epicShown" :key="data.identifier" cols="4">
        <VImg :src="epicSrc(data)" aspect-ratio="1" cover>
          <template v-slot:placeholder><Progress /></template>
        </VImg>
      </VCol>
    </VRow>

    <div class="d-flex align-center my-4">
      <VBtn class="mx-auto" @click="showMore">Load More</VBtn>
    </div>
  </VSheet>
</template>
