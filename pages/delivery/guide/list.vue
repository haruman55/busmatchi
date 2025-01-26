<template>
  <div>
    <v-container class="fill-height align-center" fluid>
      <v-row no-gutters>
        <v-col>
          <v-card-text class="font-weight-bold text-h5">
            <v-icon left x-large @click="back">
              mdi-close
            </v-icon>
            バスガイド
          </v-card-text>
        </v-col>
      </v-row>
    </v-container>
    <v-container class="fill-height align-center" fluid>
      <v-toolbar-title class="font-weight-bold">
        バスガイド一覧<v-divider />
      </v-toolbar-title>
      <v-btn rounded color="success" size="x-large" @click="entry">
        バスガイド登録
      </v-btn>
    </v-container>
    <v-container class="fill-height align-center" fluid>
      <v-row>
        <v-col>
          <v-card>
            <v-row justify="center" no-gutters>
              <v-col>
                <v-data-table :headers="guideListHeaders" :items="guideList" class="text-pre-wrap">
                  <template #[`item.guideName`]="{ item }">
                    <!-- <div v-if="act == $Const.USER_ACTION_ORDER"> -->
                    <a href="" @click.prevent.stop="selectguide(item)">
                      {{ item.guideName }}</a>
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
// バスガイド情報を保持
const { editGuideInfo } = useGuideInfo()

// ユーザ操作情報を保持
const { actionInfo } = useAction()
const act = actionInfo.value.act

/**
   * バスガイド情報取得
   */
const guideList = await userData.getGuideList(keyUserId);


// バスガイドのデータテーブルヘッダ定義
const guideListHeaders = [
  {
    title: 'ガイド名',
    key: 'guideName',
    sortable: true
  },
  {
    title: 'ガイド名（カナ）',
    key: 'guideNameKana',
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
 * ガイドを選択する
 */
const selectguide = async (item) => {
  let confirmRes = false
  await $swal.fire({
    text: 'バスガイドを選択します。よろしいですか？',
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
  const selectGuide = {
    id: item.id,
    companyId: item.companyId,
    guideName: item.guideName,
    guideNameKana: item.guideNameKana,
    contact: item.contact,
    remarks: item.remarks
  }
  // 画面設定値をStateへ情報保存
  editGuideInfo(selectGuide)


  // 画面遷移
  router.push('/delivery/order/entry')

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
    remarks: item.remarks
  }
  // 画面設定値をStateへ情報保存
  editGuideInfo(object)

  // 画面遷移
  router.push('/delivery/guide/update')
}


</script>
