<script setup lang="ts">
import { ref } from 'vue';
import { z } from "zod";
import { useAppStore } from '../stores/app';

const appStore = useAppStore();

const showMessage = ref(false);
const email = ref("");

function emailRule() {
  const rule = z.string().trim().email().max(320);
  const result = rule.safeParse(email.value);
  if (result.success) return true;
  return "Invalid e-mail.";
}

function login() {
  showMessage.value = true;
}
</script>

<template>
  <VDialog scrollable v-model="appStore.showLoginDialog" style="max-width: 400px; z-index: 10000;">
    <VContainer class="bg-grey-darken-4 pa-4">
      <div class="text-center mb-4">
        <h2 class="text-h5">Login to</h2>
        <h1 class="text-h4">Space Explorer</h1>
      </div>

      <VTextField :rules="[emailRule]" v-model="email" prepend-inner-icon="mdi-at" label="Email Address"
        placeholder="johndoe@mail.com" type="email" />

      <VBtn @click="login" class="w-100 mt-4" variant="tonal">Login via Email</VBtn>

      <p v-show="showMessage" class="text-center text-body-1 mt-4">Please check your email inbox.</p>
    </VContainer>
  </VDialog>
</template>