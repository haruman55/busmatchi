<template>
  <div>
    <v-container class="fill-height align-center" fluid>
      <v-row no-gutters>
        <v-col>
          <v-card-text class="font-weight-bold text-h5">
            <v-icon left x-large @click="back">
              mdi-close
            </v-icon>
            案件登録-顧客情報
          </v-card-text>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row no-gutters>
        <v-col cols="12" sm="12" md="12">
          <v-card-title>申込者情報</v-card-title>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="6" md="6">
          <v-text-field v-model="applicant" label="申込担当者名" outlined />

        </v-col>
        <v-col align="center" cols="12" sm="6" md="6">
          <v-text-field v-model="emergencyContact" label="緊急連絡先" outlined />
        </v-col>
      </v-row>
      <br>
    </v-container>
    <v-container>
      <v-row>
        <v-col cols="12" sm="12" md="12">
          <v-card-title>お客様情報</v-card-title>
        </v-col>

        <v-col cols="12">
          <v-btn rounded dark color="yellow" class="mb-2 pr-8 pl-8" @click="customerSerch">
            顧客選択
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <br>
    <v-container >
      <v-row>
        <v-col v-if="applicantCustomerId != '' && applicantCustomerId != null" cols="12" sm="6" md="6">
        <v-card color="white" class="mx-auto"  elevation="15">
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
      <br>
      <br>




    </v-container>
    <v-container class="align-center" fluid>
      <v-row justify="center" no-gutters>
        <v-col align="center">
          <v-btn rounded dark size="x-large" color="green" class="mb-2 pr-8 pl-8" @click="draft">
            一次保存
          </v-btn>
        </v-col>
        <v-col align="center">
          <v-btn rounded dark size="x-large" color="indigo darken-4" class="mb-2 pr-8 pl-8" @click="entryForm">
            運送引受会社の設定へ
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

// 選択された申込顧客情報を保持
const { applicantCustomerInfo, clearApplicantCustomerInfo } = useApplicantCustomerInfo()
const applicantCustomerId = applicantCustomerInfo.value.customerId

// 画面入力(設定)された申込情報を保持
const { orderInfo, editOrderInfo, clearOrderInfo } = useOrderInfo()
// 既にDB登録済みの案件の場合のid情報
const keyOrderId = orderInfo.value.id
const orderState = orderInfo.value.state

// 画面入力(設定)された申込運送引受会社情報を保持
const { orderDeliveryUserInfo, clearOrderDeliveryUserInfo } = useOrderDeliveryUserInfo()
console.log("初期表示")
console.log(orderDeliveryUserInfo)

// 画面入力項目
const applicant = ref(orderInfo.value.applicant)
const emergencyContact = ref(orderInfo.value.emergencyContact)
const tourOrganization = ref(orderInfo.value.tourOrganization)
const remarks = ref(orderInfo.value.remarks)

/**
 * 顧客選択画面表示
 */
const customerSerch = () => {
  // stateへ保存
  const orderInfo = {
    id:keyOrderId,
    state: orderState,
    companyId: keyUserId,
    applicant: applicant.value,
    emergencyContact: utils.toBlank(emergencyContact.value),
    tourOrganization: utils.toBlank(tourOrganization.value),
    remarks: utils.toBlank(remarks.value),
    customerId: utils.toBlank(applicantCustomerId),
  }
  editOrderInfo(orderInfo)

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
    const updateOrderInfo = {
      id: keyOrderId,
      state: orderState,
      companyId: keyUserId,
      applicant: utils.toBlank(applicant.value),
      emergencyContact: utils.toBlank(emergencyContact.value),
      tourOrganization: utils.toBlank(tourOrganization.value),
      remarks: utils.toBlank(remarks.value),
      customerId: utils.toBlank(applicantCustomerId),
      deliveryLocation: orderDeliveryUserInfo.value.deliveryLocation,
      dispatchDate: orderDeliveryUserInfo.value.dispatchDate,
      dispatchTime: orderDeliveryUserInfo.value.dispatchTime,
      departureTime: orderDeliveryUserInfo.value.departureTime,
      deliveryCompanyId: orderDeliveryUserInfo.value.id,
      updatedAt: new Date(),
    }
    console.log("updateOrderInfo")

    console.log(updateOrderInfo)
    await userData.updateOrder(updateOrderInfo)

  } else {
    // 新規登録
    const orderInfo = {
      // 案件登録中：1
      state: $Const.STATUS_DRAFT,
      companyId: keyUserId,
      applicant: utils.toBlank(applicant.value),
      emergencyContact: utils.toBlank(emergencyContact.value),
      tourOrganization: utils.toBlank(tourOrganization.value),
      remarks: utils.toBlank(remarks.value),
      customerId: utils.toBlank(applicantCustomerId),
      deliveryLocation: orderDeliveryUserInfo.value.deliveryLocation,
      dispatchDate: orderDeliveryUserInfo.value.dispatchDate,
      dispatchTime: orderDeliveryUserInfo.value.dispatchTime,
      departureTime: orderDeliveryUserInfo.value.departureTime,
      deliveryCompanyId: orderDeliveryUserInfo.value.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    // console.log(orderInfo)
    await userData.addOrder(orderInfo)
  }

  // stateのクリア
  clearOrderInfo(orderInfo)
  clearApplicantCustomerInfo(applicantCustomerInfo)
  clearOrderDeliveryUserInfo(orderDeliveryUserInfo)


  // 画面遷移
  router.push('/user/order/list')

}

/** 登録した案件情報をstateに保持して次工程へ */
const entryForm = async () => {
  // 案件情報を保存
  // stateへ保存
  const orderInfo = {
    id:keyOrderId,
    state: $Const.STATUS_DRAFT,
    companyId: keyUserId,
    applicant: applicant.value,
    emergencyContact: utils.toBlank(emergencyContact.value),
    tourOrganization: utils.toBlank(tourOrganization.value),
    remarks: utils.toBlank(remarks.value),
    customerId: utils.toBlank(applicantCustomerId),
  }
  editOrderInfo(orderInfo)

  // 画面遷移
  router.push('/user/order/entryDeliveryInfo')

}

/** 前の画面へ戻る */
const back = () => {
  // stateのクリア
  clearOrderInfo(orderInfo)
  clearApplicantCustomerInfo(applicantCustomerInfo)
  clearOrderDeliveryUserInfo(orderDeliveryUserInfo)

  // 画面遷移
  router.push('/user/order/list')
}

definePageMeta({
  layout: 'user'
})
</script>
