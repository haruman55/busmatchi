<template>
  <v-container max-width="1200">
    <v-row no-gutters>
      <v-col>
        <v-breadcrumbs
:items="[
          { title: 'マイページ', disabled: true },
          { title: '案件管理', disabled: false, click: () => back() },
          { title: '案件登録', disabled: true },]">
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

    <v-row>
      <v-col>
        <v-card variant="outlined" class="color-outline" elevation="3">

          <!-- <v-container fluid> -->
          <v-card-title class="color-title">申込者情報</v-card-title>
          <v-row no-gutters dense>
            <v-col cols="12" sm="4" md="4" class="pa-2">
              <p>
                <span class="text-body-2">申込担当者名</span>
                <v-chip class="ml-2 mb-1" variant="flat" size="x-small" label color="warning">
                  必須
                </v-chip>
              </p>

              <v-combobox
v-model="applicant" :items="applicantUserList" item-title="name" item-value="id" outlined
                clearable @update:model-value="handleApplicantChange" />
            </v-col>
            <v-col cols="12" sm="4" md="4" class="pa-2">
              <p>
                <span class="text-body-2">緊急連絡先</span>
              </p>
              <v-text-field v-model="emergencyContact" outlined />
            </v-col>
          </v-row>
          <!-- </v-container> -->
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card variant="outlined" class="color-outline" elevation="3">
          <v-container fluid>
            <v-row>
              <v-card-title class="color-title">お客様情報</v-card-title>
              <v-btn rounded dark color="yellow" class="mt-2 mb-2 pr-8 pl-8" @click="customerSerch">
                顧客選択
              </v-btn>

            </v-row>
            <v-row no-gutters dense>
              <v-col
v-if="applicantCustomerId != '' && applicantCustomerId != null" cols="12" sm="6" md="6"
                class="pa-2">
                <v-card color="background" elevation="5">
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
              <!-- <v-col cols="12" sm="6" md="6"> -->
              <v-col cols="12" sm="6" md="6" class="pa-2">
                <p>
                  <span class="text-body-2">団体名</span>
                  <v-chip class="ml-2 mb-1" variant="flat" size="x-small" label color="warning">
                    必須
                  </v-chip>
                </p>
                <v-text-field v-model="tourOrganization" outlined />
                <p>
                  <span class="text-body-2">備考</span>
                </p>
                <v-textarea v-model="customerRemarks" rows="2" outlined />
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col>
        <v-card variant="outlined" class="color-outline" elevation="3">
          <v-container fluid>
            <v-card-title class="color-title">申込情報</v-card-title>

            <v-row dense>
              <v-col cols="12" sm="4" md="4" class="pa-2">
                <p>
                  <span class="text-body-2">申込乗車人員</span>
                  <v-chip class="ml-2 mb-1" variant="flat" size="x-small" label color="warning">
                    必須
                  </v-chip>
                </p>
                <v-text-field v-model.number="passengers" label="申込乗車人数" type="number" outlined min="0" step="1" />
              </v-col>
            </v-row>


            <v-row justify="center" dense>
              <v-col cols="3" class="pa-2">
                <p>
                  <span class="text-body-2">乗車定員別又は車種別車両数</span>
                  <v-chip class="ml-2 mb-1" variant="flat" size="x-small" label color="warning">
                    必須
                  </v-chip>
                </p>

                <v-text-field
v-model.number="vehicleTypeLiftAmount" label="リフト-車両数" type="number" outlined min="0"
                  step="1" suffix="両" />
              </v-col>
              <v-col cols="3" class="pa-9">
                <v-text-field
v-model.number="vehicleTypeMediumAmount" label="中型車-車両数" type="number" outlined min="0"
                  step="1" suffix="両" />
              </v-col>
              <v-col cols="3" class="pa-9">
                <v-text-field
v-model.number="vehicleTypeSmallAmount" label="小型車-車両数" type="number" outlined min="0"
                  step="1" suffix="両" />
              </v-col>
              <v-col cols="3" class="pa-9">
                <v-text-field
v-model.number="vehicleTypeMicroAmount" label="マイクロ-車両数" type="number" outlined min="0"
                  step="1" suffix="両" />
              </v-col>
            </v-row>

            <v-row no-gutters dense>
              <v-col cols="12" sm="2" md="2" class="text-body-2">車両合計 </v-col>
              <v-col cols="12" sm="2" md="2">{{ totalvehicleAmount
              }}両</v-col>
            </v-row>
            <v-row no-gutters dense>
              <v-col cols="12" sm="8" md="8">
                <p>
                  <span class="text-body-2">配車場所</span>
                  <v-chip class="ml-2 mb-1" variant="flat" size="x-small" label color="warning">
                    必須
                  </v-chip>
                </p>

                <v-text-field v-model="deliveryLocation" type="text" />
              </v-col>
            </v-row>

            <v-row no-gutters dense>
              <v-col cols="12" sm="3" md="3">
                <p>
                  <span class="text-body-2">配車日時</span>
                  <v-chip class="ml-2 mb-1" variant="flat" size="x-small" label color="warning">
                    必須
                  </v-chip>
                </p>

                <datepicker
v-model="dispatchDate" :teleport="true" locale="jp" auto-apply :enable-time-picker="false"
                  format="yyyy/MM/dd" model-type="yyyy/MM/dd" />
              </v-col>
              <v-col cols="12" sm="2" md="2" class="mt-8">
                <v-select
v-model="dispatchTimeHour" label="時間" item-title="disp" item-value="code"
                  :items="$Const.TIME_HOUR_LIST" />
              </v-col>
              <v-col cols="12" sm="2" md="2" class="mt-8 px-2">

                <v-select
v-model="dispatchTimeMinute" label="分" item-title="disp" item-value="code"
                  :items="$Const.TIME_MINUTE_LIST" />
              </v-col>
            </v-row>

            <v-row dense>
              <v-col cols="12" sm="2" md="2">
                <p>
                  <span class="text-body-2">出発時間</span>
                  <v-chip class="ml-2 mb-1" variant="flat" size="x-small" label color="warning">
                    必須
                  </v-chip>
                </p>

                <v-select
v-model="departureTimeHour" label="時間" item-title="disp" item-value="code"
                  :items="$Const.TIME_HOUR_LIST" />
              </v-col>
              <v-col cols="12" sm="2" md="2" class="mt-6">

                <v-select
v-model="departureTimeMinute" label="分" item-title="disp" item-value="code"
                  :items="$Const.TIME_MINUTE_LIST" />
              </v-col>
            </v-row>

          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card variant="outlined" class="color-outline" elevation="3">
          <v-container fluid>

            <v-row>
              <v-card-title class="color-title">運送引受会社</v-card-title>
              <v-btn
                v-if="orderState == $Const.STATUS_DRAFT || orderState == $Const.STATUS_ORDER_DENY || orderState == ''"
                rounded dark color="yellow" class="mt-2 mb-2 pr-8 pl-8" @click="deliverySerch">
                運送引受会社選択
              </v-btn>

            </v-row>


            <v-row v-if="orderDeliveryUserInfo.companyId != ''">
              <v-col cols="12" sm="6" md="6">
                <v-card color="background" elevation="5">
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
                <div v-if="keydispatchId != null && keydispatchId != ''">
                  <v-row v-if="dispatchInfo.busList.length > 0" class="mb-4">
                    <!-- 配車情報 -->
                    <v-col
v-for="(bus) in dispatchInfo.busList" :key="bus.id" cols="12" sm="6" md="4"
                      class="py-2">
                      <v-card
outlined prepend-icon="mdi-bus" :title="$Const.VEHICLE_TYPE_DISP[bus.vehicleType].text"
                        :subtitle="bus.vehicleNo" color="background" class="text-body-2">
                      </v-card>
                    </v-col>
                  </v-row>

                  <v-row v-if="dispatchInfo.driverList.length > 0" class="mb-4">
                    <!-- 乗務員情報 -->
                    <v-col
v-for="(driver) in dispatchInfo.driverList" :key="driver.id" cols="12" sm="6" md="4"
                      class="py-2">
                      <v-card
outlined prepend-icon="mdi-card-account-details-outline" :title="driver.driverName"
                        :subtitle="driver.contact" color="background" class="text-body-2">
                      </v-card>
                    </v-col>
                  </v-row>

                  <v-row v-if="dispatchInfo.guideList.length > 0" class="mb-4">
                    <!-- ガイド情報 -->
                    <v-col
v-for="(guide) in dispatchInfo.guideList" :key="guide.id" cols="12" sm="6" md="4"
                      class="py-2">
                      <v-card
outlined prepend-icon="mdi-human-female-dance" :title="guide.guideName" color="background"
                        class="text-body-2">

                      </v-card>

                    </v-col>
                  </v-row>
                </div>
              </v-col>

            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>




    <!-- TODO:以下 運行情報 については一旦日帰りで実装。数日の旅程の場合はデータの持ち方や表示を検討必要 -->
    <v-row>
      <v-col>
        <v-card variant="outlined" class="color-outline" elevation="3">
          <v-container fluid>
            <v-card-title class="color-title">旅程</v-card-title>
            <v-row>
              <v-col>

                <v-table class="bg-background">
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
                          rows="3" />
                      </td>
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
            <v-row>
              <!-- <v-col cols="12" sm="2" md="2">終着日時</v-col> -->
              <v-col cols="12" sm="2" md="2" class="ma-2 pa-2">
                <p>
                  <span class="text-body-2">終着日時</span>
                  <v-chip class="ml-2 mb-1" variant="flat" size="x-small" label color="warning">
                    必須
                  </v-chip>
                </p>

                <datepicker
v-model="endDate" :teleport="true" locale="jp" auto-apply :enable-time-picker="false"
                  format="yyyy/MM/dd" model-type="yyyy/MM/dd" />
              </v-col>
              <v-col cols="12" sm="2" md="2" class="mt-8">
                <v-select
v-model="endingTimeHour" label="時間" item-title="disp" item-value="code"
                  :items="$Const.TIME_HOUR_LIST" />
              </v-col>
              <v-col cols="12" sm="2" md="2" class="mt-8">

                <v-select
v-model="endingTimeMinute" label="分" item-title="disp" item-value="code"
                  :items="$Const.TIME_MINUTE_LIST" />
              </v-col>

            </v-row>

            <v-row>
              <v-col cols="12" sm="8" md="8">
                <p>
                  <span class="text-body-2">終着場所</span>
                  <v-chip class="ml-2 mb-1" variant="flat" size="x-small" label color="warning">
                    必須
                  </v-chip>
                </p>

                <v-text-field v-model="terminalLocation" label="終着場所" type="text" />
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>

        <v-card variant="outlined" class="color-outline" elevation="3">
          <!-- <v-container fluid> -->
          <v-card-title class="color-title">支払い</v-card-title>

          <v-row class="pa-2">
            <v-col cols="12" sm="6" md="6">

              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <p>
                    <span class="text-body-2">支払方法</span>
                  </p>


                  <v-radio-group v-model="selectPayment" inline>
                    <v-radio
v-for="(paymentType) in PAYMENT_TYPE" :key="paymentType.id" :value="paymentType.code"
                      :label="paymentType.label" />
                  </v-radio-group>
                  <v-text-field v-if="selectPayment == '9'" v-model="selectPaymentOther" label="その他" type="text" />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <p>
                    <span class="text-body-2">適用予定の割引</span>
                  </p>
                </v-col>

                <v-col v-for="(discount) in discountList" :key="discount.id" cols="12" sm="3" md="3">
                  <v-checkbox v-model="selectDiscount" :value="discount.code" :label="discount.title" />
                </v-col>
                <v-text-field
v-if="selectDiscount.some(value => value == '99')" v-model="selectDiscountOther"
                  label="その他" type="text" />
              </v-row>
              <v-row dense>
                <v-col cols="12" class="pa-2">
                  <p>
                    <span class="text-body-2">特約事項</span>
                  </p>
                  <v-textarea v-model="specialTerms" rows="2" outlined />
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" class="pa-2">
                  <p>
                    <span class="text-body-2">備考</span>
                  </p>

                  <v-textarea v-model="remarks" rows="2" outlined />
                </v-col>
              </v-row>


            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-card color="background" class="mx-auto" elevation="3">
                <v-card-title>運賃・料金</v-card-title>
                <v-row dense>
                  <v-col cols="6" class="pa-2">
                    <p>
                      <span class="text-body-2">発注料金</span>
                    </p>
                    <v-text-field v-model="orderAmount" suffix="円" label="発注料金" @update:model-value="editOrderAmount" />
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
                  <!-- <v-col cols="6" class="pa-2" align="left">
                      <v-checkbox v-model="isTaxIn" label="税込み" @click="formatTax" />
                  </v-col> -->
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
        </v-card>
      </v-col>
    </v-row>


    <v-row>
      <v-col align="center">
        <v-btn rounded dark color="grey" class="mb-2 pr-8 pl-8" @click="back">
          戻 る
        </v-btn>
      </v-col>

      <v-col v-if="orderState == $Const.STATUS_DRAFT || orderState == ''" align="center">
        <v-btn rounded dark  color="secondary" class="mb-2 pr-8 pl-8" @click="draft">
          一次保存
        </v-btn>
      </v-col>
      <v-col
        v-if="orderInfo.state == $Const.STATUS_REQUEST || orderInfo.state == $Const.STATUS_UNDERTAKE || orderInfo.state == $Const.STATUS_PAYMENT_METHOD_CONFIRMED"
        align="center">
        <v-btn rounded dark  color="secondary" class="mb-2 pr-8 pl-8" @click="edit">
          内容を修正する
        </v-btn>
      </v-col>


      <v-spacer />
      <v-col
        v-if="orderInfo.state == $Const.STATUS_DRAFT || orderInfo.state == $Const.STATUS_ORDER_DENY || orderInfo.state == ''"
        align="center">
        <v-btn rounded dark  color="primary" class="mb-2 pr-8 pl-8" @click="entry">
          運送引受会社へ依頼する
        </v-btn>
      </v-col>
      <v-col v-else-if="orderInfo.state == $Const.STATUS_UNDERTAKE" align="center">
        <v-btn rounded dark  color="primary" class="mb-2 pr-8 pl-8" @click="payment">
          金額と支払方法を確定し、手配を完了する
        </v-btn>
      </v-col>

      <v-col v-else-if="orderInfo.state == $Const.STATUS_PAYMENT_COMPLETED" align="center">
        <v-btn rounded dark  color="primary" class="mb-2 pr-8 pl-8" @click="completed">
          案件を完了する
        </v-btn>
      </v-col>


      <!-- <v-col align="center">
        <v-btn rounded dark size="x-large" color="success" class="mb-2 pr-8 pl-8" @click="confirm">
          申込内容確認(帳票形式)
        </v-btn>
      </v-col> -->

    </v-row>
  </v-container>
</template>
<script setup>

const { $Const } = useNuxtApp()
const { $swal } = useNuxtApp()
const router = useRouter()
// DB接続の呼び出し
const userData = useUserData();
const masterData = useMasterData();
const db = useFirestore()


// 共通関数の呼び出し
const utils = useUtils();

// ログインユーザーのキーID
const { userInfo } = useUserInfo()
const keyUserId = userInfo.value.companyId

// 申込者選択用の社員一覧を取得
const applicantUserList = ref(
  (await db.getQueryDocument({
    path: 'user',
    where: [{ fieldPath: 'companyId', opStr: '==', value: keyUserId }],
  })).map(applicantUser => ({
    name: applicantUser.name, // プルダウンに表示するラベル
    id: applicantUser.name,     // TODO:選択された値 文字列で保持したいので名前(name)でそのまま保持
  }))
);

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
// [申込者情報]
const applicant = ref(orderInfo.value.applicant)
const handleApplicantChange = (value) => {
  if (!value) {
    // 値が空の場合はリセット
    applicant.value = '';
    return;
  }

  if (typeof value === 'object' && value.name) {
    // コンボボックスから選択された場合
    applicant.value = value.name;
  } else if (typeof value === 'string') {
    // 手入力された場合
    applicant.value = value;
  }
};
const emergencyContact = ref(orderInfo.value.emergencyContact)
// [お客様情報]
const tourOrganization = ref(orderInfo.value.tourOrganization)
const customerRemarks = ref(orderInfo.value.customerRemarks)
// [申込情報]
const passengers = ref(orderInfo.value.passengers)
const vehicleTypeLiftAmount = ref(orderInfo.value.vehicleTypeLiftAmount)
const vehicleTypeMediumAmount = ref(orderInfo.value.vehicleTypeMediumAmount)
const vehicleTypeSmallAmount = ref(orderInfo.value.vehicleTypeSmallAmount)
const vehicleTypeMicroAmount = ref(orderInfo.value.vehicleTypeMicroAmount)
// 車両数の合計を計算するcomputedプロパティ
const totalvehicleAmount = computed(() => {
  return (vehicleTypeLiftAmount.value || 0) + (vehicleTypeMediumAmount.value || 0) + (vehicleTypeSmallAmount.value || 0) + (vehicleTypeMicroAmount.value || 0);
});

const dispatchDate = ref(orderInfo.value.dispatchDate)
const dispatchTime = ref(orderInfo.value.dispatchTime)
const departureTime = ref(orderInfo.value.departureTime)
const dispatchTimeHour = ref(orderInfo.value.dispatchTimeHour)
const dispatchTimeMinute = ref(orderInfo.value.dispatchTimeMinute)
const departureTimeHour = ref(orderInfo.value.departureTimeHour)
const departureTimeMinute = ref(orderInfo.value.departureTimeMinute)
const deliveryLocation = ref(orderInfo.value.deliveryLocation)
// [旅程]
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

// [運賃・料金]
// 支払方法
const PAYMENT_TYPE = [
  { label: '銀行振込', code: '1' },
  { label: '現金', code: '2' },
  { label: 'その他', code: '9' },
]
const selectPayment = ref(orderInfo.value.selectPayment)
const selectPaymentOther = ref(orderInfo.value.selectPaymentOther)

// 割引情報：DBでマスタ管理
const discountList = ref(await masterData.getDiscountList())
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
  const num = utils.toBlank(value).replace(/[^\d]/g, ""); // 数字以外を削除
  return num ? Number(num).toLocaleString() : "";
};

/**
 *発注金額の金額編集 
 */
const editOrderAmount = (value) => {
  orderAmount.value = formatAmount(value);
};

/**
 *実費の金額編集 
 */
const editActualCost = (value) => {
  actualCost.value = formatAmount(value);
};

// 発注金額＋実費の合計金額を計算するcomputedプロパティ
const totalAmount = computed(() => {
  let totalValue = 0
  let orderAmountValue = utils.toBlank(orderAmount.value).replace(/[^\d]/g, "");
  let actualCostValue = utils.toBlank(actualCost.value).replace(/[^\d]/g, "");
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
    totalValue = totalValue.toLocaleString("ja-JP", { maximumFractionDigits: 0 });
  }
  return totalValue
});

// 支払期日
const paymentDueDate = ref(orderInfo.value.paymentDueDate)

// [その他]
const specialTerms = ref(orderInfo.value.specialTerms)
const remarks = ref(orderInfo.value.remarks)




/**
 * 「税込み」チェック時に実行
 * チェックONの場合、合計金額に消費税を追加
 */
const formatTax = () => {

  let totalAmountValue = totalAmount.value
  if (utils.toNumber(totalAmountValue) > 0) {
    totalAmountValue = totalAmount.value.replace(/[^\d]/g, "");
    if (isTaxIn.value) {
      totalAmountValue = utils.toNumber(totalAmountValue) * 1.1
    } else {
      totalAmountValue = utils.toNumber(totalAmountValue)
    }
  }
  return totalAmountValue ? Number(totalAmountValue).toLocaleString("ja-JP", { maximumFractionDigits: 0 }) : 0;
};


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
    customerRemarks: utils.toBlank(customerRemarks.value),
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
    selectPayment: utils.toBlank(selectPayment.value),
    selectPaymentOther: utils.toBlank(selectPaymentOther.value),
    selectDiscount: selectDiscount.value,
    selectDiscountOther: utils.toBlank(selectDiscountOther.value),
    orderAmount: utils.toBlank(orderAmount.value),
    actualCost: utils.toBlank(actualCost.value),
    paymentDueDate: utils.toBlank(paymentDueDate.value),
    specialTerms: utils.toBlank(specialTerms.value),
    remarks: utils.toBlank(remarks.value),

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
    customerRemarks: utils.toBlank(customerRemarks.value),
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
    selectPayment: utils.toBlank(selectPayment.value),
    selectPaymentOther: utils.toBlank(selectPaymentOther.value),
    selectDiscount: selectDiscount.value,
    selectDiscountOther: utils.toBlank(selectDiscountOther.value),
    orderAmount: utils.toBlank(orderAmount.value),
    actualCost: utils.toBlank(actualCost.value),
    paymentDueDate: utils.toBlank(paymentDueDate.value),
    specialTerms: utils.toBlank(specialTerms.value),
    remarks: utils.toBlank(remarks.value),


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
      customerRemarks: utils.toBlank(customerRemarks.value),
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
      selectPayment: utils.toBlank(selectPayment.value),
      selectPaymentOther: utils.toBlank(selectPaymentOther.value),
      selectDiscount: selectDiscount.value,
      selectDiscountOther: utils.toBlank(selectDiscountOther.value),
      orderAmount: utils.toBlank(orderAmount.value),
      actualCost: utils.toBlank(actualCost.value),
      paymentDueDate: utils.toBlank(paymentDueDate.value),
      specialTerms: utils.toBlank(specialTerms.value),
      remarks: utils.toBlank(remarks.value),

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
      customerRemarks: utils.toBlank(customerRemarks.value),
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
      selectPayment: utils.toBlank(selectPayment.value),
      selectPaymentOther: utils.toBlank(selectPaymentOther.value),
      selectDiscount: selectDiscount.value,
      selectDiscountOther: utils.toBlank(selectDiscountOther.value),
      orderAmount: utils.toBlank(orderAmount.value),
      actualCost: utils.toBlank(actualCost.value),
      paymentDueDate: utils.toBlank(paymentDueDate.value),
      specialTerms: utils.toBlank(specialTerms.value),
      remarks: utils.toBlank(remarks.value),
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

  if (dispatchTimeHour.value == null || dispatchTimeMinute.value == null) {
    $swal.fire({
      text: '配車時間を入力してください。',
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning'
    })
    return
  }

  if (departureTimeHour.value == null || departureTimeMinute.value == null) {
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
  if (endingTimeHour.value == null || endingTimeMinute.value == null) {
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
    customerRemarks: utils.toBlank(customerRemarks.value),
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
    selectPayment: utils.toBlank(selectPayment.value),
    selectPaymentOther: utils.toBlank(selectPaymentOther.value),
    selectDiscount: selectDiscount.value,
    selectDiscountOther: utils.toBlank(selectDiscountOther.value),
    orderAmount: utils.toBlank(orderAmount.value),
    actualCost: utils.toBlank(actualCost.value),
    paymentDueDate: utils.toBlank(paymentDueDate.value),
    specialTerms: utils.toBlank(specialTerms.value),
    remarks: utils.toBlank(remarks.value),

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




/** 運送引受会社へ依頼する */
const entry = async () => {
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

  if (dispatchTimeHour.value == null || dispatchTimeMinute.value == null) {
    $swal.fire({
      text: '配車時間を入力してください。',
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning'
    })
    return
  }

  if (departureTimeHour.value == null || departureTimeMinute.value == null) {
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
  if (endingTimeHour.value == null || endingTimeMinute.value == null) {
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
      applicant: applicant.value,
      emergencyContact: utils.toBlank(emergencyContact.value),
      tourOrganization: utils.toBlank(tourOrganization.value),
      customerRemarks: utils.toBlank(customerRemarks.value),
      passengers: utils.toZero(passengers.value),
      vehicleTypeLiftAmount: utils.toZero(vehicleTypeLiftAmount.value),
      vehicleTypeMediumAmount: utils.toZero(vehicleTypeMediumAmount.value),
      vehicleTypeSmallAmount: utils.toZero(vehicleTypeSmallAmount.value),
      vehicleTypeMicroAmount: utils.toZero(vehicleTypeMicroAmount.value),
      dispatchDate: dispatchDate.value,
      dispatchTimeHour: utils.toZero(dispatchTimeHour.value),
      dispatchTimeMinute: utils.toZero(dispatchTimeMinute.value),
      departureTimeHour: utils.toZero(departureTimeHour.value),
      departureTimeMinute: utils.toZero(departureTimeMinute.value),
      deliveryLocation: deliveryLocation.value,
      itinerary1Top: utils.toBlank(itinerary1Top.value),
      itinerary1Bottom: utils.toBlank(itinerary1Bottom.value),
      timeschedule1Top: utils.toBlank(timeschedule1Top.value),
      timeschedule1Bottom: utils.toBlank(timeschedule1Bottom.value),
      accommodations1: utils.toBlank(accommodations1.value),
      accommodationsTel1: utils.toBlank(accommodationsTel1.value),
      accommodationsAddr1: utils.toBlank(accommodationsAddr1.value),
      endDate: utils.toBlank(endDate.value),
      endingTimeHour: utils.toZero(endingTimeHour.value),
      endingTimeMinute: utils.toZero(endingTimeMinute.value),
      terminalLocation: utils.toBlank(terminalLocation.value),
      deliveryCompanyId: utils.toBlank(orderDeliveryUserInfo.value.id),
      selectPayment: utils.toBlank(selectPayment.value),
      selectPaymentOther: utils.toBlank(selectPaymentOther.value),
      selectDiscount: selectDiscount.value,
      selectDiscountOther: utils.toBlank(selectDiscountOther.value),
      orderAmount: utils.toBlank(orderAmount.value),
      actualCost: utils.toBlank(actualCost.value),
      paymentDueDate: utils.toBlank(paymentDueDate.value),
      specialTerms: utils.toBlank(specialTerms.value),
      remarks: utils.toBlank(remarks.value),
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
      applicant: applicant.value,
      emergencyContact: utils.toBlank(emergencyContact.value),
      tourOrganization: utils.toBlank(tourOrganization.value),
      customerRemarks: utils.toBlank(customerRemarks.value),
      passengers: utils.toZero(passengers.value),
      vehicleTypeLiftAmount: utils.toZero(vehicleTypeLiftAmount.value),
      vehicleTypeMediumAmount: utils.toZero(vehicleTypeMediumAmount.value),
      vehicleTypeSmallAmount: utils.toZero(vehicleTypeSmallAmount.value),
      vehicleTypeMicroAmount: utils.toZero(vehicleTypeMicroAmount.value),
      dispatchDate: dispatchDate.value,
      dispatchTimeHour: utils.toZero(dispatchTimeHour.value),
      dispatchTimeMinute: utils.toZero(dispatchTimeMinute.value),
      departureTimeHour: utils.toZero(departureTimeHour.value),
      departureTimeMinute: utils.toZero(departureTimeMinute.value),
      deliveryLocation: deliveryLocation.value,
      itinerary1Top: utils.toBlank(itinerary1Top.value),
      itinerary1Bottom: utils.toBlank(itinerary1Bottom.value),
      timeschedule1Top: utils.toBlank(timeschedule1Top.value),
      timeschedule1Bottom: utils.toBlank(timeschedule1Bottom.value),
      accommodations1: utils.toBlank(accommodations1.value),
      accommodationsTel1: utils.toBlank(accommodationsTel1.value),
      accommodationsAddr1: utils.toBlank(accommodationsAddr1.value),
      endDate: utils.toBlank(endDate.value),
      endingTimeHour: utils.toZero(endingTimeHour.value),
      endingTimeMinute: utils.toZero(endingTimeMinute.value),
      terminalLocation: utils.toBlank(terminalLocation.value),
      deliveryCompanyId: utils.toBlank(orderDeliveryUserInfo.value.id),
      selectPayment: utils.toBlank(selectPayment.value),
      selectPaymentOther: utils.toBlank(selectPaymentOther.value),
      selectDiscount: selectDiscount.value,
      selectDiscountOther: utils.toBlank(selectDiscountOther.value),
      orderAmount: utils.toBlank(orderAmount.value),
      actualCost: utils.toBlank(actualCost.value),
      paymentDueDate: utils.toBlank(paymentDueDate.value),
      specialTerms: utils.toBlank(specialTerms.value),
      remarks: utils.toBlank(remarks.value),
      customerId: utils.toBlank(applicantCustomerId),

      // 運送引受会社側のみの入力情報-申込時には未設定の仕様
      dispatchId: utils.toBlank(dispatchInfo.value.id),
      counterPersonMain: utils.toBlank(orderDeliveryUserInfo.value.counterPersonMain),
      counterPersonSub: utils.toBlank(orderDeliveryUserInfo.value.counterPersonSub),

      // デフォルト
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
 * 申込内容を変更する
 */
const edit = async () => {


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

  if (dispatchTimeHour.value == null || dispatchTimeMinute.value == null) {
    $swal.fire({
      text: '配車時間を入力してください。',
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning'
    })
    return
  }

  if (departureTimeHour.value == null || departureTimeMinute.value == null) {
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
  if (endingTimeHour.value == null || endingTimeMinute.value == null) {
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

  // 必須選択チェック
  // 案件情報を保存
  let confirmRes = false
  await $swal.fire({
    text: '運送引受会社への依頼内容を修正します。よろしいですか？',
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
    // ステータスの変更はなし
    state: orderInfo.value.state,
    companyId: keyUserId,
    applicant: applicant.value,
    emergencyContact: utils.toBlank(emergencyContact.value),
    tourOrganization: utils.toBlank(tourOrganization.value),
    customerRemarks: utils.toBlank(customerRemarks.value),
    passengers: utils.toZero(passengers.value),
    vehicleTypeLiftAmount: utils.toZero(vehicleTypeLiftAmount.value),
    vehicleTypeMediumAmount: utils.toZero(vehicleTypeMediumAmount.value),
    vehicleTypeSmallAmount: utils.toZero(vehicleTypeSmallAmount.value),
    vehicleTypeMicroAmount: utils.toZero(vehicleTypeMicroAmount.value),
    dispatchDate: dispatchDate.value,
    dispatchTimeHour: utils.toZero(dispatchTimeHour.value),
    dispatchTimeMinute: utils.toZero(dispatchTimeMinute.value),
    departureTimeHour: utils.toZero(departureTimeHour.value),
    departureTimeMinute: utils.toZero(departureTimeMinute.value),
    deliveryLocation: deliveryLocation.value,
    itinerary1Top: utils.toBlank(itinerary1Top.value),
    itinerary1Bottom: utils.toBlank(itinerary1Bottom.value),
    timeschedule1Top: utils.toBlank(timeschedule1Top.value),
    timeschedule1Bottom: utils.toBlank(timeschedule1Bottom.value),
    accommodations1: utils.toBlank(accommodations1.value),
    accommodationsTel1: utils.toBlank(accommodationsTel1.value),
    accommodationsAddr1: utils.toBlank(accommodationsAddr1.value),
    endDate: utils.toBlank(endDate.value),
    endingTimeHour: utils.toZero(endingTimeHour.value),
    endingTimeMinute: utils.toZero(endingTimeMinute.value),
    terminalLocation: utils.toBlank(terminalLocation.value),
    deliveryCompanyId: utils.toBlank(orderDeliveryUserInfo.value.id),
    selectPayment: utils.toBlank(selectPayment.value),
    selectPaymentOther: utils.toBlank(selectPaymentOther.value),
    selectDiscount: selectDiscount.value,
    selectDiscountOther: utils.toBlank(selectDiscountOther.value),
    orderAmount: utils.toBlank(orderAmount.value),
    actualCost: utils.toBlank(actualCost.value),
    paymentDueDate: utils.toBlank(paymentDueDate.value),
    specialTerms: utils.toBlank(specialTerms.value),
    remarks: utils.toBlank(remarks.value),
    customerId: utils.toBlank(applicantCustomerId),
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
 * 支払方法を確定する
 */
const payment = async () => {
  //必須入力チェック
  if (utils.toBlank(selectPayment.value) == '') {
    $swal.fire({
      text: '支払方法を選択してください。',
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning'
    })
    return
  }
  if (utils.toBlank(orderAmount.value) == '') {
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
    selectPayment: utils.toBlank(selectPayment.value),
    selectPaymentOther: utils.toBlank(selectPaymentOther.value),
    selectDiscount: selectDiscount.value,
    selectDiscountOther: utils.toBlank(selectDiscountOther.value),
    orderAmount: utils.toBlank(orderAmount.value),
    actualCost: utils.toBlank(actualCost.value),
    paymentDueDate: utils.toBlank(paymentDueDate.value),
    specialTerms: utils.toBlank(specialTerms.value),
    remarks: utils.toBlank(remarks.value),
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

.color-outline {
  border-color: #448AFF !important;
}

.color-title {
  color: #448AFF !important;

}
</style>