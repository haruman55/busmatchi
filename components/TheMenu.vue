<template>
  <v-card color="grey-lighten-4" flat rounded="0">
    <v-toolbar density="compact" color="indigo-lighten-3">
      <v-spacer />

      <h3> {{ userInfo.companyName }}さん({{ userInfo.companyId }})</h3>

      <v-btn x-large >
        <font-awesome-icon icon="fa-solid  fa-home" size="2x" />
      </v-btn>
      <v-icon size="x-large" @click="home">
        mdi-home
      </v-icon>


    </v-toolbar>
  </v-card>
</template>

<script setup>
// const router = useRouter()
// user情報の状態管理
const { userInfo } = useUserInfo()



</script>
