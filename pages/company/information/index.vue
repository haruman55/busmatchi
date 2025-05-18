<template>
  <v-container max-width="1200">
    <v-row no-gutters>
      <v-col>
        <v-breadcrumbs
          :items="[
            { title: 'マイページ', disabled: false, to: category === $Const.CATEGORY_APPLICANT ? '/user/mypage' : '/delivery/mypage' },
            { title: 'インフォメーション', disabled: true },
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

    <v-row>
      <v-col cols="12" v-for="info in information" :key="info.id">
        <v-row align="center" no-gutters class="d-flex">
          <!-- 左側のアイコン -->
          <v-col cols="auto" class="d-flex align-center">
            <v-icon size="36" color="primary" class="mr-4">{{
              $Const.INFORMATION_CODE.filter((e) => e.code == info.informationCode)[0].icon
            }}</v-icon>
          </v-col>
          <v-col>
            <v-card class="mx-0 my-4" outlined max-width="500" color="transparent">
              <v-card-subtitle>{{ info.createdAt.toDate().toLocaleString() }}</v-card-subtitle>
              <v-card-text :class="{ 'font-weight-bold': !info.isRead }"><v-icon v-if="!info.isRead" color="red">mdi-new-box</v-icon>{{ info.remarks }}</v-card-text>
              <v-card-actions v-if="info.orderId">
                <v-btn text color="primary" @click="showOrder(info)">内容を確認する</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
const router = useRouter()
const db = useFirestore()
const { $Const } = useNuxtApp()

// ユーザ情報を保持
const { userInfo } = useUserInfo()
const keyCompanyId = userInfo.value.companyId
const category = userInfo.value.category
// インフォメーション操作の呼び出し
const { getInformation, readInformation } = useInformation()
const { information } = await getInformation(keyCompanyId, false)

/** 前の画面へ戻る */
const back = () => {
  if (category === $Const.CATEGORY_APPLICANT) {
    router.push('/user/mypage') // 申込会社のmypage
  } else {
    router.push('/delivery/mypage') // それ以外(運送引受会社)のmypage
  }
}

/**
 * 指定の通知に対する申し込み情報を表示する
 * 通知は既読状態にする
 * @param {Object} info - 通知情報
 */
const showOrder = async (info) => {
  let dispatchTime = ''
  let departureTime = ''
  let endingTime = ''

  // 申込情報を取得
  const orderId = info.orderId
  const order = await db.getDocument({ path: 'order', docId: orderId })
  // 申込情報がなければ、何もしない
  if (order == null) {
    return
  }
  const orderApplicantCompany = await db.getDocument({ path: 'company', docId: order.companyId })

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
    companyId: order.companyId,
    applicant: order.applicant,
    applicantCompanyName: orderApplicantCompany.companyName,
    applicantCompanyTel: orderApplicantCompany.companyTel,
    applicantCompanyFax: orderApplicantCompany.companyFax,
    applicantCompanyAddr: orderApplicantCompany.companyAddr,
    applicantCompanyEmail: orderApplicantCompany.companyEmail,
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
    const dispatchInfo = await db.getDocument({ path: 'dispatch', docId: order.dispatchId })

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
    const userCustomer = await db.getDocument({ path: 'customer', docId: order.customerId })
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
  // ここから申込運送引受会社の情報があれば設定
  const { editOrderDeliveryUserInfo } = useOrderDeliveryUserInfo()
  if (order.deliveryCompanyId != null && order.deliveryCompanyId != '') {
    const deliveryCompanyDocId = order.deliveryCompanyId
    const orderDeliveryCompany = await db.getDocument({ path: 'company', docId: deliveryCompanyDocId })

    const deliveryUser = {
      id: deliveryCompanyDocId,
      companyId: orderDeliveryCompany.id,
      companyName: orderDeliveryCompany.companyName,
      companyAddr: orderDeliveryCompany.companyAddr,
      companyTel: orderDeliveryCompany.companyTel,
      companyFax: orderDeliveryCompany.companyFax,
      companyEmail: orderDeliveryCompany.companyEmail,
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

  // 通知を既読状態に更新する
  await readInformation(info.id)

  // 申し込み情報の表示
  if (category === $Const.CATEGORY_APPLICANT) {
    router.push('/user/order/entry') // 申込会社の申込情報
  } else {
    router.push('/delivery/order/entry') // それ以外(運送引受会社)の申込情報
  }
}
</script>
<style></style>
