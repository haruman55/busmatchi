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
                          v-model="vehicleType"
                          label="車両タイプ"
                          item-title="disp"
                          item-value="code"
                          :items="$Const.VEHICLE_TYPE"
                          class="ma-2 pa-2"
                        />
                      </v-col>


                  <v-col cols="12" sm="6" md="6">
                    <v-text-field v-model="remarks" label="備考" outlined />
                  </v-col>

                </v-row>
              </v-container>
            </v-card-text>
          </v-col>
        </v-row>

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
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  await userData.addBus(object)

  router.push('/delivery/bus/list')
}

</script>
