<template>
  <v-container max-width="1200">
    <v-row no-gutters>
      <v-col>
        <v-breadcrumbs
          :items="[
            { title: 'マイページ', disabled: false, to: '/delivery/mypage' },
            { title: 'バスガイド管理', disabled: true },
          ]"
        >
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
        <v-btn rounded color="primary" @click="entry"> バスガイド登録 </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-row justify="center" no-gutters>
            <v-col>
              <v-data-table :headers="guideListHeaders" :items="guideList" class="text-pre-wrap bg-background">
                <template #[`item.editItem`]="{ item }">
                  <v-btn color="secondary" fab small rounded dark @click="editItemInfo(item)"> 編 集 </v-btn>
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
const userData = useUserData()
// ログインユーザーのキーID
const { userInfo } = useUserInfo()
const keyUserId = userInfo.value.companyId
// バスガイド情報を保持
const { editGuideInfo } = useGuideInfo()

/**
 * バスガイド情報取得
 */
const guideList = await userData.getGuideList(keyUserId)

// バスガイドのデータテーブルヘッダ定義
const guideListHeaders = [
  {
    title: 'ガイド名',
    key: 'guideName',
    sortable: true,
  },
  {
    title: 'ガイド名（カナ）',
    key: 'guideNameKana',
    sortable: true,
  },
  {
    title: '連絡先',
    key: 'contact',
    sortable: true,
  },
  {
    title: '備考',
    key: 'remarks',
    sortable: false,
  },

  {
    title: '',
    key: 'editItem',
    sortable: false,
  },
]

/**
 * バスガイド登録画面へ遷移
 */
const entry = () => {
  // 画面遷移
  router.push('/delivery/guide/entry')
}

/**
 * バスガイド情報編集画面を表示
 */
const editItemInfo = (item) => {
  const object = {
    id: item.id,
    companyId: item.companyId,
    guideName: item.guideName,
    guideNameKana: item.guideNameKana,
    contact: item.contact,
    remarks: item.remarks,
  }
  // 画面設定値をStateへ情報保存
  editGuideInfo(object)

  // 画面遷移
  router.push('/delivery/guide/update')
}
</script>
