<script setup lang="ts">
import { useAppStore } from '@/stores/app';
import type { IFavourite } from '@/types/favourite';
import type { IUser } from '@/types/user';
import { ref } from 'vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const appStore = useAppStore();

const user = ref<IUser | undefined>(undefined);
const favourites = ref<IFavourite[] | undefined>(undefined);

onMounted(async () => {
  const userId = router.currentRoute.value.params.id as string;

  const [_user, _favourites] = await Promise.all([
    appStore.getUser(userId),
    appStore.getUserAllFavouriteImages(userId),
  ]);

  user.value = _user;
  favourites.value = _favourites;
})
</script>

<template>
  {{ user?.id }}
</template>
