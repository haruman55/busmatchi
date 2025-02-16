<template>
  <div>
    <v-container class="fill-height align-center" fluid>
      <v-row no-gutters>
        <v-col>
          <v-card-text class="font-weight-bold text-h5">
            <v-icon left x-large @click="back">
              mdi-close
            </v-icon>
            顧客情報
          </v-card-text>
        </v-col>
      </v-row>
    </v-container>
    <v-container class="fill-height align-center" fluid>
      <v-toolbar-title class="font-weight-bold">
        登録顧客一覧<v-divider />
      </v-toolbar-title>
      <v-btn rounded color="success" size="x-large" @click="entry">
        新規顧客登録
      </v-btn>
    </v-container>
    <v-container class="fill-height align-center" fluid>
      <v-row>
        <v-col>
          <v-card>
            <v-row justify="center" no-gutters>
              <v-col>
                <v-data-table :headers="customerHeaders" :items="customerList" class="text-pre-wrap">
                  <template #[`item.customerName`]="{ item }">
                    <div v-if="act == $Const.USER_ACTION_ORDER">
                      <a href="" @click.prevent.stop="selectCustomer(item)">
                        {{ item.customerName }}</a>
                    </div>
                    <div v-else>{{ item.customerName }}</div>
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

// ユーザ情報を保持
const { userInfo } = useUserInfo()

// ユーザ操作情報を保持
const { actionInfo } = useAction()
const act = actionInfo.value.act
// 顧客情報(マスタ)の状態管理
const { editCustomerInfo } = useCustomerInfo()

// 案件申込顧客情報
const { editApplicantCustomerInfo } = useApplicantCustomerInfo()


/**
   * 登録顧客情報取得
   */
const customerList = await userData.getUserCustomerList(userInfo.value.companyId);


// 目標設定したイベントのデータテーブルヘッダ定義
const customerHeaders = [
  {
    title: '顧客名',
    key: 'customerName',
    sortable: true
  },
  {
    title: '住所',
    key: 'customerAddr',
    sortable: true
  },
  {
    title: 'Tel',
    key: 'customerTel',
    sortable: false
  },
  {
    title: 'e-mail',
    key: 'customerMail',
    sortable: false
  },
  {
    title: 'Fax',
    key: 'customerFax',
    sortable: false
  },

  {
    title: '',
    key: 'editItem',
    sortable: false
  },
]

/**
 * 顧客を選択する
 */
const selectCustomer = async (item) => {
  let confirmRes = false
  await $swal.fire({
    text: '申込顧客を選択します。よろしいですか？',
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
    // id: item.raw.id,
    id: item.id,
    customerId: item.customerId,
    customerName: item.customerName,
    customerAddr: item.customerAddr,
    customerTel: item.customerTel,
    customerFax: item.customerFax,
    customerMail: item.customerMail,
    // TODO:顧客：ユーザ(申込会社)= 1:N もあり得る 
    companyId: item.companyId,
  }
  // 画面設定値をStateへ情報保存
  editApplicantCustomerInfo(selectCustomer)

  // 画面遷移
  router.push('/user/order/entry')

}
/** 前の画面へ戻る */
const back = () => {
  if (act == $Const.USER_ACTION_ORDER) {
    // 画面遷移
    router.push('/user/order/entry')

  } else {
    // 画面遷移
    router.push('/user/mypage')

  }
}
/**
   * 顧客登録画面へ遷移
   */
const entry = () => {
  // 画面遷移
  router.push('/user/customer/entry')
}

/**
 * 顧客情報編集画面を表示
 */
const editItemInfo = (item) => {
  const object = {
    id: item.id,
    customerId: item.customerId,
    customerName: item.customerName,
    customerAddr: item.customerAddr,
    customerTel: item.customerTel,
    customerFax: item.customerFax,
    customerMail: item.customerMail,
    customerXXX: item.customerXXX,
    companyId: item.companyId,

  }
  // 画面遷移
  editCustomerInfo(object)

  // 画面遷移
  router.push('/user/customer/update')
}


</script>
