import { defineStore } from 'pinia'
import type { Session } from "@supabase/supabase-js";
import type { IUser } from '@/types/user';
import type { IFavourite } from '@/types/favourite';
import { supabase } from '@/lib/supabase';

export const useAppStore = defineStore('app', {
  state: () => ({
    /* Dialogs */
    showLoginDialog: false,
    showEditProfileDialog: false,

    /* Session related data */
    session: null as Session | null,

    /* App related data */
    user: null as IUser | null,
    favourites: [] as IFavourite[],
  }),
  getters: {
    /**
     * Check to see if the given user is the current authorized user.
     * @returns Returns a function that input 'userId' as string or undefined and output a boolean.
     */
    isCurrentUser: (state) => {
      return (userId: string | undefined) => state.user && state.user.id === userId;
    },

    /**
     * Check to see if the given image is favourited by current authorized user.
     * @returns Returns a function that input 'imageUrl' as string and output a boolean.
     */
    isImageFavourited: (state) => {
      return (imageUrl: string) => state.favourites.filter(f => f.image_url === imageUrl).length > 0;
    },
  },
  actions: {
    /**
     * Get given user's all favourite images.
     * @param userId User's id (as UUID v4).
     * @returns A promise that resolves with the favourite images.
     */
    async getUserAllFavouriteImages(userId: string): Promise<IFavourite[]> {
      const { data, error } = await supabase
        .from('favourite')
        .select('*')
        .eq('user_id', userId)

      if (data && !error) return data;
      return [];
    },

    /**
     * Favourite or unfavourite an image.
     * @param imageUrl The image's url.
     * @param targetState Target state for favouriting, true is to favourite and false is to unfavourite.
     */
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

    /**
     * Creates (initalizes) an user, must be used everytime when a user logs in.
     */
    async createUser() {
      if (!this.session) return;

      const { data, error } = await supabase
        .from('user')
        .upsert({ id: this.session.user.id })
        .select()

      if (data && !error) this.user = data[0];
    },

    /**
     * Get a given user's data.
     * @param userId User's id (as UUID v4).
     * @returns A promise that resolves to given user's data or undefined.
     */
    async getUser(userId: string): Promise<IUser | undefined> {
      const { data, error } = await supabase
        .from('user')
        .select('*')
        .eq("id", userId)

      if (data && !error) return data[0];
      return undefined;
    },

    /**
     * Updates the user profile.
     * @param name Name of the user, does nothing if not supplied.
     * @param bio Bio of the user, does nothing if not supplied.
     * @param profile_image Profile image's url of the user, does nothing if not supplied.
     */
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
