<template>
  <v-container max-width="1200">
    <v-row no-gutters>
      <v-col>
        <v-breadcrumbs
:items="[
          { title: 'マイページ', disabled: false, to: '/delivery/mypage' },
          { title: 'バス管理', disabled: true },
        ]">
          <template #prepend>
            <v-icon icon="mdi-home" size="small" />
          </template>
          <template #divider>
            <v-icon icon="mdi-chevron-right" />
          </template>
        </v-breadcrumbs>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col align="right">
        <v-btn  size="large" rounded color="primary" @click="entry">
          バス登録
        </v-btn>
    </v-col></v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-row justify="center" no-gutters>
            <v-col>
              <v-data-table :headers="busListHeaders" :items="busList" class="text-pre-wrap bg-background">
                <template #[`item.vehicleNo`]="{ item }">
                  {{ item.vehicleNo }}
                </template>
                <template #[`item.vehicleType`]="{ item }">
                  {{ $Const.VEHICLE_TYPE_DISP[item.vehicleType].text }}
                </template>

                <template #[`item.editItem`]="{ item }">
                  <v-btn color="secondary" fab small rounded dark @click="editItemInfo(item)">
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
</template>
<script setup>
const router = useRouter()
const { $Const } = useNuxtApp()
const userData = useUserData();
// ログインユーザーのキーID
const { userInfo } = useUserInfo()
const keyUserId = userInfo.value.companyId
// バス情報を保持
const { editBusInfo } = useBusInfo()


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
