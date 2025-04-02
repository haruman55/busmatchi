<template>
  <v-app-bar color="secondary" flat>
    <v-app-bar-title style="font-family: Comic Sans MS">
      <!-- <v-icon>mdi-bus-side</v-icon> -->
      <v-btn icon @click.stop="drawer = !drawer">
        <v-icon size="36">mdi-bus-side</v-icon>
      </v-btn>
      <span>busmatchi</span>
    </v-app-bar-title>

    <template v-if="isShowEntryBtn" #append>
      <v-btn class="mr-2" variant="text" rounded @click="login()">ログイン</v-btn>
      <v-btn variant="flat" color="primary" rounded @click="newEntry()">今すぐ始める</v-btn>
      <!-- <template v-slot:image>
        <v-img src="/img/logoicon.png"></v-img>
      </template> -->
    </template>
  </v-app-bar>
  <!-- <DrawerNavigation :drawer="drawer" /> -->
</template>

<script setup>
const drawer = ref(false)
const router = useRouter()
const isShowEntryBtn = computed(() => router.currentRoute.value.fullPath === '/')

/**
 * ログイン画面表示
 */
const login = () => {
  // 画面遷移
  router.push('/login')
}

/**
 * 新規ユーザ登録表示
 */
const newEntry = () => {
  // 画面遷移
  router.push('/entry')
}
</script>

<style scoped>
:deep(.v-toolbar__content) {
  max-width: 1200px;
  margin-inline: auto;
}

:deep(.v-toolbar__append) {
  margin-inline: auto 16px;
}
</style>
