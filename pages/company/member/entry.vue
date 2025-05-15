<template>
  <v-container max-width="1200">
    <v-row no-gutters>
      <v-col>
        <v-breadcrumbs
:items="[
          { title: '会社情報', disabled: false, to: '/company' },
          { title: '利用者登録', disabled: true },
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

    <v-row class="pb-10" no-gutters>
      <v-col align="center">


        <div v-if="step === 1">
          <h3 class="font-weight-bold text-h5">利用者情報を入力してください</h3>

          <v-sheet class="py-10 mx-auto text-start" max-width="500" color="transparent">
            <v-form>
              <v-row no-gutters>
                <v-col v-for="form in userForms" :key="form.key" class="pa-2" :cols="form.cols">
                  <p>
                    <span class="text-body-2">{{ form.title }}</span>
                    <v-chip v-if="form.required" class="ml-2 mb-1" variant="flat" size="x-small" label color="warning">
                      必須
                    </v-chip>
                  </p>
                  <v-text-field
v-model="form.value" :placeholder="form.placeholder" :prepend-inner-icon="form.icon"
                    :type="form.type" :hint="form.hint" persistent-hint :error-messages="form.errorMessage"
                    density="comfortable" />
                </v-col>
              </v-row>
            </v-form>
          </v-sheet>

          <div>
            <v-btn class="ml-4" color="primary" size="large" flat rounded @click="submitUser()">次へ</v-btn>
          </div>
        </div>

        <div v-if="step === 2">
          <h3 class="font-weight-bold text-h5">登録内容を確認してください</h3>

          <v-sheet class="py-10 mx-auto text-start" max-width="500" color="transparent">
            <p class="mb-2 font-weight-bold">会社情報</p>
            <v-divider class="mb-2 border-opacity-100" />
            <div class="py-2 d-flex justify-space-between">
              <span>会社種別</span>
              <span>{{ $Const.USER_CATEGORY_DISP[category].text }}</span>
            </div>
            <div v-for="form in companyForms" :key="form.key" class="py-2 d-flex justify-space-between">
              <span>{{ form.title }}</span>
              <span>{{ form.value }}</span>
            </div>

            <p class="mt-10 mb-2 font-weight-bold">利用者情報</p>
            <v-divider class="mb-2 border-opacity-100" />
            <div
v-for="form in userForms.filter((e) => e.key !== 'pass2')" :key="form.key"
              class="py-2 d-flex justify-space-between">
              <span>{{ form.title }}</span>
              <span>{{ form.type === 'password' ? '•'.repeat(form.value.length) : form.value }}</span>
            </div>
          </v-sheet>

          <div>
            <v-btn class="mr-4" variant="tonal" size="large" rounded @click="step = 1">前へ</v-btn>
            <v-btn class="ml-4" color="primary" size="large" flat rounded @click="registData()">確認</v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const { $Const } = useNuxtApp()
const { $swal } = useNuxtApp()
const db = useFirestore()
const utils = useUtils() // 共通関数の呼び出し
const router = useRouter()
const { userInfo } = useUserInfo()
const keyCompanyId = userInfo.value.companyId


const step = ref(1)
const category = ref(userInfo.value.category)
const processing = ref(false)

const companyForms = ref([
  {
    title: '会社名',
    key: 'companyName',
    value: userInfo.value.companyName,
    required: true,
    icon: 'mdi-office-building-outline',
    placeholder: '',
    cols: 12,
  },
  {
    title: '会社住所',
    key: 'companyAddr',
    value: userInfo.value.companyAddr,
    required: false,
    icon: 'mdi-office-building-marker-outline',
    placeholder: '',
    cols: 12,
  },
  {
    title: '電話番号',
    key: 'companyTel',
    value: userInfo.value.companyTel,
    required: false,
    icon: 'mdi-phone-outline',
    placeholder: '',
    cols: 6,
  },
  {
    title: '代表Emailアドレス',
    key: 'companyEmail',
    value: userInfo.value.companyEmail,
    required: false,
    icon: 'mdi-email-outline',
    placeholder: '',
    cols: 6,
  },

  {
    title: 'FAX',
    key: 'companyFax',
    value: userInfo.value.companyFax,
    required: false,
    icon: 'mdi-fax',
    placeholder: '',
    cols: 6,
  },

])

const userForms = ref([
  {
    title: '氏名',
    key: 'name',
    value: '',
    required: true,
    icon: 'mdi-account-outline',
    placeholder: '',
    cols: 12,
  },
  {
    title: 'Emailアドレス',
    key: 'email',
    value: '',
    required: true,
    icon: 'mdi-email-outline',
    placeholder: '',
    cols: 12,
  },
  {
    title: 'パスワード',
    key: 'pass',
    value: '',
    required: true,
    icon: 'mdi-lock-outline',
    placeholder: '半角英数字で6文字以上',
    type: 'password',
    cols: 12,
  },
  {
    title: 'パスワード（再入力）',
    key: 'pass2',
    value: '',
    required: true,
    icon: 'mdi-lock',
    placeholder: '半角英数字で6文字以上',
    type: 'password',
    cols: 12,
  },
])


/**
 * ログイン情報の確認
 */
const submitUser = async () => {
  for (const f of userForms.value) f.errorMessage = f.required && !f.value ? '必須入力です' : ''
  if (userForms.value.some((f) => !!f.errorMessage)) return

  const email = userForms.value.find((f) => f.key === 'email')
  const pass = userForms.value.find((f) => f.key === 'pass')
  const pass2 = userForms.value.find((f) => f.key === 'pass2')
  if (!/.+@.+\..+/.test(email.value)) email.errorMessage = '有効なメールアドレスではありません'
  if (!/^[a-zA-Z0-9]{6,}$/.test(pass.value)) pass.errorMessage = '半角英数字の6文字以上で入力してください'
  if (!/^[a-zA-Z0-9]{6,}$/.test(pass2.value)) pass2.errorMessage = '半角英数字の6文字以上で入力してください'
  if (userForms.value.some((f) => !!f.errorMessage)) return

  if (pass.value !== pass2.value) return (pass2.errorMessage = 'パスワードが不一致です')

  // ユーザ情報存在チェック
  const user = await db.getQueryDocument({
    path: 'user',
    where: [{ fieldPath: 'email', opStr: '==', value: email.value }],
    limit: 1,
  })
  if (user) return (email.errorMessage = '既に使用されています')

  // 画面遷移
  step.value = 2
}

/**
 * 入力データをDBに保存
 */
const registData = async () => {
  let confirmRes = false
  await $swal.fire({
    text: '入力した内容で利用者を登録します。よろしいですか？',
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

  processing.value = true

  const getValue = (forms, key) => utils.toBlank(forms.value.find((f) => f.key === key).value)
  const items = []


  // ユーザ登録情報作成
  const userId = db.createDocId('user')
  items.push({
    method: 'set',
    path: 'user',
    docId: userId,
    data: {
      companyId: keyCompanyId,
      name: getValue(userForms, 'name'),
      email: getValue(userForms, 'email'),
      pass: getValue(userForms, 'pass'),
      auth: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })
  await db.writeTransaction(items)

  processing.value = false

  // 画面遷移
  router.push('/company')
}
</script>

<style scoped>
:deep(.v-stepper-header) {
  box-shadow: none;
}
</style>
