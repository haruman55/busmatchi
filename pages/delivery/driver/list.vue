<template>
  <v-container max-width="1200">
    <v-row no-gutters>
      <v-col>
        <v-breadcrumbs
:items="[
          { title: 'マイページ', disabled: false, to: '/delivery/mypage' },
          { title: '運転手管理', disabled: true },
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
          運転手登録
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-row justify="center" no-gutters>
            <v-col>
              <v-data-table :headers="driverListHeaders" :items="driverList" class="text-pre-wrap bg-background">
                <template #[`item.driverName`]="{ item }">
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
  <!-- </div> -->
</template>
<script setup>
const router = useRouter()
const userData = useUserData();
// ログインユーザーのキーID
const { userInfo } = useUserInfo()
const keyUserId = userInfo.value.companyId


// 運転手情報オブジェクトを保持
const { editDriverInfo } = useDriverInfo()


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
  const selectDriver = {
    id: item.id,
    companyId: item.companyId,
    driverName: item.driverName,
    driverNameKana: item.driverNameKana,
    contact: item.contact,
    remarks: item.remarks
  }
  // 画面設定値をStateへ情報保存
  editDriverInfo(selectDriver)


  // 画面遷移
  router.push('/delivery/driver/update')
}


</script>
