<template>
    <v-container max-width="1200">
      <v-row no-gutters>
      <v-col>
        <v-breadcrumbs
:items="[
          { title: 'マイページ', disabled: false, to: '/delivery/mypage' },
          { title: '駐車地管理', disabled: true },
        ]">
          <template #prepend>
            <v-icon icon="mdi-home" size="small" />
          </template>
          <template #divider>
            <v-icon icon="mdi-chevron-right" />
          </template>
        </v-breadcrumbs>
      </v-col>
    </v-row>
      <v-row no-gutters>
        <v-col align="right">
          <v-btn rounded color="primary" @click="entry">
            駐車地登録
          </v-btn>
        </v-col>
     </v-row>

      <v-row>
        <v-col>
          <v-card>
            <v-row justify="center" no-gutters>
              <v-col>
                <v-data-table :headers="parkingListHeaders" :items="parkingList" class="text-pre-wrap bg-background" :items-per-page="5" hide-default-footer>
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
</template>
<script setup>
const router = useRouter()
const { $swal } = useNuxtApp()
const userData = useUserData();
// ログインユーザーのキーID
const { userInfo } = useUserInfo()
const keyUserId = userInfo.value.companyId

// 登録駐車場情報の保持
const {  editParkingInfo } = useParkingInfo()


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
   * 駐車地登録画面へ遷移
   */
const entry = () => {
  // 画面遷移
  router.push('/delivery/parking/entry')
}

/**
 * 駐車地編集画面を表示
 */
const editItemInfo = (item) => {
  const object = {
    id: item.id,
    parking: item.parking,
    parkingAddr: item.parkingAddr,
    remarks: item.remarks,
    parkingId: item.parkingId
  }

  // 画面設定値をStateへ情報保存 
  editParkingInfo(object)

  // 画面遷移
  router.push('/delivery/parking/update')
}


</script>
