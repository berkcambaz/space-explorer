<script setup lang="ts">
import { ref } from 'vue';
import { z } from "zod";
import { useAppStore } from '../stores/app';
import { supabase } from '@/lib/supabase';

const appStore = useAppStore();

/**
 * Stores user's email input.
 */
const email = ref("");

/**
 * Used to display loader on the login button when pressed.
 */
const loading = ref(false);

/**
 * Used to display login message, it's either 'check email' or 'error logging in'.
 */
const message = ref("");

/**
 * Checks if email is valid or not.
 * @returns True if email is valid and error message if email is invalid.
 */
function emailRule() {
  const rule = z.string().trim().email().max(320);
  const result = rule.safeParse(email.value);
  if (result.success) return true;
  return "Invalid e-mail.";
}

/**
 * Tries to log the user in using supabase OTP sign in.
 */
async function login() {
  try {
    loading.value = true;
    await supabase.auth.signInWithOtp({ email: email.value });
    message.value = "Please check your email inbox.";
  } catch (error) {
    message.value = "An error happened while logging in.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <VDialog scrollable v-model="appStore.showLoginDialog" max-width="400" z-index="10000">
    <VContainer class="bg-grey-darken-4 pa-4">
      <div class="text-center mb-4">
        <h2 class="text-h5">Login to</h2>
        <h1 class="text-h4">Space Explorer</h1>
      </div>

      <VTextField 
        @keyup.enter="login" 
        :rules="[emailRule]" 
        v-model="email" 
        prepend-inner-icon="mdi-at"
        label="Email Address" 
        placeholder="johndoe@mail.com" 
        type="email" 
      />

      <VBtn 
        @click="login" 
        :loading="loading" 
        class="w-100 mt-4" 
        variant="tonal"
      >
        Login via Email
      </VBtn>

      <p v-show="message" class="text-center text-body-1 mt-4">{{ message }}</p>
    </VContainer>
  </VDialog>
</template>