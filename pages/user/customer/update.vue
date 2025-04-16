<template>
  <v-container max-width="1200">
    <v-row no-gutters>
      <v-col>
        <v-breadcrumbs :items="breadcrumbs">
          <template #prepend>
            <v-icon icon="mdi-home" size="small" />
          </template>
          <template #divider>
            <v-icon icon="mdi-chevron-right" />
          </template>
          <template #item="{ item }">
            <v-breadcrumbs-item :disabled="item.disabled" @click="item.click && item.click()">
              {{ item.title }}
            </v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
      </v-col>
    </v-row>
    <v-row class="pb-10" no-gutters>
      <v-col align="center">
        <div>
          <h3 class="font-weight-bold text-h5">お客様情報を編集してください</h3>

          <v-sheet class="py-10 mx-auto text-start" max-width="500" color="transparent">
            <v-form>
              <v-row no-gutters>
                <v-col v-for="form in customerForms" :key="form.key" class="pa-2" :cols="form.cols">
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
            <v-btn class="ml-4" color="primary" size="x-large" flat rounded @click="update">更 新</v-btn>
          </div>
        </div>

      </v-col>
    </v-row>

  </v-container>
</template>
<script setup>
const { $swal } = useNuxtApp()
const { $Const } = useNuxtApp()
const router = useRouter()
const db = useFirestore()

// 共通関数の呼び出し
const utils = useUtils();
// ユーザ操作情報を保持
const { actionInfo } = useAction()
const act = actionInfo.value.act

// 遷移元によるパンくずの表示切替
const breadcrumbs = computed(() => {
  if (act === $Const.USER_ACTION_ORDER) {
    return [
      { title: 'マイページ', disabled: true },
      { title: '案件管理', disabled: true },
      { title: '案件登録', disabled: true },
      { title: '顧客管理', disabled: false, click: () => back() },
      { title: '顧客編集', disabled: true },
    ];
  } else {
    return [
      { title: 'マイページ', disabled: true },
      { title: '顧客管理', disabled: false, click: () => back() },
      { title: '顧客編集', disabled: true },
    ];
  }
});

// 顧客情報の状態管理
const { customerInfo, clearCustomerInfo } = useCustomerInfo()

// 顧客情報の入力状態管理フォーム
const customerForms = ref([
  {
    title: '顧客名',
    key: 'customerName',
    value: customerInfo.value.customerName,
    required: true,
    icon: 'mdi-office-building-outline',
    placeholder: '',
    cols: 12,
  },
  {
    title: '住所',
    key: 'customerAddr',
    value: customerInfo.value.customerAddr,
    required: false,
    icon: 'mdi-office-building-marker-outline',
    placeholder: '',
    cols: 12,
  },
  {
    title: '電話番号',
    key: 'customerTel',
    value: customerInfo.value.customerTel,
    required: false,
    icon: 'mdi-phone-outline',
    placeholder: '',
    cols: 6,
  },
  {
    title: 'FAX',
    key: 'customerFax',
    value: customerInfo.value.customerFax,
    required: false,
    icon: 'mdi-fax',
    placeholder: '',
    cols: 6,
  },
  {
    title: 'Emailアドレス',
    key: 'customerMail',
    value: customerInfo.value.customerMail,
    required: false,
    icon: 'mdi-email-outline',
    placeholder: '',
    cols: 12,
  },
])



/** 前の画面へ戻る */
const back = () => {
  clearCustomerInfo(customerInfo)

  // 画面遷移
  router.push('/user/customer/list')
}

/**
 * 顧客情報を更新する。
 */
const update = async () => {
  for (const f of customerForms.value) f.errorMessage = f.required && !f.value ? '必須入力です' : ''
  if (customerForms.value.some((f) => !!f.errorMessage)) return

  const email = customerForms.value.find((f) => f.key === 'customerMail')
  if (!/.+@.+\..+/.test(email.value)) email.errorMessage = '有効なメールアドレスではありません'
  if (customerForms.value.some((f) => !!f.errorMessage)) return


  let confirmRes = false
  await $swal.fire({
    text: '入力した内容で顧客情報を更新します。よろしいですか？',
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
  const getValue = (forms, key) => utils.toBlank(forms.value.find((f) => f.key === key).value)
  const items = []
  items.push({
    method: 'update',
    path: 'customer',
    docId: customerInfo.value.id,
    data: {
      customerName: getValue(customerForms, 'customerName'),
      customerAddr: getValue(customerForms, 'customerAddr'),
      customerTel: getValue(customerForms, 'customerTel'),
      customerFax: getValue(customerForms, 'customerFax'),
      customerMail: getValue(customerForms, 'customerMail'),
      updatedAt: new Date(),
    },
  })

  await db.writeTransaction(items)

  router.push('/user/customer/list')
}

</script>
