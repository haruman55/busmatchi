<template>
  <div>
    <v-container class="align-center" fluid>
      <v-row justify="center" no-gutters>
        <v-col>
          <v-card-text class="font-weight-bold text-h5">
            <v-icon left x-large @click="back">
              mdi-close
            </v-icon>

           登録ありがとうございました。
          </v-card-text>
        </v-col>
      </v-row>
    </v-container>

    <v-container class="align-center" fluid>
      <v-card>
        <!-- この中にコンテンツ -->
        <v-row justify="center" no-gutters>
          <v-col>
            <v-container>
              <v-row>
                <v-col >
                  <v-card-text>登録完了後の文言</v-card-text>
                  <v-card-text>XXXXXXXXXXXXXX</v-card-text>
                  <v-card-text>登録完了しました。</v-card-text>
                  <v-card-text>メールアドレスにアカウント情報を送信しました。</v-card-text>
                  <v-card-text>確認してください。</v-card-text>
                  <v-card-text>テスト用↓</v-card-text>

                  <v-card-text>ID:{{ userInfo.companyId }}</v-card-text>
                  <v-card-text>Pass:{{ userInfo.pass }}</v-card-text>
                  <v-card-text>XXXXXXXXXXXXXX</v-card-text>
                  <v-card-text>XXXXXXXXXXXXXX</v-card-text>
                  <v-card-text>XXXXXXXXXXXXXX</v-card-text>

                </v-col>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
    <v-container class="align-center" fluid>
      <v-row justify="center" no-gutters>
        <v-col align="center">
          <v-btn
rounded variant="outlined" size="x-large" color="indigo darken-4" dark class="mb-2 pr-8 pl-8"
            @click="back">閉じる
          </v-btn>
        </v-col>

      </v-row>

    </v-container>
  </div>
</template>
<script setup>
const router = useRouter()
const { userInfo } = useUserInfo()


/** 前の画面へ戻る */
const back = () => {
  // 画面遷移
  router.push('/')

}
</script>
