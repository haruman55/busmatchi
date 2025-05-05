<template>
  <v-container max-width="1200">
    <v-row no-gutters>
      <v-col>
        <v-breadcrumbs
:items="[
          { title: 'マイページ', disabled: true },
          { title: '案件管理', disabled: true },
          { title: '案件登録 ', disabled: false, to: '/delivery/order/entry' },
          { title: '配車登録 ', disabled: true },
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

    <v-row>
      <v-col>
        <v-table class="table-border bg-background">
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
    <v-row>
      <v-toolbar-title class="font-weight-bold">
        配車可能リスト <v-btn icon @click="showAllResource">
          <v-icon>mdi-bus-clock</v-icon>
        </v-btn><v-divider />
      </v-toolbar-title>
      <v-overlay :model-value="loading" class="align-center justify-center">
        <v-progress-circular color="primary" size="150" width="20" indeterminate />
      </v-overlay>
    </v-row>

    <v-row>
      <v-col>
        <v-card>
          <v-row justify="center" no-gutters>
            <v-col>
              <v-data-table
:headers="busListHeaders" :items="busList" hide-default-footer
                class="text-pre-wrap bg-background">
                <template #[`item.selectBus`]="{ item }">
                  <v-checkbox-btn v-if="!item.isReservation" v-model="item.selectBus" />
                  <div v-else>予約中</div>
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
    <v-row>
      <v-col>
        <v-card>
          <v-row justify="center" no-gutters>
            <v-col>
              <v-data-table
:headers="driverListHeaders" :items="driverList" hide-default-footer
                class="text-pre-wrap bg-background">
                <template #[`item.selectDriver`]="{ item }">
                  <v-checkbox-btn v-if="!item.isReservation" v-model="item.selectDriver" />
                  <div v-else>予約中</div>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-row justify="center" no-gutters>
            <v-col>
              <v-data-table
:headers="guideListHeaders" :items="guideList" hide-default-footer
                class="text-pre-wrap bg-background">
                <template #[`item.selectGuide`]="{ item }">
                  <v-checkbox-btn v-if="!item.isReservation" v-model="item.selectGuide" />
                  <div v-else>予約中</div>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <br>
    <v-row justify="center" no-gutters>
      <v-col align="center">
        <v-btn rounded dark  size="large" color="secondary" class="mb-2 pr-8 pl-8" @click="back">
          戻 る
        </v-btn>
      </v-col>
      <v-spacer />

      <v-col align="center">
        <v-btn rounded dark  size="large" color="primary" class="mb-2 pr-8 pl-8" @click="dispatch">
          配車登録する
        </v-btn>
      </v-col>
      <v-spacer />

    </v-row>
  </v-container>


</template>
<script setup>
const router = useRouter()
const { $Const } = useNuxtApp()
const { $swal } = useNuxtApp()
const userData = useUserData();
const { $dayjs } = useNuxtApp();
// ログインユーザーのキーID
const { userInfo } = useUserInfo()
const keyUserId = userInfo.value.companyId

// ユーザマスタ情報の状態管理
const { deliveryUserMasterhInfo } = useDeliveryUserMasterhInfo()

// 案件情報を保持
const { orderInfo } = useOrderInfo()
// 運行情報を保持
const { orderOperationInfo } = useOrderOperationInfo()

// 配車情報を保持
const { dispatchInfo, editDispatchInfo } = useDispatchInfo()


const loading = ref(false)

// 配車日付
const reservationFromDt = orderInfo.value.dispatchDate.replace(/\//g, "");
const reservationToDt = orderOperationInfo.value.endDate.replace(/\//g, "");


// 文字列を結合して YYYY-MM-DD HH:mm 形式に変換
const formattedSearchReservationFrom = `${reservationFromDt.slice(0, 4)}-${reservationFromDt.slice(4, 6)}-${reservationFromDt.slice(6, 8)} ${orderInfo.value.dispatchTime}`;
const formattedSearchReservationTo = `${reservationToDt.slice(0, 4)}-${reservationToDt.slice(4, 6)}-${reservationToDt.slice(6, 8)} ${orderOperationInfo.value.endingTime}`;

const SearchReservationTSFrom = new Date($dayjs(formattedSearchReservationFrom, 'YYYY-MM-DD HH:mm').valueOf());
const SearchReservationTSTo = new Date($dayjs(formattedSearchReservationTo, 'YYYY-MM-DD HH:mm').valueOf());

// 合計を計算するcomputedプロパティ
const totalvehicleAmount = computed(() => {
  return (orderInfo.value.vehicleTypeLiftAmount || 0) + (orderInfo.value.vehicleTypeMediumAmount || 0) + (orderInfo.value.vehicleTypeSmallAmount || 0) + (orderInfo.value.vehicleTypeMicroAmount || 0);
});


/**
 * バス情報取得の一覧を取得する。
 */
const getBusInfoList = async () => {

  // TODO:stateからの情報取得に変更（しばらく動作確認） const busList = await userData.getBusList(keyUserId);
  const busList = deliveryUserMasterhInfo.value.busList

  // 既に配車選択済みのバス情報一覧(チェック状態にするための処理)
  const dispatchBusList = dispatchInfo.value.busList
  const busInfoListArray = []
  for (let i = 0; i < busList.length; i++) {
    const busId = busList[i].id
    // 画面トランザクション内で保持する情報：確定(DB登録)されてはいないが、既に予約選択済みか否かのフラグ
    const isdispatched = dispatchBusList.some(dispatchBus => {
      return dispatchBus.id === busId;
    })
    // DBで保持する情報：既に予約登録済み
    let isReservation = false

    let reservationId = ''
    let reservationTimeDisp = ''
    const reservationTime = []

    const busReservationInfo = await userData.searchReservation('0', busId, SearchReservationTSFrom, SearchReservationTSTo)
    if (busReservationInfo != null && busReservationInfo.length > 0) {
      reservationId = busReservationInfo[0].id
      reservationTimeDisp = $dayjs(busReservationInfo[0].reservationFrom.toDate()).format('YYYY/MM/DD HH:mm') + ' - ' + $dayjs(busReservationInfo[0].reservationTo.toDate()).format('YYYY/MM/DD HH:mm')
      // 既に指定期間で予約済み
      isReservation = true
    }


    // バスが配置されている駐車場のdocid
    const parkingId = busList[i].parkingId
    // TODO:stateからの情報取得に変更（しばらく動作確認） const parkingData = await userData.getParkingData(parkingId)
    const parkingData = deliveryUserMasterhInfo.value.parkingList.find(
      (parking) => parking.id === parkingId
    );

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
      reservationId: reservationId,
      reservationTimeDisp: reservationTimeDisp,
      reservationTime: reservationTime,
      selectBus: isdispatched,
      isReservation: isReservation,
    }
    busInfoListArray.push(busInfoObj)
  }
  return busInfoListArray
}

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
    title: '配車予約',
    key: 'reservationTimeDisp',
    sortable: true
  },
  {
    title: 'バス備考',
    key: 'remarks',
    sortable: false
  },
  {
    title: '駐車場住所',
    key: 'parkingAddr',
    sortable: true
  },

]

/**
 * 運転手情報取得の一覧を取得する。
 */
const getDriverInfoList = async () => {
  // TODO:stateからの情報取得に変更（しばらく動作確認）const driverList = await userData.getDriverList(keyUserId);
  const driverList = deliveryUserMasterhInfo.value.driverList

  // 既に配車選択済みの運転手情報一覧(チェック状態にするための処理)
  const dispatchDriverList = dispatchInfo.value.driverList
  const driverInfoListArray = []
  for (let i = 0; i < driverList.length; i++) {
    const driverId = driverList[i].id
    const isdispatched = dispatchDriverList.some(dispatchDriver => {
      return dispatchDriver.id === driverId;
    })
    // DBで保持する情報：既に予約登録済み
    let isReservation = false

    let reservationId = ''
    let reservationTimeDisp = ''
    const reservationTime = []

    const reservationInfo = await userData.searchReservation('1', driverId, SearchReservationTSFrom, SearchReservationTSTo)
    if (reservationInfo != null && reservationInfo.length > 0) {
      reservationId = reservationInfo[0].id
      reservationTimeDisp = $dayjs(reservationInfo[0].reservationFrom.toDate()).format('YYYY/MM/DD HH:mm') + ' - ' + $dayjs(reservationInfo[0].reservationTo.toDate()).format('YYYY/MM/DD HH:mm')
      // 既に指定期間で予約済み
      isReservation = true
    }

    const driverInfoObj = {
      id: driverId,
      companyId: driverList[i].companyId,
      driverName: driverList[i].driverName,
      driverNameKana: driverList[i].driverNameKana,
      contact: driverList[i].contact,
      remarks: driverList[i].remarks,
      reservationId: reservationId,
      reservationTimeDisp: reservationTimeDisp,
      reservationTime: reservationTime,
      selectDriver: isdispatched,
      isReservation: isReservation,

    }
    driverInfoListArray.push(driverInfoObj)
  }
  return driverInfoListArray
}


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
    title: '配車予約',
    key: 'reservationTimeDisp',
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
  //  TODO:stateからの情報取得に変更（しばらく動作確認）const guideList = await userData.getGuideList(keyUserId);
  const guideList = deliveryUserMasterhInfo.value.guideList

  // 既に配車選択済みの運転手情報一覧(チェック状態にするための処理)
  const dispatchGuideList = dispatchInfo.value.guideList
  const guideInfoListArray = []
  for (let i = 0; i < guideList.length; i++) {
    const guideId = guideList[i].id
    const isdispatched = dispatchGuideList.some(dispatchGuide => {
      return dispatchGuide.id === guideId;
    })

    // DBで保持する情報：既に予約登録済み
    let isReservation = false

    let reservationId = ''
    let reservationTimeDisp = ''
    const reservationTime = []

    const reservationInfo = await userData.searchReservation('2', guideId, SearchReservationTSFrom, SearchReservationTSTo)
    // console.log(busReservationInfo)
    if (reservationInfo != null && reservationInfo.length > 0) {
      reservationId = reservationInfo[0].id
      reservationTimeDisp = $dayjs(reservationInfo[0].reservationFrom.toDate()).format('YYYY/MM/DD HH:mm') + ' - ' + $dayjs(reservationInfo[0].reservationTo.toDate()).format('YYYY/MM/DD HH:mm')
      // 既に指定期間で予約済み
      isReservation = true
    }

    const guideInfoObj = {
      id: guideId,
      companyId: guideList[i].companyId,
      guideName: guideList[i].guideName,
      guideNameKana: guideList[i].guideNameKana,
      contact: guideList[i].contact,
      remarks: guideList[i].remarks,
      reservationId: reservationId,
      reservationTimeDisp: reservationTimeDisp,
      reservationTime: reservationTime,
      selectGuide: isdispatched,
      isReservation: isReservation,

    }
    guideInfoListArray.push(guideInfoObj)
  }
  return guideInfoListArray
}


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
    title: '配車予約',
    key: 'reservationTimeDisp',
    sortable: true
  },
  {
    title: '備考',
    key: 'remarks',
    sortable: false
  },
]
// [速度Upのため、Promise.allでまとめて取得]
const [busList, driverList, guideList] = await Promise.all([
  getBusInfoList(),
  getDriverInfoList(),
  getGuideInfoList(),
]);

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
  loading.value = true;
  router.push('/delivery/reservation')
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
