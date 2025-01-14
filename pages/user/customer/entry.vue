<template>
  <div>
    <v-container class="fill-height align-center" fluid>
      <v-row no-gutters>
        <v-col>
          <v-card-text class="font-weight-bold text-h5">
            <v-icon left x-large @click="back">
              mdi-close
            </v-icon>
            顧客情報を登録する
          </v-card-text>
        </v-col>
      </v-row>
    </v-container>

    <v-container>
      <v-form ref="entry_form">
        <v-row justify="center" no-gutters>
          <v-col>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field v-model="customerName" label="顧客名" outlined />
                  </v-col>

                  <v-col cols="12" sm="12" md="12">
                    <v-text-field v-model="customerAddr" label="住所" outlined />
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field v-model="customerTel" label="Tel" outlined />
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field v-model="customerFax" label="Fax" outlined />
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field v-model="customerMail" label="e-Mail" outlined />
                  </v-col>


                </v-row>
              </v-container>
            </v-card-text>
          </v-col>
        </v-row>

        <v-row justify="center" no-gutters>
          <v-col align="center">
            <v-btn block rounded dark size="x-large" color="indigo darken-4" class="mb-2 pr-8 pl-8" @click="entry">
              登 録
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </div>
</template>
<script setup>
const { $swal } = useNuxtApp()
const router = useRouter()
const userData = useUserData();
// 共通関数の呼び出し
const utils = useUtils();
// user情報の状態管理
const { userInfo } = useUserInfo()
const keyUserId = userInfo.value.companyId
// 顧客情報の状態管理
const { customerInfo, clearCustomerInfo } = useCustomerInfo()

const customerName = ref(customerInfo.value.customerName)
const customerAddr = ref(customerInfo.value.customerAddr)
const customerTel = ref(customerInfo.value.customerTel)
const customerFax = ref(customerInfo.value.customerFax)
const customerMail = ref(customerInfo.value.customerMail)


/** 前の画面へ戻る */
const back = () => {
  clearCustomerInfo(customerInfo)

  // 画面遷移
  router.push('/user/customer/list')
}
/**
 * 
 */
const entry = async () => {
  if (customerName.value === '') {
    $swal.fire({
      text: '顧客名を入力してください。',
      confirmButtonColor: "#00BCD4",
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning'
    })
    return
  }

  let confirmRes = false
  await $swal.fire({
    text: '入力した内容で顧客情報を登録します。よろしいですか？',
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


  // TODO:顧客IDの採番 一旦ランダム
  const customerId = Math.random().toString(32).substring(2)
  const customerInfo = {
    companyId: keyUserId,
    customerId: customerId,
    customerName: customerName.value,
    customerAddr: utils.toBlank(customerAddr.value),
    customerTel: utils.toBlank(customerTel.value),
    customerFax: utils.toBlank(customerFax.value),
    customerMail: utils.toBlank(customerMail.value),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  await userData.addCustomer(customerInfo)

  router.push('/user/customer/list')
}

</script>
