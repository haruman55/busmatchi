<template>
  <v-container max-width="1200">
    <v-row no-gutters>
      <v-col>
        <v-breadcrumbs
:items="[
          { title: 'マイページ', disabled: true },
          { title: 'バス管理', disabled: false, to: '/delivery/bus/list' },
          { title: 'バス登録', disabled: true },
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
          <h3 class="font-weight-bold text-h5">バス情報を入力してください</h3>

          <v-sheet class="py-10 mx-auto text-start" max-width="500" color="transparent">
            <v-form>
              <v-row no-gutters>
                <v-col v-for="form in busForms" :key="form.key" class="pa-2" :cols="form.cols">
                  <p>
                    <span class="text-body-2">{{ form.title }}</span>
                    <v-chip v-if="form.required" class="ml-2 mb-1" variant="flat" size="x-small" label color="warning">
                      必須
                    </v-chip>
                  </p>
                  <!-- v-text-fieldを表示 -->
                  <v-text-field
v-if="form.type !== 'select'" v-model="form.value" :prepend-inner-icon="form.icon"
                    :placeholder="form.placeholder" :label="form.title" :hint="form.hint" persistent-hint
                    :error-messages="form.errorMessage" density="comfortable" />
                  <!-- v-selectを表示 -->
                  <v-select
v-else v-model="form.value" :prepend-inner-icon="form.icon" :placeholder="form.placeholder"
                    :label="form.title" :items="$Const.VEHICLE_TYPE" item-title="disp" item-value="code"
                    :hint="form.hint" persistent-hint :error-messages="form.errorMessage" density="comfortable" />
                </v-col>
              </v-row>
            </v-form>
          </v-sheet>
        </div>
      </v-col>

    </v-row>


    <v-row dense>
      <v-col>
        <v-card>
          <v-row justify="center" no-gutters>
            <v-col>
              <v-data-table :headers="parkingListHeaders" :items="parkigList" class="text-pre-wrap bg-background">
                <template #[`item.checkItem`]="{ item }">
                  <v-radio-group v-model="selectPaking" inline class="mt-4 ">
                    <v-radio :value="item.id" @click="setParking(item)" />
                  </v-radio-group>
                </template>
              </v-data-table>

            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <br>

    <v-row justify="center" no-gutters>
      <v-col align="center">
        <div>
          <v-btn class="ml-4" color="primary" flat rounded @click="entry">登 録</v-btn>
        </div>

      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
const { $Const } = useNuxtApp();
const { $swal } = useNuxtApp()
const router = useRouter()
const db = useFirestore()

const userData = useUserData();
// 共通関数の呼び出し
const utils = useUtils();
// user情報の状態管理
const { userInfo } = useUserInfo()
const keyUserId = userInfo.value.companyId

// バス情報の入力状態管理フォーム
const busForms = ref([
  {
    title: '車両ナンバー',
    key: 'vehicleNo',
    value: '',
    required: true,
    icon: 'mdi-office-building-outline',
    placeholder: '',
    type: 'text',
    cols: 12,
  },
  {
    title: '車両タイプ',
    key: 'vehicleType',
    value: '',
    required: true,
    icon: 'mdi-office-building-marker-outline',
    placeholder: '',
    type: 'select',
    cols: 12,
  },
  {
    title: '備考',
    key: 'remarks',
    value: '',
    required: false,
    icon: 'mdi-note-outline',
    placeholder: '',
    type: 'text',
    cols: 12,
  },
])



// 選択用の駐車場情報
const parkigList = await userData.getParkingList(keyUserId)
const selectPaking = ref('')
// 駐車地のデータテーブルヘッダ定義
const parkingListHeaders = [
  {
    title: '',
    key: 'checkItem',
    sortable: false
  },
  {
    title: '駐車地',
    key: 'parking',
    sortable: true
  },
  {
    title: '駐車地住所',
    key: 'parkingAddr',
    sortable: true
  },
  {
    title: '備考',
    key: 'remarks',
    sortable: false
  },

]

const setParking = (item) => {
  selectPaking.value = item.id

}

/**
 * バス情報を登録する
 */
const entry = async () => {
  for (const f of busForms.value) f.errorMessage = f.required && !f.value ? '必須入力です' : ''
  if (busForms.value.some((f) => !!f.errorMessage)) return

  if (selectPaking.value === '') {
    $swal.fire({
      html: '駐車地が選択されていません。選択してください。<br>選択肢がない場合はマイページから駐車地を登録してください。',
      confirmButtonColor: "#00BCD4",
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning'
    })
    return
  }

  let confirmRes = false
  await $swal.fire({
    text: '入力した内容でバス情報を登録します。よろしいですか？',
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

  const busDocId = db.createDocId('bus')
  items.push({
    method: 'set',
    path: 'bus',
    docId: busDocId,
    data: {
      companyId: keyUserId,
      vehicleNo: getValue(busForms, 'vehicleNo'),
      vehicleType: getValue(busForms, 'vehicleType'),
      remarks: getValue(busForms, 'remarks'),
    // バスが配置されている駐車場のdocid
    parkingId: selectPaking.value,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })

  await db.writeTransaction(items)
  router.push('/delivery/bus/list')
}

</script>
