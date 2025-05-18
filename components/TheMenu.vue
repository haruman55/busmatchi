<template>
  <v-toolbar density="compact" color="#ccd9d3">
    <h3 class="ml-10">{{ userInfo.companyName }}</h3>
    <v-spacer />

    <v-btn color="#4f4f4f" icon class="ma-2" @click="navigateTo('/company/information')">
      <v-tooltip location="bottom" activator="parent">
        <span>インフォメーション</span>
      </v-tooltip>
      <v-badge v-if="newInformationCount > 0" :content='newInformationCount' color="red" >
        <v-icon size="32">mdi-email-outline</v-icon>
      </v-badge>
      <v-icon v-else size="32">mdi-email-outline</v-icon>
    </v-btn>

    <v-btn v-if="auth === 1" color="#4f4f4f" class="ma-2" cols="auto" icon @click="navigateTo('/company')">
      <v-tooltip location="bottom" activator="parent">
        <span>会社情報</span>
      </v-tooltip>
      <v-icon size="32">mdi-office-building-outline</v-icon>
    </v-btn>

    <v-btn color="#4f4f4f" icon class="ma-2" @click="navigateTo('/company/member')">
      <v-tooltip location="bottom" activator="parent">
        <span>個人情報</span>
      </v-tooltip>
      <v-icon size="32">mdi-account-outline</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script setup>
const router = useRouter()
// user情報の状態管理
const { userInfo } = useUserInfo()
const auth = userInfo.value.auth

console.log('userInfo:', userInfo.value.companyId)

// インフォメーション操作の呼び出し
const {getInformation} = useInformation()
const {newInformationCount, information} = await getInformation(userInfo.value.companyId, false)


/**
 * 指定画面を表示
 * @param path 遷移先のパス
 */
const navigateTo = (path) => {
  router.push(path)
}
</script>
