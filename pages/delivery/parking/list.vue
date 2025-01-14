<template>
  <div>
    <v-container class="fill-height align-center" fluid>
      <v-row no-gutters>
        <v-col>
          <v-card-text class="font-weight-bold text-h5">
            <v-icon left x-large @click="back">
              mdi-close
            </v-icon>
            駐車地
          </v-card-text>
        </v-col>
      </v-row>
    </v-container>
    <v-container class="fill-height align-center" fluid>
      <v-toolbar-title class="font-weight-bold">
        駐車地一覧<v-divider />
      </v-toolbar-title>
      <v-btn rounded color="success" size="x-large" @click="entry">
        駐車地登録
      </v-btn>
    </v-container>
    <v-container class="fill-height align-center" fluid>
      <v-row>
        <v-col>
          <v-card>
            <v-row justify="center" no-gutters>
              <v-col>
                <v-data-table :headers="parkingListHeaders" :items="parkingList" class="text-pre-wrap">
                  <template #[`item.parking`]="{ item }">
                    <!-- <div v-if="act == $Const.USER_ACTION_ORDER"> -->
                      <a href="" @click.prevent.stop="selectParking(item)">
                        {{ item.parking }}</a>
                    <!-- </div>
                    <div v-else>{{ item.parking }}</div> -->
                  </template>

                  <template #[`item.editItem`]="{ item }">
                    <v-btn color="primary" fab small rounded dark @click="editItemInfo(item)">
                      編 集
                    </v-btn>
                  </template>
                </v-data-table>

              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script setup>
const router = useRouter()
const { $Const } = useNuxtApp()
const { $swal } = useNuxtApp()
const userData = useUserData();
// ログインユーザーのキーID
const { userInfo } = useUserInfo()
const keyUserId = userInfo.value.companyId

// ユーザ操作情報を保持
const { actionInfo } = useAction()
const act = actionInfo.value.act

/**
   * 登録駐車地情報取得
   */
const parkingList = await userData.getParkingList(keyUserId);


// 駐車地のデータテーブルヘッダ定義
const parkingListHeaders = [
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

  {
    title: '',
    key: 'editItem',
    sortable: false
  },
]

/**
 * 駐車地を選択する
 */
const selectParking = async (item) => {
  let confirmRes = false
  await $swal.fire({
    text: '駐車地を選択します。よろしいですか？',
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
  const selectCustomer = {
    id: item.id,
    parking: item.parking,
    parkingAddr: item.parkingAddrAddr,
    remarks: item.remarks,
  }
  // 画面設定値をStateへ情報保存
  editApplicantCustomerInfo(selectCustomer)

  // 画面遷移
  router.push('/user/order/entryCustomerInfo')

}
/** 前の画面へ戻る */
const back = () => {
  // if (act == $Const.USER_ACTION_ORDER) {
    // 画面遷移
    // router.push('/user/order/entryCustomerInfo')
    router.push('/delivery/mypage')

  // } else {
  //   // 画面遷移
  //   router.push('/delivery/mypage')

  // }
}
/**
   * 駐車地登録画面へ遷移
   */
const entry = () => {
  // 画面遷移
  router.push('/delivery/parking/entry')
}

/**
 * 顧客情報編集画面を表示
 */
const editItemInfo = (item) => {
  const object = {
    id: item.id,
    parking: item.parking,
    parkingAddr: item.parkingAddrAddr,
    remarks: item.remarks,
  }
  // 画面遷移
  customerState.editCustomerInfo(object)

  // 画面遷移
  router.push('/user/customer/update')
}


</script>
