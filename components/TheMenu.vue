<template>
  <v-toolbar density="compact" color="indigo-lighten-3">

    <h3 class="ml-10"> {{ userInfo.companyName }} </h3>
    <v-spacer />

    <v-menu v-model="menu" open-on-hover location="bottom" offset="0">
      <template #activator="{ props }">
        <v-btn icon="mdi-dots-grid" size="x-large" v-bind="props"></v-btn>
      </template>
      <v-sheet width="300" height="150" class="pa-2" color="white" style="overflow-x: hidden;"> 
        <v-row
justify="center"
           class="text-center">
          <v-col cols="auto">
            <v-icon icon="mdi-home" size="36" @click="navigateTo('/user/mypage')" />
            <div>マイページ</div>
          </v-col>
          <v-col v-if="auth === 1" cols="auto">
            <v-icon icon="mdi-account-plus-outline" size="36" @click="navigateTo('/manager/member/list')" />
            <div>利用者管理</div>
          </v-col>
        </v-row>
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
