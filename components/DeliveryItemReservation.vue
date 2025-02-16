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
  // 既に登録済みの場合は値保有
  reservationId: String,
  // TODO:仕様で固定:0:バス 1:運転手 2:バスガイド
  category: String,
  item: Object,
})

const emit = defineEmits(['close', 'reload'])

const dispatchDate = ref(props.dispatchDate)
const endDate = ref(props.dispatchDate)
const dispatchTimeHour = ref(props.index)
const dispatchTimeMinute = ref(0)

// TODO(仕様):dispatchTimeに1時間足した時間(これだと24(0)時が対応できないのでバグ有)
const endingTimeHour = ref(props.index + 1)
const endingTimeMinute = ref(0)

const category = ref(props.category)
const reservationId = ref(props.reservationId)
const title = ref("")


/**
 * 保有物(バス、運転手、バスガイド)を予約登録する
 */
const reservation = async () => {

  if (reservationId.value == '') {
    if (title.value == null || title.value == '') {
      $swal.fire({
        text: 'タイトルを入力してください。',
        showCancelButton: false,
        confirmButtonText: 'OK',
        icon: 'warning'
      })
      return
    }

  }
  if (dispatchTimeHour.value == null || dispatchTimeMinute.value == null) {
    $swal.fire({
      text: '開始時間を入力してください。',
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

  // 画面入力された日、時、分を結合してDB登録用のTSへ変換
  // 予約設定-開始時間
  const timeFrom = $Const.TIME_HOUR_LIST.find(item => item.code === dispatchTimeHour.value);
  const minFrom = $Const.TIME_MINUTE_LIST.find(item => item.code === dispatchTimeMinute.value);
  const formattedReservationFromTS = new Date(`${dispatchDate.value} ${timeFrom.disp + ':' + minFrom.disp}`)
  // 予約設定-終了時間
  const timeTo = $Const.TIME_HOUR_LIST.find(item => item.code === endingTimeHour.value);
  const minTo = $Const.TIME_MINUTE_LIST.find(item => item.code === endingTimeMinute.value);
  const formattedReservationToTS = new Date(`${endDate.value} ${timeTo.disp + ':' + minTo.disp}`)


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
  if (reservationId.value != '') {
    // 既存の登録内容がある際は削除(Delete)
    await userData.deleteReservation(reservationId.value)
  }

  // 指定日付での予約情報を登録(Add)
  const itemId = props.item.id
  // 新規登録
  const reservationInfoObj = {
    category: category.value,
    itemId: itemId,
    reservationFrom: formattedReservationFromTS,
    reservationTo: formattedReservationToTS,
    // 本画面からの登録は案件と紐付いていないので'空白'
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

/**
 * 初期処理
 * 既に予約登録されている場合の、登録時間開始日時、終了日時を復元する
 */
onMounted(async () => {
  if (reservationId.value != '') {
    const reservationData = await userData.getReservationData(reservationId.value)
    dispatchDate.value = $dayjs(reservationData.reservationFrom.toDate()).format('YYYY/MM/DD')
    dispatchTimeHour.value = utils.toNumber($dayjs(reservationData.reservationFrom.toDate()).format('HH'))
    dispatchTimeMinute.value = utils.toNumber($dayjs(reservationData.reservationFrom.toDate()).format('mm'))

    endDate.value = $dayjs(reservationData.reservationTo.toDate()).format('YYYY/MM/DD')
    endingTimeHour.value = utils.toNumber($dayjs(reservationData.reservationTo.toDate()).format('HH'))
    endingTimeMinute.value = utils.toNumber($dayjs(reservationData.reservationTo.toDate()).format('mm'))

  }

})



</script>

<template>
  <Teleport to="body">
    <div class="modal-overlay">
      <div class="modal">
        <v-container class="align-center">
          <v-row>
            <v-col>
              <v-card>
                <v-row>
                  <v-col cols="12" sm="10" md="10" />


                  <v-col  cols="12" sm="1" md="1">
                    <v-icon v-if="reservationId != ''" size="large" @click="cancel">mdi-trash-can-outline</v-icon>
                    <v-tooltip v-if="reservationId != ''" activator="parent" location="bottom">予定を削除</v-tooltip>
                  </v-col>

                  <v-col cols="12" sm="1" md="1">
                    <v-icon  size="large" @click="$emit('close')">mdi-close</v-icon>
                    <v-tooltip activator="parent" location="bottom">閉じる</v-tooltip>
                  </v-col>
                </v-row>

                <v-row justify="center">
                  <v-col v-if="reservationId != ''" cols="12" sm="12" md="12">
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
                  <v-col cols="12" sm="2" md="2"><v-card-text>終了日時</v-card-text>
                  </v-col>
                  <v-col cols="12" sm="4" md="4">
                    <datepicker
v-model="endDate" :teleport="true" locale="jp" auto-apply :enable-time-picker="true"
                      format="yyyy/MM/dd" model-type="yyyy/MM/dd" />
                  </v-col>

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

                <v-row justify="center" no-gutters>
                  <v-col align="center">
                    <v-btn rounded color="grey" dark class="mb-2 pr-8 pl-8" @click="$emit('close')">閉じる</v-btn>
                  </v-col>
                  <v-spacer />

                  <v-col align="center">
                    <v-btn
rounded size="x-large" color="indigo darken-4" dark class="mb-2 pr-8 pl-8"
                      @click="reservation">保存</v-btn>
                  </v-col>

                  <v-col v-if="reservationId != ''" align="center">
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
