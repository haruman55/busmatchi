<template>
  <v-container max-width="1200">
    <!-- <v-row no-gutters>
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
 -->
    <v-row>
      <v-col cols="12" sm="4" md="4">
        <v-card flat rounded="xl"  class="mx-auto" width="300" height="420" color="primary" dark @click="showOrder">
          <v-card-text class="py-0" align="center">
            <v-icon size="100" color="white">mdi-pencil-circle-outline</v-icon>
          </v-card-text>
          <v-card-item title="案件管理" class="text-center" />
          <v-card-text class="py-0">
            <v-row align="center" justify="center" no-gutters>
              <v-col class="text-h2" align="center" cols="12"> {{ orderList.length }}件 </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="4" md="4">
        <v-card flat rounded="xl" class="mx-auto" width="300" height="420" color="secondary" @click="showContract">
          <v-card-text class="py-0" align="center">
            <v-icon size="100" >mdi-file-document-outline</v-icon>
          </v-card-text>
          <v-card-item title="契約管理" class="text-center" />
          <v-card-text class="py-0">
            <v-row align="center" justify="center" no-gutters>
              <v-col class="text-h2" align="center" cols="12"> {{ contractList.length }}件 </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-divider thickness="1" vertical />

      <v-col cols="12" sm="4" md="4">
        <v-card  flat rounded="xl" class="mx-auto" width="300" height="200" @click="showCustomer">
          <v-card-item title="ご利用顧客" />

          <v-card-text class="py-0">
            <v-row align="center" no-gutters>
              <v-col class="text-h2" align="center" cols="6"> {{ customerList.length }}社 </v-col>
              <v-icon color="yellow" icon="mdi-card-account-details-outline" size="70" />
            </v-row>
          </v-card-text>
        </v-card>
        <br />

        <v-card flat rounded="xl"  class="mx-auto" width="300" height="200" >
          <v-card-item title="運送引受会社" />

          <v-card-text class="py-0">
            <v-row align="center" no-gutters>
              <v-col class="text-h2" align="center" cols="6"> {{ deliveryUserList.length }}社 </v-col>
              <v-icon icon="mdi-bus" size="70" />
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
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
const userData = useUserData()
const db = useFirestore()
// 登録顧客情報取得
const customerList = await userData.getUserCustomerList(userInfo.value.companyId)
// 登録案件情報取得
const orderList = await userData.getOrderList(userInfo.value.companyId)

// 支払～完了までの登録案件情報取得
const statusArray = [
  $Const.STATUS_PAYMENT_METHOD_CONFIRMED,
  $Const.STATUS_TRANSPORTATION_COMPLETED,
  $Const.STATUS_PAYMENT_COMPLETED,
  $Const.STATUS_ORDER_COMPLETED,
]
const contractList = await userData.getOrderList(userInfo.value.companyId, statusArray)

// 運送引受会社情報(マスタ)取得
const deliveryUserList = await db.getQueryDocument({
  path: 'company',
  where: [{ fieldPath: 'category', opStr: '==', value: '2' }],
})

/**
 * 画面初期処理
 */
onMounted(async () => {
  // 導線の初期化
  const initAction = {
    act: $Const.USER_ACTION_MYPAGE,
  }
  editActionInfo(initAction)
})

/**
 * 案件一覧画面を表示
 */
const showOrder = () => {
  const setAction = {
    act: $Const.USER_ACTION_ORDER,
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
    act: $Const.USER_ACTION_CONTRACT,
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

// const showInformation = () => {
//   $swal.fire({
//     text: '[未実装]インフォメーションの詳細がみれます',
//     showCancelButton: false,
//     confirmButtonText: 'OK',
//     icon: 'info',
//   })
// }

definePageMeta({
  layout: 'user',
})
</script>
