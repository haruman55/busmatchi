<template>
  <v-container max-width="1200">
    <v-row no-gutters>
      <v-col>
        <v-breadcrumbs
:items="[
          { title: 'ホーム', disabled: false, to: '/' },
          { title: 'アカウント登録', disabled: true },
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
        <v-stepper v-model="step" class="mb-6" bg-color="transparent" hide-actions alt-labels flat>
          <v-stepper-header class="w-sm-75 mx-auto text-body-2">
            <v-stepper-item title="会社種別の選択" :value="1" :complete="step > 1" />
            <v-divider />
            <v-stepper-item title="会社情報の入力" :value="2" :complete="step > 2" />
            <v-divider />
            <v-stepper-item title="ログイン情報の入力" :value="3" :complete="step > 3" />
          </v-stepper-header>
        </v-stepper>

        <div v-if="step === 1">
          <h3 class="mb-10 font-weight-bold text-h5">会社種別を選択してください</h3>

          <div class="d-flex justify-center">
            <v-btn class="mr-4 text-primary" variant="text" rounded="xl" size="300" @click="selectType('1')">
              <div>
                <v-icon size="100">mdi-lead-pencil</v-icon>
                <p class="mt-8 text-h5 text-black">申込会社で登録する</p>
              </div>
            </v-btn>
            <v-btn class="ml-4 text-primary" variant="text" rounded="xl" size="300" @click="selectType('2')">
              <div>
                <v-icon size="100">mdi-bus-multiple</v-icon>
                <p class="mt-8 text-h5 text-black">運送引受会社で登録する</p>
              </div>
            </v-btn>
          </div>

          <!-- <v-card class="mt-10 mx-auto" @click="selectType('1')">
            <v-img
              src="/img/guide.png"
              class="align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              height="250px"
              cover
            >
              <v-card-title class="text-white">申込会社で登録する</v-card-title>
            </v-img>
          </v-card> -->

          <!-- <v-card class="mt-6 mx-auto" @click="selectType('2')">
            <v-img
              src="/img/bus.png"
              class="align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              height="250px"
              cover
            >
              <v-card-title class="text-white">運送引受会社で登録する</v-card-title>
            </v-img>
          </v-card> -->
        </div>

        <div v-if="step === 2">
          <h3 class="font-weight-bold text-h5">会社情報を入力してください</h3>

          <v-sheet class="py-10 mx-auto text-start" max-width="500" color="transparent">
            <v-form>
              <v-row no-gutters>
                <v-col v-for="form in companyForms" :key="form.key" class="pa-2" :cols="form.cols">
                  <p>
                    <span class="text-body-2">{{ form.title }}</span>
                    <v-chip v-if="form.required" class="ml-2 mb-1" variant="flat" size="x-small" label color="warning">
                      必須
                    </v-chip>
                  </p>
                  <v-text-field
v-model="form.value" :prepend-inner-icon="form.icon" :placeholder="form.placeholder"
                    :hint="form.hint" persistent-hint :error-messages="form.errorMessage" density="comfortable" />
                </v-col>
              </v-row>
            </v-form>
          </v-sheet>

          <div>
            <v-btn class="mr-4" variant="tonal" size="x-large" rounded @click="step = 1">前へ</v-btn>
            <v-btn class="ml-4" color="primary" size="x-large" flat rounded @click="submitCompany()">次へ</v-btn>
          </div>
        </div>

        <div v-if="step === 3">
          <h3 class="font-weight-bold text-h5">ログイン情報を入力してください</h3>
          <h4 class="text-subtitle-1">この企業/団体のアカウントの最高管理者になります</h4>

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
            <v-btn class="mr-4" variant="tonal" size="x-large" rounded @click="step = 2">前へ</v-btn>
            <v-btn class="ml-4" color="primary" size="x-large" flat rounded @click="submitUser()">次へ</v-btn>
          </div>
        </div>

        <div v-if="step === 4">
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

            <p class="mt-10 mb-2 font-weight-bold">ログイン情報</p>
            <v-divider class="mb-2 border-opacity-100" />
            <div
v-for="form in userForms.filter((e) => e.key !== 'pass2')" :key="form.key"
              class="py-2 d-flex justify-space-between">
              <span>{{ form.title }}</span>
              <span>{{ form.type === 'password' ? '•'.repeat(form.value.length) : form.value }}</span>
            </div>
          </v-sheet>

          <div>
            <v-btn class="mr-4" variant="tonal" size="x-large" rounded @click="step = 3">前へ</v-btn>
            <v-btn class="ml-4" color="primary" size="x-large" flat rounded @click="registData()">確認</v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const { $Const } = useNuxtApp()
const db = useFirestore()
const utils = useUtils() // 共通関数の呼び出し
const router = useRouter()

const step = ref(1)
const category = ref(null)
const processing = ref(false)

const companyForms = ref([
  {
    title: '会社名',
    key: 'companyName',
    value: '',
    required: true,
    icon: 'mdi-office-building-outline',
    placeholder: '',
    cols: 12,
  },
  {
    title: '会社住所',
    key: 'companyAddr',
    value: '',
    required: false,
    icon: 'mdi-office-building-marker-outline',
    placeholder: '',
    cols: 12,
  },
  {
    title: '電話番号',
    key: 'companyTel',
    value: '',
    required: false,
    icon: 'mdi-phone-outline',
    placeholder: '',
    cols: 6,
  },
  {
    title: 'Emailアドレス',
    key: 'companyEmail',
    value: '',
    required: false,
    icon: 'mdi-email-outline',
    placeholder: '',
    cols: 6,
  },
  {
    title: 'FAX',
    key: 'companyFax',
    value: '',
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
 * 会社種別の選択
 * @param value
 */
const selectType = async (value) => {
  category.value = value
  step.value = 2
}

/**
 * 会社情報の確認
 */
const submitCompany = async () => {
  for (const f of companyForms.value) f.errorMessage = f.required && !f.value ? '必須入力です' : ''
  if (companyForms.value.some((f) => !!f.errorMessage)) return

  const email = companyForms.value.find((f) => f.key === 'companyEmail')
  if (email.value && !/.+@.+\..+/.test(email.value)) {
    email.errorMessage = '有効なメールアドレスではありません'
  }
  if (companyForms.value.some((f) => !!f.errorMessage)) return

  // 画面遷移
  step.value = 3
}

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
  step.value = 4
}

/**
 * 入力データをDBに保存
 */
const registData = async () => {
  processing.value = true

  const getValue = (forms, key) => utils.toBlank(forms.value.find((f) => f.key === key).value)
  const items = []

  // 会社登録情報作成
  const companyDocId = db.createDocId('company')
  items.push({
    method: 'set',
    path: 'company',
    docId: companyDocId,
    data: {
      category: category.value,
      companyName: getValue(companyForms, 'companyName'),
      companyAddr: getValue(companyForms, 'companyAddr'),
      companyTel: getValue(companyForms, 'companyTel'),
      companyEmail: getValue(companyForms, 'companyEmail'),
      companyFax: getValue(companyForms, 'companyFax'),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })

  // ユーザ登録情報作成
  const userId = db.createDocId('user')
  items.push({
    method: 'set',
    path: 'user',
    docId: userId,
    data: {
      companyId: companyDocId,
      name: getValue(userForms, 'name'),
      email: getValue(userForms, 'email'),
      pass: getValue(userForms, 'pass'),
      auth: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })
  await db.writeTransaction(items)

  processing.value = false

  // 画面遷移
  router.push('/entry/complete')
}
</script>

<style scoped>
:deep(.v-stepper-header) {
  box-shadow: none;
}
</style>
