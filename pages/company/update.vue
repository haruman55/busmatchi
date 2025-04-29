<template>
  <v-container max-width="1200">
    <v-row no-gutters>
      <v-col>
        <v-breadcrumbs
:items="[
          { title: '会社情報', disabled: false, to: '/company' },
          { title: '会社情報更新', disabled: true },
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
          <h3 class="font-weight-bold text-h5">会社情報を編集してください</h3>

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
v-model="form.value" :placeholder="form.placeholder" :prepend-inner-icon="form.icon"
                    :type="form.type" :hint="form.hint" persistent-hint :error-messages="form.errorMessage"
                    density="comfortable" />
                </v-col>
              </v-row>
            </v-form>
          </v-sheet>

          <div>
            <v-btn class="ml-4" color="primary" size="x-large"   flat rounded @click="submitCompany()">次へ</v-btn>
          </div>
        </div>

        <div v-if="step === 2">
          <h3 class="font-weight-bold text-h5">編集内容を確認してください</h3>

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

          </v-sheet>

          <div>
            <v-btn class="mr-4" variant="tonal"  size="x-large" rounded @click="step = 1">前へ</v-btn>
            <v-btn class="ml-4" color="primary"  size="x-large"  flat rounded @click="registData()">確認</v-btn>
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
// (ログイン)ユーザ情報を保持
const { userInfo, editUserInfo } = useUserInfo()
const keyCompanyId = userInfo.value.companyId
const companyInfo = await db.getDocument({ path: 'company', docId: keyCompanyId })


const step = ref(1)
const category = ref(companyInfo.category)
const processing = ref(false)

const companyForms = ref([
  {
    title: '会社名',
    key: 'companyName',
    value: companyInfo.companyName,
    required: true,
    icon: 'mdi-office-building-outline',
    placeholder: '',
    cols: 12,
  },
  {
    title: '会社住所',
    key: 'companyAddr',
    value: companyInfo.companyAddr,
    required: false,
    icon: 'mdi-office-building-marker-outline',
    placeholder: '',
    cols: 12,
  },
  {
    title: '電話番号',
    key: 'companyTel',
    value: companyInfo.companyTel,
    required: false,
    icon: 'mdi-phone-outline',
    placeholder: '',
    cols: 6,
  },
  {
    title: 'Emailアドレス',
    key: 'companyEmail',
    value: companyInfo.companyEmail,
    required: false,
    icon: 'mdi-email-outline',
    placeholder: '',
    cols: 6,
  },

  {
    title: 'FAX',
    key: 'companyFax',
    value: companyInfo.companyFax,
    required: false,
    icon: 'mdi-fax',
    placeholder: '',
    cols: 6,
  },
])



/**
 * 入力情報の確認
 */
const submitCompany = async () => {
  for (const f of companyForms.value) f.errorMessage = f.required && !f.value ? '必須入力です' : ''
  if (companyForms.value.some((f) => !!f.errorMessage)) return

  const email = companyForms.value.find((f) => f.key === 'companyEmail')
  if (email.value && !/.+@.+\..+/.test(email.value)) {
    email.errorMessage = '有効なメールアドレスではありません'
  }
  if (companyForms.value.some((f) => !!f.errorMessage)) return

  // メールアドレス存在チェック(emailが変更されている場合) TODO:userテーブルもチェックする必要あり？
  if (companyInfo.companyEmail !== email.value) {
    const company = await db.getQueryDocument({
      path: 'company',
      where: [{ fieldPath: 'companyEmail', opStr: '==', value: email.value }],
      limit: 1,
    })
    if (company) return (email.errorMessage = '既に使用されています')
  }
  // 画面遷移
  step.value = 2
}

/**
 * 入力データをDBに保存
 */
const registData = async () => {
  let confirmRes = false
  await $swal.fire({
    text: '入力した内容で会社情報を更新します。よろしいですか？',
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

  // 会社情報更新
  items.push({
    method: 'update',
    path: 'company',
    docId: keyCompanyId,
    data: {
      companyName: getValue(companyForms, 'companyName'),
      companyAddr: getValue(companyForms, 'companyAddr'),
      companyTel: getValue(companyForms, 'companyTel'),
      companyEmail: getValue(companyForms, 'companyEmail'),
      companyFax: getValue(companyForms, 'companyFax'),
      updatedAt: new Date(),
    },
  })
  await db.writeTransaction(items)

  // 更新した会社情報で(ログイン)ユーザ情報をstateに設定する
  const editUser = {
    id: userInfo.value.id,
    category: userInfo.value.category,
    companyId: userInfo.value.companyId,
    companyName: getValue(companyForms, 'companyName'),
    companyAddr: getValue(companyForms, 'companyAddr'),
    companyTel: getValue(companyForms, 'companyTel'),
    companyEmail: getValue(companyForms, 'companyEmail'),
    companyFax: getValue(companyForms, 'companyFax'),
    businessPermitDate: userInfo.value.businessPermitDate,
    businessPermitNo: userInfo.value.businessPermitNo,
    businessLicenseArea: userInfo.value.businessLicenseArea,
    name: userInfo.value.name,
    email: userInfo.value.email,
    auth: userInfo.value.auth,
    pass: userInfo.value.pass,
  }
  editUserInfo(editUser)


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
