<template>
  <div>
    <v-container class="fill-height align-center" fluid>
      <v-row no-gutters>
        <v-col>
          <v-card-text class="font-weight-bold text-h5">
            <v-icon left x-large @click="back">
              mdi-close
            </v-icon>
            バス情報を登録する
          </v-card-text>
        </v-col>
      </v-row>
    </v-container>

    <v-container>
      <v-form ref="entry_form">
        <v-row justify="center" no-gutters>
          <v-col>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field v-model="vehicleNo" label="車両ナンバー" outlined />
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-select
v-model="vehicleType" label="車両タイプ" item-title="disp" item-value="code"
                      :items="$Const.VEHICLE_TYPE" class="ma-2 pa-2" />
                  </v-col>


                  <v-col cols="12" sm="6" md="6">
                    <v-text-field v-model="remarks" label="備考" outlined />
                  </v-col>

                </v-row>
              </v-container>
            </v-card-text>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-card>
              <v-row justify="center" no-gutters>
                <v-col>
                  <v-data-table :headers="parkingListHeaders" :items="parkigList" class="text-pre-wrap">
                    <template #[`item.checkItem`]="{ item }">
                      <v-radio-group v-model="selectPaking" inline class="mt-4 ">
                        <v-radio :value="item.id"  @click="setParking(item)" />
                      </v-radio-group>
                      <!-- {{ item.parking }} -->
                      <!-- <div v-if="act == $Const.USER_ACTION_ORDER"> -->
                      <!-- <a href="" @click.prevent.stop="selectDriver(item)">
                      {{ item.driverName }}</a> -->

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
            <v-btn block rounded dark size="x-large" color="indigo darken-4" class="mb-2 pr-8 pl-8" @click="entry">
              登 録
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </div>
</template>
<script setup>
const { $Const } = useNuxtApp();
const { $swal } = useNuxtApp()
const router = useRouter()
const userData = useUserData();
// 共通関数の呼び出し
const utils = useUtils();
// user情報の状態管理
const { userInfo } = useUserInfo()
const keyUserId = userInfo.value.companyId

//画面入力項目
const vehicleNo = ref('')
const vehicleType = ref('')
const remarks = ref('')
// 選択用の駐車場情報
const parkigList = await userData.getParkingList(keyUserId)
const selectPaking = ref('')
// 駐車地のデータテーブルヘッダ定義
const parkingListHeaders = [
  {
    title: '',
    key: 'checkItem',
    sortable: false
  },
  {
    title: '駐車地',
    key: 'parking',
    sortable: true
  },
  {
    title: '駐車地住所',
    key: 'parkingAddr',
    sortable: true
  },
  {
    title: '備考',
    key: 'remarks',
    sortable: false
  },

]

const setParking = (item) => {
  selectPaking.value = item.id

}
/** 前の画面へ戻る */
const back = () => {

  // 画面遷移
  router.push('/delivery/bus/list')
}
/**
 * バス情報を登録する
 */
const entry = async () => {
  if (vehicleNo.value === '') {
    $swal.fire({
      text: '車両ナンバーを入力してください。',
      confirmButtonColor: "#00BCD4",
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning'
    })
    return
  }
  if (vehicleType.value === '') {
    $swal.fire({
      text: '車両タイプを選択してください。',
      confirmButtonColor: "#00BCD4",
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning'
    })
    return
  }

  if (selectPaking.value === '') {
    $swal.fire({
      html: '駐車場が選択されていません。選択してください。<br>選択肢がない場合はマイページから駐車場を選択して登録してください。',
      confirmButtonColor: "#00BCD4",
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning'
    })
    return
  }




  let confirmRes = false
  await $swal.fire({
    text: '入力した内容でバス情報を登録します。よろしいですか？',
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

  const object = {
    companyId: keyUserId,
    vehicleNo: vehicleNo.value,
    vehicleType: vehicleType.value,
    remarks: remarks.value,
    // バスが配置されている駐車場のdocid
    parkingId: selectPaking.value,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  await userData.addBus(object)

  router.push('/delivery/bus/list')
}

</script>
