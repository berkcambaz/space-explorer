import { defineStore } from 'pinia'
import type { Session } from "@supabase/supabase-js";

export const useAppStore = defineStore('app', {
  state: () => ({
    showLoginDialog: false,

    authorized: false,
    session: null as Session | null,
  }),
})
