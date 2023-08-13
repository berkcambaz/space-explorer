<script setup lang="ts">
import { ref } from 'vue';
import { useAppStore } from '../stores/app';

const appStore = useAppStore();

const name = ref(appStore.user?.name || "");
const bio = ref(appStore.user?.bio || "");
const loading = ref(false);

async function editProfile() {
  loading.value = true;
  await appStore.updateUser(name.value, bio.value);
  loading.value = false;
  appStore.showEditProfileDialog = false;
}
</script>

<template>
  <VDialog scrollable v-model="appStore.showEditProfileDialog" style="max-width: 400px; z-index: 10000;">
    <VContainer class="bg-grey-darken-4 pa-4">
      <VTextField label="Name" v-model="name" placeholder="Space Explorer" type="text" />
      <VTextarea label="Bio" v-model="bio" placeholder="Bio of the Space Explorer" auto-grow />
      <VBtn @click="editProfile" :loading="loading" class="w-100 mt-4" variant="tonal">Edit</VBtn>
    </VContainer>
  </VDialog>
</template>