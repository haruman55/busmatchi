<template>
  <v-container class="pa-0" fluid>
    <v-row class="mb-10 bg-white" no-gutters style="height: 450px">
      <v-col class="mx-auto d-flex align-center" style="max-width: 1200px">
        <div class="w-50 px-8">
          <p class="mb-2 text-h4">旅の感動をともに創る、</p>
          <p class="mb-8 text-h4">最高のパートナー。</p>
          <v-btn class="mr-2" variant="flat" color="grey-darken-3" size="x-large" rounded @click="newEntry">
            今すぐ始める
          </v-btn>
          <v-btn class="ml-2" variant="outlined" color="grey-darken-3" size="x-large" rounded>始め方ガイド</v-btn>
        </div>
        <div class="w-50 px-8">
          <img class="mx-auto" width="100%" src="/img/bus_mono.png" />
        </div>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col class="mx-auto pa-8" style="max-width: 1200px">
        <h3 class="font-weight-bold text-h4">busmatchiとは？</h3>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const router = useRouter()

/**
 * 新規ユーザ登録表示
 */
const newEntry = () => {
  // 画面遷移
  router.push('/entry')
}
</script>

<style scoped></style>
