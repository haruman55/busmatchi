<template>
  <div>
    <v-container class="align-center" fluid>
      <v-row no-gutters>
        <v-col>
            <v-card-text class="text-h6">
              <v-icon left x-large @click="back">
                mdi-close
              </v-icon>
              ログイン
            </v-card-text>
        </v-col>
      </v-row>
    </v-container>


    <v-form @submit.prevent>
      <v-container fluid>
        <v-row>
          <v-col>
            <v-card class="mx-auto " max-width="600">
              <v-card-text>
                <v-row>
                  <v-col>
                    <v-text-field v-model="companyId" label="id" type="text" />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-text-field
v-model="pass" label="password" :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="show ? 'text' : 'password'" name="input-10-2" class="input-group--focused"
                      @click:append="show = !show" />
                  </v-col>
                </v-row>
                <v-card-actions>
                  <v-btn
size="x-large" block color="teal-accent-2" variant="flat" elevation="8" rounded="xl"
                    @click="login">
                    ログイン
                  </v-btn>
                </v-card-actions>
              </v-card-text>



            </v-card>
          </v-col>
        </v-row>
        <v-overlay :model-value="loading" class="align-center justify-center">
          <v-progress-circular color="primary" size="80" width="20" indeterminate />
        </v-overlay>


      </v-container>
    </v-form>
  </div>
</template>
<script setup>
const { $Const } = useNuxtApp()
const { $swal } = useNuxtApp()
const router = useRouter()
// DB接続
const userData = useUserData();

const companyId = ref('')
const pass = ref('')
const show = ref(false)
const loading = ref(false)

/**
 * ログイン処理
 */
const login = async () => {
  loading.value = true;
  // validate
  // 必須入力チェック
  if (companyId.value === null || companyId.value === '') {
    $swal.fire({
      text: 'ID(会社ID)を入力してください。',
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning'
    })
    loading.value = false;
    return
  }
  if (pass.value === null || pass.value === '') {
    $swal.fire({
      text: 'パスワードを入力してください。',
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning'
    })
    loading.value = false;
    return
  }


  // ユーザ情報データ取得
  const loginUser = await userData.getUser(companyId.value, pass.value)
  if (loginUser == null) {
    $swal.fire({
      text: '指定のユーザが存在しません。',
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning'
    })
    loading.value = false;
    return
  }

  // user情報の状態管理
  const userState = useUserInfo()

  // ログインで取得したユーザ情報をstateに設定する
  const editUser = {
    id: loginUser.id,
    category: loginUser.category,
    companyId: loginUser.companyId,
    companyName: loginUser.companyName,
    companyAddr: loginUser.companyAddr,
    companyTel: loginUser.companyTel,
    companyFax: loginUser.companyFax,
    companyEmail: loginUser.companyEmail,
    pass: loginUser.pass,

  }
  userState.editUserInfo(editUser)

  // 画面遷移
  if (loginUser.category == $Const.CATEGORY_APPLICANT) {
    router.push('/user/mypage')
  } else {
    router.push('/delivery/mypage')

  }

}
/** 前の画面へ戻る */
const back = () => {
  // 画面遷移
  router.push('/')

}


</script>
