<template>
  <div>
    <v-container class="fill-height align-center" fluid>
      <v-row no-gutters>
        <v-col>
          <v-card-text class="font-weight-bold text-h5">
            <v-icon left x-large @click="back">
              mdi-close
            </v-icon>
            案件登録-運送引受会社選定
          </v-card-text>
        </v-col>
      </v-row>
    </v-container>
    <v-container>

      <v-row>
        <v-col cols="12" sm="2" md="2">
          <v-card-title>配車場所</v-card-title>
        </v-col>
        <v-col cols="12" sm="8" md="8">
          <v-text-field v-model="deliveryLocation" label="配車場所" type="text" />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="2" md="2">
          <v-card-title>配車日時</v-card-title>
        </v-col>
        <v-col cols="12" sm="4" md="4" class="ma-2 pa-2">
          <datepicker
v-model="dispatchDate" locale="jp" auto-apply :enable-time-picker="false" format="yyyy/MM/dd"
            model-type="yyyy/MM/dd" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="2" md="2" />
        <v-col cols="12" sm="2" md="2">
          <v-text-field v-model="dispatchTime" label="配車時間" type="text" />
        </v-col>
        <v-col cols="12" sm="2" md="2">
          <v-text-field v-model="departureTime" label="出発時間" type="text" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6" md="6">
          <v-card-title>運送引受会社</v-card-title>
          <v-col cols="12">
            <v-btn rounded dark color="yellow" class="mb-2 pr-8 pl-8" @click="deliverySerch">
              運送引受会社選択
            </v-btn>
          </v-col>

        </v-col>
      </v-row>
    </v-container>

    <v-container v-if="orderDeliveryUserInfo.companyId != ''">
      <v-row>
        <v-col cols="12" sm="12" md="12">
          <v-card-title>運送引受会社情報</v-card-title>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="12" md="12">

          <v-card color="white" class="mx-auto" elevation="15">
            <v-card-item class="text-center text-h4">
              {{ orderDeliveryUserInfo.companyName }}
            </v-card-item>
            <v-card-item class="text-left text-h6" prepend-icon="mdi-map-marker-outline">
              {{ orderDeliveryUserInfo.companyAddr }}
            </v-card-item>
            <v-card-item class="text-left text-h6">
              <v-icon>mdi-phone-outline</v-icon>{{ orderDeliveryUserInfo.companyTel }}
              <v-icon>mdi-fax</v-icon> {{ orderDeliveryUserInfo.companyFax }}
            </v-card-item>
            <v-card-item class="text-left text-h6">
              <v-icon>mdi-email-outline</v-icon>{{ orderDeliveryUserInfo.companyEmail }}
            </v-card-item>
          </v-card>
        </v-col>
      </v-row>
      <hr>
    </v-container>
    <br>

    <v-container class="align-center" fluid>
      <v-row justify="center" no-gutters>
        <v-col align="center">
          <v-btn rounded dark size="x-large" color="grey" class="mb-2 pr-8 pl-8" @click="back">
            戻 る
          </v-btn>
        </v-col>
        <v-spacer />

        <v-col align="center">
          <v-btn rounded dark size="x-large" color="success" class="mb-2 pr-8 pl-8" @click="draft">
            一次保存
          </v-btn>
        </v-col>
        <v-col align="center">
          <v-btn rounded dark size="x-large" color="indigo darken-4" class="mb-2 pr-8 pl-8" @click="add">
            運送申込書を作成する
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
// DB接続の呼び出し
const userData = useUserData();


// ログインユーザーのキーID
const { userInfo } = useUserInfo()
const keyUserId = userInfo.value.companyId

const { orderInfo, clearOrderInfo } = useOrderInfo()
// 既にDB登録済みの案件の場合のid情報
const keyOrderId = orderInfo.value.id
console.log('保存前：keyOrderId=' + keyOrderId)
const orderState = orderInfo.value.state

// 選択された申込顧客情報を保持
const { applicantCustomerInfo, clearApplicantCustomerInfo } = useApplicantCustomerInfo()


// 画面入力(設定)された申込運送引受会社情報を保持
const { orderDeliveryUserInfo, editOrderDeliveryUserInfo, clearOrderDeliveryUserInfo } = useOrderDeliveryUserInfo()
console.log("orderDeliveryUserInfo")

console.log(orderDeliveryUserInfo)

const deliveryChoice = ref(orderDeliveryUserInfo.value.deliveryChoice)
const dispatchDate = ref(orderDeliveryUserInfo.value.dispatchDate)
const dispatchTime = ref(orderDeliveryUserInfo.value.dispatchTime)
const departureTime = ref(orderDeliveryUserInfo.value.departureTime)
const deliveryLocation = ref(orderDeliveryUserInfo.value.deliveryLocation)

/**
 * 画面初期処理
 */
onMounted(async () => {
  // TODO:運送引受会社が選択済みの場合の情報取得:運送引受会社の情報をDBから取得する
  // const selectDeliveryUser = orderDeliveryUserInfo.value.companyId
  // if (selectDeliveryUser != null && utils.toBlank(selectDeliveryUser) != '') {
  // }
})


/**
 * 運送引受会社選択画面表示
 */
const deliverySerch = () => {
  // 入力情報を保持
  // stateへ保存
  const object = {
    id: orderDeliveryUserInfo.value.id,
    companyId: orderDeliveryUserInfo.value.companyId,
    companyName: orderDeliveryUserInfo.value.companyName,
    companyAddr: orderDeliveryUserInfo.value.companyAddr,
    companyTel: orderDeliveryUserInfo.value.companyTel,
    companyFax: orderDeliveryUserInfo.value.companyFax,
    companyEmail: orderDeliveryUserInfo.value.companyEmail,
    dispatchDate: dispatchDate.value,
    dispatchTime: dispatchTime.value,
    departureTime: departureTime.value,
    deliveryChoice: deliveryChoice.value,
    deliveryLocation: deliveryLocation.value,

  }
  editOrderDeliveryUserInfo(object)

  // 画面遷移
  router.push('/delivery/list')

}


/** 追加ボタン処理 */
const add = async () => {
  // 必須選択チェック

  router.push('/user/skill/list')
}
/** 登録した案件情報を保存して終了 */
const draft = async () => {
  // 案件情報を保存
  // 案件情報を保存
  let confirmRes = false
  await $swal.fire({
    text: '登録した内容を保存します。よろしいですか？',
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

  // 新規登録 or 更新処理
  if (keyOrderId != null && keyOrderId != '') {
    // 更新
    const updateOrderInfo = {
      id: keyOrderId,
      state: orderState,
      companyId: keyUserId,
      applicant: orderInfo.value.applicant,
      emergencyContact: orderInfo.value.emergencyContact,
      tourOrganization: orderInfo.value.tourOrganization,
      remarks: orderInfo.value.remarks,
      customerId: orderInfo.value.customerId,
      dispatchDate: utils.toBlank(dispatchDate.value),
      dispatchTime: utils.toBlank(dispatchTime.value),
      departureTime: utils.toBlank(departureTime.value),
      deliveryLocation: utils.toBlank(deliveryLocation.value),
      deliveryCompanyId: utils.toBlank(orderDeliveryUserInfo.value.id),
      updatedAt: new Date(),
    }
    await userData.updateOrder(updateOrderInfo)

  } else {
    // 新規登録
    const insertorderInfo = {
      // 案件登録中：1
      state: $Const.STATUS_DRAFT,
      companyId: keyUserId,
      applicant: orderInfo.value.applicant,
      emergencyContact: orderInfo.value.emergencyContact,
      tourOrganization: orderInfo.value.tourOrganization,
      remarks: orderInfo.value.remarks,
      customerId: orderInfo.value.customerId,
      dispatchDate: utils.toBlank(dispatchDate.value),
      dispatchTime: utils.toBlank(dispatchTime.value),
      departureTime: utils.toBlank(departureTime.value),
      deliveryLocation: utils.toBlank(deliveryLocation.value),
      deliveryCompanyId: utils.toBlank(orderDeliveryUserInfo.value.id),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    // console.log(orderInfo)
    await userData.addOrder(insertorderInfo)
  }

  // stateのクリア
  clearOrderInfo(orderInfo)
  clearApplicantCustomerInfo(applicantCustomerInfo)
  clearOrderDeliveryUserInfo(orderDeliveryUserInfo)


  // 画面遷移
  router.push('/user/order/list')

}
/** 前の画面へ戻る */
const back = () => {
  // 入力情報を保持
  // stateへ保存
  const object = {
    id: orderDeliveryUserInfo.value.id,
    companyId: orderDeliveryUserInfo.value.companyId,
    companyName: orderDeliveryUserInfo.value.companyName,
    companyAddr: orderDeliveryUserInfo.value.companyAddr,
    companyTel: orderDeliveryUserInfo.value.companyTel,
    companyFax: orderDeliveryUserInfo.value.companyFax,
    companyEmail: orderDeliveryUserInfo.value.companyEmail,
    dispatchDate: dispatchDate.value,
    dispatchTime: dispatchTime.value,
    departureTime: departureTime.value,
    deliveryChoice: deliveryChoice.value,
    deliveryLocation: deliveryLocation.value,

  }
  editOrderDeliveryUserInfo(object)

  // 画面遷移
  router.push('/user/order/entryCustomerInfo')
}

definePageMeta({
  layout: 'user'
})
</script>
