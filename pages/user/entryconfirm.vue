<template>
  <div>
    <v-container class="align-center" fluid>
      <v-row justify="center" no-gutters>
        <v-col>
          <v-card-text class="font-weight-bold text-h5">
            <v-icon left x-large @click="back">
              mdi-close
            </v-icon>

            {{ $Const.USER_CATEGORY_DISP[userInfo.category].text }}：登録内容を確認してください
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
                <v-col cols="12" sm="6" md="6">
                  <v-card-text>会社名</v-card-text>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-card-text>{{ userInfo.companyName }}</v-card-text>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-card-text>住所:</v-card-text>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-card-text>{{ userInfo.companyAddr }}</v-card-text>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-card-text>Tel:</v-card-text>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-card-text>{{ userInfo.companyTel }}</v-card-text>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-card-text>Fax:</v-card-text>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-card-text>{{ userInfo.companyFax }}</v-card-text>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-card-text>eMailアドレス:</v-card-text>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-card-text>{{ userInfo.companyEmail }}</v-card-text>
                </v-col>
                <!-- <v-col cols="12" sm="6" md="6">
                  <v-card-text>パスワード:</v-card-text>
                </v-col> -->
                <!-- <v-col cols="12" sm="6" md="6">
                  <v-card-text>{{ userInfo.pass }}</v-card-text>
                </v-col> -->
              </v-row>
            </v-container>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
    <v-container class="align-center" fluid>
      <v-row justify="center" no-gutters>
        <v-spacer />
        <v-col align="center">
          <v-btn
rounded variant="outlined" size="x-large" color="indigo darken-4" dark class="mb-2 pr-8 pl-8"
            @click="back">
            <v-icon dark left>
              mdi-arrow-left
            </v-icon> 戻 る
          </v-btn>
        </v-col>

        <v-col align="center">
          <v-btn rounded size="x-large" color="indigo darken-4" dark class="mb-2 pr-8 pl-8" @click="entryConfirm">
            この情報で登録する
          </v-btn>
        </v-col>
        <v-spacer />
      </v-row>
      <v-overlay :model-value="loading" class="align-center justify-center">
        <v-progress-circular color="primary" size="80" width="20" indeterminate />
      </v-overlay>

    </v-container>
  </div>
</template>
<script setup>
// const { $Const } = useNuxtApp()
const { $swal } = useNuxtApp()
const router = useRouter()
const userData = useUserData();

const userState = useUserInfo()
const { userInfo } = userState

const loading = ref(false)

/** 入力情報を登録へ遷移 */
const entryConfirm = async () => {
  /** 業務チェック */
  let confirmRes = false
  await $swal.fire({
    text: '確認した内容で登録します。よろしいですか？',
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

  // 必須入力チェック

  // ユーザ情報データ取得：存在チェック

  loading.value = true;

  /** 次画面遷移準備 */
  /** DB操作  */
  // TODO:会社IDの採番:一旦ランダム
  const companyId_ = Math.random().toString(32).substring(2)
  // TODO:パスワード
  const pass_ = '12345'

  // ユーザ登録
  const insertObj = {
    category: userInfo.value.category,
    companyId: companyId_,
    companyName: userInfo.value.companyName,
    companyAddr: userInfo.value.companyAddr,
    companyTel: userInfo.value.companyTel,
    companyFax: userInfo.value.companyFax,
    companyEmail: userInfo.value.companyEmail,
    pass: pass_,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const userId = await userData.addUser(insertObj)

  // state情報更新
  const editUser = {
    id: userId,
    category: userInfo.value.category,
    companyId: companyId_,
    companyName: userInfo.value.companyName,
    companyAddr: userInfo.value.companyAddr,
    companyTel: userInfo.value.companyTel,
    companyFax: userInfo.value.companyFax,
    companyEmail: userInfo.value.companyEmail,
    pass: pass_,

  }
  userState.editUserInfo(editUser)


  // 画面遷移
    router.push('/user/entrycomplete')
}

/** 前の画面へ戻る */
const back = () => {
  // 画面遷移
  router.push('/user/entry')

}
</script>
