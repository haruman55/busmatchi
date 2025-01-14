import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

export default defineNuxtPlugin((nuxtApp) => {
  const { $dayjs } = useNuxtApp();

  Datepicker.props.format.default = (date) => {
     return $dayjs(date).format('YYYY年MM月DD日')
  }
  nuxtApp.vueApp.component('Datepicker', Datepicker)
})
