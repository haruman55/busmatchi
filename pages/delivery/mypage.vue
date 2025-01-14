<template>
  <div>
    <v-container class="fill-height align-center" fluid>
      <v-card color="#bae6fd" class="mx-auto" width="600" height="210" elevation="15">
        <v-card-item class=" text-h4">
          {{ userInfo.companyName }}
          <template #prepend>
          <v-icon color="red" icon="mdi-bus"/>
        </template>

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
              {{ orderList.length }}件
            </v-col>
            <v-col class="text-right" cols="6">
              <v-icon color="indigo" icon="mdi-note-plus-outline" size="70" />
            </v-col>

          </v-row>
        </v-card-text>
      </v-card>
      <v-card class="mx-auto" width="300" height="150" elevation="15" >
        <v-card-item title="運行状況" />

        <v-card-text class="py-0">
          <v-row align="center" no-gutters>
            <v-col class="text-h2" align="center" cols="6">
              2台
            </v-col>
            <v-col class="text-right" cols="6">
              <v-icon color="indigo" icon="mdi-note-plus-outline" size="70" />
            </v-col>

          </v-row>
        </v-card-text>
      </v-card>
    </v-container>
    <br>
    <v-divider />
    <v-container class="fill-height align-center" fluid>

    

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
      <v-card class="mx-auto" width="300" height="150" elevation="15" @click="showDriver">
        <v-card-item title="ドライバー" />
        <v-card-text class="py-0">
          <v-row align="center" no-gutters>
            <v-col class="text-h2" align="center" cols="6">
              {{driverList.length}}名
            </v-col>
            <v-col class="text-right" cols="6">
              <v-icon color="indigo" icon="mdi-card-account-details-outline" size="70" />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-card class="mx-auto" width="300" height="150" elevation="15" @click="showGuide">
        <v-card-item title="バスガイド" />
        <v-card-text class="py-0">
          <v-row align="center" no-gutters>
            <v-col class="text-h2" align="center" cols="6">
              {{guideList.length}}名
            </v-col>
            <v-col class="text-right" cols="6">
              <v-icon color="success" icon="mdi-human-female-dance" size="70" />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-card class="mx-auto" width="300" height="150" elevation="15" @click="showParking">
        <v-card-item title="駐車場" />
        <v-card-text class="py-0">
          <v-row align="center" no-gutters>
            <v-col class="text-h2" align="center" cols="6">
              {{parkingList.length}}
            </v-col>
            <v-col class="text-right" cols="6">
              <v-icon color="red" icon="mdi-map-marker" size="70" />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>


    </v-container>
    <br>
    <v-divider />


  </div>
</template>
<script setup>
// const { $swal } = useNuxtApp()
const router = useRouter()
const { $Const } = useNuxtApp()
// user情報の状態管理
const { userInfo } = useUserInfo()
const keyUserId = userInfo.value.companyId

// ユーザ操作情報の状態管理
const { editActionInfo } = useAction()

// DB操作
const userData = useUserData();
// 登録案件情報取得
const orderList = await userData.getOrderList(keyUserId);
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
 * 駐車地一覧画面を表示
 */
 const showParking = () => {
  const setAction = {
    act: "1"
  }
  editActionInfo(setAction)

  // 画面遷移
  router.push('/delivery/parking/list')
}

/**
 * バスガイド一覧画面を表示
 */
 const showGuide = () => {
  const setAction = {
    act: "1"
  }
  editActionInfo(setAction)

  // 画面遷移
  router.push('/delivery/guide/list')
}

/**
 * バス運転手一覧画面を表示
 */
 const showDriver = () => {
  const setAction = {
    act: "1"
  }
  editActionInfo(setAction)

  // 画面遷移
  router.push('/delivery/driver/list')
}

/**
 * バス一覧画面を表示
 */
 const showBus = () => {
  const setAction = {
    act: "1"
  }
  editActionInfo(setAction)

  // 画面遷移
  router.push('/delivery/bus/list')
}



definePageMeta({
  layout: 'user'
})
</script>
