<template>
  <div>
    <br>
    <!-- <v-container class="fill-height align-center" fluid>
      <v-row><v-col><v-card-title class="text-h5"  >マイページ</v-card-title></v-col></v-row>
      </v-container> -->
    <v-container class="fill-height align-center" fluid>
      <v-row>
        <v-col cols="12">
          <v-card-title><v-icon color="red">mdi-chat-outline</v-icon>インフォメーション</v-card-title>
          <v-card class="overflow-y-auto overflow-x-hidden">
            <v-row>
              <v-col>
                <a href="" @click.prevent.stop="showInformation()">XXXXX社が運送手配完了しました。</a>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <a href="" @click.prevent.stop="showInformation()">XXXXX社から運送手配が断られました。</a>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <a href="" @click.prevent.stop="showInformation()">XXXXX社との支払確認が完了しました。</a>
              </v-col>
            </v-row>

          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-container class="fill-height align-center" fluid>
      <v-row>
        <v-col cols="12" sm="4" md="4">
          <v-card class="mx-auto" width="300" height="420" elevation="15" color="indigo" dark @click="showOrder">
            <v-card-item title="案件" />

            <v-card-text class="py-0">
              <v-row align="center" no-gutters>
                <v-col class="text-h2" align="center" cols="6">
                  {{ orderList.length }}件
                </v-col>
                <v-col class="text-right" cols="6">
                  <v-icon icon="mdi-note-plus-outline" size="70" />
                </v-col>

              </v-row>
            </v-card-text>
          </v-card>

        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-card class="mx-auto" width="300" height="420" elevation="15" @click="showContract">
            <v-card-item title="契約管理" />

            <v-card-text class="py-0">
              <v-row align="center" no-gutters>
                <v-col class="text-h2" align="center" cols="6">
                  {{ contractList.length }}件
                </v-col>
                <v-col class="text-right" cols="6">
                  <v-icon color="green" icon="mdi-check-circle-outline" size="70" />
                </v-col>

              </v-row>
            </v-card-text>
          </v-card>

        </v-col>
        <v-divider thickness="1" vertical />

        <v-col cols="12" sm="4" md="4">
          <v-card class="mx-auto" width="300" height="200" elevation="15" @click="showCustomer">
            <v-card-item title="ご利用顧客" />

            <v-card-text class="py-0">
              <v-row align="center" no-gutters>
                <v-col class="text-h2" align="center" cols="6">
                  {{ customerList.length }}社
                </v-col>
                <v-icon color="yellow" icon="mdi-card-account-details-outline" size="70" />

              </v-row>
            </v-card-text>
          </v-card>
          <br>

          <v-card class="mx-auto" width="300" height="200" elevation="15">
            <v-card-item title="運送引受会社" />

            <v-card-text class="py-0">
              <v-row align="center" no-gutters>
                <v-col class="text-h2" align="center" cols="6">
                  {{ deliveryUserList.length }}社
                </v-col>
                <v-icon color="red" icon="mdi-bus" size="70" />

              </v-row>
            </v-card-text>
          </v-card>

        </v-col>
      </v-row>
    </v-container>


    <br>
    <v-divider />
    <!-- <v-container class="fill-height align-center" fluid>
      <v-row align="center">
      <v-col >

      <v-card class="mx-auto" width="400" height="150" elevation="15">
        <v-card-item title="運送引受会社" />

        <v-card-text class="py-0">
          <v-row align="center" no-gutters>
            <v-col class="text-h2" align="center" cols="6">
              {{ deliveryUserList.length }}社
            </v-col>
            <v-icon color="red" icon="mdi-bus" size="70" />

          </v-row>
        </v-card-text>
      </v-card>
      </v-col>
      </v-row>



    </v-container> -->
    <v-divider />


  </div>
</template>
<script setup>
const { $swal } = useNuxtApp()
const router = useRouter()
const { $Const } = useNuxtApp()
// user情報の状態管理
const userState = useUserInfo()
const { userInfo } = userState

// ユーザ操作情報の状態管理
const { editActionInfo } = useAction()

// DB操作
const userData = useUserData();
// 登録顧客情報取得
const customerList = await userData.getUserCustomerList(userInfo.value.companyId);
// 登録案件情報取得
const orderList = await userData.getOrderList(userInfo.value.companyId);

// 支払～完了までの登録案件情報取得
const statusArray = [ $Const.STATUS_PAYMENT_METHOD_CONFIRMED, $Const.STATUS_TRANSPORTATION_COMPLETED, $Const.STATUS_PAYMENT_COMPLETED, $Const.STATUS_ORDER_COMPLETED]
const contractList = await userData.getOrderList(userInfo.value.companyId,statusArray);

// 運送引受会社情報(マスタ)取得
const deliveryUserList = await userData.getDeliveryUser();


/**
 * 画面初期処理
 */
onMounted(async () => {
  // 導線の初期化
  const initAction = {
    act: $Const.USER_ACTION_MYPAGE
  }
  editActionInfo(initAction)
})



/**
 * 案件一覧画面を表示
 */
const showOrder = () => {
  const setAction = {
    act: $Const.USER_ACTION_ORDER
  }
  editActionInfo(setAction)

  // 画面遷移
  router.push('/user/order/list')
}
/**
 * 契約一覧画面を表示
 */
const showContract = () => {
  const setAction = {
    act: $Const.USER_ACTION_CONTRACT
  }
  editActionInfo(setAction)

  // 画面遷移
  router.push('/user/contract/list')


}

/**
 * 顧客一覧画面を表示
 */
const showCustomer = () => {

  // 画面遷移
  router.push('/user/customer/list')

}

const showInformation = () => {
  $swal.fire({
    text: '[未実装]インフォメーションの詳細がみれます',
    showCancelButton: false,
    confirmButtonText: 'OK',
    icon: 'info'
  })


}


definePageMeta({
  layout: 'user'
})
</script>
