<template>
  <v-container max-width="1200">
    <v-row no-gutters>
      <v-col>
        <v-breadcrumbs
:items="[
          { title: 'マイページ', disabled: true },
          { title: '駐車地管理', disabled: false, to: '/delivery/parking/list' },
          { title: '駐車地登録', disabled: true },
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
        <div>
          <h3 class="font-weight-bold text-h5">駐車地情報を入力してください</h3>

          <v-sheet class="py-10 mx-auto text-start" max-width="500" color="transparent">
            <v-form>
              <v-row no-gutters>
                <v-col v-for="form in parkingForms" :key="form.key" class="pa-2" :cols="form.cols">
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
            <v-btn class="ml-4" color="primary" flat rounded @click="entry">登 録</v-btn>
          </div>
        </div>

      </v-col>
    </v-row>


  </v-container>
</template>
<script setup>
const { $swal } = useNuxtApp()
const router = useRouter()
const db = useFirestore()

// 共通関数の呼び出し
const utils = useUtils();
// user情報の状態管理
const { userInfo } = useUserInfo()
const keyUserId = userInfo.value.companyId

//画面入力項目
// 駐車地情報の入力状態管理フォーム
const parkingForms = ref([
  {
    title: '駐車地名',
    key: 'parking',
    value: '',
    required: true,
    icon: 'mdi-office-building-outline',
    placeholder: '',
    cols: 12,
  },
  {
    title: '駐車地住所',
    key: 'parkingAddr',
    value: '',
    required: true,
    icon: 'mdi-office-building-marker-outline',
    placeholder: '',
    cols: 12,
  },
  {
    title: '備考',
    key: 'remarks',
    value: '',
    required: false,
    icon: 'mdi-note-outline',
    placeholder: '',
    cols: 12,
  },
])

/**
 * 駐車地を登録する
 */
const entry = async () => {
  for (const f of parkingForms.value) f.errorMessage = f.required && !f.value ? '必須入力です' : ''
  if (parkingForms.value.some((f) => !!f.errorMessage)) return

  let confirmRes = false
  await $swal.fire({
    text: '入力した内容で駐車地情報を登録します。よろしいですか？',
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

  const parkingDocId = db.createDocId('parking')
  items.push({
    method: 'set',
    path: 'parking',
    docId: parkingDocId,
    data: {
      companyId: keyUserId,
      parking: getValue(parkingForms, 'parking'),
      parkingAddr: getValue(parkingForms, 'parkingAddr'),
      remarks: getValue(parkingForms, 'remarks'),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })

  await db.writeTransaction(items)


  router.push('/delivery/parking/list')
}

</script>
