// plugins/dayjs.js
import dayjs from 'dayjs';

export default defineNuxtPlugin(() => {
  return {
    provide: {
      dayjs
    }
  };
});
