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
      <v-container class="align-center modal">
        <v-row>
          <v-col cols="12" sm="10" md="10" />
          <v-col cols="12" sm="1" md="1">
            <v-icon v-if="reservationId != ''" size="large" class="ml-8" @click="cancel">mdi-trash-can-outline</v-icon>
            <v-tooltip v-if="reservationId != ''" activator="parent" location="bottom">予定を削除</v-tooltip>
          </v-col>

          <v-col cols="12" sm="1" md="1">
            <v-icon size="large" class="mr-8"  @click="$emit('close')">mdi-close</v-icon>
            <v-tooltip activator="parent" location="bottom">閉じる</v-tooltip>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12">
            <v-sheet class="py-2 mx-auto text-start" max-width="500" color="transparent">
              <v-row justify="center">
                <v-col v-if="reservationId != ''" cols="12">
                  <v-card-title class="font-weight-bold">{{ props.item.title }}</v-card-title>
                </v-col>
                <v-col v-else class="pa-2" cols="12">
                  <p>
                    <span class="text-body-2">件名</span>
                    <v-chip class="ml-2 mb-1" variant="flat" size="x-small" label color="warning">
                      必須
                    </v-chip>
                  </p>
                  <v-text-field v-model="title" outlined />
                </v-col>
              </v-row>
            </v-sheet>
          </v-col>
        </v-row>
        <div v-if="category === $Const.CATEGORY_BUS">
          <v-row no-gutters>
            <v-col cols="12">
              <div>
                <v-sheet class="py-2 mx-auto text-start" max-width="500" color="transparent">
                  <div class="py-2 d-flex justify-space-between">
                    <span>車種</span>
                    <span>{{ props.item.vehicleNo }} {{ $Const.VEHICLE_TYPE_DISP[props.item.vehicleType].text }}</span>
                  </div>
                  <div class="py-2 d-flex justify-space-between">
                    <span>駐車場</span>
                    <span>[{{ props.item.parking }}]{{ props.item.parkingAddr }}</span>
                  </div>
                </v-sheet>
              </div>
            </v-col>
          </v-row>
        </div>
        <div v-else-if="category === $Const.CATEGORY_DRIVER">
          <v-row no-gutters>
            <v-col cols="12">
              <div>
                <v-sheet class="py-2 mx-auto text-start" max-width="500" color="transparent">
                  <div class="py-2 d-flex justify-space-between">
                    <span>運転手</span>
                    <span> {{ props.item.driverName }} {{ props.item.contact }}</span>
                  </div>
                  <div class="py-2 d-flex justify-space-between">
                    <span>備考</span>
                    <span>{{ props.item.remarks }}</span>
                  </div>
                </v-sheet>
              </div>
            </v-col>
          </v-row>

        </div>
        <div v-else-if="category === $Const.CATEGORY_GUIDE">
          <v-row no-gutters>
            <v-col cols="12">
              <div>
                <v-sheet class="py-2 mx-auto text-start" max-width="500" color="transparent">
                  <div class="py-2 d-flex justify-space-between">
                    <span>バスガイド</span>
                    <span> {{ props.item.guideName }} {{ props.item.contact }}</span>
                  </div>
                  <div class="py-2 d-flex justify-space-between">
                    <span>備考</span>
                    <span>{{ props.item.remarks }}</span>
                  </div>
                </v-sheet>
              </div>
            </v-col>
          </v-row>

        </div>


        <v-row no-gutters>
          <v-col cols="12">
            <v-sheet class="py-1 mx-auto text-start" max-width="500" color="transparent">
              <p>
                <span class="text-body-2">開始日時</span>
                <v-chip class="ml-2 mb-1" variant="flat" size="x-small" label color="warning">
                  必須
                </v-chip>
              </p>
              <v-row no-gutters align="center">
                <!-- 日付選択 -->
                <v-col cols="12" sm="6" md="6" class="pr-2">
                  <datepicker
v-model="dispatchDate" :teleport="true" locale="jp" auto-apply :enable-time-picker="true"
                    format="yyyy/MM/dd" model-type="yyyy/MM/dd" :clearable="false" />
                </v-col>
                <v-col cols="12" sm="3" md="3" class="pr-2">
                  <v-select
v-model="dispatchTimeHour" label="時間" item-title="disp" item-value="code"
                    :items="$Const.TIME_HOUR_LIST" />
                </v-col>
                <v-col cols="12" sm="3" md="3">
                  <v-select
v-model="dispatchTimeMinute" label="分" item-title="disp" item-value="code"
                    :items="$Const.TIME_MINUTE_LIST" />
                </v-col>
              </v-row>
            </v-sheet>
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col cols="12">
            <v-sheet class="py-1 mx-auto text-start" max-width="500" color="transparent">
              <p>
                <span class="text-body-2">終了日時</span>
                <v-chip class="ml-2 mb-1" variant="flat" size="x-small" label color="warning">
                  必須
                </v-chip>
              </p>
              <v-row no-gutters align="center">
                <!-- 日付選択 -->
                <v-col cols="12" sm="6" md="6" class="pr-2">
                  <datepicker
v-model="endDate" :teleport="true" locale="jp" auto-apply :enable-time-picker="true"
                    format="yyyy/MM/dd" model-type="yyyy/MM/dd" :clearable="false" />
                </v-col>
                <v-col cols="12" sm="3" md="3" class="pr-2">
                  <v-select
v-model="endingTimeHour" label="時間" item-title="disp" item-value="code"
                    :items="$Const.TIME_HOUR_LIST" />
                </v-col>
                <v-col cols="12" sm="3" md="3">
                  <v-select
v-model="endingTimeMinute" label="分" item-title="disp" item-value="code"
                    :items="$Const.TIME_MINUTE_LIST" />
                </v-col>
              </v-row>
            </v-sheet>
          </v-col>
        </v-row>




        <v-row no-gutters>
          <v-col align="center">
            <div>
              <v-btn class="mr-4" rounded color="secondary" dark  @click="$emit('close')">閉じる</v-btn>
              <v-btn class="ml-4" rounded color="primary" dark  @click="reservation">保存</v-btn>
              <v-btn
v-if="reservationId != ''"
class="ml-8" rounded color="secondary" dark 
                @click="cancel">削除</v-btn>
            </div>

          </v-col>




        </v-row>

      </v-container>
    </div>
  </Teleport>
</template>

<style scoped>
.modal {
  position: fixed;
  z-index: 999;
  top: 10%;
  left: 20%;
  right: 20%;
  width: 60%;
  height: 70%;
  overflow-y: auto;
  overflow-x: hidden;
  pointer-events: auto;
  background-color: #f8f3ed;
  /* これでモーダル内は操作可能 */
}

/* オーバーレイ */
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
}
</style>
