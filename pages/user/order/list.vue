<template>
  <div>
    <v-container fluid class="bg-teal-accent-2 mb-6">
      <v-row justify="center">
        <v-col>
          <v-sheet>
            <v-card-text class="text-h5 ">
              <v-icon left x-large @click="back">
                mdi-close
              </v-icon>
              案件一覧
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
            <v-card-text> {{ $Const.ORDER_STATUS_DISP[order.state].text }}</v-card-text>
            <v-card-text class="text-h5">{{ order.tourOrganization }}</v-card-text>

            <v-card-text>日程:未入力</v-card-text>
            <v-card-text>申込者:{{ order.applicant }}</v-card-text>
          </v-card>

        </v-col>
      </v-row>


      <v-container class="fill-height align-center" fluid>
        <v-row>
          <v-col cols="12" sm="3" md="3">
            <v-btn size="x-large" value="add" color="indigo" @click="addOrder">
              <v-icon>mdi-plus</v-icon>新規登録
            </v-btn>
          </v-col>
        </v-row>
      </v-container>

    </v-container>
  </div>
</template>
<script setup>
const router = useRouter()
const { $Const } = useNuxtApp()
const userData = useUserData();
// ログインユーザーのキーID
const { userInfo } = useUserInfo()
const keyUserId = userInfo.value.companyId

// 登録案件情報取得
const orderList = await userData.getOrderList(keyUserId);

/**
 * 案件登録画面表示
 */
const addOrder = () => {
  // 画面遷移
  router.push('/user/order/entryCustomerInfo')
}

/**
 * 一覧から選択した案件情報の登録画面を表示する
 */
const selectOrder = async (order) => {
  // console.log(order)

  // 一覧から選択した申込情報を保持
  const { editOrderInfo } = useOrderInfo()
  // stateへ保存
  const orderInfo = {
    id: order.id,
    state: order.state,
    companyId: keyUserId,
    applicant: order.applicant,
    emergencyContact: order.emergencyContact,
    tourOrganization: order.tourOrganization,
    remarks: order.remarks,
    customerId: order.customerId,
    deliveryCompanyId: order.deliveryCompanyId,
  }
  editOrderInfo(orderInfo)

  // 申込顧客情報があれば設定
  const { editApplicantCustomerInfo } = useApplicantCustomerInfo()
  if (order.customerId != null && order.customerId != '') {
    const userCustomer = await userData.getUserCustomer(keyUserId, order.customerId)
    const userCustomerInfo = {
      id: userCustomer.id,
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
    // alert(order.deliveryCompanyId)
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
      dispatchTime: order.dispatchTime,
      departureTime: order.departureTime,
      deliveryLocation: order.deliveryLocation
    }
    editOrderDeliveryUserInfo(deliveryUser)
  }


  router.push('/user/order/entryCustomerInfo')
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
