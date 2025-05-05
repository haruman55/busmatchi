<template>
  <v-container max-width="1200">
    <v-row no-gutters>
      <v-col>
        <v-breadcrumbs
:items="[
          { title: 'マイページ', disabled: true },
          { title: '案件管理', disabled: false, click: () => back() },
          { title: '案件登録 ', disabled: true },
        ]">
          <template #prepend>
            <v-icon icon="mdi-home" size="small" />
          </template>
          <template #divider>
            <v-icon icon="mdi-chevron-right" />
          </template>
          <template #item="{ item }">
            <v-breadcrumbs-item :disabled="item.disabled" @click="item.click && item.click()">
              {{ item.title }}
            </v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col align="center">
        <div>
          <h3 class="font-weight-bold text-h5">内容を確認し配車登録をしてください。</h3>
        </div>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12" sm="6" md="6">
        <div>
          <v-sheet class="py-10 mx-auto text-start" max-width="500" color="transparent">
            <p class="mb-2 font-weight-bold">申込会社情報</p>
            <v-divider class="mb-2 border-opacity-100" />
            <div class="py-2 d-flex justify-space-between">
              <span>会社名</span>
              <span>{{ orderInfo.applicantCompanyName }}</span>
            </div>
            <div class="py-2 d-flex justify-space-between">
              <span>申込者</span>
              <span>{{ orderInfo.applicant }}</span>
            </div>
            <div class="py-2 d-flex justify-space-between">
              <span>電話</span>
              <span>{{ orderInfo.applicantCompanyTel }}</span>
            </div>
            <div class="py-2 d-flex justify-space-between">
              <span>FAX</span>
              <span>{{ orderInfo.applicantCompanyFax }}</span>
            </div>
            <div class="py-2 d-flex justify-space-between">
              <span>住所</span>
              <span>{{ orderInfo.applicantCompanyAddr }}</span>
            </div>
            <div class="py-2 d-flex justify-space-between">
              <span>e-mail</span>
              <span>{{ orderInfo.applicantCompanyEmail }}</span>
            </div>
            <div class="py-2 d-flex justify-space-between">
              <span>緊急連絡先</span>
              <span>{{ orderInfo.emergencyContact }}</span>
            </div>
          </v-sheet>
        </div>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <div>
          <v-sheet class="py-10 mx-auto text-start" max-width="500" color="transparent">
            <p class="mb-2 font-weight-bold">顧客情報</p>
            <v-divider class="mb-2 border-opacity-100" />
            <div class="py-2 d-flex justify-space-between">
              <span>団体名</span>
              <span>{{ orderInfo.tourOrganization }}</span>
            </div>
            <div class="py-2 d-flex justify-space-between">
              <span>顧客名</span>
              <span>{{ applicantCustomerInfo.customerName }}</span>
            </div>
            <div class="py-2 d-flex justify-space-between">
              <span>電話</span>
              <span>{{ applicantCustomerInfo.customerTel }}</span>
            </div>
            <div class="py-2 d-flex justify-space-between">
              <span>FAX</span>
              <span>{{ applicantCustomerInfo.customerFax }}</span>
            </div>
            <div class="py-2 d-flex justify-space-between">
              <span>住所</span>
              <span>{{ applicantCustomerInfo.customerAddr }}</span>
            </div>
            <div class="py-2 d-flex justify-space-between">
              <span>e-mail</span>
              <span>{{ applicantCustomerInfo.customerMail }}</span>
            </div>
            <div class="py-2 d-flex justify-space-between">
              <span>直通？</span>
              <span>{{ orderInfo.customerId }}</span>
            </div>
          </v-sheet>
        </div>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12" sm="6" md="6">
        <div>
          <v-sheet class="py-10 mx-auto text-start" max-width="500" color="transparent">
            <p class="mb-2 font-weight-bold">配車依頼内容</p>
            <v-divider class="mb-2 border-opacity-100" />
            <div class="py-2 d-flex justify-space-between">
              <span>乗車人員</span>
              <span>{{ orderInfo.passengers }}名</span>
            </div>
            <div class="py-2 d-flex justify-space-between">
              <span>車両</span>
              <span>合計{{ totalvehicleAmount }}両</span>
            </div>
            <div v-if="orderInfo.vehicleTypeLiftAmount > 0" class="py-2 d-flex justify-space-between">
              <span>　リフト</span>
              <span>{{ orderInfo.vehicleTypeLiftAmount }}両</span>
            </div>
            <div v-if="orderInfo.vehicleTypeMediumAmount > 0" class="py-2 d-flex justify-space-between">
              <span>　中型車</span>
              <span>{{ orderInfo.vehicleTypeMediumAmount }}両</span>
            </div>
            <div v-if="orderInfo.vehicleTypeSmallAmount > 0" class="py-2 d-flex justify-space-between">
              <span>　小型車</span>
              <span>{{ orderInfo.vehicleTypeSmallAmount }}両</span>
            </div>
            <div v-if="orderInfo.vehicleTypeMicroAmount > 0" class="py-2 d-flex justify-space-between">
              <span>　マイクロ</span>
              <span>{{ orderInfo.vehicleTypeMicroAmount }}両</span>
            </div>
            <div class="py-2 d-flex justify-space-between">
              <span>座席</span>
              <span>前向き</span>
            </div>


          </v-sheet>
        </div>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <div>
          <v-sheet class="py-10 mx-auto text-start" max-width="500" color="transparent">
            <p class="mb-2 font-weight-bold">配車依頼内容</p>
            <v-divider class="mb-2 border-opacity-100" />
            <div class="py-2 d-flex justify-space-between">
              <span>配車日時</span>
              <span>{{ orderInfo.dispatchDate }} {{ orderInfo.dispatchTime }}</span>
            </div>
            <div class="py-2 d-flex justify-space-between">
              <span>出発時間</span>
              <span>{{ orderInfo.departureTime }}</span>
            </div>

            <div class="py-2 d-flex justify-space-between">
              <span>配車場所</span>
              <span>{{ orderInfo.deliveryLocation }}</span>
            </div>
            <div class="py-2 d-flex justify-space-between">
              <span>地図</span>
              <span></span>
            </div>
            <div class="py-2 d-flex justify-space-between">
              <span>有料道路</span>
              <span>利用なし</span>
            </div>
            <div class="py-2 d-flex justify-space-between">
              <span>駐車場</span>
              <span>手配有/立替</span>
            </div>
            <div class="py-2 d-flex justify-space-between">
              <span>ガイド</span>
              <span>有</span>
            </div>

          </v-sheet>
        </div>
      </v-col>
    </v-row>
    <v-row no-gutters>

      <v-col cols="12" sm="6" md="6">
        <div>
          <v-sheet class="py-10 mx-auto text-start" max-width="500" color="transparent">
            <p class="mb-2 font-weight-bold">旅程</p>
            <v-divider class="mb-2 border-opacity-100" />
            <div class="py-2 d-flex justify-space-between">
              <v-table class="text-pre-wrap bg-background">
                <tbody>
                  <tr class="dashed-border" align="center">
                    <td>{{ orderInfo.dispatchDate }}</td>
                    <td>{{ orderOperationInfo.itinerary1Top }}</td>
                  </tr>
                  <tr class="dashed-border" align="center">
                    <td>{{ orderInfo.dispatchTime }}発</td>
                    <td>{{ orderOperationInfo.timeschedule1Top }}</td>
                  </tr>

                  <tr class="thick-border" align="center">
                    <td>日</td>
                    <td>{{ orderOperationInfo.itinerary1Bottom }}</td>
                  </tr>
                  <tr class="thick-border" align="center">
                    <td>発</td>
                    <td>{{ orderOperationInfo.timeschedule1Bottom }}</td>
                  </tr>
                  <tr class="thick-border" align="center">
                    <td>終着</td>
                    <td>{{ orderOperationInfo.endDate }} {{ orderOperationInfo.endingTime }}</td>
                  </tr>
                  <tr class="thick-border" align="center">
                    <td>場所</td>
                    <td>{{ orderOperationInfo.terminalLocation }}</td>
                  </tr>

                </tbody>
              </v-table>
            </div>
          </v-sheet>
        </div>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <div>
          <v-sheet class="py-10 mx-auto text-start" max-width="500" color="transparent">
            <p class="mb-2 font-weight-bold">宿泊場所</p>
            <v-divider class="mb-2 border-opacity-100" />
            <div class="py-2 d-flex justify-space-between">
              <span>名称</span>
              <span>{{ orderOperationInfo.accommodations1 }} </span>
            </div>
            <div class="py-2 d-flex justify-space-between">
              <span>電話</span>
              <span>{{ orderOperationInfo.accommodationsTel1 }} </span>
            </div>
            <div class="py-2 d-flex justify-space-between">
              <span>住所</span>
              <span>{{ orderOperationInfo.accommodationsAddr1 }} </span>
            </div>
          </v-sheet>
        </div>
      </v-col>

    </v-row>


    <!-- TODO:以下 運行情報 については一旦日帰りで実装。数日の旅程の場合はデータの持ち方や表示を検討必要 -->
    <!-- <v-row>
      <v-col cols="12">
        <div>
          <v-sheet class="py-10 mx-auto text-start" max-width="1000" color="transparent">
            <p class="mb-2 font-weight-bold">旅程</p>
            <v-divider class="mb-2 border-opacity-100" />

            <v-table class="text-pre-wrap bg-background">
              <thead>
                <tr align="center">
                  <th width="80%" colspan="2" class="text-center">旅程</th>
                  <th class="text-center" colspan="2">宿泊場所</th>
                </tr>
              </thead>
              <tbody>
                <tr class="dashed-border" align="center">
                  <td>{{ orderInfo.dispatchDate }}</td>
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
                  <td align="right">日</td>
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
          </v-sheet>
        </div>
      </v-col>
    </v-row> -->

    <v-row>
      <v-col col="12">
        <v-card flat rounded="xl" variant="outlined" class="color-outline">
          <v-container fluid>
            <v-card-title class="color-title">運送引受会社
              <v-chip class="ml-2 mb-1" variant="flat" size="x-small" label color="warning">
                必須
              </v-chip>

            </v-card-title>
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <v-text-field v-model="counterPersonMain" label="担当者①" outlined />
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field v-model="counterPersonSub" label="担当者②" outlined />
              </v-col>
            </v-row>

            <v-btn
v-if="orderInfo.state == $Const.STATUS_REQUEST || orderInfo.state == $Const.STATUS_UNDERTAKE" rounded
              dark color="yellow" size="large" class="mb-2 pr-8 pl-8" @click="entry">
              配車情報を登録する
            </v-btn>
            <v-overlay :model-value="loading" class="align-center justify-center">
              <v-progress-circular color="primary" size="150" width="20" indeterminate />
            </v-overlay>

            <v-row v-if="dispatchInfo.busList.length > 0" class="mb-4">
              <!-- 配車情報 -->
              <v-col v-for="(bus, index) in dispatchInfo.busList" :key="bus.id" cols="12" sm="6" md="4" class="py-2">
                <v-card
outlined prepend-icon="mdi-bus" :title="$Const.VEHICLE_TYPE_DISP[bus.vehicleType].text"
                  :subtitle="bus.vehicleNo" color="background" class="text-body-2">
                  <template #append>
                    <v-icon size="small" @click="removeBus(index)">
                      mdi-close
                    </v-icon>
                  </template>
                </v-card>
              </v-col>
            </v-row>

            <v-row v-if="dispatchInfo.driverList.length > 0" class="mb-4">
              <!-- 乗務員情報 -->
              <v-col
v-for="(driver, index) in dispatchInfo.driverList" :key="driver.id" cols="12" sm="6" md="4"
                class="py-2">
                <v-card
outlined prepend-icon="mdi-card-account-details-outline" :title="driver.driverName"
                  :subtitle="driver.contact" color="background" class="text-body-2">
                  <template #append>
                    <v-icon size="small" @click="removeDriver(index)">
                      mdi-close
                    </v-icon>
                  </template>
                </v-card>
              </v-col>
            </v-row>

            <v-row v-if="dispatchInfo.guideList.length > 0" class="mb-4">
              <!-- ガイド情報 -->
              <v-col
v-for="(guide, index) in dispatchInfo.guideList" :key="guide.id" cols="12" sm="6" md="4"
                class="py-2">
                <v-card
outlined prepend-icon="mdi-human-female-dance" :title="guide.guideName"
                  :subtitle="guide.contact" color="background" class="text-body-2">
                  <template #append>
                    <v-icon size="small" @click="removeGuide(index)">
                      mdi-close
                    </v-icon>
                  </template>

                </v-card>

              </v-col>
            </v-row>

          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col col="12">
        <v-card flat rounded="xl" variant="outlined" class="color-outline">
          <v-container fluid>
            <v-card-title class="color-title">支払い方法
            <v-chip class="ml-2 mb-1" variant="flat" size="x-small" label color="warning">
                必須
              </v-chip>
            </v-card-title>
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <v-card flat rounded="xl" class="mx-auto" color="background">

                  <v-card-text>
                    <p>
                      <span class="font-weight-bold">運賃及び料金の支払い方法</span>
                    </p>
                    <v-divider class="mb-2 border-opacity-100" />
                    <span>
                      {{ dispPaymentType }}</span>
                  </v-card-text>
                  <v-card-text>
                    <p>
                      <span class="font-weight-bold">適用を受けようとする割引</span>
                    </p>
                    <v-divider class="mb-2 border-opacity-100" />
                    <span>
                      {{ dispDiscount }}</span>
                  </v-card-text>
                  <v-card-text>
                    <p>
                      <span class="font-weight-bold">特約事項</span>
                    </p>
                    <v-divider class="mb-2 border-opacity-100" />
                    <span>
                      {{ orderInfo.specialTerms }}</span>
                  </v-card-text>
                  <v-card-text>
                    <p>
                      <span class="font-weight-bold">備考</span>
                    </p>
                    <v-divider class="mb-2 border-opacity-100" />

                    <span>
                      {{ orderInfo.remarks }}</span>
                  </v-card-text>


                </v-card>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-card color="background" class="mx-auto" elevation="3">
                  <v-card-title>運賃・料金</v-card-title>

                  <v-row dense>
                    <v-col cols="6" class="pa-2">
                      <p>
                        <span class="text-body-2">料金</span>
                      </p>
                      <v-text-field v-model="orderAmount" suffix="円" label="料金" @update:model-value="editOrderAmount" />
                    </v-col>
                    <v-col cols="6" class="pa-2">
                      <p>
                        <span class="text-body-2">実費</span>
                      </p>
                      <v-text-field v-model="actualCost" suffix="円" label="実費" @update:model-value="editActualCost" />
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col cols="10" class="pa-2">
                      <p>
                        <span class="text-body-2">合計金額</span>
                      </p>

                      <div class="d-flex align-center">
                        <p class="text-h6 mb-4">{{ totalAmount }} 円</p>
                        <span class="ml-4">
                          <v-checkbox v-model="isTaxIn" label="税込み" @click="formatTax" />
                        </span>
                      </div>
                    </v-col>
                  </v-row>

                  <v-row dense>
                    <v-col cols="4" class="pa-4">
                      <p>
                        <span class="text-body-2">支払期日</span>
                      </p>

                      <datepicker
v-model="paymentDueDate" :teleport="true" locale="jp" auto-apply
                        :enable-time-picker="false" format="yyyy/MM/dd" model-type="yyyy/MM/dd" />

                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>

    <br />

    <v-row justify="center" no-gutters>
      <v-col align="center">
        <v-btn rounded dark color="grey" size="large" class="mb-2 pr-8 pl-8" @click="back"> 戻 る </v-btn>
      </v-col>
      <v-spacer />

      <v-col v-if="orderInfo.state == $Const.STATUS_REQUEST" align="center">
        <v-btn rounded dark color="primary" size="large" class="mb-2 pr-8 pl-8" @click="undertake">
          運送手配を引き受ける
        </v-btn>
      </v-col>
      <v-col v-else-if="orderInfo.state == $Const.STATUS_PAYMENT_METHOD_CONFIRMED" align="center">
        <v-btn rounded dark color="primary" size="large" class="mb-2 pr-8 pl-8" @click="settlement">
          運送の完了報告と実費精算
        </v-btn>
      </v-col>

      <v-col v-else-if="orderInfo.state == $Const.STATUS_TRANSPORTATION_COMPLETED" align="center">
        <v-btn rounded dark color="primary" size="large" class="mb-2 pr-8 pl-8" @click="confirmation">
          入金を確認しました
        </v-btn>
      </v-col>

      <v-spacer />
      <v-col align="center">
        <v-btn
v-if="orderInfo.state == $Const.STATUS_REQUEST" rounded dark color="secondary" size="large"
          class="mb-2 pr-8 pl-8" @click="deny">
          運送手配を断る
        </v-btn>
      </v-col>
      <v-spacer />
    </v-row>
  </v-container>
  <!-- </div> -->
</template>
<script setup>
const { $Const } = useNuxtApp()
const { $swal } = useNuxtApp()
const router = useRouter()
// 共通関数の呼び出し
const utils = useUtils()
// DB接続の呼び出し
const userData = useUserData()
const masterData = useMasterData()

// state保持情報 //
// ログインユーザーのキーID
const { userInfo } = useUserInfo()
const keyUserId = userInfo.value.companyId

const { orderInfo, editOrderInfo, clearOrderInfo } = useOrderInfo()
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
  return (
    (orderInfo.value.vehicleTypeLiftAmount || 0) +
    (orderInfo.value.vehicleTypeMediumAmount || 0) +
    (orderInfo.value.vehicleTypeSmallAmount || 0) +
    (orderInfo.value.vehicleTypeMicroAmount || 0)
  )
})

// 画面入力項目
// TODO:一旦帳票と合わせて可変ではなく固定変数定義
const counterPersonMain = ref(orderDeliveryUserInfo.value.counterPersonMain)
const counterPersonSub = ref(orderDeliveryUserInfo.value.counterPersonSub)

// [運賃・料金]
// 支払方法
const PAYMENT_TYPE = [
  { label: '銀行振込', code: '1' },
  { label: '現金', code: '2' },
  { label: 'その他', code: '9' },
]
const dispPaymentType = ref('')

// 割引情報：DBでマスタ管理
const discountList = ref(await masterData.getDiscountList())
const dispDiscount = ref('')

const selectDiscount = ref(orderInfo.value.selectDiscount)
const selectDiscountOther = ref(orderInfo.value.selectDiscountOther)
//料金
const isTaxIn = ref(true)
const orderAmount = ref(orderInfo.value.orderAmount)
const actualCost = ref(orderInfo.value.actualCost)
/**
 * [内部関数]入力値を金額値に編集
 */
const formatAmount = (value) => {
  const num = utils.toBlank(value).replace(/[^\d]/g, '') // 数字以外を削除
  return num ? Number(num).toLocaleString() : ''
}

/**
 *発注金額の金額編集
 */
const editOrderAmount = (value) => {
  orderAmount.value = formatAmount(value)
}

/**
 *実費の金額編集
 */
const editActualCost = (value) => {
  actualCost.value = formatAmount(value)
}

// 発注金額＋実費の合計金額を計算するcomputedプロパティ
const totalAmount = computed(() => {
  let totalValue = 0
  let orderAmountValue = utils.toBlank(orderAmount.value).replace(/[^\d]/g, '')
  let actualCostValue = utils.toBlank(actualCost.value).replace(/[^\d]/g, '')
  if (orderAmountValue == '') {
    orderAmountValue = '0'
  }
  if (actualCostValue == '') {
    actualCostValue = '0'
  }

  if (utils.toNumber(orderAmountValue) > 0 || utils.toNumber(actualCost.value) > 0) {
    totalValue = utils.toNumber(orderAmountValue) + utils.toNumber(actualCostValue)

    if (isTaxIn.value) {
      totalValue = totalValue * 1.1
    }
    totalValue = totalValue.toLocaleString('ja-JP', { maximumFractionDigits: 0 })
  }
  return totalValue
})

// 支払期日
const paymentDueDate = ref(orderInfo.value.paymentDueDate)

/**
 * 「税込み」チェック時に実行
 * チェックONの場合、合計金額に消費税を追加
 */
const formatTax = () => {
  let totalAmountValue = totalAmount.value
  if (utils.toNumber(totalAmountValue) > 0) {
    totalAmountValue = totalAmount.value.replace(/[^\d]/g, '')
    if (isTaxIn.value) {
      totalAmountValue = utils.toNumber(totalAmountValue) * 1.1
    } else {
      totalAmountValue = utils.toNumber(totalAmountValue)
    }
  }
  return totalAmountValue ? Number(totalAmountValue).toLocaleString('ja-JP', { maximumFractionDigits: 0 }) : 0
}

/**
 * 初期処理
 * 表示用の編集
 */
onMounted(async () => {
  //支払い方法
  if (utils.toBlank(orderInfo.value.selectPayment) !== '') {
    if (orderInfo.value.selectPayment == '9') {
      // その他の内容を表示する
      dispPaymentType.value = 'その他 (' + orderInfo.value.selectPaymentOther + ')'
    } else {
      dispPaymentType.value = PAYMENT_TYPE.find((item) => item.code === orderInfo.value.selectPayment).label
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
      dispDiscountArray.push(discountList.value.find((item) => item.code === code).title)
    }
  }
  dispDiscount.value = dispDiscountArray.join('、')
})

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
    // companyEmail: orderDeliveryUserInfo.value.companyEmail,
    // 以下本画面入力情報
    counterPersonMain: counterPersonMain.value,
    counterPersonSub: counterPersonSub.value,
  }
  editOrderDeliveryUserInfo(deliveryUser)

  const order = orderInfo
  // 以下本画面入力情報
  order.value.selectDiscount = selectDiscount.value
  order.value.selectDiscountOther = selectDiscountOther.value
  order.value.orderAmount = orderAmount.value
  order.value.actualCost = actualCost.value
  order.value.paymentDueDate = paymentDueDate.value
  editOrderInfo(order.value)

  loading.value = true

  // 画面遷移
  router.push('/delivery/order/dispatch')
}

/**
 * 配車情報を削除する関数
 */
const removeBus = (index) => {
  dispatchInfo.value.busList.splice(index, 1); // 指定したインデックスの配車情報を削除
};

/**
 * 乗務員情報を削除する関数
 */
const removeDriver = (index) => {
  dispatchInfo.value.driverList.splice(index, 1); // 指定したインデックスの乗務員情報を削除
};
/**
 * ガイド情報を削除する関数
 */
const removeGuide = (index) => {
  dispatchInfo.value.guideList.splice(index, 1); // 指定したインデックスのガイド情報を削除
};


/** 運送依頼を引き受ける */
const undertake = async () => {
  // 必須選択チェック
  if (dispatchInfo.value.busList.length == 0) {
    $swal.fire({
      text: '配車情報を登録してください。',
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning',
    })
    return
  }
  if (utils.toBlank(counterPersonMain.value) == '') {
    $swal.fire({
      text: 'ご担当者様を入力してください。',
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning',
    })
    return
  }

  if (utils.toBlank(orderAmount.value) == '') {
    $swal.fire({
      text: '運賃・料金を入力してください。',
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning',
    })
    return
  }

  // 案件情報を保存
  let confirmRes = false
  await $swal
    .fire({
      text: '運送引受を申込会社へ通知します。よろしいですか？',
      showCancelButton: true,
      confirmButtonColor: '#00BCD4',
      cancelButtonColor: '#CFD8DC',
      confirmButtonText: 'はい。',
      cancelButtonText: 'キャンセル',
      icon: 'info',
    })
    .then((res) => {
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
    // 運送手配引受：3
    state: $Const.STATUS_UNDERTAKE,
    counterPersonMain: counterPersonMain.value,
    counterPersonSub: counterPersonSub.value,
    orderAmount: utils.toBlank(orderAmount.value),
    actualCost: utils.toBlank(actualCost.value),
    paymentDueDate: utils.toBlank(paymentDueDate.value),
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

/**
 * 運送完了報告と実費含めた料金を確定する
 */
const settlement = async () => {
  let confirmRes = false
  await $swal
    .fire({
      text: '運送の完了報告と実費含めた料金を確定します。よろしいですか？',
      showCancelButton: true,
      confirmButtonColor: '#00BCD4',
      cancelButtonColor: '#CFD8DC',
      confirmButtonText: 'はい。',
      cancelButtonText: 'キャンセル',
      icon: 'info',
    })
    .then((res) => {
      confirmRes = res.isConfirmed
    })
  if (!confirmRes) {
    return
  }

  if (actualCost.value <= 0) {
    await $swal
      .fire({
        text: '実費の入力がありません。よろしいですか？',
        showCancelButton: true,
        confirmButtonColor: '#00BCD4',
        cancelButtonColor: '#CFD8DC',
        confirmButtonText: 'はい。',
        cancelButtonText: 'キャンセル',
        icon: 'info',
      })
      .then((res) => {
        confirmRes = res.isConfirmed
      })
    if (!confirmRes) {
      return
    }
  }

  // ステータス更新
  const updateObject = {
    id: keyOrderId,
    // 運送完了：5
    state: $Const.STATUS_TRANSPORTATION_COMPLETED,
    actualCost: actualCost.value,
    paymentDueDate: paymentDueDate.value,
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
  router.push('/delivery/order/list')
}

/**
 * 入金を確定する
 */
const confirmation = async () => {
  let confirmRes = false
  await $swal
    .fire({
      text: '申込会社からの入金を確認したことを通知します。よろしいですか？',
      showCancelButton: true,
      confirmButtonColor: '#00BCD4',
      cancelButtonColor: '#CFD8DC',
      confirmButtonText: 'はい。',
      cancelButtonText: 'キャンセル',
      icon: 'info',
    })
    .then((res) => {
      confirmRes = res.isConfirmed
    })
  if (!confirmRes) {
    return
  }

  // ステータス更新
  const updateObject = {
    id: keyOrderId,
    // 支払い完了：6
    state: $Const.STATUS_PAYMENT_COMPLETED,
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
  router.push('/delivery/order/list')
}

/** 運送手配を断る */
const deny = async () => {
  // 必須選択チェック
  // 案件情報を保存
  let confirmRes = false
  await $swal
    .fire({
      text: '運送手配を断ります。よろしいですか？',
      showCancelButton: true,
      confirmButtonColor: '#00BCD4',
      cancelButtonColor: '#CFD8DC',
      confirmButtonText: 'はい。',
      cancelButtonText: 'キャンセル',
      icon: 'info',
    })
    .then((res) => {
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
  layout: 'user',
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

.color-outline {
  border-color: #448aff !important;
}

.color-title {
  color: #448aff !important;
}
</style>
