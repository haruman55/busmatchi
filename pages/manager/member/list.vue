<template>
  <v-container max-width="1200">
    <v-row no-gutters>
      <v-col>
        <v-breadcrumbs
:items="[
          { title: 'マイページ', disabled: false, to: '/user/mypage' },
          { title: '利用者管理', disabled: true },
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

    <v-row align="center">
      <v-col>
        <v-card-text class="text-h5 font-weight-bold">
          利用者管理
        </v-card-text>
      </v-col>
      <v-col class="d-flex justify-end">
        <v-btn rounded color="success" size="x-large" @click="entry">
          利用者登録
        </v-btn>
      </v-col>
    </v-row>
    <v-divider />
    <v-row>
      <v-col>
        <v-card>
          <v-row justify="center" no-gutters>
            <v-col>
              <v-data-table :headers="memberListHeaders" :items="memberList">
                <template #[`item.editItem`]="{ item }">
                    <v-btn color="primary" fab small rounded dark @click="selectMember(item)">
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
const db = useFirestore()


// ユーザ情報を保持
const { userInfo } = useUserInfo()
const keyCompanyId = userInfo.value.companyId

// メンバー情報を保持
const { editMemberInfo } = useMemberInfo()



// 契約データテーブルヘッダ定義
const memberListHeaders = [
  {
    title: '名前',
    key: 'name',
    sortable: true
  },
  {
    title: 'メールアドレス',
    key: 'email',
    sortable: false
  },
  {
    title: '利用権限',
    key: 'auth',
    sortable: false
  },
  {
    title: '',
    key: 'editItem',
    sortable: false
  },

]

const memberList = await db.getQueryDocument({
  path: 'user',
  where: [{ fieldPath: 'companyId', opStr: '==', value: keyCompanyId }]
})


// 利用者登録画面へ遷移
const entry = () => {
  router.push('/manager/member/entry')
}


/**
 * 利用者選択し、編集画面を表示する。
 * @param {Object} item - 利用者情報
 */
const selectMember = (item) => {
  const selectMember = {
    id: item.id,
    category: userInfo.value.category,
    companyId: userInfo.value.companyId,
    companyName: userInfo.value.companyName,
    companyAddr: userInfo.value.companyAddr,
    companyTel: userInfo.value.companyTel,
    companyZip: userInfo.value.companyZip,
    companyFax: userInfo.value.companyFax,
    companyEmail: userInfo.value.companyEmail,
    businessPermitDate: userInfo.value.businessPermitDate,
    businessPermitNo: userInfo.value.businessPermitNo,
    businessLicenseArea: userInfo.value.businessLicenseArea,
    name: item.name,
    email: item.email,
    auth: item.auth,  
    pass: item.pass,
  }
  // 選択された利用者情報をStateへ情報保存
  editMemberInfo(selectMember)

  // 画面遷移
  router.push('/manager/member/update')
}

</script>
<style></style>