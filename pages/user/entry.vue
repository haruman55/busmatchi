<template>
  <div>
    <v-container class="align-center" >
      <v-row justify="center" no-gutters>
        <v-col>
            <v-card-text class="font-weight-bold text-h5">
              <v-icon left x-large @click="back">
                mdi-close
              </v-icon>
              {{ $Const.USER_CATEGORY_DISP[userInfo.category].text }}：ユーザ情報を入力してください
            </v-card-text>
        </v-col>
      </v-row>
    </v-container>

    <v-container class="align-center" >
      <!-- この中にコンテンツ -->
      <v-row justify="center" no-gutters>
        <v-col>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <v-text-field v-model="companyName" label="会社名" outlined />
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field v-model="companyAddr" label="会社住所" outlined />
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field v-model="companyTel" label="Tel" outlined />
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field v-model="companyFax" label="Fax" outlined />
              </v-col>
              <hr>
              <v-col cols="12" sm="6" md="6">
                <v-text-field v-model="companyEmail" label="eMailアドレス" outlined />
              </v-col>

              <!-- <v-col cols="12" sm="6" md="6">
                <v-text-field v-model="pass" label="パスワード" outlined />
              </v-col> -->
            </v-row>
          </v-container>
        </v-col>
      </v-row>
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
            <v-icon dark left>
              mdi-arrow-right
            </v-icon> 次 へ
          </v-btn>
        </v-col>
        <v-spacer />
      </v-row>
    </v-container>
  </div>
</template>
<script setup>
const { $Const } = useNuxtApp()
const { $swal } = useNuxtApp()
const router = useRouter()
// 共通関数の呼び出し
const utils = useUtils();
// user情報の状態管理
const userState = useUserInfo()
const { userInfo } = userState

const companyName = ref(userInfo.value.companyName)
const companyAddr = ref(userInfo.value.companyAddr)
const companyTel = ref(userInfo.value.companyTel)
const companyFax = ref(userInfo.value.companyFax)
const companyEmail = ref(userInfo.value.companyEmail)
const pass = ref(userInfo.value.pass)

/** 入力情報を保存して、確認画面へ遷移 */
const entryConfirm = async () => {
  /** 業務チェック */
  // 必須入力チェック
  if (companyName.value == null || companyName.value == '') {
    $swal.fire({
      text: '会社名を入力してください。',
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning'
    })
    loading.value = false;
    return
  }
  if (companyEmail.value == null || companyEmail.value == '') {
    $swal.fire({
      text: 'e-mailアドレスを入力してください。',
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning'
    })
    loading.value = false;
    return
  }


  // TODO:ユーザ情報データ取得：存在チェック


  /** 次画面遷移準備 */
  const editUser = {
    id: '',
    category: userInfo.value.category,
    companyName: utils.toBlank(companyName.value),
    companyAddr: utils.toBlank(companyAddr.value),
    companyTel: utils.toBlank(companyTel.value),
    companyFax: utils.toBlank(companyFax.value),
    companyEmail:utils.toBlank(companyEmail.value) ,
    pass: utils.toBlank(pass.value),

  }
  userState.editUserInfo(editUser)


  // 画面遷移
  router.push('/user/entryconfirm')
}

/** 前の画面へ戻る */
const back = () => {
  // 画面遷移
  router.push('/user/entrychoice')

}
</script>
