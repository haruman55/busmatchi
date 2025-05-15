<template>
  <v-container max-width="1200">
    <v-row no-gutters>
      <v-col>
        <v-breadcrumbs
:items="[
          { title: 'ホーム', disabled: false, to: '/' },
          { title: 'ログイン', disabled: true },
        ]">
          <template #prepend>
            <v-icon icon="mdi-home" size="small" />
          </template>
          <template #divider>
            <v-icon icon="mdi-chevron-right" />
          </template>
        </v-breadcrumbs>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-form @submit.prevent="login">
          <v-card class="mx-auto py-14" flat rounded="xl" max-width="500">
            <v-card-title class="pa-0 pb-6 text-subtitle-1 text-center">
              <v-icon class="mb-4" size="80">mdi-bus</v-icon>
              <p>パスワードの入力、または信頼済みの</p>
              <p>端末でログインしてください。</p>
            </v-card-title>

            <v-card-text class="d-flex flex-column align-center">
              <!-- <v-text-field
                v-model="companyId"
                label="会社ID"
                prepend-inner-icon="mdi-office-building-outline"
                :error-messages="idError"
                width="400"
              /> -->
              <v-text-field
v-model="email" label="ユーザーID（メールアドレス）" prepend-inner-icon="mdi-account-outline"
                :error-messages="mailError" width="400" />
              <v-text-field
v-model="pass" label="password" prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'" :type="show ? 'text' : 'password'"
                :error-messages="passError" width="400" @click:append-inner="show = !show" />
            </v-card-text>

            <v-card-actions class="d-flex justify-center">
              <v-btn
variant="flat" color="primary" rounded="xl" size="x-large" :disabled="loading" :loading="loading"
                width="400" type="submit">
                ログイン
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const { $Const } = useNuxtApp()
const router = useRouter()
// DB接続
const db = useFirestore()

const email = ref('')
const pass = ref('')
const show = ref(false)
const loading = ref(false)
const mailError = ref('')
const passError = ref('')


/**
 * ログイン処理
 */
const login = async () => {
  loading.value = true

  // 必須入力チェック
  mailError.value = ''
  passError.value = ''
  if (email.value === null || email.value === '') mailError.value = '入力してください。'
  if (pass.value === null || pass.value === '') passError.value = '入力してください。'
  if (mailError.value || passError.value) return (loading.value = false)

  // ユーザー情報データ取得
  const loginUser = await db.getQueryDocument({
    path: 'user',
    where: [{ fieldPath: 'email', opStr: '==', value: email.value }],
    limit: 1,
  })
  if (!loginUser) {
    mailError.value = '指定のユーザーが存在しません。'
    loading.value = false
    return
  }
  if (pass.value !== loginUser.pass) {
    passError.value = 'パスワードが間違っています。'
    loading.value = false
    return
  }

  // 会社情報データ取得
  const loginCompany = await db.getDocument({ path: 'company', docId: loginUser.companyId })

  // user情報の状態管理
  const userState = useUserInfo()

  // ログインで取得したユーザ情報をstateに設定する
  const editUser = {
    id: loginUser.id,
    category: loginCompany.category,
    companyId: loginUser.companyId,
    companyName: loginCompany.companyName,
    companyAddr: loginCompany.companyAddr,
    companyTel: loginCompany.companyTel,
    companyFax: loginCompany.companyFax,
    companyEmail: loginCompany.companyEmail,
    businessPermitDate: '',
    businessPermitNo: '',
    businessLicenseArea: '',
    name: loginUser.name,
    email: loginUser.email,
    auth: loginUser.auth,
    pass: loginUser.pass,
  }
  userState.editUserInfo(editUser)

  // 画面遷移
  if (loginCompany.category == $Const.CATEGORY_APPLICANT) {
    router.push('/user/mypage')
  } else {
    router.push('/delivery/mypage')
  }
}
</script>
