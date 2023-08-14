<script setup lang="ts">
import { util } from '@/lib/util';
import { useAppStore } from '@/stores/app';
import type { IFavourite } from '@/types/favourite';
import type { IUser } from '@/types/user';
import { ref } from 'vue';
import { computed } from 'vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Progress from "@/components/Progress.vue"
import { useDisplay } from 'vuetify';
import EditProfileDialog from '@/components/EditProfileDialog.vue';
import { supabase } from '@/lib/supabase';

const display = useDisplay();
const router = useRouter();
const appStore = useAppStore();

const user = ref<IUser | undefined>(undefined);
const favourites = ref<IFavourite[]>([]);

const favouritesShown = ref<IFavourite[]>([]);
const loading = ref(true);

const profileName = computed(() => {
  const name = appStore.isCurrentUser(user.value?.id) ? appStore.user?.name : user.value?.name;
  return name || "Space Explorer";
})
const profileBio = computed(() => {
  const bio = appStore.isCurrentUser(user.value?.id) ? appStore.user?.bio : user.value?.bio;
  return bio || "Bio of the Space Explorer";
})
const profileDate = computed(
  () => user.value ? util.formatDate(new Date(user.value.created_at)) : "Their journey started at..."
)
const profileImageSrc = computed(() => {
  const profileImage = appStore.isCurrentUser(user.value?.id) ? appStore.user?.profile_image : user.value?.profile_image;
  return profileImage || "/android-chrome-512x512.png";
})

async function logout() {
  await supabase.auth.signOut();
  appStore.$reset();
  router.push("/home");
}

function showEditProfileDialog() {
  appStore.showEditProfileDialog = !appStore.showEditProfileDialog;
}

function loadMore() {
  const diff = Math.min(favourites.value.length - favouritesShown.value.length, 3);
  if (diff <= 0) return;

  const currentLength = favouritesShown.value.length;
  favouritesShown.value.push(...favourites.value.slice(currentLength, currentLength + diff));
}

function setProfileImage(imageUrl: string) {
  appStore.updateUser(undefined, undefined, imageUrl);
}

onMounted(async () => {
  const userId = router.currentRoute.value.params.id as string;

  const [_user, _favourites] = await Promise.all([
    appStore.getUser(userId),
    appStore.getUserAllFavouriteImages(userId),
  ]);

  user.value = _user;
  favourites.value = _favourites.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  favouritesShown.value = _favourites.slice(0, 3);
  loading.value = false;
})
</script>

<template>
  <VSheet class="ma-4 bg-transparent">
    <VCard class="mx-auto" :max-width="display.thresholds.value.md">
      <VContainer class="d-flex justify-space-between">
        <VAvatar :image="profileImageSrc" size="128" />

        <div>
          <VBtn v-if="appStore.isCurrentUser(user?.id)" icon="mdi-logout" @click="logout" class="mx-2" />
          <VBtn v-if="appStore.isCurrentUser(user?.id)" icon="mdi-pencil-outline" @click="showEditProfileDialog" />
        </div>
      </VContainer>

      <VContainer>
        <h1 class="text-h5">{{ profileName }}</h1>
        <p class="text-body-1 my-2">{{ profileBio }}</p>
        <div class="d-flex align-center">
          <VIcon icon="mdi-calendar" />
          <p class="text-body-1 mx-2">{{ profileDate }}</p>
        </div>
      </VContainer>

      <VOverlay v-model="loading" persistent contained class="align-center justify-center"><Progress /></VOverlay>
    </VCard>
  </VSheet>

  <VSheet class="mx-auto my-4 px-4 bg-transparent" :max-width="display.thresholds.value.md">
    <VRow>
      <VCol v-for="data in favouritesShown" :key="data.id" cols="4" style="cursor: pointer;">
        <VImg @click="setProfileImage(data.image_url)" :src="data.image_url" aspect-ratio="1" cover>
          <template v-slot:placeholder><Progress /></template>
        </VImg>
      </VCol>
    </VRow>

    <div class="d-flex align-center my-4">
      <VBtn class="mx-auto" @click="loadMore">Load More</VBtn>
    </div>
  </VSheet>

  <EditProfileDialog />
</template>
