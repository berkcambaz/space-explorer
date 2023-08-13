import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    showLoginDialog: false,

    authorized: false,
  }),
})
