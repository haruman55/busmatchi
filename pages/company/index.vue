<template>
  <v-container max-width="1200">
    <v-row no-gutters>
      <v-col>
        <v-breadcrumbs
:items="[
          { title: 'マイページ', disabled: false, click: () => back() },
          { title: '会社情報', disabled: true },
        ]" >
          <template #prepend>
            <v-icon icon="mdi-home" size="small" />
          </template>
          <template #divider>
            <v-icon icon="mdi-chevron-right" />
          </template>
          <template #item="{ item }">
            <v-breadcrumbs-item
:disabled="item.disabled" :class="{
              'breadcrumb-link': !item.disabled,
            }" @click="item.click && item.click()">
              {{ item.title }}
            </v-breadcrumbs-item>
          </template>

        </v-breadcrumbs>
      </v-col>
    </v-row>

    <v-row>
      <v-col>

        <v-sheet class="py-10 mx-auto text-start"  color="transparent">
          <p class="mb-2 font-weight-bold">会社情報<v-btn color="background" icon class="ml-2" @click="editCompanyInfo">
              <v-icon color="primary">mdi-pencil</v-icon>
              <v-tooltip location="bottom" activator="parent">
                <span>会社情報を編集します。</span>
              </v-tooltip>

            </v-btn></p>
          <v-divider class="mb-2 border-opacity-100" />
          <div class="py-2 d-flex justify-space-between">
              <span>会社種別</span>
              <span>{{ $Const.USER_CATEGORY_DISP[companyInfo.category].text }}</span>
            </div>

          <div v-for="form in companyForms" :key="form.key" class="py-2 d-flex justify-space-between">
            <span>{{ form.title }}</span>
            <span>{{ form.value }}</span>
          </div>
          <v-divider class="mb-2 border-opacity-100" />
        </v-sheet>
      </v-col>
    </v-row>


    <v-row dense>
      <v-col align="right" class="d-flex justify-end">
        <v-btn size="large"  rounded color="primary" @click="entry">
          利用者登録
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card>
          <v-row justify="center" no-gutters>
            <v-col>
              <v-data-table :headers="memberListHeaders" :items="memberList" class="text-pre-wrap bg-background">
                <template #[`item.auth`]="{ item }">
                  <span>{{ item.auth ? '管理者' : '' }}</span>
                </template>
                <template #[`item.editItem`]="{ item }">
                  <v-btn color="secondary" fab small rounded dark @click="selectMember(item)">
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
const { $Const } = useNuxtApp()


// ユーザ情報を保持
const { userInfo } = useUserInfo()
const keyCompanyId = userInfo.value.companyId
// 会社情報を取得
const companyInfo = await db.getDocument({ path: 'company', docId: keyCompanyId })
const companyForms = ref([
  {
    title: '会社名',
    key: 'companyName',
    value: companyInfo.companyName,
    required: true,
    icon: 'mdi-office-building-outline',
    placeholder: '',
    cols: 12,
  },
  {
    title: '会社住所',
    key: 'companyAddr',
    value: companyInfo.companyAddr,
    required: false,
    icon: 'mdi-office-building-marker-outline',
    placeholder: '',
    cols: 12,
  },
  {
    title: '電話番号',
    key: 'companyTel',
    value: companyInfo.companyTel,
    required: false,
    icon: 'mdi-phone-outline',
    placeholder: '',
    cols: 6,
  },
  {
    title: '代表Emailアドレス',
    key: 'companyEmail',
    value: companyInfo.companyEmail,
    required: false,
    icon: 'mdi-email-outline',
    placeholder: '',
    cols: 6,
  },

  {
    title: 'FAX',
    key: 'companyFax',
    value: companyInfo.companyFax,
    required: false,
    icon: 'mdi-fax',
    placeholder: '',
    cols: 6,
  },
])


// メンバー(利用者)情報を保持
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

// メンバー(利用者)情報を取得
const memberList = await db.getQueryDocument({
  path: 'user',
  where: [{ fieldPath: 'companyId', opStr: '==', value: keyCompanyId }]
})

/** 前の画面へ戻る */
const back = () => {

    if (companyInfo.category === $Const.CATEGORY_APPLICANT) {
      router.push('/user/mypage') // 申込会社のmypage
    } else {
      router.push('/delivery/mypage') // それ以外(運送引受会社)のmypage
    }
}


// 利用者登録画面へ遷移
const entry = () => {
  router.push('/company/member/entry')
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
  router.push('/company/member/update')
}

/**
 * 会社情報編集画面へ遷移
 */
const editCompanyInfo = () => {
  // 画面遷移
  router.push('/company/update')
}

</script>
<style></style>