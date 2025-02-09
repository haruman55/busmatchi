<script setup>
const { $Const } = useNuxtApp()
const { $swal } = useNuxtApp()
const { $dayjs } = useNuxtApp();
const userData = useUserData();
// 共通関数の呼び出し
const utils = useUtils();

const props = defineProps({
  dispatchDate: String,
  index: Number,
  // TODO:仕様で固定:0:バス 1:運転手 2:バスガイド
  category: String,
  item: Object,
  isReservation: Boolean,
})

const emit = defineEmits(['close', 'reload'])

const dispatchDate = ref(props.dispatchDate)
// TODO(仕様):dispatchDateと同値を初期値とする
const endDate = ref(props.dispatchDate)
const dispatchTime = ref(props.index)
// TODO(仕様):dispatchTimeに1時間足した時間(これだと24(0)時が対応できないのでバグ有)
const endingTime = ref(props.index + 1)
const category = ref(props.category)
const isReservation = ref(props.isReservation)
const reservationId = ref(props.item.reservationId)
const title = ref("")

/**
 * 日付文字列(YYYY/MM/DD)と時間のコード値をTimeStamp型に変換する
 */
const formatTimeStampData = (dateStr, timeStr) => {
  // 日付
  const date = dateStr.replace(/\//g, "");
  // 配車時間
  const time = $Const.TIME_LIST.find(item => item.code === timeStr);
  // 文字列を結合して YYYY-MM-DD HH:mm 形式に変換
  const formattedDateTime = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)} ${time.disp}`;

  // dayjsでパースしてタイムスタンプに変換（ミリ秒単位）
  const formattedTimeStamp = $dayjs(formattedDateTime, 'YYYY-MM-DD HH:mm').valueOf();
  return formattedTimeStamp

}


/**
 * 保有物(バス、運転手、バスガイド)を予約登録する
 */
const reservation = async () => {

  if (dispatchTime.value === null || dispatchTime.value === undefined) {
    $swal.fire({
      text: '開始時間を入力してください。',
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning'
    })
    return
  }

  if (endingTime.value === null || endingTime.value === undefined) {
    $swal.fire({
      text: '終着時間を入力してください。',
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning'
    })
    return
  }

  // 予約設定-開始時間
  const formattedReservationFromTS = formatTimeStampData(dispatchDate.value, dispatchTime.value)

  // 予約設定-終了時間
  const formattedReservationToTS = formatTimeStampData(endDate.value, endingTime.value)


  let confirmRes = false
  await $swal.fire({
    text: '指定した日時で予約登録をします。よろしいですか？',
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

  // 指定予約の更新の場合(delete/insert)
  if (utils.toBlank(reservationId.value) != '') {
    // 既存の登録内容がある際は削除(Delete)
    await userData.deleteReservation(reservationId.value)
  }

  // 指定日付での予約情報を登録(Add)
  const itemId = props.item.id
  // 新規登録
  const reservationInfoObj = {
    category: category.value,
    itemId: itemId,
    reservationFrom: new Date(formattedReservationFromTS),
    reservationTo: new Date(formattedReservationToTS),
    orderId: '',
    title: title.value,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  await userData.addReservation(reservationInfoObj)

  // 呼び出し元への処理委譲
  emit('reload')
  emit('close')
}

/**
 * 配車予約キャンセルする
 */
const cancel = async () => {

  let confirmRes = false
  await $swal.fire({
    text: '選択した予約を削除します。よろしいですか？',
    showCancelButton: true,
    confirmButtonColor: "#00BCD4",
    cancelButtonColor: "#CFD8DC",
    confirmButtonText: 'はい。',
    cancelButtonText: 'ャンセル',
    icon: 'info'
  }).then((res) => {
    confirmRes = res.isConfirmed
  })
  if (!confirmRes) {
    return
  }

  // 既存の登録内容がある際は削除(Delete)
  await userData.deleteReservation(reservationId.value)

  emit('reload')
  emit('close')
}






</script>

<template>
  <Teleport to="body">
    <div class="modal-overlay">
      <div class="modal">
        <v-container class="align-center">
          <v-row>
            <v-col>
              <v-card>
                <v-row justify="center">
                  <v-col v-if="isReservation" cols="12" sm="12" md="12">
                    <v-card-title class="font-weight-bold">{{ props.item.title }}</v-card-title>
                  </v-col>
                  <v-col v-else align="center" cols="12" sm="10" md="10">
                    <v-text-field v-model="title" label="タイトルを入力してください。" outlined />
                  </v-col>
                </v-row>
                <div v-if="category === $Const.CATEGORY_BUS">
                  <v-row>
                    <v-col cols="12" sm="2" md="2">
                      <v-card-text>車種</v-card-text>
                    </v-col>
                    <v-col>
                      <v-card-text>
                        {{ props.item.vehicleNo }} {{ $Const.VEHICLE_TYPE_DISP[props.item.vehicleType].text }}
                      </v-card-text>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="2" md="2">
                      <v-card-text>駐車場</v-card-text>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-card-text>
                        [{{ props.item.parking }}]{{ props.item.parkingAddr }}
                      </v-card-text>
                    </v-col>
                  </v-row>
                </div>
                <div v-else-if="category === $Const.CATEGORY_DRIVER">
                  <v-row>
                    <v-col cols="12" sm="2" md="2">
                      <v-card-text>運転手</v-card-text>
                    </v-col>
                    <v-col>
                      <v-card-text>
                        {{ props.item.driverName }} {{ props.item.contact }}
                      </v-card-text>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="2" md="2">
                      <v-card-text>備考</v-card-text>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-card-text>
                        {{ props.item.remarks }}
                      </v-card-text>
                    </v-col>
                  </v-row>
                </div>
                <div v-else-if="category === $Const.CATEGORY_GUIDE">
                  <v-row>
                    <v-col cols="12" sm="2" md="2">
                      <v-card-text>バスガイド</v-card-text>
                    </v-col>
                    <v-col>
                      <v-card-text>
                        {{ props.item.guideName }} {{ props.item.contact }}
                      </v-card-text>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="2" md="2">
                      <v-card-text>備考</v-card-text>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-card-text>
                        {{ props.item.remarks }}
                      </v-card-text>
                    </v-col>
                  </v-row>
                </div>

                <v-row>
                  <v-col cols="12" sm="2" md="2"><v-card-text>開始日時</v-card-text>
                  </v-col>
                  <v-col cols="12" sm="4" md="4">
                    <datepicker
v-model="dispatchDate" :teleport="true" locale="jp" auto-apply
                      :enable-time-picker="true" format="yyyy/MM/dd" model-type="yyyy/MM/dd" />
                  </v-col>

                  <v-col cols="12" sm="4" md="4">
                    <v-select
v-model="dispatchTime" label="開始時間" item-title="disp" item-value="code"
                      :items="$Const.TIME_LIST" />
                  </v-col>

                </v-row>



                <v-row>
                  <v-col cols="12" sm="2" md="2"><v-card-text>終了日時</v-card-text>
                  </v-col>
                  <v-col cols="12" sm="4" md="4">
                    <datepicker
v-model="endDate" :teleport="true" locale="jp" auto-apply :enable-time-picker="true"
                      format="yyyy/MM/dd" model-type="yyyy/MM/dd" />
                  </v-col>


                  <v-col cols="12" sm="4" md="4">
                    <v-select
v-model="endingTime" label="終了時間" item-title="disp" item-value="code"
                      :items="$Const.TIME_LIST" />

                  </v-col>
                </v-row>

                <v-row justify="center" no-gutters>
                  <v-col align="center">
                    <v-btn rounded color="grey" dark class="mb-2 pr-8 pl-8" @click="$emit('close')">キャンセル</v-btn>
                  </v-col>
                  <v-spacer />

                  <v-col align="center">
                    <v-btn
rounded size="x-large" color="indigo darken-4" dark class="mb-2 pr-8 pl-8"
                      @click="reservation">保存</v-btn>
                  </v-col>

                  <v-col v-if="isReservation" align="center">
                    <v-btn
rounded size="x-large" color="grey darken-4" dark class="mb-2 pr-8 pl-8"
                      @click="cancel">削除</v-btn>
                  </v-col>

                </v-row>

              </v-card>
            </v-col>
          </v-row>

        </v-container>

      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 20%;
  right: 20%;
  width: 60%;
  height: 90%;
  overflow-y: scroll;
  overflow-x: hidden;
  pointer-events: auto;
  /* これでモーダル内は操作可能 */
}

/* オーバーレイ（背景をクリックで閉じる） */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  pointer-events: auto;
  /* これでクリックを受け付ける */
}
</style>
