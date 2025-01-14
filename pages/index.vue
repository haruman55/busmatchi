<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-col class="text-h5" align="center" />
      </v-row>
    </v-container>

    <v-form @submit.prevent>
      <v-container fluid >
        <v-row>
          <v-col>
            <v-card class="mx-auto" max-width="700" height="250" image="/img/top.png" />
            <v-card class="mx-auto " max-width="600" max-height="250">
              <v-card-text>
                <v-card-actions>
                  <v-btn
size="x-large" block color="teal-accent-2" variant="flat" elevation="8" rounded="xl"
                    @click="login">
                    ログイン
                  </v-btn>
                </v-card-actions>
              </v-card-text>
              <v-card-text>
                <v-row>
                  <v-col md="12" align="center">
                    <p class="white--text">↓ 初めてご利用の方はこちら ↓</p>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions class="justify-center">
                <v-btn variant="outlined" color="" @click="newEntry">
                  アカウントを作成する
                </v-btn>
              </v-card-actions>
            </v-card>

          </v-col>
        </v-row>

      </v-container>
    </v-form>
  </div>
</template>
<script setup>
const router = useRouter()

/**
 * ログイン画面表示
 */
const login =  () => {

  // 画面遷移
  router.push('/login')

}

/**
 * 新規ユーザ登録表示
 */
const newEntry = () => {
  // 画面遷移
  router.push('/user/entrychoice')
}

</script>
<style scoped>

</style>