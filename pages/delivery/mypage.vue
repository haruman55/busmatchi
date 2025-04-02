<template>
  <div>
    <br>
    <!-- <v-container class="fill-height align-center" fluid>
      <v-row><v-col><v-card-title class="text-h5">マイページ</v-card-title></v-col></v-row>
    </v-container> -->
    <v-container class="fill-height align-center" fluid>
      <v-row>
        <v-col cols="12">
          <v-card-title><v-icon color="red">mdi-chat-outline</v-icon>インフォメーション</v-card-title>
          <v-card class="overflow-y-auto overflow-x-hidden">
            <v-row>
              <v-col>
                <a href="" @click.prevent.stop="showInformation()">XXXXX社から運送申込書が届いています。</a>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <a href="" @click.prevent.stop="showInformation()">XXXXX社との運送手配が完了しました。</a>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <a href="" @click.prevent.stop="showInformation()">XXXXX社から運送申込書の修正通知が届いています。</a>
              </v-col>
            </v-row>

          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-container class="fill-height align-center" fluid>
      <v-row>
        <v-col cols="12" sm="3" md="3">
          <v-card class="mx-auto" width="300" height="420" elevation="15" color="indigo" dark  @click="showOrder">
            <v-card-item title="案件管理" />
            <v-card-text class="py-0">
              <v-row align="center" no-gutters>
                <v-col class="text-h2" align="center" cols="6">
                  {{ orderList.length }}件
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-text class="py-0" align="right">
            <v-img  width="200" height="300" src="/img/orderIcon.png"/>
            </v-card-text>

          </v-card>
        </v-col>
        <v-col cols="12" sm="3" md="3">
          <v-card class="mx-auto" width="300" height="420" elevation="15" color="red-lighten-2" @click="showReservation">
            <v-card-item title="運行管理" />

            <v-card-text class="py-0">
              <v-overlay :model-value="loading" class="align-center justify-center">
                <v-progress-circular color="primary" size="150" width="20" indeterminate />
              </v-overlay>

            </v-card-text>
            <v-card-text class="py-0" align="right">
            <v-img  width="200" height="200" src="/img/reservationIcon.png"/>
            <v-icon color="red" icon="mdi-bus" size="70" />
                  <v-icon color="indigo" icon="mdi-card-account-details-outline" size="70" />
                  <v-icon color="success" icon="mdi-human-female-dance" size="70" />
            </v-card-text>

          </v-card>
        </v-col>
        <v-divider thickness="1" vertical />

        <v-col cols="12" sm="6" md="6">
          <v-row>
            <v-col cols="12" sm="6" md="6">
              <v-card class="mx-auto" width="300" height="150" elevation="15" @click="showBus">
                <v-card-item title="バス" />
                <v-card-text class="py-0">
                  <v-row align="center" no-gutters>
                    <v-col class="text-h2" align="center" cols="6">
                      {{ busList.length }}台
                    </v-col>
                    <v-col class="text-right" cols="6">
                      <v-icon color="red" icon="mdi-bus" size="70" />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-card class="mx-auto" width="300" height="150" elevation="15" @click="showParking">
                <v-card-item title="駐車場" />
                <v-card-text class="py-0">
                  <v-row align="center" no-gutters>
                    <v-col class="text-h2" align="center" cols="6">
                      {{ parkingList.length }}
                    </v-col>
                    <v-col class="text-right" cols="6">
                      <v-icon color="red" icon="mdi-map-marker" size="70" />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" sm="6" md="6">
              <v-card class="mx-auto" width="300" height="150" elevation="15" @click="showDriver">
                <v-card-item title="ドライバー" />
                <v-card-text class="py-0">
                  <v-row align="center" no-gutters>
                    <v-col class="text-h2" align="center" cols="6">
                      {{ driverList.length }}名
                    </v-col>
                    <v-col class="text-right" cols="6">
                      <v-icon color="indigo" icon="mdi-card-account-details-outline" size="70" />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-card class="mx-auto" width="300" height="150" elevation="15" @click="showGuide">
                <v-card-item title="バスガイド" />
                <v-card-text class="py-0">
                  <v-row align="center" no-gutters>
                    <v-col class="text-h2" align="center" cols="6">
                      {{ guideList.length }}名
                    </v-col>
                    <v-col class="text-right" cols="6">
                      <v-icon color="success" icon="mdi-human-female-dance" size="70" />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>


    <br>
    <v-divider />


  </div>
</template>
<script setup>
const { $swal } = useNuxtApp()
const router = useRouter()
const { $Const } = useNuxtApp()
// user情報の状態管理
const { userInfo } = useUserInfo()
// const keyUserDocId = userInfo.value.id
const keyUserId = userInfo.value.companyId
const loading = ref(false)
// ユーザ操作情報の状態管理
const { editActionInfo } = useAction()

// DB操作
const userData = useUserData();
// 登録案件情報取得
const statusArray = [$Const.STATUS_REQUEST, $Const.STATUS_UNDERTAKE, $Const.STATUS_PAYMENT_METHOD_CONFIRMED, $Const.STATUS_TRANSPORTATION_COMPLETED, $Const.STATUS_PAYMENT_COMPLETED, $Const.STATUS_ORDER_COMPLETED]
const orderList = await userData.getOrderDeliveryList(keyUserId, statusArray);

// 保有駐車地情報取得
const parkingList = await userData.getParkingList(keyUserId);
// 保有バス情報取得
const guideList = await userData.getGuideList(keyUserId);
// 保有運転手情報取得
const driverList = await userData.getDriverList(keyUserId);
// 保有バス情報取得
const busList = await userData.getBusList(keyUserId);


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
  router.push('/delivery/order/list')
}

/**
 * 配車情報一覧を表示
 */
const showReservation = () => {
  loading.value = true;

  // 画面遷移
  router.push('/delivery/reservation')

}

/**
 * 駐車地一覧画面を表示
 */
const showParking = () => {

  // 画面遷移
  router.push('/delivery/parking/list')
}

/**
 * バスガイド一覧画面を表示
 */
const showGuide = () => {

  // 画面遷移
  router.push('/delivery/guide/list')
}

/**
 * バス運転手一覧画面を表示
 */
const showDriver = () => {

  // 画面遷移
  router.push('/delivery/driver/list')
}

/**
 * バス一覧画面を表示
 */
const showBus = () => {
  if (parkingList.length === 0) {
    $swal.fire({
      text: 'バスの登録より先に駐車場を登録してください。',
      confirmButtonColor: "#00BCD4",
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning'
    })
    return
  }

  

  // 画面遷移
  router.push('/delivery/bus/list')
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
