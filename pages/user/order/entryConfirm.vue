<template>
  <div>
    <v-container class="fill-height align-center" fluid>
      <v-row no-gutters>
        <v-col>
          <v-card-text class="font-weight-bold text-h5">
            <v-icon left x-large @click="back">
              mdi-close
            </v-icon>
            {{ $Const.ORDER_STATUS_DISP[orderInfo.state]?.text ?? '案件登録中' }}
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
            <!-- </v-table>
          <v-table class="table-border"> -->
            <tbody>
              <tr align="center">
                <td rowspan="5" align="center">お客様名</td>
                <td>団体名</td>
                <td class="text-h4" colspan="5">{{ orderInfo.tourOrganization }}</td>
                <td colspan="2">{{ orderInfo.customerRemarks }}</td>
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
            <!-- </v-table>
          <v-table class="table-border"> -->
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
                <td class="text-h4">{{ dispDispatchTime }}</td>
                <td>出発</td>
                <td class="text-h4">{{ dispDepartureTime }}</td>
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


    <!-- TODO:運送引受会社-申込書に合わせたが、申込のタイミングだと会社の名称と電話番号のみの表示となるか？ -->
    <v-container>
      <v-table class="table-border">
        <tbody>
          <tr>
            <td rowspan="6">運送引受会社</td>
            <td>名称</td>
            <td class="text-h5" colspan="3">{{ orderDeliveryUserInfo.companyName }} {{ orderDeliveryUserInfo.companyTel
              }}</td>
            <td>ご担当者様</td>
            <td colspan="2">{{ orderDeliveryUserInfo.counterPersonMain }}様</td>
          </tr>
          <tr>
            <td>住所</td>
            <td colspan="3">{{ orderDeliveryUserInfo.companyAddr }}</td>
            <td>ご担当者様</td>
            <td colspan="2">{{ orderDeliveryUserInfo.counterPersonSub }}様</td>
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
      <v-table v-if="keydispatchId != null && keydispatchId != ''">
        <thead>
          <tr align="center">
            <th colspan="5" class="text-center">
              乗務員
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(driver, index) in dispatchInfo.driverList" :key="driver.id">
            <td>ドライバー{{ index + 1 }}</td>
            <td colspan="2"> {{ driver.driverName }}</td>
            <td>連絡先</td>
            <td colspan="2">{{ driver.contact }}</td>
          </tr>
          <tr v-for="(guide, index) in dispatchInfo.guideList" :key="guide.id">
            <td>ガイド{{ index + 1 }}</td>
            <td colspan="2"> {{ guide.guideName }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-container>



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
            <td>{{ dispDepartureTime }}発</td>
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
            <td class="text-h4">{{ orderOperationInfo.endDate }} {{ dispEndingTime }}</td>
            <td>場所</td>
            <td>{{ orderOperationInfo.terminalLocation }}</td>
          </tr>
        </tbody>
      </v-table>

    </v-container>

    <v-container>
      <v-table class="table-border">
        <tbody>
          <tr align="center">
            <td colspan="3">運賃・料金</td>
            <td >支払期日</td>
            <td >{{ orderInfo.paymentDueDate }}</td>
          </tr>
          <tr>
            <td rowspan="2">運賃及び料金の支払い方法</td>
            <td rowspan="2" colspan="2">{{ dispPaymentType }}</td>
            <td>発注料金</td>
            <td colspan="2">{{ orderInfo.orderAmount }}円</td>
          </tr>
          <tr>
            <td>実費</td>
            <td colspan="2">{{ orderInfo.actualCost }}円</td>
          </tr>
          <tr>
            <td>適用を受けようとする割引</td>
            <td colspan="2">{{ dispDiscount }}</td>
            <td>合計金額</td>
            <td colspan="2">{{ totalAmount }}円</td>
          </tr>

          <tr>
            <td>特約事項</td>
            <td colspan="5">{{ orderInfo.specialTerms }}</td>
          </tr>
          <tr>
            <td>備考</td>
            <td colspan="5">{{ orderInfo.remarks }}</td>
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

        <v-col
          v-if="orderInfo.state == $Const.STATUS_DRAFT || orderInfo.state == $Const.STATUS_ORDER_DENY || orderInfo.state == ''"
          align="center">
          <v-btn rounded dark size="x-large" color="indigo darken-4" class="mb-2 pr-8 pl-8" @click="entry">
            運送引受会社へ依頼する
          </v-btn>
        </v-col>
        <v-col v-else-if="orderInfo.state == $Const.STATUS_UNDERTAKE" align="center">
          <v-btn rounded dark size="x-large" color="indigo darken-4" class="mb-2 pr-8 pl-8" @click="payment">
            支払方法を確定し、手配を完了する
          </v-btn>
        </v-col>

        <v-col v-else-if="orderInfo.state == $Const.STATUS_PAYMENT_COMPLETED" align="center">
          <v-btn rounded dark size="x-large" color="indigo darken-4" class="mb-2 pr-8 pl-8" @click="completed">
            案件を完了する
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
const router = useRouter()
// 共通関数の呼び出し
const utils = useUtils();
// DB接続の呼び出し
const userData = useUserData();
const masterData = useMasterData();

// state保持情報 //
// ログインユーザー(申込会社)のキーID
const { userInfo } = useUserInfo()
const keyUserId = userInfo.value.companyId

const { orderInfo, clearOrderInfo } = useOrderInfo()
// 既にDB登録済みの案件の場合のid情報
const keyOrderId = orderInfo.value.id

// 選択された申込顧客情報（他画面からの引継ぎ情報）
const { applicantCustomerInfo, clearApplicantCustomerInfo } = useApplicantCustomerInfo()
const applicantCustomerId = applicantCustomerInfo.value.id

// 選択された申込運送引受会社情報（他画面からの引継ぎ情報）
const { orderDeliveryUserInfo, clearOrderDeliveryUserInfo } = useOrderDeliveryUserInfo()

// 入力された運行情報
const { orderOperationInfo, clearOrderOperationInfo } = useOrderOperationInfo()

// 運送引受外車側で登録された配車情報を保持
const { dispatchInfo, clearDispatchInfo } = useDispatchInfo()
const keydispatchId = ref(dispatchInfo.value.id)

const dispDispatchTime = ref('')
const dispDepartureTime = ref('')
const dispEndingTime = ref('')

const dispPaymentType = ref('')
// 割引情報：DBでマスタ管理
const discountList = ref(await masterData.getDiscountList())

const dispDiscount = ref('')
// 計算された合計金額
const totalAmount = ref('')

//-----------------------//


// 支払方法
const PAYMENT_TYPE = [
  { label: '銀行振込', code: '1' },
  { label: '現金', code: '2' },
  { label: 'その他', code: '9' },
]

// 合計を計算するcomputedプロパティ
const totalvehicleAmount = computed(() => {
  return (orderInfo.value.vehicleTypeLiftAmount || 0) + (orderInfo.value.vehicleTypeMediumAmount || 0) + (orderInfo.value.vehicleTypeSmallAmount || 0) + (orderInfo.value.vehicleTypeMicroAmount || 0);
});

/**
 * 画面初期処理
 */
onMounted(async () => {
  if (orderInfo.value.dispatchTimeHour != null && orderInfo.value.dispatchTimeMinute != null) {
    const time = $Const.TIME_HOUR_LIST.find(item => item.code === orderInfo.value.dispatchTimeHour);
    const min = $Const.TIME_MINUTE_LIST.find(item => item.code === orderInfo.value.dispatchTimeMinute);
    dispDispatchTime.value = time.disp + ':' + min.disp
  }
  if (orderInfo.value.departureTimeHour != null && orderInfo.value.departureTimeMinute != null) {
    const time = $Const.TIME_HOUR_LIST.find(item => item.code === orderInfo.value.departureTimeHour);
    const min = $Const.TIME_MINUTE_LIST.find(item => item.code === orderInfo.value.departureTimeMinute);
    dispDepartureTime.value = time.disp + ':' + min.disp
  }
  if (orderOperationInfo.value.endingTimeHour != null && orderOperationInfo.value.endingTimeMinute != null) {
    const time = $Const.TIME_HOUR_LIST.find(item => item.code === orderOperationInfo.value.endingTimeHour);
    const min = $Const.TIME_MINUTE_LIST.find(item => item.code === orderOperationInfo.value.endingTimeMinute);
    dispEndingTime.value = time.disp + ':' + min.disp
  }
  //支払い方法
  if (utils.toBlank(orderInfo.value.selectPayment) !== '') {
    if (orderInfo.value.selectPayment == '9') {
      // その他の内容を表示する
      dispPaymentType.value = 'その他 (' + orderInfo.value.selectPaymentOther + ')'

    } else {
      dispPaymentType.value = PAYMENT_TYPE.find(item => item.code === orderInfo.value.selectPayment).label
    }
  }
  // 選択した割引たち
  const dispDiscountArray = []
  const selectDiscount = orderInfo.value.selectDiscount
  selectDiscount.sort()
  for (let i = 0; i < selectDiscount.length; i++) {
    const code = selectDiscount[i]
    if (code === '99') {
      // その他の内容を表示する
      dispDiscountArray.push('その他 (' + orderInfo.value.selectDiscountOther + ') ')

    } else {
      dispDiscountArray.push(discountList.value.find(item => item.code === code).title)
    }
  }
  dispDiscount.value = dispDiscountArray.join('、')


  // 合計金額
  let totalValue = 0
  let orderAmountValue = utils.toBlank(orderInfo.value.orderAmount).replace(/[^\d]/g, "");
  let actualCostValue = utils.toBlank(orderInfo.value.actualCost).replace(/[^\d]/g, "");
  if (orderAmountValue == '') {
    orderAmountValue = '0'
  }
  if (actualCostValue == '') {
    actualCostValue = '0'
  }

  if (utils.toNumber(orderAmountValue) > 0 || utils.toNumber(actualCost.value) > 0) {
    totalValue = utils.toNumber(orderAmountValue) + utils.toNumber(actualCostValue)

    // if (isTaxIn.value) {
    totalValue = totalValue * 1.1
    // }
    totalAmount.value = totalValue.toLocaleString("ja-JP", { maximumFractionDigits: 0 });
  }


})




/** 運送引受会社へ依頼する */
const entry = async () => {
  // 必須選択チェック
  // 案件情報を保存
  let confirmRes = false
  await $swal.fire({
    text: '登録した内容で運送引受会社へ依頼します。よろしいですか？',
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

  // 新規登録 or 更新処理
  if (keyOrderId != null && keyOrderId != '') {
    // 更新
    const updateObject = {
      id: keyOrderId,
      // 運送引受会社へ申込中：2
      state: $Const.STATUS_REQUEST,
      companyId: keyUserId,
      applicant: orderInfo.value.applicant,
      emergencyContact: orderInfo.value.emergencyContact,
      tourOrganization: orderInfo.value.tourOrganization,
      customerRemarks: orderInfo.value.customerRemarks,
      passengers: utils.toZero(orderInfo.value.passengers),
      vehicleTypeLiftAmount: utils.toZero(orderInfo.value.vehicleTypeLiftAmount),
      vehicleTypeMediumAmount: utils.toZero(orderInfo.value.vehicleTypeMediumAmount),
      vehicleTypeSmallAmount: utils.toZero(orderInfo.value.vehicleTypeSmallAmount),
      vehicleTypeMicroAmount: utils.toZero(orderInfo.value.vehicleTypeMicroAmount),
      dispatchDate: orderInfo.value.dispatchDate,
      dispatchTimeHour: utils.toZero(orderInfo.value.dispatchTimeHour),
      dispatchTimeMinute: utils.toZero(orderInfo.value.dispatchTimeMinute),
      departureTimeHour: utils.toZero(orderInfo.value.departureTimeHour),
      departureTimeMinute: utils.toZero(orderInfo.value.departureTimeMinute),

      deliveryLocation: orderInfo.value.deliveryLocation,
      itinerary1Top: utils.toBlank(orderOperationInfo.value.itinerary1Top),
      itinerary1Bottom: utils.toBlank(orderOperationInfo.value.itinerary1Bottom),
      timeschedule1Top: utils.toBlank(orderOperationInfo.value.timeschedule1Top),
      timeschedule1Bottom: utils.toBlank(orderOperationInfo.value.timeschedule1Bottom),
      accommodations1: utils.toBlank(orderOperationInfo.value.accommodations1),
      accommodationsTel1: utils.toBlank(orderOperationInfo.value.accommodationsTel1),
      accommodationsAddr1: utils.toBlank(orderOperationInfo.value.accommodationsAddr1),
      endDate: utils.toBlank(orderOperationInfo.value.endDate),

      endingTimeHour: utils.toZero(orderOperationInfo.value.endingTimeHour),
      endingTimeMinute: utils.toZero(orderOperationInfo.value.endingTimeMinute),

      terminalLocation: utils.toBlank(orderOperationInfo.value.terminalLocation),
      deliveryCompanyId: utils.toBlank(orderDeliveryUserInfo.value.id),
      selectPayment: utils.toBlank(orderInfo.value.selectPayment),
      selectPaymentOther: utils.toBlank(orderInfo.value.selectPaymentOther),
      selectDiscount: orderInfo.value.selectDiscount,
      selectDiscountOther: utils.toBlank(orderInfo.value.selectDiscountOther),
      orderAmount: utils.toBlank(orderInfo.value.orderAmount),
      actualCost: utils.toBlank(orderInfo.value.actualCost),
      paymentDueDate: utils.toBlank(orderInfo.value.paymentDueDate),
      specialTerms: utils.toBlank(orderInfo.value.specialTerms),

      remarks: utils.toBlank(orderInfo.value.remarks),
      customerId: utils.toBlank(applicantCustomerId),
      updatedAt: new Date(),
    }
    await userData.updateOrder(updateObject)

  } else {
    // 新規登録
    const insertObject = {
      // 運送引受会社へ申込中：2
      state: $Const.STATUS_REQUEST,
      companyId: keyUserId,
      applicant: orderInfo.value.applicant,
      emergencyContact: orderInfo.value.emergencyContact,
      tourOrganization: orderInfo.value.tourOrganization,
      customerRemarks: orderInfo.value.customerRemarks,
      passengers: utils.toZero(orderInfo.value.passengers),
      vehicleTypeLiftAmount: utils.toZero(orderInfo.value.vehicleTypeLiftAmount),
      vehicleTypeMediumAmount: utils.toZero(orderInfo.value.vehicleTypeMediumAmount),
      vehicleTypeSmallAmount: utils.toZero(orderInfo.value.vehicleTypeSmallAmount),
      vehicleTypeMicroAmount: utils.toZero(orderInfo.value.vehicleTypeMicroAmount),
      dispatchDate: orderInfo.value.dispatchDate,
      dispatchTimeHour: utils.toZero(orderInfo.value.dispatchTimeHour),
      dispatchTimeMinute: utils.toZero(orderInfo.value.dispatchTimeMinute),
      departureTimeHour: utils.toZero(orderInfo.value.departureTimeHour),
      departureTimeMinute: utils.toZero(orderInfo.value.departureTimeMinute),


      deliveryLocation: orderInfo.value.deliveryLocation,
      itinerary1Top: utils.toBlank(orderOperationInfo.value.itinerary1Top),
      itinerary1Bottom: utils.toBlank(orderOperationInfo.value.itinerary1Bottom),
      timeschedule1Top: utils.toBlank(orderOperationInfo.value.timeschedule1Top),
      timeschedule1Bottom: utils.toBlank(orderOperationInfo.value.timeschedule1Bottom),
      accommodations1: utils.toBlank(orderOperationInfo.value.accommodations1),
      accommodationsTel1: utils.toBlank(orderOperationInfo.value.accommodationsTel1),
      accommodationsAddr1: utils.toBlank(orderOperationInfo.value.accommodationsAddr1),
      endDate: utils.toBlank(orderOperationInfo.value.endDate),
      endingTimeHour: utils.toZero(orderOperationInfo.value.endingTimeHour),
      endingTimeMinute: utils.toZero(orderOperationInfo.value.endingTimeMinute),

      terminalLocation: utils.toBlank(orderOperationInfo.value.terminalLocation),
      deliveryCompanyId: utils.toBlank(orderDeliveryUserInfo.value.id),
      customerId: utils.toBlank(applicantCustomerId),
      // 運送引受会社側の入力情報-申込時には未設定の仕様
      dispatchId: utils.toBlank(dispatchInfo.value.id),
      counterPersonMain: utils.toBlank(orderDeliveryUserInfo.value.counterPersonMain),
      counterPersonSub: utils.toBlank(orderDeliveryUserInfo.value.counterPersonSub),
      selectPayment: utils.toBlank(orderInfo.value.selectPayment),
      selectPaymentOther: utils.toBlank(orderInfo.value.selectPaymentOther),
      selectDiscount: orderInfo.value.selectDiscount,
      selectDiscountOther: utils.toBlank(orderInfo.value.selectDiscountOther),
      orderAmount: utils.toBlank(orderInfo.value.orderAmount),
      actualCost: utils.toBlank(orderInfo.value.actualCost),
      paymentDueDate: utils.toBlank(orderInfo.value.paymentDueDate),
      specialTerms: utils.toBlank(orderInfo.value.specialTerms),
      remarks: utils.toBlank(orderInfo.value.remarks),


      createdAt: new Date(),
      updatedAt: new Date(),
    }
    await userData.addOrder(insertObject)
  }

  // stateのクリア
  clearOrderInfo(orderInfo)
  clearApplicantCustomerInfo(applicantCustomerInfo)
  clearOrderDeliveryUserInfo(orderDeliveryUserInfo)
  clearOrderOperationInfo(orderOperationInfo)
  clearDispatchInfo(dispatchInfo)

  // 画面遷移
  router.push('/user/order/list')


}

/**
 * 支払方法を確定する
 */
const payment = async () => {
  //必須入力チェック
  if (utils.toBlank(orderInfo.value.selectPayment) == '') {
    $swal.fire({
      text: '支払方法を選択してください。',
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning'
    })
    return
  }
  if (utils.toBlank(orderInfo.value.orderAmount) == '') {
    $swal.fire({
      text: '料金が設定されていません。確認してください。',
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning'
    })
    return
  }



  // 案件情報を保存
  let confirmRes = false
  await $swal.fire({
    text: '運送引受会社への支払方法を確定し申込を完了します。よろしいですか？',
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

  // 更新
  const updateObject = {
    id: keyOrderId,
    // 運送引受会社との支払方法確定：4
    state: $Const.STATUS_PAYMENT_METHOD_CONFIRMED,
    selectPayment: utils.toBlank(orderInfo.value.selectPayment),
    selectPaymentOther: utils.toBlank(orderInfo.value.selectPaymentOther),
    selectDiscount: orderInfo.value.selectDiscount,
    selectDiscountOther: utils.toBlank(orderInfo.value.selectDiscountOther),
    orderAmount: utils.toBlank(orderInfo.value.orderAmount),
    actualCost: utils.toBlank(orderInfo.value.actualCost),
    paymentDueDate: utils.toBlank(orderInfo.value.paymentDueDate),
    specialTerms: utils.toBlank(orderInfo.value.specialTerms),
    remarks: utils.toBlank(orderInfo.value.remarks),
    updatedAt: new Date(),
  }
  await userData.updateOrder(updateObject)


  // stateのクリア
  clearOrderInfo(orderInfo)
  clearApplicantCustomerInfo(applicantCustomerInfo)
  clearOrderDeliveryUserInfo(orderDeliveryUserInfo)
  clearOrderOperationInfo(orderOperationInfo)
  clearDispatchInfo(dispatchInfo)

  // 画面遷移
  router.push('/user/order/list')


}

/**
 * 案件を完了する
 */
const completed = async () => {
  // 案件情報を保存
  let confirmRes = false
  await $swal.fire({
    text: '案件を完了します。よろしいですか？',
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

  // 更新
  const updateObject = {
    id: keyOrderId,
    // 案件完了：9
    state: $Const.STATUS_ORDER_COMPLETED,
    updatedAt: new Date(),
  }
  await userData.updateOrder(updateObject)


  // stateのクリア
  clearOrderInfo(orderInfo)
  clearApplicantCustomerInfo(applicantCustomerInfo)
  clearOrderDeliveryUserInfo(orderDeliveryUserInfo)
  clearOrderOperationInfo(orderOperationInfo)
  clearDispatchInfo(dispatchInfo)

  // 画面遷移
  router.push('/user/order/list')


}


/** 前の画面へ戻る */
const back = () => {
  const { actionInfo } = useAction()
  // 画面遷移
  if (actionInfo.value.act == $Const.USER_ACTION_CONTRACT) {
    // 契約管理メニューからの遷移
    clearOrderInfo(orderInfo)
    clearApplicantCustomerInfo(applicantCustomerInfo)
    clearOrderDeliveryUserInfo(orderDeliveryUserInfo)
    clearOrderOperationInfo(orderOperationInfo)
    clearDispatchInfo(dispatchInfo)
    router.push('/user/contract/list')
  } else {
    // 案件管理メニューからの遷移
    if (orderInfo.value.state == $Const.STATUS_DRAFT || orderInfo.value.state == $Const.STATUS_UNDERTAKE || orderInfo.value.state == $Const.STATUS_ORDER_DENY || orderInfo.value.state == '') {
      router.push('/user/order/entry')

    } else if (orderInfo.value.state == $Const.STATUS_REQUEST) {

      // stateのクリア
      clearOrderInfo(orderInfo)
      clearApplicantCustomerInfo(applicantCustomerInfo)
      clearOrderDeliveryUserInfo(orderDeliveryUserInfo)
      clearOrderOperationInfo(orderOperationInfo)
      clearDispatchInfo(dispatchInfo)

      router.push('/user/order/list')
    } else {
      // stateのクリア
      clearOrderInfo(orderInfo)
      clearApplicantCustomerInfo(applicantCustomerInfo)
      clearOrderDeliveryUserInfo(orderDeliveryUserInfo)
      clearOrderOperationInfo(orderOperationInfo)
      clearDispatchInfo(dispatchInfo)

      router.push('/user/order/list')
    }
  }

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
