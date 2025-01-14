<template>
  <div>
    <v-container class="align-center" >
      <v-row justify="center" no-gutters>
        <v-col>
            <v-card-text class="font-weight-bold text-h5">
              <v-icon left x-large @click="back">
                mdi-close
              </v-icon>
              会社種別を選択してください
            </v-card-text>
        </v-col>
      </v-row>
    </v-container>

    <v-container class="align-center" >
      <v-row justify="center" no-gutters>
        <v-col>
          <v-card class="mx-auto" @click="entry('1')">
            <v-img
src="/img/guide.png" class="align-end" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              height="250px" cover>
              <v-card-title class="text-white">申込会社で登録する</v-card-title>
            </v-img>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card class="mx-auto" @click="entry('2')">
            <v-img
src="/img/bus.png" class="align-end" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              height="250px" cover>
              <v-card-title class="text-white">運送引受会社で登録する</v-card-title>
            </v-img>
          </v-card>
        </v-col>

      </v-row>
    </v-container>

  </div>
</template>
<script setup>
const router = useRouter()
// user情報の状態管理
const userState = useUserInfo()

/** 入力情報を保存して、確認画面へ遷移 */
const entry = async (category) => {

  /** 次画面遷移準備 */
  const editUser = {
    id: '',
    category: category,
    name: '',
    email: '',
    pass: '',

  }
  userState.editUserInfo(editUser)

  // 画面遷移
  router.push('/user/entry')
}

/** 前の画面へ戻る */
const back = () => {
  // stateの初期化
  userState.clearUserInfo()
  // 画面遷移
  router.push('/')

}
</script>
