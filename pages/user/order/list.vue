<template>
  <v-container max-width="1200">
    <v-row no-gutters>
      <v-col>
        <v-breadcrumbs
:items="[
          { title: 'マイページ', disabled: false, to: '/user/mypage' },
          { title: '案件管理', disabled: true },
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

    <v-row no-gutters>
      <v-col v-for="(order) in orderList" :key="order.id">
        <v-card elevation="20" class="ma-2 pa-2 " height="250" width="350" @click="selectOrder(order)">
          <v-card-item :class="'bg-' + $Const.ORDER_STATUS_DISP[order.state].color">{{
            $Const.ORDER_STATUS_DISP[order.state].text }}</v-card-item>
          <v-card-text align="center" class="text-h5">{{ order.tourOrganization }}</v-card-text>
          <v-card-text align="center">日程:{{ order.dispatchDate }} {{ order.dispatchTimeHour
          }}:{{$Const.TIME_MINUTE_LIST.find(item => item.code === order.dispatchTimeMinute)?.disp ??
              ''}}</v-card-text>
          <v-card-text align="center">申込担当:{{ order.applicant }}</v-card-text>
        </v-card>

      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="3" md="3">
        <v-btn  value="add" color="primary" @click="addOrder">
          <v-icon>mdi-plus</v-icon>新規登録
        </v-btn>
      </v-col>
    </v-row>


  </v-container>
</template>
<script setup>
const router = useRouter()
const { $Const } = useNuxtApp()
const userData = useUserData();
const db = useFirestore()
// ログインユーザーのキーID
const { userInfo } = useUserInfo()
const keyUserId = userInfo.value.companyId

// 登録案件情報取得
const orderList = await userData.getOrderList(keyUserId);

/**
 * 案件登録画面表示
 */
const addOrder = () => {
  const { orderInfo, editOrderInfo } = useOrderInfo()
  const order = orderInfo
  // stateへ保存
  order.value.applicantCompanyName = userInfo.value.companyName
  order.value.applicantCompanyTel = userInfo.value.companyTel
  order.value.applicantCompanyFax = userInfo.value.companyFax
  order.value.applicantCompanyAddr = userInfo.value.companyAddr
  order.value.applicantCompanyEmail = userInfo.value.companyEmail
  editOrderInfo(order.value)

  // 画面遷移
  router.push('/user/order/entry')
}

/**
 * 一覧から選択した案件情報の登録画面を表示する
 */
const selectOrder = async (order) => {

  let dispatchTime = ''
  let departureTime = ''
  let endingTime = ''

  if (order.dispatchTimeHour != null && order.dispatchTimeMinute != null) {
    const time = $Const.TIME_HOUR_LIST.find(item => item.code === order.dispatchTimeHour);
    const min = $Const.TIME_MINUTE_LIST.find(item => item.code === order.dispatchTimeMinute);
    dispatchTime = time.disp + ':' + min.disp
  }
  if (order.departureTimeHour != null && order.departureTimeMinute != null) {
    const time = $Const.TIME_HOUR_LIST.find(item => item.code === order.departureTimeHour);
    const min = $Const.TIME_MINUTE_LIST.find(item => item.code === order.departureTimeMinute);
    departureTime = time.disp + ':' + min.disp
  }
  if (order.endingTimeHour != null && order.endingTimeMinute != null) {
    const time = $Const.TIME_HOUR_LIST.find(item => item.code === order.endingTimeHour);
    const min = $Const.TIME_MINUTE_LIST.find(item => item.code === order.endingTimeMinute);
    endingTime = time.disp + ':' + min.disp
  }


  // 一覧から選択した申込情報を保持
  const { editOrderInfo } = useOrderInfo()
  // stateへ保存
  const orderInfo = {
    id: order.id,
    state: order.state,
    companyId: keyUserId,
    applicant: order.applicant,
    applicantCompanyName: userInfo.value.companyName,
    applicantCompanyTel: userInfo.value.companyTel,
    applicantCompanyFax: userInfo.value.companyFax,
    applicantCompanyAddr: userInfo.value.companyAddr,
    applicantCompanyEmail: userInfo.value.companyEmail,
    emergencyContact: order.emergencyContact,
    tourOrganization: order.tourOrganization,
    customerRemarks: order.customerRemarks,
    passengers: order.passengers,
    vehicleTypeLiftAmount: order.vehicleTypeLiftAmount,
    vehicleTypeMediumAmount: order.vehicleTypeMediumAmount,
    vehicleTypeSmallAmount: order.vehicleTypeSmallAmount,
    vehicleTypeMicroAmount: order.vehicleTypeMicroAmount,
    dispatchDate: order.dispatchDate,
    dispatchTime: dispatchTime,
    dispatchTimeHour: order.dispatchTimeHour,
    dispatchTimeMinute: order.dispatchTimeMinute,
    departureTime: departureTime,
    departureTimeHour: order.departureTimeHour,
    departureTimeMinute: order.departureTimeMinute,
    deliveryLocation: order.deliveryLocation,
    selectPayment: order.selectPayment,
    selectPaymentOther: order.selectPaymentOther,
    selectDiscount: order.selectDiscount,
    selectDiscountOther: order.selectDiscountOther,
    orderAmount: order.orderAmount,
    actualCost: order.actualCost,
    paymentDueDate: order.paymentDueDate,
    specialTerms: order.specialTerms,
    remarks: order.remarks,
    customerId: order.customerId,
    deliveryCompanyId: order.deliveryCompanyId,
    dispatchId: order.dispatchId,
  }
  editOrderInfo(orderInfo)

  // 配車情報があれば設定
  const { editDispatchInfo } = useDispatchInfo()
  if (order.dispatchId != null && order.dispatchId != '') {
    const dispatchInfo = await userData.getDispatchData(order.dispatchId);
    const dispatchObj = {
      id: order.dispatchId,
      companyId: dispatchInfo.companyId,
      orderId: dispatchInfo.orderId,
      busList: dispatchInfo.busList,
      driverList: dispatchInfo.driverList,
      guideList: dispatchInfo.guideList,
    }
    editDispatchInfo(dispatchObj)
  }


  // 申込顧客情報があれば設定
  const { editApplicantCustomerInfo } = useApplicantCustomerInfo()
  if (order.customerId != null && order.customerId != '') {
    // const userCustomer = await userData.getUserCustomer(keyUserId, order.customerId)
    const userCustomer = await userData.getCustomerData(order.customerId)
    const userCustomerInfo = {
      id: order.customerId,
      customerId: userCustomer.customerId,
      customerName: userCustomer.customerName,
      customerAddr: userCustomer.customerAddr,
      customerTel: userCustomer.customerTel,
      customerFax: userCustomer.customerFax,
      customerMail: userCustomer.customerMail,
    }
    editApplicantCustomerInfo(userCustomerInfo)
  }
  // TODO:ここから申込運送引受会社の情報があれば設定
  const { editOrderDeliveryUserInfo } = useOrderDeliveryUserInfo()
  if (order.deliveryCompanyId != null && order.deliveryCompanyId != '') {
    const deliveryCompanyDocId = order.deliveryCompanyId
    // const orderDeliveryUser = await userData.getUserData(deliveryCompanyDocId)
    const orderDeliveryCompany = await db.getDocument({ path: 'company', docId: deliveryCompanyDocId })

    const deliveryUser = {
      id: deliveryCompanyDocId,
      companyId: orderDeliveryCompany.id,
      companyName: orderDeliveryCompany.companyName,
      companyAddr: orderDeliveryCompany.companyAddr,
      companyTel: orderDeliveryCompany.companyTel,
      companyFax: orderDeliveryCompany.companyFax,
      // companyEmail: orderDeliveryCompany.companyEmail,
      dispatchDate: order.dispatchDate,
      dispatchTime: dispatchTime,
      dispatchTimeHour: order.dispatchTimeHour,
      dispatchTimeMinute: order.dispatchTimeMinute,
      departureTime: order.departureTime,
      departureTimeHour: order.departureTimeHour,
      departureTimeMinute: order.departureTimeMinute,

      deliveryLocation: order.deliveryLocation,
      counterPersonMain: order.counterPersonMain,
      counterPersonSub: order.counterPersonSub,

    }
    editOrderDeliveryUserInfo(deliveryUser)
  }
  // 運行情報の設定
  // 入力された運行情報(当該画面での入力情報)
  const { editOrderOperationInfo } = useOrderOperationInfo()
  const orderOperationInfoObject = {
    itinerary1Top: order.itinerary1Top,
    itinerary1Bottom: order.itinerary1Bottom,
    timeschedule1Top: order.timeschedule1Top,
    timeschedule1Bottom: order.timeschedule1Bottom,
    accommodations1: order.accommodations1,
    accommodationsTel1: order.accommodationsTel1,
    accommodationsAddr1: order.accommodationsAddr1,
    endDate: order.endDate,
    endingTime: endingTime,
    endingTimeHour: order.endingTimeHour,
    endingTimeMinute: order.endingTimeMinute,
    terminalLocation: order.terminalLocation,
  }
  editOrderOperationInfo(orderOperationInfoObject)

  router.push('/user/order/entry')


}


/** 前の画面へ戻る */
const back = () => {
  // 画面遷移
  router.push('/user/mypage')
}

definePageMeta({
  layout: 'user'
})
</script>
