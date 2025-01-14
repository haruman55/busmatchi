<template>
  <v-app-bar color="white" dense >
    <v-card-title>何かイメージアイコン</v-card-title>
    <template #prepend>
      <v-btn color="red" icon="mdi-exit-run" @click="portal"/>

    </template>

    <!-- <template v-slot:image>
      <v-img src="/img/logoicon.png"></v-img>
    </template> -->
  </v-app-bar>

</template>
<script setup>
const router = useRouter()
const { $swal } = useNuxtApp()

/** ポータル画面へ戻る */
const portal = async () => {
  let confirmRes = false
  await $swal.fire({
    text: 'ポータルページに戻ります。入力途中の情報は破棄されます。よろしいですか？',
    showCancelButton: true,
    confirmButtonColor: "#00BCD4",
    cancelButtonColor: "#CFD8DC",
    confirmButtonText: 'はい。',
    cancelButtonText: 'キャンセル',
    icon: 'info'
  }).then((res) => {
    confirmRes = res.isConfirmed
  })
  if (!confirmRes) {
    return
  }
  // 主要なstateをクリア

  // 画面遷移
  router.push('/')
}

</script>
