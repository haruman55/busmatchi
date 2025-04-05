<template>
  <v-toolbar density="compact" color="indigo-lighten-3">

    <h3> {{ userInfo.companyName }}さん({{ userInfo.companyId }})</h3>
    <v-spacer />

    <v-menu v-model="menu" open-on-hover location="bottom" offset="0">
      <template #activator="{ props }">
        <v-btn icon="mdi-dots-grid" size="x-large" v-bind="props"></v-btn>
      </template>
      <v-sheet width="300" height="200" class="pa-2" color="white">
        <v-btn size="x-large" icon="mdi-home" variant="text" @click="navigateTo('/user/mypage')"></v-btn>
        <v-btn v-if="auth === 1" size="x-large" icon="mdi-account-plus-outline" variant="text" @click="navigateTo('/manager/member/list')"></v-btn>
      </v-sheet>
    </v-menu>


  </v-toolbar>

</template>

<script setup>
const router = useRouter()
// user情報の状態管理
const { userInfo } = useUserInfo()
const auth = userInfo.value.auth
const menu = ref(false);
/**
 * 指定画面を表示
 * @param path 遷移先のパス
 */
const navigateTo = (path) => {
  menu.value = false; // メニューを閉じる
  router.push(path);  
};


</script>
