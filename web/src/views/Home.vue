<script setup lang="ts">
import undrawAstranaut from '@/assets/undraw_astronaut.svg'
import undrawStars from '@/assets/undraw_stars.svg'
import undrawSpace from '@/assets/undraw_space.svg'
import { useDisplay } from 'vuetify';

const display = useDisplay();
</script>

<template>
  <VSheet class="mx-4 my-4 bg-transparent">

    <VImg src="/android-chrome-512x512.png" class="mx-auto my-8" maxWidth="200" />

    <h1 class="text-center text-h4 header">
      SPACE EXPLORER
    </h1>

    <VSheet class="d-flex flex-wrap justify-center my-8 bg-transparent">
      <VImg :src="undrawAstranaut" :width="display.smAndUp.value ? 300 : '50vw'" maxWidth="300" />

      <VSheet class="ma-8 bg-transparent" maxWidth="300">
        <p class="text-body-1 text-center">
          Welcome to Space Explorer, your gateway to the captivating realm of space photography, captured by the lens of
          NASA's cutting-edge imaging technology. Delve into an extraordinary odyssey as you peruse our curated
          compilation of celestial snapshots.
        </p>
      </VSheet>
    </VSheet>

    <VImg :src="undrawSpace" class="mx-auto my-8" maxWidth="300" />

    <VContainer class="d-flex flex-wrap justify-center my-8 bg-transparent">
      <VSheet class="ma-8 bg-transparent" maxWidth="300">
        <p class="text-body-1 text-center">
          Marvel at the dazzling dance of distant stars, the intricate tapestry of nebulae, and the intriguing landscapes
          of far-off planets. Whether you're a seasoned astronomer or a curious mind entranced by the cosmos, Space
          Explorer invites you to embark on an accessible and visually stunning expedition to unravel the enigmas of the
          universe, all in one place.
        </p>
      </VSheet>

      <VImg :src="undrawStars" :width="display.smAndUp.value ? 300 : '50vw'" maxWidth="300" />
    </VContainer>

    <VSheet class="d-flex justify-center my-8 bg-transparent">
      <RouterLink to="/picture-of-the-day">
        <VBtn variant="tonal" size="x-large">Start Exploring</VBtn>
      </RouterLink>
    </VSheet>

  </VSheet>
</template>

<style scoped>
.header {
  font-weight: 800;
  text-shadow: 4px 2px 5px gray;
}
</style>