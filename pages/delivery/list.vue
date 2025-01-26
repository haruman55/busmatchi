<template>
  <div>
    <v-container class="fill-height align-center" fluid>
      <v-row no-gutters>
        <v-col>
          <v-card-text class="font-weight-bold text-h5">
            <v-icon left x-large @click="back">
              mdi-close
            </v-icon>
            運送引受会社
          </v-card-text>
        </v-col>
      </v-row>
    </v-container>
    <v-container class="fill-height align-center" fluid>
      <v-toolbar-title class="font-weight-bold">
        運送引受会社一覧<v-divider />
      </v-toolbar-title>
    </v-container>

    <v-container class="fill-height align-center">
      <v-row>
        <v-col>
          <v-textarea v-model="deliveryLocation" label="配車場所" rows="2" outlined />
          <v-checkbox v-model="deliveryChoice" label="配車場所からの経路で選択" />
        </v-col>
      </v-row>

    </v-container>
    <v-container v-show="deliveryChoice">
      <v-row>
        <v-col>
          <v-card class="mx-auto" max-width="600" height="300" image="/img/dummymap.png" />
        </v-col>
      </v-row>
      <br>
      <v-row>
        <v-col>
          <v-card>
            <v-row justify="center" no-gutters>
              <v-col>
                <v-data-table
:headers="deliveryUserParkinParkinHeaders" :items="deliveryUerBusParkingList"
                  class="text-pre-wrap">
                  <template #[`item.companyName`]="{ item }">
                    <a href="" @click.prevent.stop="selectDeliveryUser(item)">
                      {{ item.companyName }}</a>
                  </template>
                </v-data-table>

              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-container v-show="!deliveryChoice" class="fill-height align-center" fluid>
      <v-row>
        <v-col>
          <v-card>
            <v-row justify="center" no-gutters>
              <v-col>
                <v-data-table :headers="deliveryUserHeaders" :items="deliveryUserList" class="text-pre-wrap">
                  <template #[`item.companyName`]="{ item }">
                    <a href="" @click.prevent.stop="selectDeliveryUser(item)">
                      {{ item.companyName }}</a>
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

// 画面入力(設定)された申込情報を保持
const { orderInfo, editOrderInfo, clearOrderInfo } = useOrderInfo()

/**
   * 運送引受会社情報取得
   */
const deliveryUserList = await userData.getDeliveryUser();

// 画面選択された申込運送引受会社情報を保持
const { orderDeliveryUserInfo, editOrderDeliveryUserInfo, clearOrderDeliveryUserInfo } = useOrderDeliveryUserInfo()

// 画面入力-Map選択可否
const deliveryChoice = ref(false)

// 画面入力-配車場所
const deliveryLocation = ref(orderInfo.value.deliveryLocation)

// 運送引受会社のデータテーブルヘッダ定義
const deliveryUserHeaders = [
  {
    title: '運送引受会社名',
    key: 'companyName',
    sortable: true
  },
  {
    title: '住所',
    key: 'companyAddr',
    sortable: true
  },
  {
    title: 'TEL',
    key: 'companyTel',
    sortable: true
  },
  {
    title: 'Fax',
    key: 'companyFax',
    sortable: true
  },
  {
    title: 'e-mailアドレス',
    key: 'companyEmail',
    sortable: true
  },

]
// 運送引受会社-駐車地のデータテーブルヘッダ定義
const deliveryUserParkinParkinHeaders = [
  {
    title: '運送引受会社名',
    key: 'companyName',
    sortable: true
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

]

/**
 * 運送会社保有の駐車場の一覧取得
 */
const getDeliveryUserParkingInfos = async () => {

  const deliveryUerBusParkingArray = []
  for (let i = 0; i < deliveryUserList.length; i++) {
    const companyId = deliveryUserList[i].companyId
    const parkingList = await userData.getParkingList(companyId)
    // const parkingArray = []
    for (let j = 0; j < parkingList.length; j++) {
      const parkingInfo = {
        companyId: deliveryUserList[i].companyId,
        companyName: deliveryUserList[i].companyName,
        companyAddr: deliveryUserList[i].companyAddr,
        companyEmail: deliveryUserList[i].companyEmail,
        companyFax: deliveryUserList[i].companyFax,
        companyTel: deliveryUserList[i].companyTel,
        parkingId: parkingList[j].id,
        parking: parkingList[j].parking,
        parkingAddr: parkingList[j].parkingAddr,
        remarks: parkingList[j].remarks,
      }
      deliveryUerBusParkingArray.push(parkingInfo)
    }
  }
  return deliveryUerBusParkingArray
}
const deliveryUerBusParkingList = await reactive(getDeliveryUserParkingInfos())



/**
 * 運送引受会社を選択する
 */
const selectDeliveryUser = async (item) => {
  let confirmRes = false
  await $swal.fire({
    text: '運送引受会社を選択します。よろしいですか？',
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
  const selectObject = {
    id: item.id,
    companyId: item.companyId,
    companyName: item.companyName,
    companyAddr: item.companyAddr,
    companyTel: item.companyTel,
    companyFax: item.companyFax,
    companyEmail: item.companyEmail,
    // TODO:保留(stateを分けた方が良い？)
    // parkingId: item.parkingId,
    // parking: item.parking,
    // parkingAddr: item.parkingAddr,
    // remarks: item.remarks,
    deliveryLocation: deliveryLocation.value,
    dispatchDate: orderDeliveryUserInfo.value.dispatchDate,
    dispatchTime: orderDeliveryUserInfo.value.dispatchTime,
    departureTime: orderDeliveryUserInfo.value.departureTime,
    deliveryChoice: deliveryChoice,
  }
  // 画面設定値をStateへ情報保存
  editOrderDeliveryUserInfo(selectObject)

  // 画面遷移
  router.push('/user/order/entry')

}
/** 前の画面へ戻る */
const back = () => {

  // 画面遷移
  router.push('/user/order/entry')

}



</script>
