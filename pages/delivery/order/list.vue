<template>
  <div>
    <v-container fluid class="bg-grey-lighten-4 mb-6">
      <v-row justify="center">
        <v-col>
          <v-sheet>
            <v-card-text class="text-h5 ">
              <v-icon left x-large @click="back">
                mdi-close
              </v-icon>
              運送依頼一覧
            </v-card-text>
            <v-divider :thickness="2" class="border-opacity-100" />
          </v-sheet>
        </v-col>
      </v-row>
      <v-divider />
    </v-container>
    <v-container class="fill-height align-center" fluid>
      <v-row no-gutters>
        <v-col v-for="(order) in orderList" :key="order.id" align="center">

          <v-card
elevation="20" class="ma-2 pa-2 align-end" height="250" width="350"
            :color="$Const.ORDER_STATUS_DISP[order.state].color" @click="selectOrder(order)">
            <v-card-text class="text-h5"> {{ order.applicantCompanyName }} {{ order.applicant }}</v-card-text>

            <v-card-text>配車日時:{{ order.dispatchDate }} {{ order.dispatchTimeHour }}:{{ order.dispatchTimeMinute }}</v-card-text>
            <v-card-text>配車場所:{{ order.deliveryLocation }}</v-card-text>
          </v-card>

        </v-col>
      </v-row>



    </v-container>
  </div>
</template>
<script setup>
const router = useRouter()
const { $Const } = useNuxtApp()
const userData = useUserData();
// ログインユーザーのキーID
const { userInfo } = useUserInfo()
const keyUserDocId = userInfo.value.id
const keyUserId = userInfo.value.companyId

/**
 * 申込会社からの案件情報の一覧を取得する。
 */
const getOrderDeliveryList = async () => {

  const statusArray = [$Const.STATUS_REQUEST, $Const.STATUS_RESERVATION, $Const.STATUS_APPLICATION, $Const.STATUS_ARRANGEMENTS_COMPLETED, $Const.STATUS_PAYMENT_COMPLETED, $Const.STATUS_ORDER_COMPLETED]
  const orderList = await userData.getOrderDeliveryList(keyUserDocId, statusArray);
  const orderListArray = []
  for (let i = 0; i < orderList.length; i++) {

    const companyId = orderList[i].companyId
    // 申込会社の情報取得
    const companyData = await userData.getUserCompanyKey(companyId)
    const orderInfoObj = {
      id: orderList[i].id,
      state: orderList[i].state,
      companyId: companyId,
      // TODO:この申込会社情報がとりたい為にわざわざ getOrderDeliveryList()で実装した。
      applicant: orderList[i].applicant,
      applicantCompanyName: companyData.companyName,
      applicantCompanyTel: companyData.companyTel,
      applicantCompanyFax: companyData.companyFax,
      applicantCompanyAddr: companyData.companyAddr,
      applicantCompanyEmail: companyData.companyEmail,
      emergencyContact: orderList[i].emergencyContact,
      tourOrganization: orderList[i].tourOrganization,
      remarks: orderList[i].remarks,
      passengers: orderList[i].passengers,
      vehicleTypeLiftAmount: orderList[i].vehicleTypeLiftAmount,
      vehicleTypeMediumAmount: orderList[i].vehicleTypeMediumAmount,
      vehicleTypeSmallAmount: orderList[i].vehicleTypeSmallAmount,
      vehicleTypeMicroAmount: orderList[i].vehicleTypeMicroAmount,
      dispatchDate: orderList[i].dispatchDate,
      dispatchTimeHour: orderList[i].dispatchTimeHour,
      dispatchTimeMinute: orderList[i].dispatchTimeMinute,
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
const orderList = await getOrderDeliveryList();



/**
 * 一覧から選択した案件情報を表示する
 */
const selectOrder = async (order) => {
  let dispatchTime =''
  let departureTime =''
  let endingTime =''

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
    applicantCompanyName: order.applicantCompanyName,
    applicantCompanyTel: order.applicantCompanyTel,
    applicantCompanyFax: order.applicantCompanyFax,
    applicantCompanyAddr: order.applicantCompanyAddr,
    applicantCompanyEmail: order.applicantCompanyEmail,
    emergencyContact: order.emergencyContact,
    tourOrganization: order.tourOrganization,
    remarks: order.remarks,
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
    const orderDeliveryUser = await userData.getUserData(deliveryCompanyDocId)
    const deliveryUser = {
      id: deliveryCompanyDocId,
      companyId: orderDeliveryUser.companyId,
      companyName: orderDeliveryUser.companyName,
      companyAddr: orderDeliveryUser.companyAddr,
      companyTel: orderDeliveryUser.companyTel,
      companyFax: orderDeliveryUser.companyFax,
      companyEmail: orderDeliveryUser.companyEmail,
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


/** 前の画面へ戻る */
const back = () => {
  // 画面遷移
  router.push('/delivery/mypage')
}

definePageMeta({
  layout: 'user'
})
</script>
