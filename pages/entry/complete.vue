<template>
  <v-container max-width="1200">
    <v-row no-gutters>
      <v-col>
        <v-breadcrumbs
          :items="[
            { title: 'ホーム', disabled: false, to: '/' },
            { title: '登録完了', disabled: true },
          ]"
        >
          <template #prepend>
            <v-icon icon="mdi-home" size="small" />
          </template>
          <template #divider>
            <v-icon icon="mdi-chevron-right" />
          </template>
        </v-breadcrumbs>
      </v-col>
    </v-row>

    <v-row class="py-10" no-gutters>
      <v-col align="center">
        <v-icon class="mb-4" size="100">mdi-checkbox-marked-circle-outline</v-icon>
        <h3 class="mb-8 font-weight-bold text-h5">登録完了</h3>
        <p class="text-subtitle-1">アカウントの登録が完了しました！</p>
        <p class="text-subtitle-1">ログインしてご利用を開始してください</p>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col align="center">
        <v-btn color="primary" size="x-large" flat rounded @click="toLogin()">ログインへ</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const router = useRouter()

/** ログイン画面へ */
const toLogin = async () => {
  router.push('/login')
}
</script>
