import * as Const from '~/common/constants'

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      Const
    }
  }
})
