<template>
  <div>
    <v-container class="fill-height align-center" fluid>
      <v-row no-gutters>
        <v-col>
          <v-card-text class="font-weight-bold text-h5">
            <v-icon left x-large @click="back">
              mdi-close
            </v-icon>
            バス運転手情報を更新する
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
                    <v-text-field v-model="driverName" label="氏名" outlined />
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field v-model="driverNameKana" label="氏名(カナ)" outlined />
                  </v-col>

                  <v-col cols="12" sm="12" md="12">
                    <v-text-field v-model="contact" label="連絡先" outlined />
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
            <v-btn block rounded dark size="x-large" color="indigo darken-4" class="mb-2 pr-8 pl-8" @click="update">
              更 新
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </div>
</template>
<script setup>
const { $swal } = useNuxtApp()
const router = useRouter()
const userData = useUserData();
// 共通関数の呼び出し
const utils = useUtils();
// user情報の状態管理
const { userInfo } = useUserInfo()
const keyUserId = userInfo.value.companyId
// 運転手情報オブジェクトを保持
const { driverInfo } = useDriverInfo()


//画面入力項目
const driverName = ref(driverInfo.value.driverName)
const driverNameKana = ref(driverInfo.value.driverNameKana)
const contact = ref(driverInfo.value.contact)
const remarks = ref(driverInfo.value.remarks)

/** 前の画面へ戻る */
const back = () => {

  // 画面遷移
  router.push('/delivery/driver/list')
}
/**
 * 
 */
const update = async () => {
  if (driverName.value === '') {
    $swal.fire({
      text: 'バス運転手名を入力してください。',
      confirmButtonColor: "#00BCD4",
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning'
    })
    return
  }
  if (contact.value === '') {
    $swal.fire({
      text: '連絡先を入力してください。',
      confirmButtonColor: "#00BCD4",
      showCancelButton: false,
      confirmButtonText: 'OK',
      icon: 'warning'
    })
    return
  }

  let confirmRes = false
  await $swal.fire({
    text: '入力した内容でバス運転手情報を更新します。よろしいですか？',
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
    id:driverInfo.value.id,
    companyId: keyUserId,
    driverName: driverName.value,
    driverNameKana: driverNameKana.value,
    contact: contact.value,
    remarks: remarks.value,
    updatedAt: new Date(),
  }
  // console.log(object)
  await userData.updateDriver(object)

  router.push('/delivery/driver/list')
}

</script>
