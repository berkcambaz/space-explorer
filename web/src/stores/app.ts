import { defineStore } from 'pinia'
import type { Session } from "@supabase/supabase-js";
import type { IUser } from '@/types/user';
import type { IFavourite } from '@/types/favourite';
import { supabase } from '@/lib/supabase';

export const useAppStore = defineStore('app', {
  state: () => ({
    // Dialogs
    showLoginDialog: false,
    showEditProfileDialog: false,

    // Session related
    session: null as Session | null,

    // App related
    user: null as IUser | null,
    favourites: [] as IFavourite[],
  }),
  getters: {
    isCurrentUser: (state) => {
      return (userId: string | undefined) => state.user && state.user.id === userId;
    },
    isImageFavourited: (state) => {
      return (imageUrl: string) => state.favourites.filter(f => f.image_url === imageUrl).length > 0;
    },
  },
  actions: {
    async getUserAllFavouriteImages(userId: string): Promise<IFavourite[]> {
      const { data, error } = await supabase
        .from('favourite')
        .select('*')
        .eq('user_id', userId)

      if (data && !error) return data;
      return [];
    },

    async favouriteImage(imageUrl: string, targetState: boolean) {
      if (!this.session) return;

      if (targetState) {
        const { data, error } = await supabase
          .from('favourite')
          .insert({ image_url: imageUrl, user_id: this.session.user.id })
          .select()

        if (data && !error) this.favourites.push(...data);
      }
      else {
        const { error } = await supabase
          .from('favourite')
          .delete()
          .eq('user_id', this.session.user.id)
          .eq('image_url', imageUrl)

        if (!error) this.favourites = this.favourites.filter(f => f.image_url !== imageUrl)
      }
    },

    async createUser() {
      if (!this.session) return;

      const { data, error } = await supabase
        .from('user')
        .upsert({ id: this.session.user.id })
        .select()

      if (data && !error) this.user = data[0];
    },

    async getUser(userId: string): Promise<IUser | undefined> {
      const { data, error } = await supabase
        .from('user')
        .select('*')
        .eq("id", userId)

      if (data && !error) return data[0];
      return undefined;
    },

    async updateUser(name?: string, bio?: string, profile_image?: string) {
      if (!this.user) return;
      if (!this.session) return;

      const { data, error } = await supabase
        .from('user')
        .update({ name, bio, profile_image })
        .eq('id', this.session.user.id)
        .select()

      if (data && !error) {
        this.user.name = name || this.user.name;
        this.user.bio = bio || this.user.bio;
        this.user.profile_image = profile_image || this.user.profile_image;
      }
    }
  }
})
