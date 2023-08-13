import { defineStore } from 'pinia'
import type { Session } from "@supabase/supabase-js";
import type { IUser } from '@/types/user';
import type { IFavourite } from '@/types/favourite';
import { supabase } from '@/lib/supabase';
import { th } from 'vuetify/locale';

export const useAppStore = defineStore('app', {
  state: () => ({
    // Dialogs
    showLoginDialog: false,

    // Session related
    session: null as Session | null,

    // App related
    user: null as IUser | null,
    favourites: [] as IFavourite[],
  }),
  getters: {
    isImageFavourited: (state) => {
      return (isoDate: string) => state.favourites.filter(f => f.image_date === isoDate).length > 0;
    }
  },
  actions: {
    async getUserAllFavouriteImages(userId: string): Promise<IFavourite[]> {
      if (!this.session) return [];

      const { data, error } = await supabase
        .from('favourite')
        .select('*')
        .eq('user_id', userId)

      if (data && !error) return data;
      return [];
    },

    async favouriteImage(isoDate: string, targetState: boolean) {
      if (!this.session) return;

      if (targetState) {
        const { data, error } = await supabase
          .from('favourite')
          .insert({ image_date: isoDate, user_id: this.session.user.id })
          .select()

        if (data && !error) this.favourites.push(...data);
      }
      else {
        const { error } = await supabase
          .from('favourite')
          .delete()
          .eq('user_id', this.session.user.id)
          .eq('image_date', isoDate)

        if (!error) this.favourites = this.favourites.filter(f => f.image_date !== isoDate)
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
  }
})
