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
        <v-col cols="12" sm="1" md="1">配車場所</v-col>
        <v-col cols="12" sm="8" md="8">
          <!-- <v-text-field v-model="deliveryLocation" label="配車場所" type="text" /> -->
          {{ orderInfo.deliveryLocation }}
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="1" md="1">配車日時</v-col>
        <v-col cols="12" sm="2" md="2">
          {{ orderInfo.dispatchDate }} {{ orderInfo.dispatchTime }}
        </v-col>
      </v-row>
    </v-container>

    <v-divider />
    <!-- TODO:以下 運行情報 については一旦日帰りで実装。数日の旅程の場合はデータの持ち方や表示を検討必要 -->
    <v-container>
      <v-table class="table-border">
        <thead>
          <tr>
            <th width="80%" colspan="2" class="text-center">
              旅程
            </th>
            <th class="text-center">
              宿泊場所
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="dashed-border">
            <td width="10%">{{ orderInfo.dispatchDate }} </td>
            <td width="70%"><v-textarea v-model="itinerary1Top" label="旅程" rows="1" outlined />
            </td>
            <td width="20%"><v-text-field v-model="accommodations1" label="宿泊施設" outlined /></td>
          </tr>
          <tr class="thick-border">
            <td width="10%" align="right">{{ orderInfo.dispatchTime }}発</td>
            <td width="70%"><v-textarea v-model="timeschedule1Top" label="発着予定時刻" rows="1" outlined /></td>
            <td width="20%"><v-text-field v-model="accommodationsTel1" label="電話" outlined /></td>
          </tr>
          <tr class="dashed-border">
            <td width="10%" align="right">日 </td>
            <td width="70%"><v-textarea v-model="itinerary1Bottom" label="旅程" rows="1" outlined />
            </td>
            <td width="20%" rowspan="2"><v-textarea v-model="accommodationsAddr1" label="住所" outlined rows="3" /></td>
          </tr>
          <tr class="thick-border">
            <td width="10%" align="right">発</td>
            <td width="70%"><v-textarea v-model="timeschedule1Bottom" label="発着予定時刻" rows="1" outlined /></td>
          </tr>
        </tbody>
      </v-table>
    </v-container>
    <v-container class="align-center">
      <v-row>
        <v-col cols="12" sm="2" md="2">終着日時</v-col>
        <v-col cols="12" sm="2" md="2" class="ma-2 pa-2">
          <datepicker
v-model="endDate" locale="jp" auto-apply :enable-time-picker="false" format="yyyy/MM/dd"
            model-type="yyyy/MM/dd" />
        </v-col>
        <v-col cols="12" sm="2" md="2">
          <v-text-field v-model="endingTime" label="終着時間" type="text" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="2" md="2">終着場所</v-col>
        <v-col cols="12" sm="8" md="8">
          <v-text-field v-model="terminalLocation" label="終着場所" type="text" />
        </v-col>
      </v-row>
    </v-container>
    <v-divider />


    <v-container>

      <v-row v-if="orderInfo.state == $Const.STATUS_DRAFT">
        <v-col cols="12">
          <v-btn rounded dark color="yellow" class="mb-2 pr-8 pl-8" @click="deliverySerch">
            運送引受会社選択
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-container v-if="orderDeliveryUserInfo.companyId != ''">
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
        <v-col v-if="orderInfo.state == $Const.STATUS_DRAFT" align="center">
          <v-btn rounded dark size="x-large" color="success" class="mb-2 pr-8 pl-8" @click="draft">
            一次保存
          </v-btn>
        </v-col>

        <v-spacer />
        <v-col v-if="orderInfo.state == $Const.STATUS_DRAFT" align="center">
          <v-btn rounded dark size="x-large" color="indigo darken-4" class="mb-2 pr-8 pl-8" @click="confirm">
            申込内容確認
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

// state保持情報 //
// ログインユーザーのキーID
const { userInfo } = useUserInfo()
const keyUserId = userInfo.value.companyId

// 案件基本情報（他画面からの引継ぎ情報）
const { orderInfo, clearOrderInfo } = useOrderInfo()
// 既にDB登録済みの案件の場合のid情報
const keyOrderId = orderInfo.value.id
// const orderState = orderInfo.value.state

// 選択された申込顧客情報（他画面からの引継ぎ情報）
const { applicantCustomerInfo, clearApplicantCustomerInfo } = useApplicantCustomerInfo()
const applicantCustomerId = applicantCustomerInfo.value.id

// 選択された申込運送引受会社情報（他画面からの引継ぎ情報）
const { orderDeliveryUserInfo, editOrderDeliveryUserInfo, clearOrderDeliveryUserInfo } = useOrderDeliveryUserInfo()

// 入力された運行情報(当該画面での入力情報)
const { orderOperationInfo, editOrderOperationInfo, clearOrderOperationInfo } = useOrderOperationInfo()

//-----------------------------//

// 画面入力項目定義 TODO:旅程の行数は一旦２行で決め打ち固定
const itinerary1Top = ref(orderOperationInfo.value.itinerary1Top)
const itinerary1Bottom = ref(orderOperationInfo.value.itinerary1Bottom)
const timeschedule1Top = ref(orderOperationInfo.value.timeschedule1Top)
const timeschedule1Bottom = ref(orderOperationInfo.value.timeschedule1Bottom)
const accommodations1 = ref(orderOperationInfo.value.accommodations1)
const accommodationsTel1 = ref(orderOperationInfo.value.accommodationsTel1)
const accommodationsAddr1 = ref(orderOperationInfo.value.accommodationsAddr1)
const endDate = ref(orderOperationInfo.value.endDate)
const endingTime = ref(orderOperationInfo.value.endingTime)
const terminalLocation = ref(orderOperationInfo.value.terminalLocation)

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
  const deliveryUserInfoObject = {
    id: orderDeliveryUserInfo.value.id,
    companyId: orderDeliveryUserInfo.value.companyId,
    companyName: orderDeliveryUserInfo.value.companyName,
    companyAddr: orderDeliveryUserInfo.value.companyAddr,
    companyTel: orderDeliveryUserInfo.value.companyTel,
    companyFax: orderDeliveryUserInfo.value.companyFax,
    companyEmail: orderDeliveryUserInfo.value.companyEmail,
  }
  editOrderDeliveryUserInfo(deliveryUserInfoObject)

  const object = {
    itinerary1Top: itinerary1Top.value,
    itinerary1Bottom: itinerary1Bottom.value,
    timeschedule1Top: timeschedule1Top.value,
    timeschedule1Bottom: timeschedule1Bottom.value,
    accommodations1: accommodations1.value,
    accommodationsTel1: accommodationsTel1.value,
    accommodationsAddr1: accommodationsAddr1.value,
    endDate: endDate.value,
    endingTime: endingTime.value,
    terminalLocation: terminalLocation.value,
  }
  editOrderOperationInfo(object)

  // 画面遷移
  router.push('/delivery/list')

}

/** 運送引受会社への依頼内容の最終確認をする */
const confirm = async () => {
  // 必須入力チェック
  if (utils.toBlank(endDate.value) == '') {
    $swal.fire({
      text: '終着日を入力してください。',
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning'
    })
    return
  }
  if (utils.toBlank(endingTime.value) == '') {
    $swal.fire({
      text: '終着時間を入力してください。',
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning'
    })
    return
  }
  if (utils.toBlank(terminalLocation.value) == '') {
    $swal.fire({
      text: '終着場所を入力してください。',
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning'
    })
    return
  }



  if (utils.toBlank(orderDeliveryUserInfo.value.companyId) == '') {
    $swal.fire({
      text: '運送引受会社を指定してください。',
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning'
    })
    return
  }

  // stateへ保存
  // 当該画面操作で設定された運送引受会社情報
  const deliveryUserInfoObject = {
    id: orderDeliveryUserInfo.value.id,
    companyId: orderDeliveryUserInfo.value.companyId,
    companyName: orderDeliveryUserInfo.value.companyName,
    companyAddr: orderDeliveryUserInfo.value.companyAddr,
    companyTel: orderDeliveryUserInfo.value.companyTel,
    companyFax: orderDeliveryUserInfo.value.companyFax,
    companyEmail: orderDeliveryUserInfo.value.companyEmail,

  }
  editOrderDeliveryUserInfo(deliveryUserInfoObject)

  // 当該画面入力で設定された運送情報
  const object = {
    itinerary1Top: itinerary1Top.value,
    itinerary1Bottom: itinerary1Bottom.value,
    timeschedule1Top: timeschedule1Top.value,
    timeschedule1Bottom: timeschedule1Bottom.value,
    accommodations1: accommodations1.value,
    accommodationsTel1: accommodationsTel1.value,
    accommodationsAddr1: accommodationsAddr1.value,
    endDate: endDate.value,
    endingTime: endingTime.value,
    terminalLocation: terminalLocation.value,
  }
  editOrderOperationInfo(object)

  router.push('/user/order/entryConfirm')



}

/** 登録した案件情報を保存して終了 */
const draft = async () => {
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
    const updateObject = {
      id: keyOrderId,
      state: $Const.STATUS_DRAFT,
      companyId: keyUserId,
      applicant: orderInfo.value.applicant,
      emergencyContact: orderInfo.value.emergencyContact,
      tourOrganization: orderInfo.value.tourOrganization,
      remarks: orderInfo.value.remarks,
      passengers: utils.toZero(orderInfo.value.passengers),
      vehicleTypeLiftAmount: utils.toZero(orderInfo.value.vehicleTypeLiftAmount),
      vehicleTypeMediumAmount: utils.toZero(orderInfo.value.vehicleTypeMediumAmount),
      vehicleTypeSmallAmount: utils.toZero(orderInfo.value.vehicleTypeSmallAmount),
      vehicleTypeMicroAmount: utils.toZero(orderInfo.value.vehicleTypeMicroAmount),
      dispatchDate: orderInfo.value.dispatchDate,
      dispatchTime: orderInfo.value.dispatchTime,
      departureTime: orderInfo.value.departureTime,
      deliveryLocation: orderInfo.value.deliveryLocation,
      itinerary1Top: utils.toBlank(itinerary1Top.value),
      itinerary1Bottom: utils.toBlank(itinerary1Bottom.value),
      timeschedule1Top: utils.toBlank(timeschedule1Top.value),
      timeschedule1Bottom: utils.toBlank(timeschedule1Bottom.value),
      accommodations1: utils.toBlank(accommodations1.value),
      accommodationsTel1: utils.toBlank(accommodationsTel1.value),
      accommodationsAddr1: utils.toBlank(accommodationsAddr1.value),
      endDate: utils.toBlank(endDate.value),
      endingTime: utils.toBlank(endingTime.value),
      terminalLocation: utils.toBlank(terminalLocation.value),
      deliveryCompanyId: utils.toBlank(orderDeliveryUserInfo.value.id),
      customerId: utils.toBlank(applicantCustomerId),
      updatedAt: new Date(),
    }
    await userData.updateOrder(updateObject)

  } else {
    // 新規登録
    const insertObject = {
      // 案件登録中：1
      state: $Const.STATUS_DRAFT,
      companyId: keyUserId,
      applicant: orderInfo.value.applicant,
      emergencyContact: orderInfo.value.emergencyContact,
      tourOrganization: orderInfo.value.tourOrganization,
      remarks: orderInfo.value.remarks,
      passengers: utils.toZero(orderInfo.value.passengers),
      vehicleTypeLiftAmount: utils.toZero(orderInfo.value.vehicleTypeLiftAmount),
      vehicleTypeMediumAmount: utils.toZero(orderInfo.value.vehicleTypeMediumAmount),
      vehicleTypeSmallAmount: utils.toZero(orderInfo.value.vehicleTypeSmallAmount),
      vehicleTypeMicroAmount: utils.toZero(orderInfo.value.vehicleTypeMicroAmount),
      dispatchDate: orderInfo.value.dispatchDate,
      dispatchTime: orderInfo.value.dispatchTime,
      departureTime: orderInfo.value.departureTime,
      deliveryLocation: orderInfo.value.deliveryLocation,
      itinerary1Top: utils.toBlank(itinerary1Top.value),
      itinerary1Bottom: utils.toBlank(itinerary1Bottom.value),
      timeschedule1Top: utils.toBlank(timeschedule1Top.value),
      timeschedule1Bottom: utils.toBlank(timeschedule1Bottom.value),
      accommodations1: utils.toBlank(accommodations1.value),
      accommodationsTel1: utils.toBlank(accommodationsTel1.value),
      accommodationsAddr1: utils.toBlank(accommodationsAddr1.value),
      endDate: utils.toBlank(endDate.value),
      endingTime: utils.toBlank(endingTime.value),
      terminalLocation: utils.toBlank(terminalLocation.value),
      deliveryCompanyId: utils.toBlank(orderDeliveryUserInfo.value.id),
      customerId: utils.toBlank(applicantCustomerId),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    await userData.addOrder(insertObject)
  }

  // stateのクリア
  clearOrderInfo(orderInfo)
  clearApplicantCustomerInfo(applicantCustomerInfo)
  clearOrderDeliveryUserInfo(orderDeliveryUserInfo)
  clearOrderOperationInfo(orderOperationInfo)

  // 画面遷移
  router.push('/user/order/list')

}
/** 前の画面へ戻る */
const back = () => {
  // 入力情報を保持
  // stateへ保存
  const deliveryUserInfoObject = {
    id: orderDeliveryUserInfo.value.id,
    companyId: orderDeliveryUserInfo.value.companyId,
    companyName: orderDeliveryUserInfo.value.companyName,
    companyAddr: orderDeliveryUserInfo.value.companyAddr,
    companyTel: orderDeliveryUserInfo.value.companyTel,
    companyFax: orderDeliveryUserInfo.value.companyFax,
    companyEmail: orderDeliveryUserInfo.value.companyEmail,

  }
  editOrderDeliveryUserInfo(deliveryUserInfoObject)

  const object = {
    itinerary1Top: itinerary1Top.value,
    itinerary1Bottom: itinerary1Bottom.value,
    timeschedule1Top: timeschedule1Top.value,
    timeschedule1Bottom: timeschedule1Bottom.value,
    accommodations1: accommodations1.value,
    accommodationsTel1: accommodationsTel1.value,
    accommodationsAddr1: accommodationsAddr1.value,
    endDate: endDate.value,
    endingTime: endingTime.value,
    terminalLocation: terminalLocation.value,
  }
  editOrderOperationInfo(object)



  // 画面遷移
  router.push('/user/order/entryBaseInfo')
}

definePageMeta({
  layout: 'user'
})
</script>
<style>
/* 点線を適用 */
.dashed-border {
  border-bottom: 2px dashed red !important;
}

/* 太線を適用 */
.thick-border {
  border-bottom: 4px solid blue !important;
}

th,
td {
  border: 1px solid #ccc;
}
</style>
