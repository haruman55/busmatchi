import { initializeApp } from 'firebase/app'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const firebaseConfig = {
    apiKey: "AIzaSyAMW3gEtKpviicDR1BQgJNCQ50yWbfbvzg",
    authDomain: "busmatchi.firebaseapp.com",
    projectId: "busmatchi",
    storageBucket: "busmatchi.firebasestorage.app",
    messagingSenderId: "470427726433",
    appId: "1:470427726433:web:584283eba67482b9e7b020"    
  }

  const app = initializeApp(firebaseConfig)
})

