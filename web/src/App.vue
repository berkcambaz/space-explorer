<script setup lang="ts">
import { computed } from 'vue';
import type { StyleValue } from 'vue';
import { ref } from 'vue';
import { RouterView, useRouter } from 'vue-router'
import { useDisplay } from "vuetify";
import { useAppStore } from './stores/app';
import LoginDialog from '@/components/LoginDialog.vue';
import { onMounted } from 'vue';
import { supabase } from './lib/supabase';

const display = useDisplay();
const router = useRouter();
const appStore = useAppStore();

/**
 * Used to show/hide the navigation drawer (used on devices with small screen size).
 */
const appMenu = ref(false);

/* Classes to show current route's name highlighted */
const pictureOfTheDayClass = computed(() => ({ "text-blue-lighten-1": router.currentRoute.value.name === "picture-of-the-day" }))
const youOnEarthClass = computed(() => ({ "text-blue-lighten-1": router.currentRoute.value.name === "you-on-earth" }))
const earthEnhancedClass = computed(() => ({ "text-blue-lighten-1": router.currentRoute.value.name === "earth-enhanced" }))

/**
 * Hides or shows the back button depending on the current route (shown in all routes expect for 'home').
 */
const backButtonStyle = computed((): StyleValue => router.currentRoute.value.name === "home" ? { visibility: "hidden" } : {})

/**
 * Shows/hides the login dialog.
 */
function showLogin() {
  appStore.showLoginDialog = !appStore.showLoginDialog;
}

/**
 * Changes to route to the current user's profile if exists.
 */
function gotoAccount() {
  const id = appStore.session?.user.id;
  if (!id) return;
  router.push(`/profile/${id}`);
}

/**
 * Handle user's auth status.
 */
onMounted(() => {
  supabase.auth.getSession().then(async ({ data }) => {
    appStore.session = data.session;

    // If user is logged in, try to create the user (no effects if user is already cretead)
    if (!appStore.session) return;
    appStore.createUser();

    // Fetch user's all favourited images (used to display on profile route)
    const favourites = await appStore.getUserAllFavouriteImages(appStore.session.user.id);
    appStore.favourites.push(...favourites);
  })

  supabase.auth.onAuthStateChange((_e, _session) => {
    appStore.session = _session;
  })
})
</script>

<template>
  <div class="background"></div>

  <VLayout>

    <VAppBar>
      <VSheet class="ma-auto d-flex flex-1-1 flex-row justify-space-between" :max-width="display.thresholds.value.md">

        <VSheet class="d-flex align-center">
          <VBtn :style="backButtonStyle" class="v-hidden ma-1" icon="mdi-arrow-left" @click="router.go(-1)" />

          <RouterLink to="/home" class="d-flex ma-1 text-decoration-none text-white">
            <VImg src="/android-chrome-512x512.png" width="32" />
            <h2 class="text-h6 mx-2">Space Explorer</h2>
          </RouterLink>
        </VSheet>

        <VSheet v-if="display.smAndUp.value" class="d-flex align-center">
          <VBtn 
            @click="appStore.session ? gotoAccount() : showLogin()" 
            class="ma-1" 
            color="blue" 
            variant="elevated"
            :prepend-icon="appStore.session ? 'mdi-account' : 'mdi-login'"
          >
            {{ appStore.session  ? 'Account' : 'Login' }}
          </VBtn>

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
          <VBtn icon="mdi-menu" class="ma-1" @click="appMenu = !appMenu" />
        </VSheet>

      </VSheet>
    </VAppBar>

    <VNavigationDrawer v-model="appMenu" location="left" temporary style="z-index: 9999;">
      <VSheet class="d-flex flex-wrap">

        <RouterLink to="/picture-of-the-day" class="w-100 ma-1">
          <VBtn variant="flat" class="w-100" :class="pictureOfTheDayClass">Picture of the Day</VBtn>
        </RouterLink>

        <RouterLink to="/you-on-earth" class="w-100 ma-1">
          <VBtn variant="flat" class="w-100" :class="youOnEarthClass">You on Earth</VBtn>
        </RouterLink>

        <RouterLink to="/earth-enhanced" class="w-100 ma-1">
          <VBtn variant="flat" class="w-100" :class="earthEnhancedClass">Earth Enhanced</VBtn>
        </RouterLink>

        <VSheet class="w-100 ma-1">
          <VBtn 
            @click="appStore.session ? gotoAccount() : showLogin()" 
            class="w-100"
            color="blue" 
            variant="elevated"
            :prepend-icon="appStore.session ? 'mdi-account' : 'mdi-login'"
          >
            {{ appStore.session  ? 'Account' : 'Login' }}
          </VBtn>
        </VSheet>

      </VSheet>
    </VNavigationDrawer>

    <LoginDialog />

    <VMain class="w-sm">
      <RouterView />
    </VMain>

  </VLayout>
</template>

<style scoped>
/* Background animation for stars */
.background {
  position: fixed;
  top: 50%;
  left: 50%;
  height: 1px;
  width: 1px;
  background-color: #fff;
  border-radius: 50%;
  box-shadow: -42vw -4vh 0px 0px #fff, 25vw -41vh 0px 0px #fff, -20vw 49vh 0px 1px #fff, 5vw 40vh 1px 1px #fff, 29vw 19vh 1px 0px #fff, -44vw -13vh 0px 0px #fff, 46vw 41vh 0px 1px #fff, -3vw -45vh 0px 1px #fff, 47vw 35vh 1px 0px #fff, 12vw -8vh 1px 0px #fff, -34vw 48vh 1px 1px #fff, 32vw 26vh 1px 1px #fff, 32vw -41vh 1px 1px #fff, 0vw 37vh 1px 1px #fff, 34vw -26vh 1px 0px #fff, -14vw -49vh 1px 0px #fff, -12vw 45vh 0px 1px #fff, -44vw -33vh 0px 1px #fff, -13vw 41vh 0px 0px #fff, -36vw -11vh 0px 1px #fff, -23vw -24vh 1px 0px #fff, -38vw -27vh 0px 1px #fff, 16vw -19vh 0px 0px #fff, 28vw 33vh 1px 0px #fff, -49vw -4vh 0px 0px #fff, 16vw 32vh 0px 1px #fff, 36vw -18vh 1px 0px #fff, -25vw -30vh 1px 0px #fff, -23vw 24vh 0px 1px #fff, -2vw -35vh 1px 1px #fff, -25vw 9vh 0px 0px #fff, -15vw -34vh 0px 0px #fff, -8vw -19vh 1px 0px #fff, -20vw -20vh 1px 1px #fff, 42vw 50vh 0px 1px #fff, -32vw 10vh 1px 0px #fff, -23vw -17vh 0px 0px #fff, 44vw 15vh 1px 0px #fff, -40vw 33vh 1px 1px #fff, -43vw 8vh 0px 0px #fff, -48vw -15vh 1px 1px #fff, -24vw 17vh 0px 0px #fff, -31vw 50vh 1px 0px #fff, 36vw -38vh 0px 1px #fff, -7vw 48vh 0px 0px #fff, 15vw -32vh 0px 0px #fff, 29vw -41vh 0px 0px #fff, 2vw 37vh 1px 0px #fff, 7vw -40vh 1px 1px #fff, 15vw 18vh 0px 0px #fff, 25vw -13vh 1px 1px #fff, -46vw -12vh 1px 1px #fff, -18vw 22vh 0px 0px #fff, 23vw -9vh 1px 0px #fff, 50vw 12vh 0px 1px #fff, 45vw 2vh 0px 0px #fff, 14vw -48vh 1px 0px #fff, 23vw 43vh 0px 1px #fff, -40vw 16vh 1px 1px #fff, 20vw -31vh 0px 1px #fff, -17vw 44vh 1px 1px #fff, 18vw -45vh 0px 0px #fff, 33vw -6vh 0px 0px #fff, 0vw 7vh 0px 1px #fff, -10vw -18vh 0px 1px #fff, -19vw 5vh 1px 0px #fff, 1vw 42vh 0px 0px #fff, 22vw 48vh 0px 1px #fff, 39vw -8vh 1px 1px #fff, -6vw -42vh 1px 0px #fff, -47vw 34vh 0px 0px #fff, -46vw 19vh 0px 1px #fff, -12vw -32vh 0px 0px #fff, -45vw -38vh 0px 1px #fff, -28vw 18vh 1px 0px #fff, -38vw -46vh 1px 1px #fff, 49vw -6vh 1px 1px #fff, -28vw 18vh 1px 1px #fff, 10vw -24vh 0px 1px #fff, -5vw -11vh 1px 1px #fff, 33vw -8vh 1px 0px #fff, -16vw 17vh 0px 0px #fff, 18vw 27vh 0px 1px #fff, -8vw -10vh 1px 1px #fff;
  box-shadow: 24vw 9vh 1px 0px #fff, 12vw -24vh 0px 1px #fff, -45vw -22vh 0px 0px #fff, -37vw -40vh 0px 1px #fff, 29vw 19vh 0px 1px #fff, 4vw -8vh 0px 1px #fff, -5vw 21vh 1px 1px #fff, -27vw 26vh 1px 1px #fff, -47vw -3vh 1px 1px #fff, -28vw -30vh 0px 1px #fff, -43vw -27vh 0px 1px #fff, 4vw 22vh 1px 1px #fff, 36vw 23vh 0px 0px #fff, -21vw 24vh 1px 1px #fff, -16vw 2vh 1px 0px #fff, -16vw -6vh 0px 0px #fff, 5vw 26vh 0px 0px #fff, -34vw 41vh 0px 0px #fff, 1vw 42vh 1px 1px #fff, 11vw -13vh 1px 1px #fff, 48vw -8vh 1px 0px #fff, 22vw -15vh 0px 0px #fff, 45vw 49vh 0px 0px #fff, 43vw -27vh 1px 1px #fff, 20vw -2vh 0px 0px #fff, 8vw 22vh 0px 1px #fff, 39vw 48vh 1px 1px #fff, -21vw -11vh 0px 1px #fff, -40vw 45vh 0px 1px #fff, 11vw -30vh 1px 0px #fff, 26vw 30vh 1px 0px #fff, 45vw -29vh 0px 1px #fff, -2vw 18vh 0px 0px #fff, -29vw -45vh 1px 0px #fff, -7vw -27vh 1px 1px #fff, 42vw 24vh 0px 0px #fff, 45vw -48vh 1px 0px #fff, -36vw -18vh 0px 0px #fff, -44vw 13vh 0px 1px #fff, 36vw 16vh 0px 1px #fff, 40vw 24vh 0px 0px #fff, 18vw 11vh 0px 0px #fff, -15vw -23vh 1px 0px #fff, -24vw 48vh 0px 1px #fff, 27vw -45vh 1px 0px #fff, -2vw -24vh 0px 1px #fff, -15vw -28vh 0px 0px #fff, -43vw 13vh 1px 0px #fff, 7vw 27vh 1px 0px #fff, 47vw 5vh 0px 0px #fff, -45vw 15vh 1px 1px #fff, -5vw -28vh 0px 1px #fff, 38vw 25vh 1px 1px #fff, -39vw -1vh 1px 0px #fff, 5vw 0vh 1px 0px #fff, 49vw 13vh 0px 0px #fff, 48vw 10vh 0px 1px #fff, 19vw -28vh 0px 0px #fff, 4vw 7vh 0px 0px #fff, 21vw 21vh 1px 1px #fff, -15vw -15vh 0px 1px #fff, -6vw -42vh 1px 0px #fff, -15vw 48vh 1px 1px #fff, -23vw 25vh 1px 1px #fff, -48vw 25vh 0px 1px #fff, -31vw -19vh 0px 1px #fff, 4vw 37vh 1px 1px #fff, -43vw 28vh 0px 0px #fff, 3vw -25vh 0px 1px #fff, -39vw 14vh 0px 1px #fff, -40vw 31vh 0px 1px #fff, 35vw -36vh 1px 1px #fff, 16vw 49vh 0px 0px #fff, 6vw 39vh 0px 0px #fff, 3vw -35vh 0px 1px #fff, -44vw -2vh 1px 0px #fff, -6vw 21vh 1px 0px #fff, 48vw 9vh 1px 1px #fff, -43vw 30vh 1px 1px #fff, 29vw -12vh 1px 1px #fff, -48vw 13vh 1px 0px #fff, -42vw 32vh 1px 1px #fff, 34vw 15vh 1px 1px #fff, 29vw -37vh 1px 1px #fff, 28vw 2vh 0px 0px #fff;
  animation: zoom 16s alternate infinite;
}

@keyframes zoom {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(1.5);
  }
}
</style>