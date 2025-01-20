<template>
  <div>
    <v-container class="fill-height align-center" fluid>
      <v-row no-gutters>
        <v-col>
          <v-card-text class="font-weight-bold text-h5">
            <v-icon left x-large @click="back">
              mdi-close
            </v-icon>
            案件登録-申込基本情報
          </v-card-text>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row>
        <v-col cols="12" sm="6" md="6">
          <v-text-field v-model="applicant" label="申込担当者名" outlined />

        </v-col>
        <v-col align="center" cols="12" sm="6" md="6">
          <v-text-field v-model="emergencyContact" label="緊急連絡先" outlined />
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row>
        <v-col cols="12" sm="3" md="3">
          <v-btn rounded dark color="yellow" class="mb-2 pr-8 pl-8" @click="customerSerch">
            顧客選択
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row>
        <v-col v-if="applicantCustomerId != '' && applicantCustomerId != null" cols="12" sm="6" md="6">
          <v-card color="white" class="mx-auto" elevation="15">
            <v-card-item class="text-center text-h4">
              {{ applicantCustomerInfo.customerName }}
            </v-card-item>
            <v-card-item class="text-left text-h6" prepend-icon="mdi-map-marker-outline">
              {{ applicantCustomerInfo.customerAddr }}
            </v-card-item>
            <v-card-item class="text-left text-h6">
              <v-icon>mdi-phone-outline</v-icon>{{ applicantCustomerInfo.customerTel }}
              <v-icon>mdi-fax</v-icon> {{ applicantCustomerInfo.customerFax }}
            </v-card-item>
            <v-card-item class="text-left text-h6">
              <v-icon>mdi-email-outline</v-icon>{{ applicantCustomerInfo.customerMail }}
            </v-card-item>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-text-field v-model="tourOrganization" label="団体名" outlined />
          <v-textarea v-model="remarks" label="備考" rows="2" outlined />
        </v-col>

      </v-row>
    </v-container>
    <v-divider />
    <br>
    <v-container class="align-center">
      <v-row dense>
        <v-col cols="12" sm="2" md="2">申込乗車人員</v-col>
        <v-col cols="12" sm="2" md="2"><v-text-field
v-model.number="passengers" label="申込乗車人数" type="number" outlined
            min="0" step="1" /></v-col>
      </v-row>
      <v-row justify="center" dense>
        <v-col cols="12" sm="2" md="2">乗車定員別又は<br>車種別車両数</v-col>
        <v-col><v-text-field
v-model.number="vehicleTypeLiftAmount" label="リフト-車両数" type="number" outlined min="0"
            step="1" suffix="両" /></v-col>
        <v-col><v-text-field
v-model.number="vehicleTypeMediumAmount" label="中型車-車両数" type="number" outlined min="0"
            step="1" suffix="両" /></v-col>
        <v-col><v-text-field
v-model.number="vehicleTypeSmallAmount" label="小型車-車両数" type="number" outlined min="0"
            step="1" suffix="両" /></v-col>
        <v-col><v-text-field
v-model.number="vehicleTypeMicroAmount" label="マイクロ-車両数" type="number" outlined min="0"
            step="1" suffix="両" /></v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12" sm="2" md="2">車両合計</v-col><v-col cols="12" sm="2" md="2">{{ totalvehicleAmount }}両</v-col>
      </v-row>
    </v-container>
    <v-divider />
    <br>

    <v-container class="align-center">
      <v-row>
        <v-col cols="12" sm="2" md="2">配車日時
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
        <v-col cols="12" sm="2" md="2">配車場所</v-col>
        <v-col cols="12" sm="8" md="8">
          <v-text-field v-model="deliveryLocation" label="配車場所" type="text" />
        </v-col>
      </v-row>

    </v-container>
    <v-divider />
    <br>

    <v-container class="align-center" fluid>
      <v-row justify="center" no-gutters>
        <v-col align="center">
          <v-btn rounded dark size="x-large" color="grey" class="mb-2 pr-8 pl-8" @click="back">
            戻 る
          </v-btn>
        </v-col>

        <v-col v-if="orderState == $Const.STATUS_DRAFT || orderState == ''" align="center">
          <v-btn rounded dark size="x-large" color="green" class="mb-2 pr-8 pl-8" @click="draft">
            一次保存
          </v-btn>
        </v-col>
        <v-spacer />

        <v-col align="center">
          <v-btn rounded dark size="x-large" color="indigo darken-4" class="mb-2 pr-8 pl-8" @click="entryForm">
            次 へ
          </v-btn>
        </v-col>

      </v-row>
    </v-container>
  </div>
</template>
<script setup>
const { $Const } = useNuxtApp()
const { $swal } = useNuxtApp()
const router = useRouter()
// DB接続の呼び出し
const userData = useUserData();
// 共通関数の呼び出し
const utils = useUtils();

// ログインユーザーのキーID
const { userInfo } = useUserInfo()
const keyUserId = userInfo.value.companyId

// 画面入力(設定)された申込情報を保持
const { orderInfo, editOrderInfo, clearOrderInfo } = useOrderInfo()
// 既にDB登録済みの案件の場合のid情報
const keyOrderId = orderInfo.value.id
const orderState = utils.toBlank(orderInfo.value.state)

// 選択された申込顧客情報（他画面からの引継ぎ情報）
const { applicantCustomerInfo, clearApplicantCustomerInfo } = useApplicantCustomerInfo()
const applicantCustomerId = applicantCustomerInfo.value.id
console.log('applicantCustomerId:'+applicantCustomerId)

// 選択された申込運送引受会社情報（他画面からの引継ぎ情報）
const { orderDeliveryUserInfo, clearOrderDeliveryUserInfo } = useOrderDeliveryUserInfo()

// 運行情報（他画面からの引継ぎ情報）
const { orderOperationInfo, clearOrderOperationInfo } = useOrderOperationInfo()


// 画面入力項目
const applicant = ref(orderInfo.value.applicant)
const emergencyContact = ref(orderInfo.value.emergencyContact)
const tourOrganization = ref(orderInfo.value.tourOrganization)
const remarks = ref(orderInfo.value.remarks)
const passengers = ref(orderInfo.value.passengers)
const vehicleTypeLiftAmount = ref(orderInfo.value.vehicleTypeLiftAmount)
const vehicleTypeMediumAmount = ref(orderInfo.value.vehicleTypeMediumAmount)
const vehicleTypeSmallAmount = ref(orderInfo.value.vehicleTypeSmallAmount)
const vehicleTypeMicroAmount = ref(orderInfo.value.vehicleTypeMicroAmount)
const dispatchDate = ref(orderInfo.value.dispatchDate)
const dispatchTime = ref(orderInfo.value.dispatchTime)
const departureTime = ref(orderInfo.value.departureTime)
const deliveryLocation = ref(orderInfo.value.deliveryLocation)


// 合計を計算するcomputedプロパティ
const totalvehicleAmount = computed(() => {
  return (vehicleTypeLiftAmount.value || 0) + (vehicleTypeMediumAmount.value || 0) + (vehicleTypeSmallAmount.value || 0) + (vehicleTypeMicroAmount.value || 0);
});
/**
 * 顧客選択画面表示
 */
const customerSerch = () => {
  // stateへ保存
  const object = {
    id: keyOrderId,
    state: orderState,
    companyId: keyUserId,
    applicant: applicant.value,
    emergencyContact: utils.toBlank(emergencyContact.value),
    tourOrganization: utils.toBlank(tourOrganization.value),
    remarks: utils.toBlank(remarks.value),
    passengers: utils.toZero(passengers.value),
    vehicleTypeLiftAmount: utils.toZero(vehicleTypeLiftAmount.value),
    vehicleTypeMediumAmount: utils.toZero(vehicleTypeMediumAmount.value),
    vehicleTypeSmallAmount: utils.toZero(vehicleTypeSmallAmount.value),
    vehicleTypeMicroAmount: utils.toZero(vehicleTypeMicroAmount.value),
    dispatchDate: dispatchDate.value,
    dispatchTime: dispatchTime.value,
    departureTime: departureTime.value,
    deliveryLocation: deliveryLocation.value,
    itinerary1Top: utils.toBlank(orderOperationInfo.value.itinerary1Top),
    itinerary1Bottom: utils.toBlank(orderOperationInfo.value.itinerary1Bottom),
    timeschedule1Top: utils.toBlank(orderOperationInfo.value.timeschedule1Top),
    timeschedule1Bottom: utils.toBlank(orderOperationInfo.value.timeschedule1Bottom),
    accommodations1: utils.toBlank(orderOperationInfo.value.accommodations1),
    accommodationsTel1: utils.toBlank(orderOperationInfo.value.accommodationsTel1),
    accommodationsAddr1: utils.toBlank(orderOperationInfo.value.accommodationsAddr1),
    endDate: utils.toBlank(orderOperationInfo.value.endDate),
    endingTime: utils.toBlank(orderOperationInfo.value.endingTime),
    terminalLocation: utils.toBlank(orderOperationInfo.value.terminalLocation),
    customerId: utils.toBlank(applicantCustomerId),
  }
  editOrderInfo(object)

  // 画面遷移
  router.push('/user/customer/list')
}

/** 登録した案件情報を一次保存して終了 */
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
      state: orderState,
      companyId: keyUserId,
      applicant: utils.toBlank(applicant.value),
      emergencyContact: utils.toBlank(emergencyContact.value),
      tourOrganization: utils.toBlank(tourOrganization.value),
      remarks: utils.toBlank(remarks.value),
      passengers: utils.toZero(passengers.value),
      vehicleTypeLiftAmount: utils.toZero(vehicleTypeLiftAmount.value),
      vehicleTypeMediumAmount: utils.toZero(vehicleTypeMediumAmount.value),
      vehicleTypeSmallAmount: utils.toZero(vehicleTypeSmallAmount.value),
      vehicleTypeMicroAmount: utils.toZero(vehicleTypeMicroAmount.value),
      dispatchDate: utils.toBlank(dispatchDate.value),
      dispatchTime: utils.toBlank(dispatchTime.value),
      departureTime: utils.toBlank(departureTime.value),
      deliveryLocation: utils.toBlank(deliveryLocation.value),
      itinerary1Top: utils.toBlank(orderOperationInfo.value.itinerary1Top),
      itinerary1Bottom: utils.toBlank(orderOperationInfo.value.itinerary1Bottom),
      timeschedule1Top: utils.toBlank(orderOperationInfo.value.timeschedule1Top),
      timeschedule1Bottom: utils.toBlank(orderOperationInfo.value.timeschedule1Bottom),
      accommodations1: utils.toBlank(orderOperationInfo.value.accommodations1),
      accommodationsTel1: utils.toBlank(orderOperationInfo.value.accommodationsTel1),
      accommodationsAddr1: utils.toBlank(orderOperationInfo.value.accommodationsAddr1),
      endDate: utils.toBlank(orderOperationInfo.value.endDate),
      endingTime: utils.toBlank(orderOperationInfo.value.endingTime),
      terminalLocation: utils.toBlank(orderOperationInfo.value.terminalLocation),

      customerId: utils.toBlank(applicantCustomerId),
      deliveryCompanyId: utils.toBlank(orderDeliveryUserInfo.value.id),
      updatedAt: new Date(),
    }
    // console.log("updateOrderInfo")

    // console.log(updateOrderInfo)
    await userData.updateOrder(updateObject)

  } else {
    // 新規登録
    const insertObject = {
      // 案件登録中：1
      state: $Const.STATUS_DRAFT,
      companyId: keyUserId,
      applicant: utils.toBlank(applicant.value),
      emergencyContact: utils.toBlank(emergencyContact.value),
      tourOrganization: utils.toBlank(tourOrganization.value),
      remarks: utils.toBlank(remarks.value),
      passengers: utils.toZero(passengers.value),
      vehicleTypeLiftAmount: utils.toZero(vehicleTypeLiftAmount.value),
      vehicleTypeMediumAmount: utils.toZero(vehicleTypeMediumAmount.value),
      vehicleTypeSmallAmount: utils.toZero(vehicleTypeSmallAmount.value),
      vehicleTypeMicroAmount: utils.toZero(vehicleTypeMicroAmount.value),
      dispatchDate: utils.toBlank(dispatchDate.value),
      dispatchTime: utils.toBlank(dispatchTime.value),
      departureTime: utils.toBlank(departureTime.value),
      deliveryLocation: utils.toBlank(deliveryLocation.value),
      itinerary1Top: utils.toBlank(orderOperationInfo.value.itinerary1Top),
      itinerary1Bottom: utils.toBlank(orderOperationInfo.value.itinerary1Bottom),
      timeschedule1Top: utils.toBlank(orderOperationInfo.value.timeschedule1Top),
      timeschedule1Bottom: utils.toBlank(orderOperationInfo.value.timeschedule1Bottom),
      accommodations1: utils.toBlank(orderOperationInfo.value.accommodations1),
      accommodationsTel1: utils.toBlank(orderOperationInfo.value.accommodationsTel1),
      accommodationsAddr1: utils.toBlank(orderOperationInfo.value.accommodationsAddr1),
      endDate: utils.toBlank(orderOperationInfo.value.endDate),
      endingTime: utils.toBlank(orderOperationInfo.value.endingTime),
      terminalLocation: utils.toBlank(orderOperationInfo.value.terminalLocation),

      customerId: utils.toBlank(applicantCustomerId),
      deliveryCompanyId: utils.toBlank(orderDeliveryUserInfo.value.id),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    // console.log(orderInfo)
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

/** 登録した案件情報をstateに保持して次工程へ */
const entryForm = async () => {

  // 必須入力チェック
  if (utils.toBlank(applicant.value) == '') {
    $swal.fire({
      text: '申込者を入力してください。',
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning'
    })
    return
  }
  if (utils.toBlank(tourOrganization.value) == '') {
    $swal.fire({
      text: '団体名を入力してください。',
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning'
    })
    return
  }
  if (utils.toZero(totalvehicleAmount.value) == 0) {
    $swal.fire({
      text: '申込車両を選択してください。',
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning'
    })
    return
  }
  if (utils.toBlank(dispatchDate.value) == '') {
    $swal.fire({
      text: '配車日を入力してください。',
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning'
    })
    return
  }
  if (utils.toBlank(dispatchTime.value) == '') {
    $swal.fire({
      text: '配車時間を入力してください。',
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning'
    })
    return
  }
  if (utils.toBlank(deliveryLocation.value) == '') {
    $swal.fire({
      text: '配車場所を入力してください。',
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning'
    })
    return
  }

  let setstate = $Const.STATUS_DRAFT
  if (utils.toBlank(orderState) != '') {
    setstate = orderState
  }
  // 案件情報を保存
  // stateへ保存
  const object = {
    id: keyOrderId,
    state: setstate,
    companyId: keyUserId,
    applicant: applicant.value,
    emergencyContact: utils.toBlank(emergencyContact.value),
    tourOrganization: utils.toBlank(tourOrganization.value),
    remarks: utils.toBlank(remarks.value),
    passengers: utils.toZero(passengers.value),
    vehicleTypeLiftAmount: utils.toZero(vehicleTypeLiftAmount.value),
    vehicleTypeMediumAmount: utils.toZero(vehicleTypeMediumAmount.value),
    vehicleTypeSmallAmount: utils.toZero(vehicleTypeSmallAmount.value),
    vehicleTypeMicroAmount: utils.toZero(vehicleTypeMicroAmount.value),
    dispatchDate: utils.toBlank(dispatchDate.value),
    dispatchTime: utils.toBlank(dispatchTime.value),
    departureTime: utils.toBlank(departureTime.value),
    deliveryLocation: utils.toBlank(deliveryLocation.value),
    itinerary1Top: utils.toBlank(orderOperationInfo.value.itinerary1Top),
    itinerary1Bottom: utils.toBlank(orderOperationInfo.value.itinerary1Bottom),
    timeschedule1Top: utils.toBlank(orderOperationInfo.value.timeschedule1Top),
    timeschedule1Bottom: utils.toBlank(orderOperationInfo.value.timeschedule1Bottom),
    accommodations1: utils.toBlank(orderOperationInfo.value.accommodations1),
    accommodationsTel1: utils.toBlank(orderOperationInfo.value.accommodationsTel1),
    accommodationsAddr1: utils.toBlank(orderOperationInfo.value.accommodationsAddr1),
    endDate: utils.toBlank(orderOperationInfo.value.endDate),
    endingTime: utils.toBlank(orderOperationInfo.value.endingTime),
    terminalLocation: utils.toBlank(orderOperationInfo.value.terminalLocation),

    customerId: utils.toBlank(applicantCustomerId),
  }
  editOrderInfo(object)

  // 画面遷移
  router.push('/user/order/entryDeliveryInfo')

}

/** 前の画面へ戻る */
const back = () => {
  // stateのクリア
  clearOrderInfo(orderInfo)
  clearApplicantCustomerInfo(applicantCustomerInfo)
  clearOrderDeliveryUserInfo(orderDeliveryUserInfo)
  clearOrderOperationInfo(orderOperationInfo)


  // 画面遷移
  router.push('/user/order/list')
}

definePageMeta({
  layout: 'user'
})
</script>
