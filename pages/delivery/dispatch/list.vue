<template>
  <div>

    <v-container class="fill-height align-center" fluid>
      <v-row no-gutters>
        <v-col>
          <v-card-text class="font-weight-bold text-h5">
            <v-icon left x-large @click="back">
              mdi-close
            </v-icon>
            配車管理 ※申込内容で対応可能なバス、乗務員を表示します。
          </v-card-text>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row>
        <v-col>
          <v-table class="table-border">
            <tbody>
              <tr align="center">
                <td rowspan="2" align="center">申込乗車人員</td>
                <td rowspan="2">{{ orderInfo.passengers }}人</td>
                <td colspan="2" rowspan="2">乗車定員別又は<br>車種別車両数</td>
                <td>リフト</td>
                <td>中型車</td>
                <td>小型車</td>
                <td>マイクロ</td>
                <td>計</td>
              </tr>
              <tr align="center">
                <td>{{ orderInfo.vehicleTypeLiftAmount }}両</td>
                <td>{{ orderInfo.vehicleTypeMediumAmount }}両</td>
                <td>{{ orderInfo.vehicleTypeSmallAmount }}両</td>
                <td>{{ orderInfo.vehicleTypeMicroAmount }}両</td>
                <td>{{ totalvehicleAmount }}両</td>
              </tr>
            </tbody>

            <tbody>
              <tr align="center">
                <td rowspan="2" align="center">配車日時</td>
                <td colspan="3" class="text-h4">{{ orderInfo.dispatchDate }} {{ orderInfo.dispatchTime }}</td>
                <td rowspan="2" align="center">配車場所</td>
                <td rowspan="2" colspan="4" align="center">{{ orderInfo.deliveryLocation }}</td>
              </tr>
            </tbody>
            <tbody>
              <tr class="dashed-border" align="center">
                <td>終着日時</td>
                <td colspan="3" class="text-h4">{{ orderOperationInfo.endDate }} {{ orderOperationInfo.endingTime }}
                </td>
                <td rowspan="2" align="center">終着場所</td>
                <td rowspan="2" colspan="4" align="center">{{ orderOperationInfo.terminalLocation }}</td>
              </tr>
            </tbody>

          </v-table>
        </v-col>
      </v-row>
    </v-container>

    <v-container class="fill-height align-center" fluid>
      <v-toolbar-title class="font-weight-bold">
        配車可能リスト <v-btn icon @click="showAllResource">
          <v-icon>mdi-apps</v-icon>
        </v-btn><v-divider />
      </v-toolbar-title>
    </v-container>
    <v-container class="fill-height align-center" fluid>
      <v-row>
        <v-col>
          <v-card>
            <v-row justify="center" no-gutters>
              <v-col>
                <v-data-table :headers="busListHeaders" :items="busList" hide-default-footer class="text-pre-wrap">
                  <template #[`item.selectBus`]="{ item }">
                    <v-checkbox-btn v-model="item.selectBus" />
                  </template>
                  <template #[`item.vehicleType`]="{ item }">
                    {{ $Const.VEHICLE_TYPE_DISP[item.vehicleType].text }}
                  </template>

                </v-data-table>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-container class="fill-height align-center" fluid>
      <v-row>
        <v-col>
          <v-card>
            <v-row justify="center" no-gutters>
              <v-col>
                <v-data-table
:headers="driverListHeaders" :items="driverList" hide-default-footer
                  class="text-pre-wrap">
                  <template #[`item.selectDriver`]="{ item }">
                    <v-checkbox-btn v-model="item.selectDriver" />
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-container class="fill-height align-center" fluid>
      <v-row>
        <v-col>
          <v-card>
            <v-row justify="center" no-gutters>
              <v-col>
                <v-data-table :headers="guideListHeaders" :items="guideList" hide-default-footer class="text-pre-wrap">
                  <template #[`item.selectGuide`]="{ item }">
                    <v-checkbox-btn v-model="item.selectGuide" />
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container class="align-center" fluid>
      <v-row justify="center" no-gutters>
        <v-col align="center">
          <v-btn rounded dark size="x-large" color="grey" class="mb-2 pr-8 pl-8" @click="back">
            戻 る
          </v-btn>
        </v-col>
        <v-spacer />

        <v-col align="center">
          <v-btn rounded dark size="x-large" color="indigo darken-4" class="mb-2 pr-8 pl-8" @click="dispatch">
            配車登録する
          </v-btn>
        </v-col>
        <v-spacer />

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

// 案件情報を保持
const { orderInfo } = useOrderInfo()
// 運行情報を保持
const { orderOperationInfo } = useOrderOperationInfo()

// バス情報を保持
const { busInfo, editBusInfo } = useBusInfo()
// 運転手情報を保持
const { driverInfo, editDriverInfo } = useDriverInfo()
// ガイド情報を保持
const { guideInfo, editGuideInfo } = useGuideInfo()

// 配車情報を保持
const { dispatchInfo, editDispatchInfo } = useDispatchInfo()


// ユーザ操作情報を保持
const { actionInfo } = useAction()
const act = actionInfo.value.act

// 合計を計算するcomputedプロパティ
const totalvehicleAmount = computed(() => {
  return (orderInfo.value.vehicleTypeLiftAmount || 0) + (orderInfo.value.vehicleTypeMediumAmount || 0) + (orderInfo.value.vehicleTypeSmallAmount || 0) + (orderInfo.value.vehicleTypeMicroAmount || 0);
});


/**
 * バス情報取得の一覧を取得する。
 */
const getBusInfoList = async () => {
  const busList = await userData.getBusList(keyUserId);
  // 既に配車選択済みのバス情報一覧(チェック状態にするための処理)
  const dispatchBusList = dispatchInfo.value.busList
  const busInfoListArray = []
  for (let i = 0; i < busList.length; i++) {
    const busId = busList[i].id
    const isdispatched = dispatchBusList.some(dispatchBus => {
      return dispatchBus.id === busId;
    })
    // バスが配置されている駐車場のdocid
    const parkingId = busList[i].parkingId
    const parkingData = await userData.getParkingData(parkingId)
    const busInfoObj = {
      id: busId,
      companyId: busList[i].companyId,
      vehicleNo: busList[i].vehicleNo,
      vehicleType: busList[i].vehicleType,
      remarks: busList[i].remarks,
      parkingId: parkingId,
      parking: parkingData.parking,
      parkingAddr: parkingData.parkingAddr,
      parkingRemarks: parkingData.remarks,
      selectBus: isdispatched,
    }
    busInfoListArray.push(busInfoObj)
  }
  return busInfoListArray
}
const busList = await getBusInfoList();

// バス情報のデータテーブルヘッダ定義
const busListHeaders = [
  {
    title: '',
    key: 'selectBus',
    sortable: true
  },
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

]

/**
 * 運転手情報取得の一覧を取得する。
 */
const getDriverInfoList = async () => {
  const driverList = await userData.getDriverList(keyUserId);
  // 既に配車選択済みの運転手情報一覧(チェック状態にするための処理)
  const dispatchDriverList = dispatchInfo.value.driverList
  const driverInfoListArray = []
  for (let i = 0; i < driverList.length; i++) {
    const driverId = driverList[i].id
    const isdispatched = dispatchDriverList.some(dispatchDriver => {
      return dispatchDriver.id === driverId;
    })
    const driverInfoObj = {
      id: driverId,
      companyId: driverList[i].companyId,
      driverName: driverList[i].driverName,
      driverNameKana: driverList[i].driverNameKana,
      contact: driverList[i].contact,
      remarks: driverList[i].remarks,
      selectDriver: isdispatched,
    }
    driverInfoListArray.push(driverInfoObj)
  }
  return driverInfoListArray
}
const driverList = await getDriverInfoList();


// バス運転手のデータテーブルヘッダ定義
const driverListHeaders = [
  {
    title: '',
    key: 'selectDriver',
    sortable: true
  },

  {
    title: '運転手名',
    key: 'driverName',
    sortable: true
  },
  {
    title: '運転手名（カナ）',
    key: 'driverNameKana',
    sortable: true
  },
  {
    title: '連絡先',
    key: 'contact',
    sortable: true
  },
  {
    title: '備考',
    key: 'remarks',
    sortable: false
  },
]

/**
 * バス情報取得の一覧を取得する。
 */
const getGuideInfoList = async () => {
  const guideList = await userData.getGuideList(keyUserId);
  // 既に配車選択済みの運転手情報一覧(チェック状態にするための処理)
  const dispatchGuideList = dispatchInfo.value.guideList
  const guideInfoListArray = []
  for (let i = 0; i < guideList.length; i++) {
    const guideId = guideList[i].id
    const isdispatched = dispatchGuideList.some(dispatchGuide => {
      return dispatchGuide.id === guideId;
    })
    const guideInfoObj = {
      id: guideId,
      companyId: guideList[i].companyId,
      guideName: guideList[i].guideName,
      guideNameKana: guideList[i].guideNameKana,
      contact: guideList[i].contact,
      remarks: guideList[i].remarks,
      selectGuide: isdispatched,
    }
    guideInfoListArray.push(guideInfoObj)
  }
  return guideInfoListArray
}
const guideList = await getGuideInfoList();


// バスガイドのデータテーブルヘッダ定義
const guideListHeaders = [
  {
    title: '',
    key: 'selectGuide',
    sortable: true
  },

  {
    title: 'ガイド名',
    key: 'guideName',
    sortable: true
  },
  {
    title: 'ガイド名（カナ）',
    key: 'guideNameKana',
    sortable: true
  },
  {
    title: '連絡先',
    key: 'contact',
    sortable: true
  },
  {
    title: '備考',
    key: 'remarks',
    sortable: false
  },
]

const dispatch = async () => {
  const checkedBusItems = busList.filter(item => item.selectBus);
  const checkedDriverItems = driverList.filter(item => item.selectDriver);
  const checkedGuideItems = guideList.filter(item => item.selectGuide);

  // バスの必須選択チェック
  if (checkedBusItems.length == 0) {
    $swal.fire({
      text: '配車するバスを選択してください。',
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning'
    })
    return
  }
  // 運転手の必須選択チェック
  if (checkedDriverItems.length == 0) {
    $swal.fire({
      text: '運転手を選択してください。',
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning'
    })
    return
  }


  let confirmRes = false
  if (checkedBusItems.length < totalvehicleAmount.value) {
    await $swal.fire({
      text: '選択した車両数が申込車両数より少ないです。よろしいですか？',
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
  }

  if (checkedDriverItems.length < totalvehicleAmount.value) {
    await $swal.fire({
      text: '選択した運転手が申込車両数より少ないです。よろしいですか？',
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
  }

  if (checkedGuideItems.length < 0) {
    await $swal.fire({
      text: 'バスガイドを選択していません。よろしいですか？',
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
  }





  await $swal.fire({
    text: '選択した内容で配車手配をします。よろしいですか？',
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

  const dispatchInfoObj = {
    id: '',
    // TODO:配車は案件に紐付くからcompanyIdはいらないかも
    companyId: keyUserId,
    orderId: orderInfo.value.id,
    busList: checkedBusItems,
    driverList: checkedDriverItems,
    guideList: checkedGuideItems,

  }
  // 選択情報をstateにセット
  editDispatchInfo(dispatchInfoObj)
  // 画面描画
  router.push('/delivery/order/entry')

}

/**
 * すべての保有リソースを確認できる画面表示
 */
const showAllResource = () => {
  $swal.fire({
    html: '開発途中！！<br>モーダルでバス、ドライバー、ガイドのスケジュールが見れる画面を表示する',
    showCancelButton: false,
    confirmButtonText: 'OK',
    icon: 'warning'
  })
  return
}


/** 前の画面へ戻る */
const back = () => {
  // if (act == $Const.USER_ACTION_ORDER) {
  // 画面遷移
  // router.push('/user/order/entryBaseInfo')
  router.push('/delivery/order/entry')

  // } else {
  //   // 画面遷移
  //   router.push('/delivery/mypage')

  // }
}



</script>
