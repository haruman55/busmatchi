<template>
  <v-container max-width="1200">
    <v-row no-gutters>
      <v-col>
        <v-breadcrumbs
          :items="[
            { title: 'マイページ', disabled: false, to: '/delivery/mypage' },
            { title: '案件管理', disabled: true },
          ]"
        >
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
      <v-col v-for="order in orderList" :key="order.id">
        <v-card elevation="20" class="ma-2 pa-2" height="250" width="350" @click="selectOrder(order)">
          <v-card-item :class="'bg-' + $Const.ORDER_STATUS_DISP[order.state].color">{{
            $Const.ORDER_STATUS_DISP[order.state].text
          }}</v-card-item>
          <v-card-text align="center" class="text-h5">
            {{ order.applicantCompanyName }} {{ order.applicant }}</v-card-text
          >
          <v-card-text align="center"
            >配車日時:{{ order.dispatchDate }} {{ order.dispatchTimeHour }}:{{
              order.dispDispatchTimeMinute
            }}</v-card-text
          >
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
const router = useRouter()
const { $Const } = useNuxtApp()
const userData = useUserData()
const db = useFirestore()
// ログインユーザーのキーID
const { userInfo } = useUserInfo()
const keyUserDocId = userInfo.value.id
const keyUserId = userInfo.value.companyId

/**
 * 申込会社からの案件情報の一覧を取得する。
 */
const getOrderDeliveryList = async () => {
  const statusArray = [
    $Const.STATUS_REQUEST,
    $Const.STATUS_UNDERTAKE,
    $Const.STATUS_PAYMENT_METHOD_CONFIRMED,
    $Const.STATUS_TRANSPORTATION_COMPLETED,
    $Const.STATUS_PAYMENT_COMPLETED,
    $Const.STATUS_ORDER_COMPLETED,
  ]
  const orderList = await userData.getOrderDeliveryList(keyUserDocId, statusArray)
  const orderListArray = []
  for (let i = 0; i < orderList.length; i++) {
    const applicantCompanyId = orderList[i].companyId
    // 申込会社の情報取得
    // const companyData = await userData.getUserCompanyKey(companyId)
    const orderApplicantCompany = await db.getDocument({ path: 'company', docId: applicantCompanyId })

    const orderInfoObj = {
      id: orderList[i].id,
      state: orderList[i].state,
      companyId: applicantCompanyId,
      // TODO:この申込会社情報がとりたい為にわざわざ getOrderDeliveryList()で実装した。
      applicant: orderList[i].applicant,
      applicantCompanyName: orderApplicantCompany.companyName,
      applicantCompanyTel: orderApplicantCompany.companyTel,
      applicantCompanyFax: orderApplicantCompany.companyFax,
      applicantCompanyAddr: orderApplicantCompany.companyAddr,
      // applicantCompanyEmail: orderApplicantCompany.companyEmail, tODO:会社の代表e-mailは必要か？
      emergencyContact: orderList[i].emergencyContact,
      tourOrganization: orderList[i].tourOrganization,
      customerRemarks: orderList[i].customerRemarks,
      passengers: orderList[i].passengers,
      vehicleTypeLiftAmount: orderList[i].vehicleTypeLiftAmount,
      vehicleTypeMediumAmount: orderList[i].vehicleTypeMediumAmount,
      vehicleTypeSmallAmount: orderList[i].vehicleTypeSmallAmount,
      vehicleTypeMicroAmount: orderList[i].vehicleTypeMicroAmount,
      dispatchDate: orderList[i].dispatchDate,
      dispatchTimeHour: orderList[i].dispatchTimeHour,
      dispatchTimeMinute: orderList[i].dispatchTimeMinute,
      // 画面(一覧のカード)表示用に編集
      dispDispatchTimeMinute:
        $Const.TIME_MINUTE_LIST.find((item) => item.code === orderList[i].dispatchTimeMinute)?.disp ?? '',

      departureTimeHour: orderList[i].departureTimeHour,
      departureTimeMinute: orderList[i].departureTimeMinute,
      deliveryLocation: orderList[i].deliveryLocation,
      itinerary1Top: orderList[i].itinerary1Top,
      itinerary1Bottom: orderList[i].itinerary1Bottom,
      timeschedule1Top: orderList[i].timeschedule1Top,
      timeschedule1Bottom: orderList[i].timeschedule1Bottom,
      accommodations1: orderList[i].accommodations1,
      accommodationsTel1: orderList[i].accommodationsTel1,
      accommodationsAddr1: orderList[i].accommodationsAddr1,
      endDate: orderList[i].endDate,
      endingTimeHour: orderList[i].endingTimeHour,
      endingTimeMinute: orderList[i].endingTimeMinute,
      terminalLocation: orderList[i].terminalLocation,
      selectPayment: orderList[i].selectPayment,
      selectPaymentOther: orderList[i].selectPaymentOther,
      selectDiscount: orderList[i].selectDiscount,
      selectDiscountOther: orderList[i].selectDiscountOther,
      orderAmount: orderList[i].orderAmount,
      actualCost: orderList[i].actualCost,
      paymentDueDate: orderList[i].paymentDueDate,
      specialTerms: orderList[i].specialTerms,
      remarks: orderList[i].remarks,
      customerId: orderList[i].customerId,
      deliveryCompanyId: orderList[i].deliveryCompanyId,
      dispatchId: orderList[i].dispatchId,
      counterPersonMain: orderList[i].counterPersonMain,
      counterPersonSub: orderList[i].counterPersonSub,
    }
    orderListArray.push(orderInfoObj)
  }
  return orderListArray
}
const orderList = await getOrderDeliveryList()

/**
 * 一覧から選択した案件情報を表示する
 */
const selectOrder = async (order) => {
  let dispatchTime = ''
  let departureTime = ''
  let endingTime = ''

  if (order.dispatchTimeHour != null && order.dispatchTimeMinute != null) {
    const time = $Const.TIME_HOUR_LIST.find((item) => item.code === order.dispatchTimeHour)
    const min = $Const.TIME_MINUTE_LIST.find((item) => item.code === order.dispatchTimeMinute)
    dispatchTime = time.disp + ':' + min.disp
  }
  if (order.departureTimeHour != null && order.departureTimeMinute != null) {
    const time = $Const.TIME_HOUR_LIST.find((item) => item.code === order.departureTimeHour)
    const min = $Const.TIME_MINUTE_LIST.find((item) => item.code === order.departureTimeMinute)
    departureTime = time.disp + ':' + min.disp
  }
  if (order.endingTimeHour != null && order.endingTimeMinute != null) {
    const time = $Const.TIME_HOUR_LIST.find((item) => item.code === order.endingTimeHour)
    const min = $Const.TIME_MINUTE_LIST.find((item) => item.code === order.endingTimeMinute)
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
    applicantCompanyName: order.applicantCompanyName,
    applicantCompanyTel: order.applicantCompanyTel,
    applicantCompanyFax: order.applicantCompanyFax,
    applicantCompanyAddr: order.applicantCompanyAddr,
    applicantCompanyEmail: order.applicantCompanyEmail,
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
    const dispatchInfo = await userData.getDispatchData(order.dispatchId)
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
      // companyEmail: orderDeliveryCompany.companyEmail, TODO:運送引受会社の代表e-mailは必要か？
      dispatchDate: order.dispatchDate,
      dispatchTime: dispatchTime,
      dispatchTimeHour: order.dispatchTimeHour,
      dispatchTimeMinute: order.dispatchTimeMinute,
      departureTime: departureTime,
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

  router.push('/delivery/order/entry')
}

definePageMeta({
  layout: 'user',
})
</script>
