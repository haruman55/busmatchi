<template>
  <div>
    <v-container class="fill-height align-center" fluid>
      <v-row no-gutters>
        <v-col>
          <v-card-text class="font-weight-bold text-h5">
            <v-icon left x-large @click="back">
              mdi-close
            </v-icon>
            バス運転手
          </v-card-text>
        </v-col>
      </v-row>
    </v-container>
    <v-container class="fill-height align-center" fluid>
      <v-toolbar-title class="font-weight-bold">
        運転手一覧<v-divider />
      </v-toolbar-title>
      <v-btn rounded color="success" size="x-large" @click="entry">
        運転手登録
      </v-btn>
    </v-container>
    <v-container class="fill-height align-center" fluid>
      <v-row>
        <v-col>
          <v-card>
            <v-row justify="center" no-gutters>
              <v-col>
                <v-data-table :headers="driverListHeaders" :items="driverList" class="text-pre-wrap">
                  <template #[`item.driverName`]="{ item }">
                    <!-- <div v-if="act == $Const.USER_ACTION_ORDER"> -->
                    <!-- <a href="" @click.prevent.stop="selectDriver(item)">
                      {{ item.driverName }}</a> -->
                    {{ item.driverName }}
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
   * バス運転手情報取得
   */
const driverList = await userData.getDriverList(keyUserId);


// バス運転手のデータテーブルヘッダ定義
const driverListHeaders = [
  {
    title: '運転手名',
    key: 'driverName',
    sortable: true
  },
  {
    title: '運転手名（カナ）',
    key: 'driverNameKana',
    sortable: true
  },
  {
    title: '連絡先',
    key: 'contact',
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
 * バス運転手を選択する
 */
const selectDriver = async (item) => {
  let confirmRes = false
  await $swal.fire({
    text: 'バス運転手を選択します。よろしいですか？',
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
    companyId: item.companyId,
    driverName: item.guideName,
    driverNameKana: item.guideNameKana,
    contact: item.contact,
    remarks: item.remarks
  }
  // 画面設定値をStateへ情報保存
  editApplicantCustomerInfo(selectCustomer)

  // 画面遷移
  router.push('/user/order/entryBaseInfo')

}
/** 前の画面へ戻る */
const back = () => {
  // if (act == $Const.USER_ACTION_ORDER) {
  // 画面遷移
  // router.push('/user/order/entryBaseInfo')
  router.push('/delivery/mypage')

  // } else {
  //   // 画面遷移
  //   router.push('/delivery/mypage')

  // }
}
/**
   * バス運転手登録画面へ遷移
   */
const entry = () => {
  // 画面遷移
  router.push('/delivery/driver/entry')
}

/**
 * バス運転手情報編集画面を表示
 */
const editItemInfo = (item) => {
  const object = {
    id: item.id,
    companyId: item.companyId,
    driverName: item.guideName,
    driverNameKana: item.guideNameKana,
    contact: item.contact,
    remarks: item.remarks
  }
  // 画面遷移
  customerState.editCustomerInfo(object)

  // 画面遷移
  router.push('/user/customer/update')
}


</script>
