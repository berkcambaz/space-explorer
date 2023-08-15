<script setup lang="ts">
import { ref } from 'vue';
import { useAppStore } from '../stores/app';

const appStore = useAppStore();

/**
 * User's name, initialized as current user's name or empty.
 */
const name = ref(appStore.user?.name || "");

/**
 * User's bio, initialized as current user's bio or empty.
 */
const bio = ref(appStore.user?.bio || "");

/**
 * Used to display loader on the edit button when pressed.
 */
const loading = ref(false);

/**
 * Tries to update the user's name and bio values.
 */
async function editProfile() {
  try {
    loading.value = true;
    await appStore.updateUser(name.value, bio.value);
    appStore.showEditProfileDialog = false;
  } catch (error) {

  }
  finally {
    loading.value = false;
  }
}
</script>

<template>
  <VDialog scrollable v-model="appStore.showEditProfileDialog" max-width="400" z-index="10000">
    <VContainer class="bg-grey-darken-4 pa-4">

      <VTextField label="Name" v-model="name" placeholder="Space Explorer" type="text" />

      <VTextarea label="Bio" v-model="bio" placeholder="Bio of the Space Explorer" auto-grow />

      <VBtn @click="editProfile" :loading="loading" class="w-100 mt-4" variant="tonal">
        Edit
      </VBtn>

    </VContainer>
  </VDialog>
</template>