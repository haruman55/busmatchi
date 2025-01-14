<template>
  <div>
    <v-container class="fill-height align-center" fluid>
      <v-card color="teal-accent-2" class="mx-auto" width="600" height="210" elevation="15">
        <v-card-item class="text-center text-h4">
          {{ userInfo.companyName }}
        </v-card-item>
        <br>
        <v-card-item class="text-right text-h5">
          {{ $Const.USER_CATEGORY_DISP[userInfo.category].text }}
        </v-card-item>
        <v-card-item class="text-right text-h5">
          ID：{{ userInfo.companyId }}
        </v-card-item>
        <br>

      </v-card>
    </v-container>




    <v-container class="fill-height align-center" fluid>
      <v-row no-gutters>
        <v-col>
          <v-toolbar-title class="font-weight-bold">
            <v-divider />
          </v-toolbar-title>
        </v-col>
      </v-row>
    </v-container>

    <v-container class="fill-height align-center" fluid>
      <v-card class="mx-auto" width="300" height="150" elevation="15" @click="showOrder">
        <v-card-item title="案件" />

        <v-card-text class="py-0">
          <v-row align="center" no-gutters>
            <v-col class="text-h2" align="center" cols="6">
              {{ orderList.length }}社
            </v-col>
            <v-col class="text-right" cols="6">
              <v-icon color="indigo" icon="mdi-note-plus-outline" size="70" />
            </v-col>

          </v-row>
        </v-card-text>
      </v-card>
      <v-card class="mx-auto" width="300" height="150" elevation="15" @click="showCustomer">
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

      <v-card class="mx-auto" width="300" height="150" elevation="15">
        <v-card-item title="契約履歴" />

        <v-card-text class="py-0">
          <v-row align="center" no-gutters>
            <v-col class="text-h2" align="center" cols="6">
              10件
            </v-col>
            <v-col class="text-right" cols="6">
              <v-icon color="green" icon="mdi-check-circle-outline" size="70" />
            </v-col>

          </v-row>
        </v-card-text>
      </v-card>

    </v-container>
    <br>
    <v-divider />
    <v-container class="fill-height align-center" fluid>

      <v-card class="mx-auto" width="300" height="150" elevation="15">
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


    </v-container>
    <v-divider />


  </div>
</template>
<script setup>
// const { $swal } = useNuxtApp()
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
// 運送引受会社情報(マスタ)取得
const deliveryUserList = await userData.getDeliveryUser();


/**
 * 画面初期処理
 */
onMounted(async () => {
  // 導線の初期化
  const initAction = {
    act: ""
  }
  editActionInfo(initAction)
})



/**
 * 案件一覧画面を表示
 */
const showOrder = () => {
  const setAction = {
    act: "1"
  }
  editActionInfo(setAction)

  // 画面遷移
  router.push('/user/order/list')
}

/**
 * 顧客一覧画面を表示
 */
const showCustomer = () => {
  const setAction = {
    act: "2"
  }
  editActionInfo(setAction)

  // 画面遷移
  router.push('/user/customer/list')

}




definePageMeta({
  layout: 'user'
})
</script>
