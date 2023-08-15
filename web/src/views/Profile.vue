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

/**
 * Used to display only a portion of favourite images to avoid requesting many images at once.
 */
const favouritesShown = ref<IFavourite[]>([]);

/**
 * Used to display loading overlay.
 */
const loading = ref(true);

/**
 * User's name, auto updated if current user changes their name.
 */
const profileName = computed(() => {
  const name = appStore.isCurrentUser(user.value?.id) ? appStore.user?.name : user.value?.name;
  return name || "Space Explorer";
})

/**
 * User's bio, auto updated if current user changes their bio.
 */
const profileBio = computed(() => {
  const bio = appStore.isCurrentUser(user.value?.id) ? appStore.user?.bio : user.value?.bio;
  return bio || "Bio of the Space Explorer";
})

/**
 * User's join date.
 */
const profileDate = computed(
  () => user.value ? util.formatDate(new Date(user.value.created_at)) : "Their journey started at..."
)

/**
 * User's profile image url, auto updated if current user changes their profile image.
 */
const profileImageSrc = computed(() => {
  const profileImage = appStore.isCurrentUser(user.value?.id) ? appStore.user?.profile_image : user.value?.profile_image;
  return profileImage || "/android-chrome-512x512.png";
})

/**
 * Tries to logout the user.
 */
async function logout() {
  try {
    await supabase.auth.signOut();
    appStore.$reset();
    router.push("/home");
  } catch (error) {

  }
}

/**
 * Shows/hides the edit profile dialog.
 */
function showEditProfileDialog() {
  appStore.showEditProfileDialog = !appStore.showEditProfileDialog;
}

/**
 * Try to load 3 more favourited images of the user.
 */
function loadMore() {
  const diff = Math.min(favourites.value.length - favouritesShown.value.length, 3);
  if (diff <= 0) return;

  const currentLength = favouritesShown.value.length;
  favouritesShown.value.push(...favourites.value.slice(currentLength, currentLength + diff));
}

/**
 * Changes user's profile image.
 * @param imageUrl Url of the image to set as the profile image.
 */
function setProfileImage(imageUrl: string) {
  appStore.updateUser(undefined, undefined, imageUrl);
}

/**
 * Favourites/unfavourites the image.
 * @param imageUrl Url of the image to favourite/unfavourite.
 */
function favourite(imageUrl: string) {
  const favourited = appStore.isImageFavourited(imageUrl);
  appStore.favouriteImage(imageUrl, !favourited);
}

/**
 * Try to fetch user's profile and favourite images.
 */
onMounted(async () => {
  // Retrieve user id from the url (ex. /profile/abc123 -> userId = abc123)
  const userId = router.currentRoute.value.params.id as string;

  // Fetch user profile and favourite images
  const [_user, _favourites] = await Promise.all([
    appStore.getUser(userId),
    appStore.getUserAllFavouriteImages(userId),
  ]);

  // Set user and favourites (sort by date descending)
  user.value = _user;
  favourites.value = _favourites.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Show only first 3 favourite images
  favouritesShown.value = _favourites.slice(0, 3);

  // Set overlay's loading to false
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
      <VCol v-for="data in  favouritesShown " :key="data.id" cols="4">
        <VHover v-slot="{ isHovering, props }">
          <VCard :elevation="isHovering ? 12 : 2" v-bind="props">
            <VImg :src="data.image_url" aspect-ratio="1" cover>
              <template v-slot:placeholder><Progress /></template>

              <VBtn 
                @click="setProfileImage(data.image_url)" 
                :color="!isHovering ? 'transparent' : ''" 
                variant="text"
                icon="mdi-image" 
              />

              <VBtn 
                @click="favourite(data.image_url)" 
                :color="!isHovering ? 'transparent' : ''" 
                variant="text"
                :icon="appStore.isImageFavourited(data.image_url) ? 'mdi-star' : 'mdi-star-outline'" 
              />
            </VImg>
          </VCard>
        </VHover>
      </VCol>
    </VRow>

    <div class="d-flex align-center my-4">
      <VBtn class="mx-auto" @click="loadMore">Load More</VBtn>
    </div>
  </VSheet>

  <EditProfileDialog />
</template>
