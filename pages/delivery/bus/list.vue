<template>
  <div>
    <v-container class="fill-height align-center" fluid>
      <v-row no-gutters>
        <v-col>
          <v-card-text class="font-weight-bold text-h5">
            <v-icon left x-large @click="back">
              mdi-close
            </v-icon>
            バス
          </v-card-text>
        </v-col>
      </v-row>
    </v-container>
    <v-container class="fill-height align-center" fluid>
      <v-toolbar-title class="font-weight-bold">
        保有バス一覧<v-divider />
      </v-toolbar-title>
      <v-btn rounded color="success" size="x-large" @click="entry">
        バス登録
      </v-btn>
    </v-container>
    <v-container class="fill-height align-center" fluid>
      <v-row>
        <v-col>
          <v-card>
            <v-row justify="center" no-gutters>
              <v-col>
                <v-data-table :headers="busListHeaders" :items="busList" class="text-pre-wrap">
                  <template #[`item.vehicleNo`]="{ item }">
                    <!-- <div v-if="act == $Const.USER_ACTION_ORDER"> -->
                    <!-- <a href="" @click.prevent.stop="selectDriver(item)">
                      {{ item.driverName }}</a> -->
                    {{ item.vehicleNo }}
                  </template>
                  <template #[`item.vehicleType`]="{ item }">
                    {{ $Const.VEHICLE_TYPE_DISP[item.vehicleType].text }}
                  </template>

                  <template #[`item.editItem`]="{ item }">
                    <v-btn color="primary" fab small rounded dark @click="editItemInfo(item)">
                      編 集
                    </v-btn>
                  </template>
                </v-data-table>

              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script setup>
const router = useRouter()
const { $Const } = useNuxtApp()
const { $swal } = useNuxtApp()
const userData = useUserData();
// ログインユーザーのキーID
const { userInfo } = useUserInfo()
const keyUserId = userInfo.value.companyId
// バス情報を保持
const { editBusInfo } = useBusInfo()


// ユーザ操作情報を保持
const { actionInfo } = useAction()
const act = actionInfo.value.act


/**
 * バス情報取得の一覧を取得する。
 */
const getBusInfoList = async () => {
  const busList = await userData.getBusList(keyUserId);
  const busInfoListArray = []
  for (let i = 0; i < busList.length; i++) {
    // バスが配置されている駐車場のdocid
    const parkingId = busList[i].parkingId
    const parkingData = await userData.getParkingData(parkingId)
    const busInfoObj = {
      id: busList[i].id,
      companyId: busList[i].companyId,
      vehicleNo: busList[i].vehicleNo,
      vehicleType: busList[i].vehicleType,
      remarks: busList[i].remarks,
      parkingId: parkingId,
      parking: parkingData.parking,
      parkingAddr: parkingData.parkingAddr,
      parkingRemarks: parkingData.remarks,
    }
    busInfoListArray.push(busInfoObj)
  }
  return busInfoListArray
}
const busList = await getBusInfoList();



// バス情報のデータテーブルヘッダ定義
const busListHeaders = [
  {
    title: '車両ナンバー',
    key: 'vehicleNo',
    sortable: true
  },
  {
    title: '車両タイプ',
    key: 'vehicleType',
    sortable: true
  },
  {
    title: 'バス備考',
    key: 'remarks',
    sortable: false
  },
  {
    title: '駐車場',
    key: 'parking',
    sortable: true
  },
  {
    title: '駐車場住所',
    key: 'parkingAddr',
    sortable: true
  },
  {
    title: '駐車場備考',
    key: 'parkingRemarks',
    sortable: false
  },

  {
    title: '',
    key: 'editItem',
    sortable: false
  },
]

/** 前の画面へ戻る */
const back = () => {
  // if (act == $Const.USER_ACTION_ORDER) {
  // 画面遷移
  // router.push('/user/order/entryBaseInfo')
  router.push('/delivery/mypage')

  // } else {
  //   // 画面遷移
  //   router.push('/delivery/mypage')

  // }
}
/**
   * バス登録画面へ遷移
   */
const entry = () => {
  // 画面遷移
  router.push('/delivery/bus/entry')
}

/**
 * バス情報編集画面を表示
 */
const editItemInfo = (item) => {
  const selectBus = {
    id: item.id,
    companyId: item.companyId,
    vehicleNo: item.vehicleNo,
    vehicleType: item.vehicleType,
    remarks: item.remarks,
    parkingId: item.parkingId,
  }
  // 画面設定値をStateへ情報保存
  editBusInfo(selectBus)

  // 画面遷移
  router.push('/delivery/bus/update')
}


</script>
