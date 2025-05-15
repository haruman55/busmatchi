<template>
  <v-container max-width="1200">
    <v-row no-gutters>
      <v-col>
        <v-breadcrumbs
:items="[
          { title: 'マイページ', disabled: false, click: () => back() },
          { title: 'プロフィール', disabled: true },
        ]">
          <template #prepend>
            <v-icon icon="mdi-home" size="small" />
          </template>
          <template #divider>
            <v-icon icon="mdi-chevron-right" />
          </template>
          <template #item="{ item }">
            <v-breadcrumbs-item
:disabled="item.disabled" :class="{
              'breadcrumb-link': !item.disabled,
            }" @click="item.click && item.click()">
              {{ item.title }}
            </v-breadcrumbs-item>
          </template>

        </v-breadcrumbs>
      </v-col>
    </v-row>

    <v-row class="pb-10" no-gutters>
      <v-col align="center">
        <div v-if="step === 1">
          <h3 class="font-weight-bold text-h5">プロフィール</h3>

          <v-sheet class="py-10 mx-auto text-start" max-width="500" color="transparent">
            <v-form>
              <v-row no-gutters>
                <v-col class="pa-2" :cols="12">
                  <div class="py-2 d-flex justify-space-between">
                    <span>氏名</span>
                    <span>{{ userInfo.name }}</span>
                  </div>
                </v-col>

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
                <v-col class="pa-2" :cols="12">
                  <v-divider class="mb-2 border-opacity-100" />
                  <p class="mt-10 mb-2 font-weight-bold">会社情報</p>
                  <div v-for="form in companyForms" :key="form.key" class="py-2 d-flex justify-space-between">
                    <span>{{ form.title }}</span>
                    <span>{{ form.value }}</span>
                  </div>
                </v-col>

              </v-row>
            </v-form>
          </v-sheet>

          <div>
            <v-btn class="mr-4" color="secondary" size="large" flat rounded @click="back()">キャンセル</v-btn>
            <v-btn
class="ml-4" color="primary" size="x-large" :disabled="!isSaveButtonEnabled" flat rounded
              @click="registData()">保存</v-btn>
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
// user情報の状態管理
const { userInfo, editUserInfo } = useUserInfo()

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
    title: 'Emailアドレス',
    key: 'email',
    value: userInfo.value.email,
    required: true,
    icon: 'mdi-email-outline',
    placeholder: '',
    cols: 12,
  },
])
// 初期値を保持
const initialUserForms = ref(
  userForms.value.map((form) => ({ key: form.key, value: form.value }))
)


// 保存ボタンの活性化状態を判定
const isSaveButtonEnabled = computed(() => {
  return userForms.value.some((form) => {
    const initialForm = initialUserForms.value.find((f) => f.key === form.key)
    return initialForm && initialForm.value !== form.value // 初期値と異なる場合にtrue
  })
})


/**
 * 入力データをDBに保存
 */
const registData = async () => {
  for (const f of userForms.value) f.errorMessage = f.required && !f.value ? '必須入力です' : ''
  if (userForms.value.some((f) => !!f.errorMessage)) return

  const email = userForms.value.find((f) => f.key === 'email')
  if (!/.+@.+\..+/.test(email.value)) email.errorMessage = '有効なメールアドレスではありません'
  if (userForms.value.some((f) => !!f.errorMessage)) return


  // ユーザ情報存在チェック(emailが変更されている場合)
  if (userInfo.value.email !== email.value) {
    const user = await db.getQueryDocument({
      path: 'user',
      where: [{ fieldPath: 'email', opStr: '==', value: email.value }],
      limit: 1,
    })
    if (user) return (email.errorMessage = '既に使用されています')
  }

  let confirmRes = false
  await $swal.fire({
    text: '入力した内容でプロフィールを更新します。よろしいですか？',
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

  // ユーザ情報更新
  items.push({
    method: 'update',
    path: 'user',
    docId: userInfo.value.id,
    data: {
      email: getValue(userForms, 'email'),
      updatedAt: new Date(),
    },
  })
  await db.writeTransaction(items)

  // 更新した情報で(ログイン)ユーザ情報をstateに設定する
  const editUser = {
    id: userInfo.value.id,
    category: userInfo.value.category,
    companyId: userInfo.value.companyId,
    companyName: userInfo.value.companyName,
    companyAddr: userInfo.value.companyAddr,
    companyTel: userInfo.value.companyTel,
    companyEmail: userInfo.value.companyEmail,
    companyFax: userInfo.value.companyFax,
    businessPermitDate: userInfo.value.businessPermitDate,
    businessPermitNo: userInfo.value.businessPermitNo,
    businessLicenseArea: userInfo.value.businessLicenseArea,
    name: userInfo.value.name,
    email: getValue(userForms, 'email'),
    auth: userInfo.value.auth,
    pass: userInfo.value.pass,
  }
  editUserInfo(editUser)

  processing.value = false

  await $swal.fire({
    text: 'プロフィールを更新しました。',
    confirmButtonColor: "#00BCD4",
    confirmButtonText: 'OK',
    icon: 'success'
  })



}

/** 前の画面へ戻る */
const back = () => {
  if (category.value === $Const.CATEGORY_APPLICANT) {
    router.push('/user/mypage') // 申込会社のmypage
  } else {
    router.push('/delivery/mypage') // それ以外(運送引受会社)のmypage
  }
}

</script>



<style scoped>
:deep(.v-stepper-header) {
  box-shadow: none;
}
</style>
