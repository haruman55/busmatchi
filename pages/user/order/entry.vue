<template>
  <div>
    <v-container class="fill-height align-center" fluid>
      <v-row no-gutters>
        <v-col>
          <v-card-text class="font-weight-bold text-h5">
            <v-icon left x-large @click="back">
              mdi-close
            </v-icon>
            案件登録
          </v-card-text>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row>
        <v-col>
          <v-card>
            <v-container fluid>
              <v-card-title>申込者情報</v-card-title>
              <v-row>

                <v-col cols="12" sm="6" md="6">
                  <v-text-field v-model="applicant" label="申込担当者名" outlined />

                </v-col>
                <v-col align="center" cols="12" sm="6" md="6">
                  <v-text-field v-model="emergencyContact" label="緊急連絡先" outlined />
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row>
        <v-col cols="12" sm="3" md="3">
          <v-btn rounded dark color="yellow" class="mb-2 pr-8 pl-8" @click="customerSerch">
            顧客選択
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row>
        <v-col>
          <v-card>
            <v-container fluid>
              <v-card-title>お客様情報</v-card-title>
              <v-row>
                <v-col v-if="applicantCustomerId != '' && applicantCustomerId != null" cols="12" sm="6" md="6">
                  <v-card color="white" class="mx-auto" elevation="15">
                    <v-card-item class="text-center text-h4">
                      {{ applicantCustomerInfo.customerName }}
                    </v-card-item>
                    <v-card-item class="text-left" prepend-icon="mdi-map-marker-outline">
                      {{ applicantCustomerInfo.customerAddr }}
                    </v-card-item>
                    <v-card-item class="text-left">
                      <v-icon>mdi-phone-outline</v-icon>{{ applicantCustomerInfo.customerTel }}
                      <v-icon>mdi-fax</v-icon> {{ applicantCustomerInfo.customerFax }}
                    </v-card-item>
                    <v-card-item class="text-left">
                      <v-icon>mdi-email-outline</v-icon>{{ applicantCustomerInfo.customerMail }}
                    </v-card-item>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field v-model="tourOrganization" label="団体名" outlined />
                  <v-textarea v-model="remarks" label="備考" rows="2" outlined />
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <br>
    <v-container class="align-center">
      <v-row>
        <v-col>
          <v-card>
            <v-container fluid>
              <v-card-title>申込情報</v-card-title>

              <v-row>
                <v-col cols="12" sm="2" md="2">申込乗車人員</v-col>
                <v-col cols="12" sm="2" md="2"><v-text-field
v-model.number="passengers" label="申込乗車人数" type="number"
                    outlined min="0" step="1" /></v-col>
              </v-row>
              <v-row justify="center" dense>
                <v-col cols="12" sm="2" md="2">乗車定員別又は<br>車種別車両数</v-col>
                <v-col><v-text-field
v-model.number="vehicleTypeLiftAmount" label="リフト-車両数" type="number" outlined
                    min="0" step="1" suffix="両" /></v-col>
                <v-col><v-text-field
v-model.number="vehicleTypeMediumAmount" label="中型車-車両数" type="number" outlined
                    min="0" step="1" suffix="両" /></v-col>
                <v-col><v-text-field
v-model.number="vehicleTypeSmallAmount" label="小型車-車両数" type="number" outlined
                    min="0" step="1" suffix="両" /></v-col>
                <v-col><v-text-field
v-model.number="vehicleTypeMicroAmount" label="マイクロ-車両数" type="number" outlined
                    min="0" step="1" suffix="両" /></v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" sm="2" md="2">車両合計</v-col><v-col cols="12" sm="2" md="2">{{ totalvehicleAmount
                  }}両</v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="2" md="2">配車日時
                </v-col>
                <v-col cols="12" sm="3" md="3" class="ma-2 pa-2">
                  <datepicker
v-model="dispatchDate" :teleport="true" locale="jp" auto-apply :enable-time-picker="false"
                    format="yyyy/MM/dd" model-type="yyyy/MM/dd" />
                </v-col>
                <v-col cols="12" sm="2" md="2">
                  <v-select
v-model="dispatchTimeHour" label="時間" item-title="disp" item-value="code"
                    :items="$Const.TIME_HOUR_LIST" />
                </v-col>
                <v-col cols="12" sm="2" md="2">

                  <v-select
v-model="dispatchTimeMinute" label="分" item-title="disp" item-value="code"
                    :items="$Const.TIME_MINUTE_LIST" />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" sm="2" md="2">出発時間
                </v-col>
                <v-col cols="12" sm="2" md="2">
                  <v-select
v-model="departureTimeHour" label="時間" item-title="disp" item-value="code"
                    :items="$Const.TIME_HOUR_LIST" />
                </v-col>
                <v-col cols="12" sm="2" md="2">

                  <v-select
v-model="departureTimeMinute" label="分" item-title="disp" item-value="code"
                    :items="$Const.TIME_MINUTE_LIST" />
                </v-col>
              </v-row>



              <v-row>
                <v-col cols="12" sm="2" md="2">配車場所</v-col>
                <v-col cols="12" sm="8" md="8">
                  <v-text-field v-model="deliveryLocation" label="配車場所" type="text" />
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <!-- TODO:以下 運行情報 については一旦日帰りで実装。数日の旅程の場合はデータの持ち方や表示を検討必要 -->
    <v-container>
      <v-row>
        <v-col>
          <v-card>
            <v-container fluid>
              <v-card-title>旅程</v-card-title>
              <v-row>
                <v-col>

                  <v-table class="table-border">
                    <thead>
                      <tr>
                        <th width="80%" colspan="2" class="text-center">
                          旅程
                        </th>
                        <th class="text-center">
                          宿泊場所
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="dashed-border">
                        <td width="10%">{{ dispatchDate }} </td>
                        <td width="70%"><v-textarea v-model="itinerary1Top" label="旅程" rows="1" outlined />
                        </td>
                        <td width="20%"><v-text-field v-model="accommodations1" label="宿泊施設" outlined /></td>
                      </tr>
                      <tr class="thick-border">
                        <td width="10%" align="right">{{ dispatchTime }}発</td>
                        <td width="70%"><v-textarea v-model="timeschedule1Top" label="発着予定時刻" rows="1" outlined /></td>
                        <td width="20%"><v-text-field v-model="accommodationsTel1" label="電話" outlined /></td>
                      </tr>
                      <tr class="dashed-border">
                        <td width="10%" align="right">日 </td>
                        <td width="70%"><v-textarea v-model="itinerary1Bottom" label="旅程" rows="1" outlined />
                        </td>
                        <td width="20%" rowspan="2"><v-textarea
v-model="accommodationsAddr1" label="住所" outlined
                            rows="3" /></td>
                      </tr>
                      <tr class="thick-border">
                        <td width="10%" align="right">発</td>
                        <td width="70%"><v-textarea v-model="timeschedule1Bottom" label="発着予定時刻" rows="1" outlined />
                        </td>
                      </tr>
                    </tbody>
                  </v-table>

                </v-col>
              </v-row>
              <!-- </v-container>
          </v-card>
        </v-col>
      </v-row>

    </v-container>
    <v-container class="align-center">
      <v-row>
        <v-col>
          <v-card>
            <v-container fluid> -->

              <v-row>
                <v-col cols="12" sm="2" md="2">終着日時</v-col>
                <v-col cols="12" sm="2" md="2" class="ma-2 pa-2">
                  <datepicker
v-model="endDate" :teleport="true" locale="jp" auto-apply :enable-time-picker="false"
                    format="yyyy/MM/dd" model-type="yyyy/MM/dd" />
                </v-col>
                <!-- <v-col cols="12" sm="2" md="2">
                  <v-text-field v-model="endingTime" label="終着時間" type="text" />
                </v-col> -->
                <v-col cols="12" sm="2" md="2">
                  <v-select
v-model="endingTimeHour" label="時間" item-title="disp" item-value="code"
                    :items="$Const.TIME_HOUR_LIST" />
                </v-col>
                <v-col cols="12" sm="2" md="2">

                  <v-select
v-model="endingTimeMinute" label="分" item-title="disp" item-value="code"
                    :items="$Const.TIME_MINUTE_LIST" />
                </v-col>

              </v-row>

              <v-row>
                <v-col cols="12" sm="2" md="2">終着場所</v-col>
                <v-col cols="12" sm="8" md="8">
                  <v-text-field v-model="terminalLocation" label="終着場所" type="text" />
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
      </v-row>
    </v-container>


    <v-container>

      <v-row v-if="orderState == $Const.STATUS_DRAFT || orderState == $Const.STATUS_ORDER_DENY || orderState == ''">
        <v-col cols="12">
          <v-btn rounded dark color="yellow" class="mb-2 pr-8 pl-8" @click="deliverySerch">
            運送引受会社選択
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-container v-if="orderDeliveryUserInfo.companyId != ''">
      <v-row>
        <v-col>
          <v-card>
            <v-container fluid>
              <v-card-title>運送引受会社</v-card-title>

              <v-row>
                <v-col cols="12" sm="6" md="6">
                  <v-card color="white" class="mx-auto" elevation="15">
                    <v-card-item class="text-center text-h4">
                      {{ orderDeliveryUserInfo.companyName }}
                    </v-card-item>
                    <v-card-item class="text-left" prepend-icon="mdi-map-marker-outline">
                      {{ orderDeliveryUserInfo.companyAddr }}
                    </v-card-item>
                    <v-card-item class="text-left">
                      <v-icon>mdi-phone-outline</v-icon>{{ orderDeliveryUserInfo.companyTel }}
                      <v-icon>mdi-fax</v-icon> {{ orderDeliveryUserInfo.companyFax }}
                      <v-icon>mdi-phone-outline</v-icon> TODO:車庫番号(入力なし)
                    </v-card-item>
                    <v-card-item class="text-left ">
                      <v-icon>mdi-email-outline</v-icon>{{ orderDeliveryUserInfo.companyEmail }}
                    </v-card-item>
                    <v-card-item class="text-left ">
                      事業許可:平成 10年 4月 1日 第 10号 TODO:(入力なし)
                    </v-card-item>
                    <v-card-item class="text-left ">
                      営業区域: TODO:(入力なし)
                    </v-card-item>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-card-item>
                    <v-table v-if="keydispatchId != null && keydispatchId != ''">
                      <thead>
                        <tr align="center">
                          <th colspan="5" class="text-left">
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
                          <td v-for="(guide) in dispatchInfo.guideList" :key="guide.id" colspan="2"> {{
                            guide.guideName
                          }}</td>
                        </tr>
                      </tbody>
                    </v-table>
                  </v-card-item>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <br>
    <v-container v-if="orderState == $Const.STATUS_RESERVATION" align="center">
      <v-card>
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <!-- <v-card> -->
            <v-row>
              <v-col cols="12">
                運賃・料金
              </v-col>

              <v-col cols="12">
                <v-text-field v-model="a" label="発注料金" type="text" />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field v-model="b" label="実費" type="text" />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field v-model="c" label="合計金額" type="text" />
              </v-col>
            </v-row>
            <!-- </v-card> -->
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <!-- <v-card> -->
            <v-row>
              <v-col cols="12">料金の支払方法</v-col>
              <v-col cols="12">
                <v-radio-group v-model="selectPayment" inline>
                  <v-radio value="1" label="銀行振込" />
                  <v-radio value="2" label="現金" />
                  <v-radio value="9" label="その他" />
                </v-radio-group>
                <v-text-field v-model="c" label="その他" type="text" />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">適用予定の割引</v-col>
              <!-- <v-col ><v-checkbox v-model="discount" label="学校団体割引" /><v-checkbox v-model="discount" label="XXXX" /><v-checkbox v-model="discount" label="その他" /></v-col> -->
              <v-col cols="12">
                <v-radio-group v-model="selectDiscount" inline>
                  <v-radio value="1" label="学校団体割引" />
                  <v-radio value="2" label="XXXXXXXXXXXXXX割引" />
                  <v-radio value="9" label="その他" />
                </v-radio-group>
                <v-text-field v-model="c" label="その他" type="text" />
              </v-col>

            </v-row>
            <!-- </v-card> -->
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-textarea v-model="d" label="特約事項" rows="2" outlined />
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field v-model="d" label="担当者" outlined />
          </v-col>

        </v-row>
        <v-row>
          <v-col cols="12">
            <v-textarea v-model="d" label="備考" rows="2" outlined />
          </v-col>
        </v-row>

      </v-card>
    </v-container>


    <v-container class="align-center" fluid>
      <v-row justify="center" no-gutters>
        <v-col align="center">
          <v-btn rounded dark size="x-large" color="grey" class="mb-2 pr-8 pl-8" @click="back">
            戻 る
          </v-btn>
        </v-col>

        <v-col v-if="orderState == $Const.STATUS_DRAFT || orderState == ''" align="center">
          <v-btn rounded dark size="x-large" color="green" class="mb-2 pr-8 pl-8" @click="draft">
            一次保存
          </v-btn>
        </v-col>
        <v-spacer />

        <v-col align="center">
          <v-btn rounded dark size="x-large" color="indigo darken-4" class="mb-2 pr-8 pl-8" @click="confirm">
            申込内容確認
          </v-btn>
        </v-col>

      </v-row>
    </v-container>
  </div>
</template>
<script setup>
const { $Const } = useNuxtApp()
const { $swal } = useNuxtApp()
const router = useRouter()
// DB接続の呼び出し
const userData = useUserData();
// 共通関数の呼び出し
const utils = useUtils();

// ログインユーザーのキーID
const { userInfo } = useUserInfo()
const keyUserId = userInfo.value.companyId

// 画面入力(設定)された申込情報を保持
const { orderInfo, editOrderInfo, clearOrderInfo } = useOrderInfo()
// 既にDB登録済みの案件の場合のid情報
const keyOrderId = orderInfo.value.id
const orderState = utils.toBlank(orderInfo.value.state)

// 選択された申込顧客情報（他画面からの引継ぎ情報）
const { applicantCustomerInfo, clearApplicantCustomerInfo } = useApplicantCustomerInfo()
const applicantCustomerId = applicantCustomerInfo.value.id

// 選択された申込運送引受会社情報（他画面からの引継ぎ情報）
const { orderDeliveryUserInfo, editOrderDeliveryUserInfo, clearOrderDeliveryUserInfo } = useOrderDeliveryUserInfo()

// 運行情報（他画面からの引継ぎ情報）
const { orderOperationInfo, editOrderOperationInfo, clearOrderOperationInfo } = useOrderOperationInfo()
// 運送引受外車側で登録された配車情報を保持
const { dispatchInfo, clearDispatchInfo } = useDispatchInfo()
const keydispatchId = ref(dispatchInfo.value.id)


// 画面入力項目
const applicant = ref(orderInfo.value.applicant)
const emergencyContact = ref(orderInfo.value.emergencyContact)
const tourOrganization = ref(orderInfo.value.tourOrganization)
const remarks = ref(orderInfo.value.remarks)
const passengers = ref(orderInfo.value.passengers)
const vehicleTypeLiftAmount = ref(orderInfo.value.vehicleTypeLiftAmount)
const vehicleTypeMediumAmount = ref(orderInfo.value.vehicleTypeMediumAmount)
const vehicleTypeSmallAmount = ref(orderInfo.value.vehicleTypeSmallAmount)
const vehicleTypeMicroAmount = ref(orderInfo.value.vehicleTypeMicroAmount)
const dispatchDate = ref(orderInfo.value.dispatchDate)

const dispatchTime = ref(orderInfo.value.dispatchTime)
const departureTime = ref(orderInfo.value.departureTime)

const dispatchTimeHour = ref(orderInfo.value.dispatchTimeHour)
const dispatchTimeMinute = ref(orderInfo.value.dispatchTimeMinute)
const departureTimeHour = ref(orderInfo.value.departureTimeHour)
const departureTimeMinute = ref(orderInfo.value.departureTimeMinute)

const deliveryLocation = ref(orderInfo.value.deliveryLocation)
// TODO:旅程の行数は一旦２行で決め打ち固定
const itinerary1Top = ref(orderOperationInfo.value.itinerary1Top)
const itinerary1Bottom = ref(orderOperationInfo.value.itinerary1Bottom)
const timeschedule1Top = ref(orderOperationInfo.value.timeschedule1Top)
const timeschedule1Bottom = ref(orderOperationInfo.value.timeschedule1Bottom)
const accommodations1 = ref(orderOperationInfo.value.accommodations1)
const accommodationsTel1 = ref(orderOperationInfo.value.accommodationsTel1)
const accommodationsAddr1 = ref(orderOperationInfo.value.accommodationsAddr1)
const endDate = ref(orderOperationInfo.value.endDate)
const endingTime = ref(orderOperationInfo.value.endingTime)
const endingTimeHour = ref(orderOperationInfo.value.endingTimeHour)
const endingTimeMinute = ref(orderOperationInfo.value.endingTimeMinute)
const terminalLocation = ref(orderOperationInfo.value.terminalLocation)

// 合計を計算するcomputedプロパティ
const totalvehicleAmount = computed(() => {
  return (vehicleTypeLiftAmount.value || 0) + (vehicleTypeMediumAmount.value || 0) + (vehicleTypeSmallAmount.value || 0) + (vehicleTypeMicroAmount.value || 0);
});


/**
 * 顧客選択画面表示
 */
const customerSerch = () => {

  // 当該画面での入力情報をstateへ保存
  const orderBaseObject = {
    id: keyOrderId,
    state: orderState,
    companyId: keyUserId,
    applicant: applicant.value,
    applicantCompanyName: orderInfo.value.applicantCompanyName,
    applicantCompanyTel: orderInfo.value.applicantCompanyTel,
    applicantCompanyFax: orderInfo.value.applicantCompanyFax,
    applicantCompanyAddr: orderInfo.value.applicantCompanyAddr,
    applicantCompanyEmail: orderInfo.value.applicantCompanyEmail,

    emergencyContact: utils.toBlank(emergencyContact.value),
    tourOrganization: utils.toBlank(tourOrganization.value),
    remarks: utils.toBlank(remarks.value),
    passengers: utils.toZero(passengers.value),
    vehicleTypeLiftAmount: utils.toZero(vehicleTypeLiftAmount.value),
    vehicleTypeMediumAmount: utils.toZero(vehicleTypeMediumAmount.value),
    vehicleTypeSmallAmount: utils.toZero(vehicleTypeSmallAmount.value),
    vehicleTypeMicroAmount: utils.toZero(vehicleTypeMicroAmount.value),
    dispatchDate: dispatchDate.value,
    dispatchTime: dispatchTime.value,
    dispatchTimeHour: utils.toZero(dispatchTimeHour.value),
    dispatchTimeMinute: utils.toZero(dispatchTimeMinute.value),
    departureTime: departureTime.value,
    departureTimeHour: utils.toZero(departureTimeHour.value),
    departureTimeMinute: utils.toZero(departureTimeMinute.value),

    deliveryLocation: deliveryLocation.value,
    customerId: utils.toBlank(applicantCustomerId),
    deliveryCompanyId: utils.toBlank(orderDeliveryUserInfo.value.id),
  }
  editOrderInfo(orderBaseObject)
  const orderOperationInfoObject = {
    itinerary1Top: itinerary1Top.value,
    itinerary1Bottom: itinerary1Bottom.value,
    timeschedule1Top: timeschedule1Top.value,
    timeschedule1Bottom: timeschedule1Bottom.value,
    accommodations1: accommodations1.value,
    accommodationsTel1: accommodationsTel1.value,
    accommodationsAddr1: accommodationsAddr1.value,
    endDate: endDate.value,
    endingTime: endingTime.value,
    endingTimeHour: utils.toZero(endingTimeHour.value),
    endingTimeMinute: utils.toZero(endingTimeMinute.value),

    terminalLocation: terminalLocation.value,
  }
  editOrderOperationInfo(orderOperationInfoObject)


  // 画面遷移
  router.push('/user/customer/list')
}
/**
 * 運送引受会社選択画面表示
 */
const deliverySerch = () => {

  // 当該画面の入力情報をstateへ保存
  const orderBaseObject = {
    id: keyOrderId,
    state: orderState,
    companyId: keyUserId,
    applicant: applicant.value,
    applicantCompanyName: orderInfo.value.applicantCompanyName,
    applicantCompanyTel: orderInfo.value.applicantCompanyTel,
    applicantCompanyFax: orderInfo.value.applicantCompanyFax,
    applicantCompanyAddr: orderInfo.value.applicantCompanyAddr,
    applicantCompanyEmail: orderInfo.value.applicantCompanyEmail,

    emergencyContact: utils.toBlank(emergencyContact.value),
    tourOrganization: utils.toBlank(tourOrganization.value),
    remarks: utils.toBlank(remarks.value),
    passengers: utils.toZero(passengers.value),
    vehicleTypeLiftAmount: utils.toZero(vehicleTypeLiftAmount.value),
    vehicleTypeMediumAmount: utils.toZero(vehicleTypeMediumAmount.value),
    vehicleTypeSmallAmount: utils.toZero(vehicleTypeSmallAmount.value),
    vehicleTypeMicroAmount: utils.toZero(vehicleTypeMicroAmount.value),
    dispatchDate: dispatchDate.value,
    dispatchTime: dispatchTime.value,
    dispatchTimeHour: utils.toZero(dispatchTimeHour.value),
    dispatchTimeMinute: utils.toZero(dispatchTimeMinute.value),
    departureTime: departureTime.value,
    departureTimeHour: utils.toZero(departureTimeHour.value),
    departureTimeMinute: utils.toZero(departureTimeMinute.value),

    deliveryLocation: deliveryLocation.value,
    customerId: utils.toBlank(applicantCustomerId),
    deliveryCompanyId: utils.toBlank(orderDeliveryUserInfo.value.id),
  }
  editOrderInfo(orderBaseObject)

  const orderOperationInfoObject = {
    itinerary1Top: itinerary1Top.value,
    itinerary1Bottom: itinerary1Bottom.value,
    timeschedule1Top: timeschedule1Top.value,
    timeschedule1Bottom: timeschedule1Bottom.value,
    accommodations1: accommodations1.value,
    accommodationsTel1: accommodationsTel1.value,
    accommodationsAddr1: accommodationsAddr1.value,
    endDate: endDate.value,
    endingTime: endingTime.value,
    endingTimeHour: utils.toZero(endingTimeHour.value),
    endingTimeMinute: utils.toZero(endingTimeMinute.value),
    terminalLocation: terminalLocation.value,
  }
  editOrderOperationInfo(orderOperationInfoObject)

  // 画面遷移
  router.push('/delivery/list')

}

/** 登録した案件情報を一次保存して終了 */
const draft = async () => {

  // 案件情報を保存
  let confirmRes = false
  await $swal.fire({
    text: '登録した内容を保存します。よろしいですか？',
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
      state: orderState,
      companyId: keyUserId,
      applicant: utils.toBlank(applicant.value),
      emergencyContact: utils.toBlank(emergencyContact.value),
      tourOrganization: utils.toBlank(tourOrganization.value),
      remarks: utils.toBlank(remarks.value),
      passengers: utils.toZero(passengers.value),
      vehicleTypeLiftAmount: utils.toZero(vehicleTypeLiftAmount.value),
      vehicleTypeMediumAmount: utils.toZero(vehicleTypeMediumAmount.value),
      vehicleTypeSmallAmount: utils.toZero(vehicleTypeSmallAmount.value),
      vehicleTypeMicroAmount: utils.toZero(vehicleTypeMicroAmount.value),
      dispatchDate: utils.toBlank(dispatchDate.value),
      dispatchTime: utils.toBlank(dispatchTime.value),
      dispatchTimeHour: utils.toZero(dispatchTimeHour.value),
      dispatchTimeMinute: utils.toZero(dispatchTimeMinute.value),
      departureTime: utils.toBlank(departureTime.value),
      departureTimeHour: utils.toZero(departureTimeHour.value),
      departureTimeMinute: utils.toZero(departureTimeMinute.value),

      deliveryLocation: utils.toBlank(deliveryLocation.value),
      itinerary1Top: utils.toBlank(itinerary1Top.value),
      itinerary1Bottom: utils.toBlank(itinerary1Bottom.value),
      timeschedule1Top: utils.toBlank(timeschedule1Top.value),
      timeschedule1Bottom: utils.toBlank(timeschedule1Bottom.value),
      accommodations1: utils.toBlank(accommodations1.value),
      accommodationsTel1: utils.toBlank(accommodationsTel1.value),
      accommodationsAddr1: utils.toBlank(accommodationsAddr1.value),
      endDate: utils.toBlank(endDate.value),
      endingTime: utils.toBlank(endingTime.value),
      endingTimeHour: utils.toZero(endingTimeHour.value),
    endingTimeMinute: utils.toZero(endingTimeMinute.value),
      terminalLocation: utils.toBlank(terminalLocation.value),
      customerId: utils.toBlank(applicantCustomerId),
      deliveryCompanyId: utils.toBlank(orderDeliveryUserInfo.value.id),
      updatedAt: new Date(),
    }
    await userData.updateOrder(updateObject)

  } else {
    // 新規登録
    const insertObject = {
      // 案件登録中：1
      state: $Const.STATUS_DRAFT,
      companyId: keyUserId,
      applicant: utils.toBlank(applicant.value),
      emergencyContact: utils.toBlank(emergencyContact.value),
      tourOrganization: utils.toBlank(tourOrganization.value),
      remarks: utils.toBlank(remarks.value),
      passengers: utils.toZero(passengers.value),
      vehicleTypeLiftAmount: utils.toZero(vehicleTypeLiftAmount.value),
      vehicleTypeMediumAmount: utils.toZero(vehicleTypeMediumAmount.value),
      vehicleTypeSmallAmount: utils.toZero(vehicleTypeSmallAmount.value),
      vehicleTypeMicroAmount: utils.toZero(vehicleTypeMicroAmount.value),
      dispatchDate: utils.toBlank(dispatchDate.value),
      dispatchTime: utils.toBlank(dispatchTime.value),
      dispatchTimeHour: utils.toZero(dispatchTimeHour.value),
      dispatchTimeMinute: utils.toZero(dispatchTimeMinute.value),
      departureTime: utils.toBlank(departureTime.value),
      departureTimeHour: utils.toZero(departureTimeHour.value),
      departureTimeMinute: utils.toZero(departureTimeMinute.value),

      deliveryLocation: utils.toBlank(deliveryLocation.value),

      itinerary1Top: utils.toBlank(itinerary1Top.value),
      itinerary1Bottom: utils.toBlank(itinerary1Bottom.value),
      timeschedule1Top: utils.toBlank(timeschedule1Top.value),
      timeschedule1Bottom: utils.toBlank(timeschedule1Bottom.value),
      accommodations1: utils.toBlank(accommodations1.value),
      accommodationsTel1: utils.toBlank(accommodationsTel1.value),
      accommodationsAddr1: utils.toBlank(accommodationsAddr1.value),
      endDate: utils.toBlank(endDate.value),
      endingTime: utils.toBlank(endingTime.value),
      endingTimeHour: utils.toZero(endingTimeHour.value),
    endingTimeMinute: utils.toZero(endingTimeMinute.value),
      terminalLocation: utils.toBlank(terminalLocation.value),
      customerId: utils.toBlank(applicantCustomerId),
      deliveryCompanyId: utils.toBlank(orderDeliveryUserInfo.value.id),
      // 運送引受会社側の入力情報-申込時には未設定の仕様
      dispatchId: utils.toBlank(dispatchInfo.value.id),
      counterPersonMain: utils.toBlank(orderDeliveryUserInfo.value.counterPersonMain),
      counterPersonSub: utils.toBlank(orderDeliveryUserInfo.value.counterPersonSub),

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


  // 画面遷移
  router.push('/user/order/list')

}

/** 運送引受会社への依頼内容の最終確認をする */
const confirm = async () => {

  // 必須入力チェック
  if (utils.toBlank(applicant.value) == '') {
    $swal.fire({
      text: '申込者を入力してください。',
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning'
    })
    return
  }
  if (utils.toBlank(tourOrganization.value) == '') {
    $swal.fire({
      text: '団体名を入力してください。',
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning'
    })
    return
  }
  if (utils.toZero(totalvehicleAmount.value) == 0) {
    $swal.fire({
      text: '申込車両を選択してください。',
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning'
    })
    return
  }
  if (utils.toBlank(dispatchDate.value) == '') {
    $swal.fire({
      text: '配車日を入力してください。',
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning'
    })
    return
  }

  if(dispatchTimeHour.value == null || dispatchTimeMinute.value == null) {
    $swal.fire({
      text: '配車時間を入力してください。',
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning'
    })
    return
  }

  if(departureTimeHour.value == null || departureTimeMinute.value == null) {
    $swal.fire({
      text: '出発時間を入力してください。',
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning'
    })
    return
  }


  if (utils.toBlank(deliveryLocation.value) == '') {
    $swal.fire({
      text: '配車場所を入力してください。',
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning'
    })
    return
  }


  if (utils.toBlank(endDate.value) == '') {
    $swal.fire({
      text: '終着日を入力してください。',
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning'
    })
    return
  }
  if(endingTimeHour.value == null || endingTimeMinute.value == null) {
    $swal.fire({
      text: '終着時間を入力してください。',
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning'
    })
    return
  }






  if (utils.toBlank(terminalLocation.value) == '') {
    $swal.fire({
      text: '終着場所を入力してください。',
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning'
    })
    return
  }



  if (utils.toBlank(orderDeliveryUserInfo.value.companyId) == '') {
    $swal.fire({
      text: '運送引受会社を指定してください。',
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning'
    })
    return
  }

  // stateへ保存
  const orderBaseObject = {
    id: keyOrderId,
    state: orderState,
    companyId: keyUserId,
    applicant: applicant.value,
    applicantCompanyName: orderInfo.value.applicantCompanyName,
    applicantCompanyTel: orderInfo.value.applicantCompanyTel,
    applicantCompanyFax: orderInfo.value.applicantCompanyFax,
    applicantCompanyAddr: orderInfo.value.applicantCompanyAddr,
    applicantCompanyEmail: orderInfo.value.applicantCompanyEmail,

    emergencyContact: utils.toBlank(emergencyContact.value),
    tourOrganization: utils.toBlank(tourOrganization.value),
    remarks: utils.toBlank(remarks.value),
    passengers: utils.toZero(passengers.value),
    vehicleTypeLiftAmount: utils.toZero(vehicleTypeLiftAmount.value),
    vehicleTypeMediumAmount: utils.toZero(vehicleTypeMediumAmount.value),
    vehicleTypeSmallAmount: utils.toZero(vehicleTypeSmallAmount.value),
    vehicleTypeMicroAmount: utils.toZero(vehicleTypeMicroAmount.value),
    dispatchDate: dispatchDate.value,
    dispatchTime: dispatchTime.value,
    dispatchTimeHour: utils.toZero(dispatchTimeHour.value),
    dispatchTimeMinute: utils.toZero(dispatchTimeMinute.value),
    departureTime: utils.toBlank(departureTime.value),
    departureTimeHour: utils.toZero(departureTimeHour.value),
    departureTimeMinute: utils.toZero(departureTimeMinute.value),

    deliveryLocation: deliveryLocation.value,
    customerId: utils.toBlank(applicantCustomerId),
    deliveryCompanyId: utils.toBlank(orderDeliveryUserInfo.value.id),
  }
  editOrderInfo(orderBaseObject)

  // 当該画面操作で設定された運送引受会社情報
  const deliveryUserInfoObject = {
    id: orderDeliveryUserInfo.value.id,
    companyId: orderDeliveryUserInfo.value.companyId,
    companyName: orderDeliveryUserInfo.value.companyName,
    companyAddr: orderDeliveryUserInfo.value.companyAddr,
    companyTel: orderDeliveryUserInfo.value.companyTel,
    companyFax: orderDeliveryUserInfo.value.companyFax,
    companyEmail: orderDeliveryUserInfo.value.companyEmail,

  }
  editOrderDeliveryUserInfo(deliveryUserInfoObject)

  // 当該画面入力で設定された運送情報
  const orderOperationInfoObject = {
    itinerary1Top: itinerary1Top.value,
    itinerary1Bottom: itinerary1Bottom.value,
    timeschedule1Top: timeschedule1Top.value,
    timeschedule1Bottom: timeschedule1Bottom.value,
    accommodations1: accommodations1.value,
    accommodationsTel1: accommodationsTel1.value,
    accommodationsAddr1: accommodationsAddr1.value,
    endDate: endDate.value,
    endingTime: endingTime.value,
    endingTimeHour: utils.toZero(endingTimeHour.value),
    endingTimeMinute: utils.toZero(endingTimeMinute.value),
    terminalLocation: terminalLocation.value,
  }
  editOrderOperationInfo(orderOperationInfoObject)

  router.push('/user/order/entryConfirm')
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
  router.push('/user/order/list')
}

definePageMeta({
  layout: 'user'
})
</script>
<style>
th,
td {
  border: 1px solid #ccc;
}
</style>