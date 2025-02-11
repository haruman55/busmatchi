<template>
  <div>

    <v-container class="fill-height align-center" fluid>
      <v-row no-gutters>
        <v-col>
          <v-card-text class="font-weight-bold text-h5">
            <v-icon left x-large @click="back">
              mdi-close
            </v-icon>
            配車管理
          </v-card-text>
        </v-col>
      </v-row>
    </v-container>

    <v-container class="fill-height align-center" fluid>
      <v-row>
        <v-col cols="12" sm="1" md="1">配車日
        </v-col>
        <v-col cols="12" sm="2" md="2">
          <datepicker
v-model="dispatchDate" :teleport="true" locale="jp" auto-apply :enable-time-picker="true"
            format="yyyy/MM/dd" model-type="yyyy/MM/dd" @update:model-value="serach" />
        </v-col>
        <v-col cols="12" sm="2" md="2">
          <v-btn @click="changeDate(-1)"><v-icon size="x-large">mdi-chevron-left</v-icon></v-btn>
          <v-btn @click="changeDate(1)"><v-icon size="x-large">mdi-chevron-right</v-icon></v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-overlay :model-value="loading" class="align-center justify-center">
      <v-progress-circular color="primary" size="150" width="20" indeterminate />
    </v-overlay>



    <v-container class="fill-height align-center" fluid>
      <v-toolbar-title class="font-weight-bold">
        バス一覧
        <v-divider />
      </v-toolbar-title>
    </v-container>

    <v-container fluid>
      <!-- ラベル部分 -->
      <v-row align="center">
        <v-col cosl="12" sm="1" md="1" />
        <v-col v-for="(label) in $Const.TIME_ARRAY" :key="label.id" align="center" class="borderline">
          <v-sheet>{{ label.index }}</v-sheet>
        </v-col>
      </v-row>

      <!-- 中身 -->
      <v-row v-for="(busInfo) in busInfoList" :key="busInfo.id" align="center">
        <v-col cosl="12" sm="1" md="1" class="borderline"><v-card-text>{{ busInfo.vehicleNo }} {{
          $Const.VEHICLE_TYPE_DISP[busInfo.vehicleType].text
        }}</v-card-text></v-col>
        <v-col
v-for="(reservation, index) in busInfo.reservationTimeArray" :key="reservation.id" align="center"
          class="borderline" :class="{ 'bg-grey-lighten-3': reservation != '' }"
          @click="reservationItem($Const.CATEGORY_BUS, index, busInfo)" /></v-row>
    </v-container>

    <!--運転手一覧-->
    <v-container class="fill-height align-center" fluid>
      <v-toolbar-title class="font-weight-bold">
        運転手一覧
        <v-divider />
      </v-toolbar-title>
    </v-container>

    <v-container fluid>
      <!-- ラベル部分 -->
      <v-row align="center">
        <v-col cosl="12" sm="1" md="1" />
        <v-col v-for="(label) in $Const.TIME_ARRAY" :key="label.id" align="center" class="borderline">
          <v-sheet>{{ label.index }}</v-sheet>
        </v-col>
      </v-row>

      <!-- 中身 -->
      <v-row v-for="(driverInfo) in driverList" :key="driverInfo.id" align="center">
        <v-col cosl="12" sm="1" md="1" class="borderline"><v-card-text>{{ driverInfo.driverName }}</v-card-text></v-col>
        <v-col
v-for="(reservation, index) in driverInfo.reservationTimeArray" :key="reservation.id" align="center"
          class="borderline" :class="{ 'bg-grey-lighten-3': reservation != '' }"
          @click="reservationItem($Const.CATEGORY_DRIVER, index, driverInfo)" /></v-row>
    </v-container>

    <v-container class="fill-height align-center" fluid>
      <v-toolbar-title class="font-weight-bold">
        ガイド一覧
        <v-divider />
      </v-toolbar-title>
    </v-container>

    <v-container fluid>
      <!-- ラベル部分 -->
      <v-row align="center">
        <v-col cosl="12" sm="1" md="1" />
        <v-col v-for="(label) in $Const.TIME_ARRAY" :key="label.id" align="center" class="borderline">
          <v-sheet>{{ label.index }}</v-sheet>
        </v-col>
      </v-row>

      <!-- 中身 -->
      <v-row v-for="(guideInfo) in guideList" :key="guideInfo.id" align="center">
        <v-col cosl="12" sm="1" md="1" class="borderline"><v-card-text>{{ guideInfo.guideName }} </v-card-text></v-col>
        <v-col
v-for="(reservation, index) in guideInfo.reservationTimeArray" :key="reservation.id" align="center"
          class="borderline" :class="{ 'bg-grey-lighten-3': reservation != '' }"
          @click="reservationItem($Const.CATEGORY_GUIDE, index, guideInfo)" /></v-row>
    </v-container>


    <!-- モーダルコンポーネント -->
    <DeliveryItemReservation
v-if="isOpenReservation" :dispatch-date="dispatchDate" :category="selectedCategory"
      :index="selectedIndex" :reservation-id="selectedReservationId" :item="selectedItem"  @close="closeModal"
      @reload="serach" />


    <v-container class="align-center" fluid>
      <v-row justify="center" no-gutters>
        <v-col align="center">
          <v-btn rounded dark size="x-large" color="grey" class="mb-2 pr-8 pl-8" @click="back">
            閉じる
          </v-btn>
        </v-col>
        <v-spacer />

        <v-spacer />

      </v-row>
    </v-container>


  </div>
</template>
<script setup>
const router = useRouter()
const { $Const } = useNuxtApp()
const { $swal } = useNuxtApp()
const { $dayjs } = useNuxtApp();
// 共通関数の呼び出し
const utils = useUtils();

const userData = useUserData();
// ログインユーザーのキーID
const { userInfo } = useUserInfo()
const keyUserId = userInfo.value.companyId

// ユーザ操作情報を保持
const { actionInfo } = useAction()
const act = actionInfo.value.act

// 検索基点とのなる日付
const dispatchDate = ref($dayjs().format('YYYY/MM/DD'))

const loading = ref(false)
const isOpenReservation = ref(false)
// モーダルへ引き割らす選択データ
const selectedIndex = ref(0)
const selectedReservationId = ref('')
const selectedItem = ref({})
const selectedCategory = ref('')

/**
 * 画面初期処理
 */
onMounted( () => {
  // 案件登録の導線から呼び出された際は、該当案件の配車日を検索日として初期設定する。
  // const { orderInfo } = useOrderInfo()
  // if (orderInfo.value.dispatchDate != null && orderInfo.value.dispatchDate != '') {
  //   dispatchDate.value =  orderInfo.value.dispatchDate
  // }
  
})

const changeDate = (days) => {
  dispatchDate.value = $dayjs(dispatchDate.value, "YYYY/MM/DD")
    .add(days, "day")
    .format("YYYY/MM/DD");

  serach()
};



/** 
 * 内部共通関数：0,1の配列を時間へ変換する
 */
const getTimeRanges = (hours) => {
  const result = [];
  let start = null;

  for (let i = 0; i < hours.length; i++) {
    if (hours[i] === 1 && start === null) {
      start = i; // 1の開始時間を記録
    }
    if ((hours[i] === 0 || i === hours.length - 1) && start !== null) {
      let end = i;
      if (hours[i] === 1) end++; // 23時が1の場合は範囲を拡張
      result.push(`${start}時-${end - 1}時`);
      start = null; // リセット
    }
  }

  return result.join(", ");
}

/**
 * 保有バス一覧を取得
 * 保有バスと指定の日時(FROM-TO)でのそれぞれの配車予約情報(時間)を取得
 */
const getBusInfoList = async () => {
  // 配車日付
  const reservationDt = dispatchDate.value.replace(/\//g, "");

  // 文字列を結合して YYYY-MM-DD HH:mm 形式に変換
  const formattedSearchReservationFrom = `${reservationDt.slice(0, 4)}-${reservationDt.slice(4, 6)}-${reservationDt.slice(6, 8)} 00:00`;
  const formattedSearchReservationTo = `${reservationDt.slice(0, 4)}-${reservationDt.slice(4, 6)}-${reservationDt.slice(6, 8)} 23:59`;

  // dayjsでパースしてタイムスタンプに変換（ミリ秒単位）
  const SearchReservationTSFrom = new Date($dayjs(formattedSearchReservationFrom, 'YYYY-MM-DD HH:mm').valueOf());
  const SearchReservationTSTo = new Date($dayjs(formattedSearchReservationTo, 'YYYY-MM-DD HH:mm').valueOf());

  const busList = await userData.getBusList(keyUserId);
  const busInfoListArray = []
  for (let i = 0; i < busList.length; i++) {
    const busId = busList[i].id

    let reservationTime = ''
    const reservationTimeArray = ['', '', '', '', '', '', '', '', '', '', '', '',
      '', '', '', '', '', '', '', '', '', '', '', ''];

    const reservationList = await userData.searchReservationFromBase('0', busId, SearchReservationTSFrom, SearchReservationTSTo)
    let reservationId = ''
    let title = ''
    // 画面指定の予約日の情報が存在するかチェック
    if (reservationList != null && reservationList.length > 0) {
      for (let i = 0; i < reservationList.length; i++) {
        reservationId = reservationList[i].id
        title = reservationList[i].title
        const dateFrom = $dayjs(reservationList[i].reservationFrom.toDate()).format('YYYYMMDD')
        const dateTo = $dayjs(reservationList[i].reservationTo.toDate()).format('YYYYMMDD')
        const reservationFrom = $dayjs(reservationList[i].reservationFrom.toDate()).format('HH')
        let reservationTo = $dayjs(reservationList[i].reservationTo.toDate()).format('HH')

        if (dateFrom != dateTo) {
          // 画面上では指定日付の1日分のスケジュールしか表示しないため、
          // From,Toで日付が違う場合(日跨ぎ)は、Fromの日付の最終時刻を設定する
          reservationTo = '23'
        }
        reservationTimeArray.fill(reservationId, utils.toNumber(reservationFrom), utils.toNumber(reservationTo) + 1);
      }
      reservationTime = getTimeRanges(reservationTimeArray);

    }

    // 配車予約のFromとToの日付が異なる（日跨ぎ）場合、Toのデータを取得する必要がある
    const reservationEndDateList = await userData.searchReservationToBase('0', busId, SearchReservationTSFrom, SearchReservationTSTo)

    if (reservationEndDateList != null && reservationEndDateList.length > 0) {
      for (let i = 0; i < reservationEndDateList.length; i++) {
        reservationId = reservationEndDateList[i].id
        title = reservationEndDateList[i].title
        const dateFrom = $dayjs(reservationEndDateList[i].reservationFrom.toDate()).format('YYYYMMDD')
        const dateTo = $dayjs(reservationEndDateList[i].reservationTo.toDate()).format('YYYYMMDD')
        const reservationTo = $dayjs(reservationEndDateList[i].reservationTo.toDate()).format('HH')

        if (reservationDt != dateFrom && dateFrom != dateTo && reservationDt == dateTo) {
          // 前日(配車日)からの日跨ぎなので、スケジュール上開始は 0時(第2引数↓) からとなる
          reservationTimeArray.fill(reservationId, 0, utils.toNumber(reservationTo) + 1);

        } else if (reservationDt != dateFrom && dateFrom != dateTo && reservationDt != dateTo) {
          // 指定の日付はぶち抜きで予約されている。例：1/2(From)-1/4(TO)の場合の 1/3 のこと 
          reservationTimeArray.fill(reservationId, 0, 24);
        }
        else {
          // すでにFrom側の処理でスケジュール設定しているので、処理なし
          continue
        }
      }
    }
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
      reservationId: reservationId,
      title: title,
      reservationTime: reservationTime,
      reservationTimeArray: reservationTimeArray,
    }
    busInfoListArray.push(busInfoObj)
  }

  return busInfoListArray
}
const busInfoList = ref(await getBusInfoList())





/**
 * 保有運転手一覧を取得
 * 保有運転手と指定の日時(FROM-TO)でのそれぞれの出勤予約情報(時間)を取得
 */
const getDriverInfoList = async () => {
  // 配車日付
  const reservationDt = dispatchDate.value.replace(/\//g, "");


  // 文字列を結合して YYYY-MM-DD HH:mm 形式に変換
  const formattedSearchReservationFrom = `${reservationDt.slice(0, 4)}-${reservationDt.slice(4, 6)}-${reservationDt.slice(6, 8)} 00:00`;
  const formattedSearchReservationTo = `${reservationDt.slice(0, 4)}-${reservationDt.slice(4, 6)}-${reservationDt.slice(6, 8)} 23:59`;

  // dayjsでパースしてタイムスタンプに変換（ミリ秒単位）
  const SearchReservationTSFrom = new Date($dayjs(formattedSearchReservationFrom, 'YYYY-MM-DD HH:mm').valueOf());
  const SearchReservationTSTo = new Date($dayjs(formattedSearchReservationTo, 'YYYY-MM-DD HH:mm').valueOf());

  const driverList = await userData.getDriverList(keyUserId);

  const driverInfoListArray = []
  for (let i = 0; i < driverList.length; i++) {
    const driverId = driverList[i].id

    let reservationTime = ''
    const reservationTimeArray = ['', '', '', '', '', '', '', '', '', '', '', '',
      '', '', '', '', '', '', '', '', '', '', '', ''];
    // 画面指定の予約日の情報が存在するかチェック
    const reservationList = await userData.searchReservationFromBase('1', driverId, SearchReservationTSFrom, SearchReservationTSTo)
    let reservationId = ''
    let title = ''
    if (reservationList != null && reservationList.length > 0) {
      for (let i = 0; i < reservationList.length; i++) {
        reservationId = reservationList[i].id
        title = reservationList[i].title
        const dateFrom = $dayjs(reservationList[i].reservationFrom.toDate()).format('YYYYMMDD')
        const dateTo = $dayjs(reservationList[i].reservationTo.toDate()).format('YYYYMMDD')
        const reservationFrom = $dayjs(reservationList[i].reservationFrom.toDate()).format('HH')
        let reservationTo = $dayjs(reservationList[i].reservationTo.toDate()).format('HH')

        if (dateFrom != dateTo) {
          // 画面上では指定日付の1日分のスケジュールしか表示しないため、
          // From,Toで日付が違う場合(日跨ぎ)は、Fromの日付の最終時刻を設定する
          reservationTo = '23'
        }
        reservationTimeArray.fill(reservationId, utils.toNumber(reservationFrom), utils.toNumber(reservationTo) + 1);
      }
      reservationTime = getTimeRanges(reservationTimeArray);

    }

    // 配車予約のFromとToの日付が異なる(日跨ぎ)場合、Toのデータを取得する必要がある
    const reservationEndDateList = await userData.searchReservationToBase('1', driverId, SearchReservationTSFrom, SearchReservationTSTo)

    if (reservationEndDateList != null && reservationEndDateList.length > 0) {
      for (let i = 0; i < reservationEndDateList.length; i++) {
        reservationId = reservationEndDateList[i].id
        title = reservationEndDateList[i].title
        const dateFrom = $dayjs(reservationEndDateList[i].reservationFrom.toDate()).format('YYYYMMDD')
        const dateTo = $dayjs(reservationEndDateList[i].reservationTo.toDate()).format('YYYYMMDD')
        const reservationTo = $dayjs(reservationEndDateList[i].reservationTo.toDate()).format('HH')

        if (reservationDt != dateFrom && dateFrom != dateTo && reservationDt == dateTo) {
          // 前日(配車日)からの日跨ぎなので、スケジュール上開始は 0時(第2引数↓) からとなる
          reservationTimeArray.fill(reservationId, 0, utils.toNumber(reservationTo) + 1);

        } else if (reservationDt != dateFrom && dateFrom != dateTo && reservationDt != dateTo) {
          // 指定の日付はぶち抜きで予約されている。例：1/2(From)-1/4(TO)の場合の 1/3 のこと 
          reservationTimeArray.fill(reservationId, 0, 24);
        }
        else {
          // すでにFrom側の処理でスケジュール設定しているので、処理なし
          continue
        }
      }
    }

    const driverInfoObj = {
      id: driverId,
      companyId: driverList[i].companyId,
      driverName: driverList[i].driverName,
      driverNameKana: driverList[i].driverNameKana,
      contact: driverList[i].contact,
      remarks: driverList[i].remarks,
      reservationId: reservationId,
      reservationTime: reservationTime,
      title: title,
      reservationTimeArray: reservationTimeArray
    }
    driverInfoListArray.push(driverInfoObj)
  }
  return driverInfoListArray
}
const driverList = ref(await getDriverInfoList());



/**
 * 保有バスガイド一覧を取得
 * 保有バスガイドと指定の日時(FROM-TO)でのそれぞれの出勤予約情報(時間)を取得
 */
const getGuideInfoList = async () => {
  // 配車日付
  const reservationDt = dispatchDate.value.replace(/\//g, "");
  // 文字列を結合して YYYY-MM-DD HH:mm 形式に変換
  const formattedSearchReservationFrom = `${reservationDt.slice(0, 4)}-${reservationDt.slice(4, 6)}-${reservationDt.slice(6, 8)} 00:00`;
  const formattedSearchReservationTo = `${reservationDt.slice(0, 4)}-${reservationDt.slice(4, 6)}-${reservationDt.slice(6, 8)} 23:59`;

  // dayjsでパースしてタイムスタンプに変換（ミリ秒単位）
  const SearchReservationTSFrom = new Date($dayjs(formattedSearchReservationFrom, 'YYYY-MM-DD HH:mm').valueOf());
  const SearchReservationTSTo = new Date($dayjs(formattedSearchReservationTo, 'YYYY-MM-DD HH:mm').valueOf());


  const guideList = await userData.getGuideList(keyUserId);
  const guideInfoListArray = []

  for (let i = 0; i < guideList.length; i++) {
    const guideId = guideList[i].id


    let reservationTime = ''
    const reservationTimeArray = ['', '', '', '', '', '', '', '', '', '', '', '',
      '', '', '', '', '', '', '', '', '', '', '', ''];

    // 画面指定の予約日の情報が存在するかチェック
    const reservationList = await userData.searchReservationFromBase('2', guideId, SearchReservationTSFrom, SearchReservationTSTo)
    let reservationId = ''
    let title = ''
    if (reservationList != null && reservationList.length > 0) {
      for (let i = 0; i < reservationList.length; i++) {
        reservationId = reservationList[i].id
        title = reservationList[i].title
        const dateFrom = $dayjs(reservationList[i].reservationFrom.toDate()).format('YYYYMMDD')
        const dateTo = $dayjs(reservationList[i].reservationTo.toDate()).format('YYYYMMDD')
        const reservationFrom = $dayjs(reservationList[i].reservationFrom.toDate()).format('HH')
        let reservationTo = $dayjs(reservationList[i].reservationTo.toDate()).format('HH')

        if (dateFrom != dateTo) {
          // 画面上では日付の1日分のスケジュールしか表示しないため、
          // From,Toで日付が違う場合は、Fromの日付の最終時刻を設定する
          reservationTo = '23'
        }
        reservationTimeArray.fill(reservationId, utils.toNumber(reservationFrom), utils.toNumber(reservationTo) + 1);
      }
      reservationTime = getTimeRanges(reservationTimeArray);

    }

    // 配車予約のFromとToの日付が異なる場合、Toのデータを取得する必要がある
    const reservationEndDateList = await userData.searchReservationToBase('2', guideId, SearchReservationTSFrom, SearchReservationTSTo)

    if (reservationEndDateList != null && reservationEndDateList.length > 0) {
      for (let i = 0; i < reservationEndDateList.length; i++) {
        reservationId = reservationEndDateList[i].id
        title = reservationEndDateList[i].title
        const dateFrom = $dayjs(reservationEndDateList[i].reservationFrom.toDate()).format('YYYYMMDD')
        const dateTo = $dayjs(reservationEndDateList[i].reservationTo.toDate()).format('YYYYMMDD')
        const reservationTo = $dayjs(reservationEndDateList[i].reservationTo.toDate()).format('HH')

        if (reservationDt != dateFrom && dateFrom != dateTo && reservationDt == dateTo) {
          // 前日(配車日)からの日跨ぎなので、スケジュール上開始は 0時(第2引数↓) からとなる
          reservationTimeArray.fill(reservationId, 0, utils.toNumber(reservationTo) + 1);

        } else if (reservationDt != dateFrom && dateFrom != dateTo && reservationDt != dateTo) {
          // 指定の日付はぶち抜きで予約されている。例：1/2(From)-1/4(TO)の場合の 1/3 のこと 
          reservationTimeArray.fill(reservationId, 0, 24);
        }
        else {
          // すでにFrom側の処理でスケジュール設定しているので、skip
          continue
        }
      }
    }

    const guideInfoObj = {
      id: guideId,
      companyId: guideList[i].companyId,
      guideName: guideList[i].guideName,
      guideNameKana: guideList[i].guideNameKana,
      contact: guideList[i].contact,
      remarks: guideList[i].remarks,
      reservationId: reservationId,
      title: title,
      reservationTime: reservationTime,
      reservationTimeArray: reservationTimeArray

    }
    guideInfoListArray.push(guideInfoObj)

  }
  return guideInfoListArray
}
const guideList = ref(await getGuideInfoList());


/**
 * 予約登録画面をダイアログで表示
 */
const reservationItem = async (category, index, item) => {

  let confirmRes = false
  if (item.reservationTimeArray[index] != '') {
    await $swal.fire({
      text: '既に配車予約している時間をしています。よろしいですか？',
      showCancelButton: true,
      confirmButtonColor: "#00BCD4",
      cancelButtonColor: "#CFD8DC",
      confirmButtonText: 'はい。',
      cancelButtonText: 'キャンセル',
      icon: 'info'
    }).then((res) => {
      confirmRes = res.isConfirmed
      selectedReservationId.value = item.reservationTimeArray[index]
    })
    if (!confirmRes) {
      return
    }
  }

  selectedCategory.value = category
  selectedIndex.value = index
  selectedItem.value = item
  isOpenReservation.value = true
}





/**
 * 検索/リロード用
 */
const serach = async () => {
  loading.value = true;

  busInfoList.value = await getBusInfoList()
  driverList.value = await getDriverInfoList()
  guideList.value = await getGuideInfoList()

  loading.value = false;

}

// モーダルを閉じる処理
const closeModal = () => {
  isOpenReservation.value = false
  selectedIndex.value = null
  selectedCategory.value = ''
  selectedReservationId.value = ''
  selectedItem.value = null

}

/** 前の画面へ戻る */
const back = () => {
  loading.value = true;
  if (act == $Const.USER_ACTION_ORDER) {
    // 画面遷移
    router.push('/delivery/order/dispatch')

  } else {
    // 画面遷移
    router.push('/delivery/mypage')
  }
}



</script>
<style>
.borderline {
  border: 1px solid #ccc;
}
</style>
