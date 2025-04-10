<template>
  <v-container max-width="1200">
    <v-row no-gutters>
      <v-col>
        <v-breadcrumbs
:items="[
          { title: 'マイページ', disabled: false, to: '/user/mypage' },
          { title: '契約管理', disabled: true },
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

    <v-row>
      <v-col>
        <v-toolbar-title class="font-weight-bold">
          登録契約一覧<v-divider />
        </v-toolbar-title>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-row justify="center" no-gutters>
            <v-col>
              <v-data-table :headers="contractListHeaders" :items="contractList" :row-props="getRowClass" class="text-pre-wrap bg-background">
                <template #[`item.payment`]="{ item }">
                  <div>
                    <a href="" @click.prevent.stop="selectContract(item)">
                      {{ item.payment }}</a>
                  </div>
                </template>

              </v-data-table>

            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
const router = useRouter()
const { $Const } = useNuxtApp()
const userData = useUserData();

// ユーザ情報を保持
const { userInfo } = useUserInfo()
const keyUserId = userInfo.value.companyId
console.log('keyUserId:' + keyUserId)

// ユーザ操作情報を保持
const { actionInfo } = useAction()
const act = actionInfo.value.act

/**
 * ステータスによってデータテーブルの行色を強調
 * class=row-completed 支払未済：class=row-payment
 */
const getRowClass = (item) => {
  const state = item.item.state
  if (state === $Const.STATUS_ORDER_COMPLETED) return { class: 'row-completed' }
  if (state === $Const.STATUS_TRANSPORTATION_COMPLETED) return { class: 'row-payment' }
  return ''

}


// 契約データテーブルヘッダ定義
const contractListHeaders = [
  {
    title: '支払状況',
    key: 'payment',
    sortable: true
  },
  {
    title: '配車日時',
    key: 'dispDispatchDT',
    sortable: true
  },
  {
    title: '運送引受会社',
    key: 'deliveryCompanyName',
    sortable: true
  },
  {
    title: '団体名',
    key: 'tourOrganization',
    sortable: false
  },
  {
    title: '担当',
    key: 'applicant',
    sortable: true
  },
]

/**
 * 支払～完了までの登録案件情報取得
 */
const getContractList = async () => {

  const statusArray = [$Const.STATUS_PAYMENT_METHOD_CONFIRMED, $Const.STATUS_TRANSPORTATION_COMPLETED, $Const.STATUS_PAYMENT_COMPLETED, $Const.STATUS_ORDER_COMPLETED]
  const contractList = await userData.getOrderList(keyUserId, statusArray);
  const orderListArray = []
  for (let i = 0; i < contractList.length; i++) {

    // 運送引受会社のdocid
    const companyId = contractList[i].deliveryCompanyId
    const state = contractList[i].state
    // 一覧表示用の編集
    let payment = ''
    if (state == $Const.STATUS_PAYMENT_COMPLETED || state == $Const.STATUS_ORDER_COMPLETED) {
      payment = '支払済み(' + $Const.ORDER_STATUS_DISP[state].text + ')'
    } else {
      payment = '支払期日:' + contractList[i].paymentDueDate
    }
    // 申込会社の情報取得
    const deliveryCompanyData = await userData.getUserData(companyId)
    const orderInfoObj = {
      id: contractList[i].id,
      state: state,
      payment: payment,
      companyId: companyId,
      applicant: contractList[i].applicant,
      applicantCompanyName: userInfo.value.companyName,
      applicantCompanyTel: userInfo.value.companyTel,
      applicantCompanyFax: userInfo.value.companyFax,
      applicantCompanyAddr: userInfo.value.companyAddr,
      applicantCompanyEmail: userInfo.value.companyEmail,
      deliveryCompanyName: deliveryCompanyData.companyName,
      counterPersonMain: contractList[i].counterPersonMain,
      counterPersonSub: contractList[i].counterPersonSub,
      applicantCompanyTel: deliveryCompanyData.companyTel,
      applicantCompanyFax: deliveryCompanyData.companyFax,
      applicantCompanyAddr: deliveryCompanyData.companyAddr,
      applicantCompanyEmail: deliveryCompanyData.companyEmail,
      emergencyContact: contractList[i].emergencyContact,
      tourOrganization: contractList[i].tourOrganization,
      customerRemarks: contractList[i].customerRemarks,
      passengers: contractList[i].passengers,
      vehicleTypeLiftAmount: contractList[i].vehicleTypeLiftAmount,
      vehicleTypeMediumAmount: contractList[i].vehicleTypeMediumAmount,
      vehicleTypeSmallAmount: contractList[i].vehicleTypeSmallAmount,
      vehicleTypeMicroAmount: contractList[i].vehicleTypeMicroAmount,
      dispatchDate: contractList[i].dispatchDate,
      dispatchTimeHour: contractList[i].dispatchTimeHour,
      dispatchTimeMinute: contractList[i].dispatchTimeMinute,
      // 一覧表示用の編集
      dispDispatchDT: contractList[i].dispatchDate + ' ' + contractList[i].dispatchTimeHour + ':' + $Const.TIME_MINUTE_LIST.find(item => item.code === contractList[i].dispatchTimeMinute).disp,
      departureTimeHour: contractList[i].departureTimeHour,
      departureTimeMinute: contractList[i].departureTimeMinute,
      deliveryLocation: contractList[i].deliveryLocation,
      itinerary1Top: contractList[i].itinerary1Top,
      itinerary1Bottom: contractList[i].itinerary1Bottom,
      timeschedule1Top: contractList[i].timeschedule1Top,
      timeschedule1Bottom: contractList[i].timeschedule1Bottom,
      accommodations1: contractList[i].accommodations1,
      accommodationsTel1: contractList[i].accommodationsTel1,
      accommodationsAddr1: contractList[i].accommodationsAddr1,
      endDate: contractList[i].endDate,
      endingTimeHour: contractList[i].endingTimeHour,
      endingTimeMinute: contractList[i].endingTimeMinute,
      terminalLocation: contractList[i].terminalLocation,
      selectPayment: contractList[i].selectPayment,
      selectPaymentOther: contractList[i].selectPaymentOther,
      selectDiscount: contractList[i].selectDiscount,
      selectDiscountOther: contractList[i].selectDiscountOther,
      orderAmount: contractList[i].orderAmount,
      actualCost: contractList[i].actualCost,
      paymentDueDate: contractList[i].paymentDueDate,
      specialTerms: contractList[i].specialTerms,
      remarks: contractList[i].remarks,
      customerId: contractList[i].customerId,
      dispatchId: contractList[i].dispatchId,
      deliveryCompanyId: contractList[i].deliveryCompanyId,

    }
    orderListArray.push(orderInfoObj)
  }
  return orderListArray
}
const contractList = await getContractList();


/**
 * 一覧から選択した契約(案件)を表示する
 */
const selectContract = async (order) => {

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
  // 画面を表示
  router.push('/user/order/entryConfirm')


}



/** 前の画面へ戻る */
const back = () => {
  // 画面遷移
  router.push('/user/mypage')

}



</script>
<style>
.row-completed {
  background-color: #B0BEC5 !important;
}

.row-payment {
  background-color: #EF5350 !important;
}
</style>