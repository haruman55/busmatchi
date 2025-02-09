<template>
  <div>
    <v-container class="fill-height align-center" fluid>
      <v-row no-gutters>
        <v-col>
          <v-card-text class="font-weight-bold text-h5">
            <v-icon left x-large @click="back">
              mdi-close
            </v-icon>
            申込確認
          </v-card-text>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row>
        <v-col>
          <v-table class="table-border">
            <tbody>
              <tr>
                <td colspan="2" align="center">申込日</td>
                <td>令和7年3月14日</td>
                <td>再FAX</td>
                <td>/</td>
                <td>/</td>
                <td>/</td>
                <td>/</td>
                <td>ファイナル</td>
                <td>/</td>
              </tr>
            </tbody>
          </v-table>
          <v-table class="table-border">
            <tbody>
              <tr align="center">
                <td rowspan="4">申込者</td>
                <td rowspan="2">名称</td>
                <td colspan="2" rowspan="2">{{ orderInfo.applicantCompanyName }}</td>
                <td rowspan="2">申込者</td>
                <td colspan="2" rowspan="2">{{ orderInfo.applicant }}</td>
                <td>電話</td>
                <td colspan="2">{{ orderInfo.applicantCompanyTel }}</td>
              </tr>
              <tr align="center">
                <td>FAX</td>
                <td colspan="2">{{ orderInfo.applicantCompanyFax }}</td>
              </tr>
              <tr align="center">
                <td rowspan="2">住所</td>
                <td colspan="5" rowspan="2">{{ orderInfo.applicantCompanyAddr }}</td>
                <td>緊急連絡先</td>
                <td>{{ orderInfo.emergencyContact }}</td>
              </tr>
              <tr align="center">
                <td>e-mail</td>
                <td>{{ orderInfo.applicantCompanyEmail }}</td>
              </tr>
            </tbody>
            <tbody>
              <tr align="center">
                <td rowspan="5" align="center">お客様名</td>
                <td>団体名</td>
                <td class="text-h4" colspan="5">{{ orderInfo.tourOrganization }}</td>
                <td colspan="2">{{ orderInfo.remarks }}</td>
              </tr>
              <tr align="center">
                <td rowspan="2">氏名<br>名称</td>
                <td colspan="5" rowspan="2">{{ applicantCustomerInfo.customerName }}</td>
                <td>電話</td>
                <td>{{ applicantCustomerInfo.customerTel }}</td>
              </tr>
              <tr align="center">
                <td>FAX</td>
                <td>{{ applicantCustomerInfo.customerFax }}</td>
              </tr>
              <tr align="center">
                <td rowspan="2">住所</td>
                <td colspan="5" rowspan="2">{{ applicantCustomerInfo.customerAddr }}</td>
                <td>直通</td>
                <td>{{ applicantCustomerInfo.customerId }}</td>
              </tr>
              <tr align="center">
                <td>e-mail</td>
                <td>{{ applicantCustomerInfo.customerMail }}</td>
              </tr>

            </tbody>
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
                <td>日程</td>
                <td colspan="3" class="text-h4">{{ orderInfo.dispatchDate }}</td>
                <td rowspan="2" align="center">配車場所</td>
                <td rowspan="2" align="center">{{ orderInfo.deliveryLocation }}</td>
                <td rowspan="2" align="center">地図</td>
                <td rowspan="2" align="center">有</td>
              </tr>
              <tr align="center">
                <td>配車</td>
                <td class="text-h4">{{ orderInfo.dispatchTime }}</td>
                <td>出発</td>
                <td class="text-h4">{{ orderInfo.departureTime }}</td>
              </tr>
            </tbody>
          </v-table>
          <v-table class="table-border">

            <tbody>
              <tr>
                <td>有料道路</td>
                <td colspan="3">利用なし(TODO:入力項目なし)</td>
                <td rowspan="2">座席</td>
                <td rowspan="2">前向き(TODO:入力項目なし)</td>
                <td rowspan="2">ガイド</td>
                <td rowspan="2">無(TODO:入力項目なし)</td>
              </tr>
              <tr>
                <td>駐車場</td>
                <td>立替(TODO:入力項目なし)</td>
                <td>駐車場の手配</td>
                <td>有(TODO:入力項目なし)</td>
              </tr>
            </tbody>


          </v-table>
        </v-col>
      </v-row>

    </v-container>
    <v-divider />

    <v-divider />
    <!-- TODO:以下 運行情報 については一旦日帰りで実装。数日の旅程の場合はデータの持ち方や表示を検討必要 -->
    <v-container>
      <v-table class="table-border">
        <thead>
          <tr align="center">
            <th width="80%" colspan="2" class="text-center">
              旅程
            </th>
            <th class="text-center" colspan="2">
              宿泊場所
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="dashed-border" align="center">
            <td>{{ orderInfo.dispatchDate }} </td>
            <td>{{ orderOperationInfo.itinerary1Top }}</td>
            <td>名称</td>
            <td>{{ orderOperationInfo.accommodations1 }}</td>
          </tr>
          <tr class="thick-border" align="center">
            <td>{{ orderInfo.dispatchTime }}発</td>
            <td>{{ orderOperationInfo.timeschedule1Top }}</td>
            <td>電話</td>
            <td>{{ orderOperationInfo.accommodationsTel1 }}</td>
          </tr>
          <tr class="dashed-border" align="center">
            <td align="right">日 </td>
            <td>{{ orderOperationInfo.itinerary1Bottom }}</td>

            <td rowspan="2">住所</td>
            <td rowspan="2">{{ orderOperationInfo.accommodationsAddr1 }}</td>
          </tr>
          <tr class="thick-border" align="center">
            <td>発</td>
            <td>{{ orderOperationInfo.timeschedule1Bottom }}</td>
          </tr>
        </tbody>
        <tbody>
          <tr class="dashed-border" align="center">
            <td>終着</td>
            <td class="text-h4">{{ orderOperationInfo.endDate }} {{ orderOperationInfo.endingTime }}</td>
            <td>場所</td>
            <td>{{ orderOperationInfo.terminalLocation }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-container>
    <v-divider />

    <v-container>
      <v-btn rounded dark size="x-large" color="yellow" class="mb-2 pr-8 pl-8" @click="entry">
        配車情報を登録する
      </v-btn>
      <v-overlay :model-value="loading" class="align-center justify-center">
        <v-progress-circular color="primary" size="150" width="20" indeterminate />
      </v-overlay>

      <v-table class="table-border">
        <tbody>
          <tr>
            <td rowspan="6">運送引受会社</td>
            <td>名称</td>
            <td class="text-h5" colspan="3">{{ orderDeliveryUserInfo.companyName }} {{ orderDeliveryUserInfo.companyTel
              }}</td>
            <td>ご担当者様</td>
            <td colspan="2"><v-text-field v-model="counterPersonMain" class="mt-4" outlined /></td>
          </tr>
          <tr>
            <td>住所</td>
            <td colspan="3">{{ orderDeliveryUserInfo.companyAddr }}</td>
            <td>ご担当者様</td>
            <td colspan="2"><v-text-field v-model="counterPersonSub" class="mt-4" outlined /></td>
          </tr>
          <tr>
            <td rowspan="2" />
            <td colspan="3" rowspan="2" />
            <td>電話</td>
            <td colspan="2">{{ orderDeliveryUserInfo.companyTel }}</td>
          </tr>
          <tr>
            <td>FAX</td>
            <td colspan="2">{{ orderDeliveryUserInfo.companyFax }}</td>
          </tr>
          <tr>
            <td rowspan="2">事業許可</td>
            <td colspan="3">昭和 年 月 日 第 号</td>
            <td>車庫番</td>
            <td colspan="2" />
          </tr>
          <tr>
            <td colspan="3">営業区域：</td>
            <td>e-mail</td>
            <td colspan="2">{{ orderDeliveryUserInfo.companyEmail }}</td>
          </tr>
        </tbody>
      </v-table>
      <v-table v-if="dispatchInfo.busList.length > 0">
        <thead>
          <tr align="center">
            <th colspan="5" class="text-center">
              乗務員
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(driver) in dispatchInfo.driverList" :key="driver.id">
            <td>ドライバー</td>
            <td colspan="2"> {{ driver.driverName }}</td>
            <td>連絡先</td>
            <td colspan="2">{{ driver.contact }}</td>
          </tr>
          <tr>
            <td>ガイド</td>
            <td v-for="(guide) in dispatchInfo.guideList" :key="guide.id" colspan="2"> {{ guide.guideName }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-container>
    <br>

    <v-container class="align-center" fluid>
      <v-row justify="center" no-gutters>
        <v-col align="center">
          <v-btn rounded dark size="x-large" color="grey" class="mb-2 pr-8 pl-8" @click="back">
            戻 る
          </v-btn>
        </v-col>
        <v-spacer />

        <v-col v-if="orderInfo.state == $Const.STATUS_REQUEST" align="center">
          <v-btn rounded dark size="x-large" color="indigo darken-4" class="mb-2 pr-8 pl-8" @click="undertake">
            運送手配を引き受ける
          </v-btn>
        </v-col>

        <v-spacer />
        <v-col align="center">
          <v-btn rounded dark size="x-large" color="red" class="mb-2 pr-8 pl-8" @click="deny">
            運送手配を断る
          </v-btn>
        </v-col>
        <v-spacer />

      </v-row>
    </v-container>
  </div>
</template>
<script setup>
const { $Const } = useNuxtApp()
const { $swal } = useNuxtApp()
const { $dayjs } = useNuxtApp();
const router = useRouter()
// 共通関数の呼び出し
const utils = useUtils();
// DB接続の呼び出し
const userData = useUserData();

// state保持情報 //
// ログインユーザーのキーID
const { userInfo } = useUserInfo()
const keyUserId = userInfo.value.companyId

const { orderInfo, clearOrderInfo } = useOrderInfo()
// 既にDB登録済みの案件の場合のid情報
const keyOrderId = orderInfo.value.id

const loading = ref(false)

// 選択された申込顧客情報
const { applicantCustomerInfo, clearApplicantCustomerInfo } = useApplicantCustomerInfo()

// 選択された申込運送引受会社情報
const { orderDeliveryUserInfo, editOrderDeliveryUserInfo, clearOrderDeliveryUserInfo } = useOrderDeliveryUserInfo()

// 選択された配車情報を保持
const { dispatchInfo, clearDispatchInfo } = useDispatchInfo()
const keydispatchId = ref(dispatchInfo.value.id)

// 入力(選択)された運行情報
const { orderOperationInfo, clearOrderOperationInfo } = useOrderOperationInfo()
//-----------------------//


// 合計を計算するcomputedプロパティ
const totalvehicleAmount = computed(() => {
  return (orderInfo.value.vehicleTypeLiftAmount || 0) + (orderInfo.value.vehicleTypeMediumAmount || 0) + (orderInfo.value.vehicleTypeSmallAmount || 0) + (orderInfo.value.vehicleTypeMicroAmount || 0);
});

// 画面入力項目
// TODO:一旦帳票と合わせて可変ではなく固定変数定義
const counterPersonMain = ref(orderDeliveryUserInfo.value.counterPersonMain)
const counterPersonSub = ref(orderDeliveryUserInfo.value.counterPersonSub)


/**
 * 運送手配情報を登録する
 */
const entry = () => {
  const deliveryUser = {
    id: orderDeliveryUserInfo.value.id,
    companyId: orderDeliveryUserInfo.value.companyId,
    companyName: orderDeliveryUserInfo.value.companyName,
    companyAddr: orderDeliveryUserInfo.value.companyAddr,
    companyTel: orderDeliveryUserInfo.value.companyTel,
    companyFax: orderDeliveryUserInfo.value.companyFax,
    companyEmail: orderDeliveryUserInfo.value.companyEmail,
    // 以下本画面入力情報
    counterPersonMain: counterPersonMain.value,
    counterPersonSub: counterPersonSub.value
  }
  loading.value = true;

  editOrderDeliveryUserInfo(deliveryUser)


  // 画面遷移
  router.push('/delivery/order/dispatch')


}



/** 運送依頼を引き受ける */
const undertake = async () => {
  // 必須選択チェック
  if (dispatchInfo.value.busList.length == 0) {
    $swal.fire({
      text: '配車情報を登録してください。',
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning'
    })
    return
  }
  if (utils.toBlank(counterPersonMain.value) == '') {
    $swal.fire({
      text: 'ご担当者様を入力してください。',
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning'
    })
    return
  }


  // 案件情報を保存
  let confirmRes = false
  await $swal.fire({
    text: '運送手配完了を申込会社へ通知します。よろしいですか？',
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

  // オーダー(案件)に紐付く配車情報のDB保存
  if (keydispatchId.value != null && keydispatchId.value != '') {
    // 更新
    const updateDispatchObj = {
      id: keydispatchId.value,
      orderId: dispatchInfo.value.orderId,
      busList: dispatchInfo.value.busList,
      driverList: dispatchInfo.value.driverList,
      guideList: dispatchInfo.value.guideList,
      reservationFrom: new Date(`${orderInfo.value.dispatchDate} ${orderInfo.value.dispatchTime}`),
      reservationTo: new Date(`${orderOperationInfo.value.endDate} ${orderOperationInfo.value.endingTime}`),
      updatedAt: new Date(),
    }
    await userData.updateDispatch(updateDispatchObj)

  } else {
    const insertDispatchObj = {
      orderId: dispatchInfo.value.orderId,
      busList: dispatchInfo.value.busList,
      driverList: dispatchInfo.value.driverList,
      guideList: dispatchInfo.value.guideList,
      reservationFrom: new Date(`${orderInfo.value.dispatchDate} ${orderInfo.value.dispatchTime}`),
      reservationTo: new Date(`${orderOperationInfo.value.endDate} ${orderOperationInfo.value.endingTime}`),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    keydispatchId.value = await userData.addDispatch(insertDispatchObj)

  }
  // 運送引受会社の追加情報(配車情報のdocIdとの紐付けも)とステータス更新
  const updateObject = {
    id: keyOrderId,
    // 運送手配完了：3
    state: $Const.STATUS_RESERVATION,
    counterPersonMain: counterPersonMain.value,
    counterPersonSub: counterPersonSub.value,
    dispatchId: keydispatchId.value,
    updatedAt: new Date(),
  }
  await userData.updateOrder(updateObject)


  //バス、運転手、ガイドに対する指定日時の予約設定をDB保存
  const busList = dispatchInfo.value.busList
  for (let i = 0; i < busList.length; i++) {

    const busId = busList[i].id
    // 新規登録
    const reservationInfoObj = {
      category: $Const.CATEGORY_BUS,
      itemId: busId,
      reservationFrom: new Date(`${orderInfo.value.dispatchDate} ${orderInfo.value.dispatchTime}`),
      reservationTo: new Date(`${orderOperationInfo.value.endDate} ${orderOperationInfo.value.endingTime}`),
      orderId: dispatchInfo.value.orderId,
      title: `[配車依頼]${orderInfo.value.applicantCompanyName} : ${orderInfo.value.tourOrganization} `,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    await userData.addReservation(reservationInfoObj)

  }

  const driverList = dispatchInfo.value.driverList
  for (let i = 0; i < driverList.length; i++) {


    const driverId = driverList[i].id
    // 新規登録
    const reservationInfoObj = {
      category: $Const.CATEGORY_DRIVER,
      itemId: driverId,
      reservationFrom: new Date(`${orderInfo.value.dispatchDate} ${orderInfo.value.dispatchTime}`),
      reservationTo: new Date(`${orderOperationInfo.value.endDate} ${orderOperationInfo.value.endingTime}`),
      orderId: dispatchInfo.value.orderId,
      title: `[配車依頼]${orderInfo.value.applicantCompanyName} : ${orderInfo.value.tourOrganization} `,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    await userData.addReservation(reservationInfoObj)

  }

  const guideList = dispatchInfo.value.guideList
  for (let i = 0; i < guideList.length; i++) {
    const guideId = guideList[i].id

    // 新規登録
    const reservationInfoObj = {
      category: $Const.CATEGORY_GUIDE,
      itemId: guideId,
      reservationFrom: new Date(`${orderInfo.value.dispatchDate} ${orderInfo.value.dispatchTime}`),
      reservationTo: new Date(`${orderOperationInfo.value.endDate} ${orderOperationInfo.value.endingTime}`),
      orderId: dispatchInfo.value.orderId,
      title: `[配車依頼]${orderInfo.value.applicantCompanyName} : ${orderInfo.value.tourOrganization} `,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    await userData.addReservation(reservationInfoObj)

  }

  // stateのクリア
  clearOrderInfo(orderInfo)
  clearApplicantCustomerInfo(applicantCustomerInfo)
  clearOrderDeliveryUserInfo(orderDeliveryUserInfo)
  clearOrderOperationInfo(orderOperationInfo)
  clearDispatchInfo(dispatchInfo)

  // 画面遷移
  router.push('/delivery/order/list')
}



/** 運送手配を断る */
const deny = async () => {
  // 必須選択チェック
  // 案件情報を保存
  let confirmRes = false
  await $swal.fire({
    text: '運送手配を断ります。よろしいですか？',
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

  // 運送引受会社の追加情報(配車情報のdocIdとの紐付けも)とステータス更新
  const updateObject = {
    id: keyOrderId,
    // 運送手配引受不可：8
    state: $Const.STATUS_ORDER_DENY,
    // 配車紐付けを初期化
    dispatchId: '',
    updatedAt: new Date(),
  }
  await userData.updateOrder(updateObject)

  // 配車情報がある場合、テーブルの情報(reservation/dispatch)を削除 
  if (keydispatchId.value != null && keydispatchId.value != '') {

    const reservationList = await userData.getReservationList(keyOrderId)
    for (let i = 0; i < reservationList.length; i++) {
      await userData.deleteReservation(reservationList[i].id)
    }

    // 配車情報(dispatch)を削除
    await userData.deleteDispatch(keydispatchId.value)
  }

  // stateのクリア
  clearOrderInfo(orderInfo)
  clearApplicantCustomerInfo(applicantCustomerInfo)
  clearOrderDeliveryUserInfo(orderDeliveryUserInfo)
  clearOrderOperationInfo(orderOperationInfo)
  clearDispatchInfo(dispatchInfo)

  // 画面遷移
  router.push('/delivery/order/list')


}


/** 前の画面へ戻る */
const back = () => {
  // stateのクリア
  clearOrderInfo(orderInfo)
  clearApplicantCustomerInfo(applicantCustomerInfo)
  clearOrderDeliveryUserInfo(orderDeliveryUserInfo)
  clearOrderOperationInfo(orderOperationInfo)
  clearDispatchInfo(dispatchInfo)

  // 画面遷移
  router.push('/delivery/order/list')

}

definePageMeta({
  layout: 'user'
})

</script>

<style>
/* 点線を適用 */
.dashed-border {
  border-bottom: 2px dashed red !important;
}

/* 太線を適用 */
.thick-border {
  border-bottom: 4px solid blue !important;
}

th,
td {
  border: 1px solid #ccc;
}
</style>
