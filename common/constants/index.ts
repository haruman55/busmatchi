// 案件の状況定義
export const ORDER_STATUS_DISP = {
  1: { text: '案件登録中', icon: 'mdi-note-plus-outline', color: 'white' },
  2: { text: '運送依頼中', icon: 'mdi-note-plus-outline', color: 'blue-lighten-3' },
  3: { text: '運送手配引受', icon: 'mdi-bus', color: 'yellow-lighten-2' },
  4: { text: '申込完了(支払方法確定)', icon: 'mdi-bus', color: 'teal-lighten-1' },
  5: { text: '運送完了(支払未済)', icon: 'mdi-bus', color: 'green' },
  6: { text: '支払完了', icon: 'mdi-bus', color: 'brown-darken-1' },
  8: { text: '運送手配引受不可', icon: 'mdi-bus', color: 'grey' },
  9: { text: '案件完了', icon: 'mdi-check-circle-outline', color: 'blue-grey-darken-1' },
}

// 案件状況-申込会社
export const STATUS_DRAFT = '1'
// 案件状況-依頼中
export const STATUS_REQUEST = '2'
// 案件状況-運送手配済
export const STATUS_UNDERTAKE = '3'
// 案件状況-支払方法確定
export const STATUS_PAYMENT_METHOD_CONFIRMED = '4'

// 案件状況-運送完了
export const STATUS_TRANSPORTATION_COMPLETED = '5'

// 案件状況-支払い完了
export const STATUS_PAYMENT_COMPLETED = '6'

// 案件状況-運送手配引受不可
export const STATUS_ORDER_DENY = '8'
// 案件状況-案件完了
export const STATUS_ORDER_COMPLETED = '9'

// 配車予約のカテゴリ-バス
export const CATEGORY_BUS = '0'
// 配車予約のカテゴリ-運転手
export const CATEGORY_DRIVER = '1'
// 配車予約のカテゴリ-バスガイド
export const CATEGORY_GUIDE = '2'

// 車両タイプ
export const VEHICLE_TYPE = [
  { disp: '', code: '' },
  { disp: 'リフト', code: '1' },
  { disp: '中型車', code: '2' },
  { disp: '小型車', code: '3' },
  { disp: 'マイクロ', code: '4' },
]

// 車両タイプの表示情報
export const VEHICLE_TYPE_DISP = {
  1: { text: 'リフト' },
  2: { text: '中型車' },
  3: { text: '小型車' },
  4: { text: 'マイクロ' },
}

// 予約確認要の時間配列
export const TIME_ARRAY = {
  0: { index: 0 },
  1: { index: 1 },
  2: { index: 2 },
  3: { index: 3 },
  4: { index: 4 },
  5: { index: 5 },
  6: { index: 6 },
  7: { index: 7 },
  8: { index: 8 },
  9: { index: 9 },
  10: { index: 10 },
  11: { index: 11 },
  12: { index: 12 },
  13: { index: 13 },
  14: { index: 14 },
  15: { index: 15 },
  16: { index: 16 },
  17: { index: 17 },
  18: { index: 18 },
  19: { index: 19 },
  20: { index: 20 },
  21: { index: 21 },
  22: { index: 22 },
  23: { index: 23 },
}


// TODO(未使用のはず次回のコミットで消す):時間-選択肢
export const TIME_LIST = [
  { disp: '00:00', code: 0 },
  { disp: '01:00', code: 1 },
  { disp: '02:00', code: 2 },
  { disp: '03:00', code: 3 },
  { disp: '04:00', code: 4 },
  { disp: '05:00', code: 5 },
  { disp: '06:00', code: 6 },
  { disp: '07:00', code: 7 },
  { disp: '08:00', code: 8 },
  { disp: '09:00', code: 9 },
  { disp: '10:00', code: 10 },
  { disp: '11:00', code: 11 },
  { disp: '12:00', code: 12 },
  { disp: '13:00', code: 13 },
  { disp: '14:00', code: 14 },
  { disp: '15:00', code: 15 },
  { disp: '16:00', code: 16 },
  { disp: '17:00', code: 17 },
  { disp: '18:00', code: 18 },
  { disp: '19:00', code: 19 },
  { disp: '20:00', code: 20 },
  { disp: '21:00', code: 21 },
  { disp: '22:00', code: 22 },
  { disp: '23:00', code: 23 },
]

// 時間-選択肢
export const TIME_HOUR_LIST = [
  { disp: '00', code: 0 },
  { disp: '01', code: 1 },
  { disp: '02', code: 2 },
  { disp: '03', code: 3 },
  { disp: '04', code: 4 },
  { disp: '05', code: 5 },
  { disp: '06', code: 6 },
  { disp: '07', code: 7 },
  { disp: '08', code: 8 },
  { disp: '09', code: 9 },
  { disp: '10', code: 10 },
  { disp: '11', code: 11 },
  { disp: '12', code: 12 },
  { disp: '13', code: 13 },
  { disp: '14', code: 14 },
  { disp: '15', code: 15 },
  { disp: '16', code: 16 },
  { disp: '17', code: 17 },
  { disp: '18', code: 18 },
  { disp: '19', code: 19 },
  { disp: '20', code: 20 },
  { disp: '21', code: 21 },
  { disp: '22', code: 22 },
  { disp: '23', code: 23 },
]

// 分-選択肢
export const TIME_MINUTE_LIST = [
  { disp: '00', code: 0 },
  { disp: '05', code: 5 },
  { disp: '10', code: 10 },
  { disp: '15', code: 15 },
  { disp: '20', code: 20 },
  { disp: '25', code: 25 },
  { disp: '30', code: 30 },
  { disp: '35', code: 35 },
  { disp: '40', code: 40 },
  { disp: '45', code: 45 },
  { disp: '50', code: 50 },
  { disp: '55', code: 55 },
]




// ユーザー種別
export const USER_CATEGORY_DISP = {
  1: { text: '申込会社' },
  2: { text: '運送引受会社' },
}

// カテゴリ-申込会社
export const CATEGORY_APPLICANT = '1'
// カテゴリ-運送引受会社
export const CATEGORY_DELIVERY = '2'

// 操作(導線入口)：マイページからの直接(0)
export const USER_ACTION_MYPAGE = '0'
// 操作(導線入口)：案件(1)
export const USER_ACTION_ORDER = '1'
// 操作(導線入口)：利用顧客(2)
export const USER_ACTION_CUSTOMER = '2'
// 操作(導線入口)：契約履歴(3)
export const USER_ACTION_CONTRACT = '3'
// 操作(導線入口)：配送引受会社(4)
export const USER_ACTION_DELIVERY = '4'

// インフォメーションコードの定数 ダイレクトメッセージ
export const INFORMATION_CODE_DM = '0'
// インフォメーションコードの定数 運送依頼
export const INFORMATION_CODE_APPLICATION = '1'
// インフォメーションコードの定数 運送依頼の引受
export const INFORMATION_CODE_ARRANGEMENTS = '2'
// インフォメーションコードの定数 運送手配内容の確認完了
export const INFORMATION_CODE_CONTENT_CONFIRMATION = '3'
// インフォメーションコードの定数 運送手配の完了
export const INFORMATION_CODE_ARRANGEMENTS_COMPLETED = '4'
// インフォメーションコードの定数 入金完了
export const INFORMATION_CODE_PAYMENT = '5'
// インフォメーションコードの定数 運送申込内容の修正
export const INFORMATION_CODE_CHANGE_APPLICATION = '6'
// インフォメーションコードの定数 運送手配内容の修正
export const INFORMATION_CODE_CHANGE_ARRANGEMENTS = '7'
// インフォメーションコードの定数 運送依頼の引受不可
export const INFORMATION_CODE_DENY_ARRANGEMENTS = '8'
// インフォメーションコードの定数 依頼完了
export const INFORMATION_CODE_ORDER_COMPLETED = '9'

  /**
   * インフォメーションコードの連想配列
   */
  export  const INFORMATION_CODE = [
    { code: '0', title: 'ダイレクトメッセージ',icon: 'mdi-chat-outline' },
    { code: '1', title: '運送依頼',icon: 'mdi-pencil-circle-outline' },
    { code: '2', title: '運送依頼の引受',icon: 'mdi-pencil-circle-outline'  },
    { code: '3', title: '運送手配内容の確認完了',icon: 'mdi-check-circle-outline'  },
    { code: '4', title: '運送手配の完了',icon: 'mdi-check-circle-outline'  },
    { code: '5', title: '入金完了',icon: 'mdi-cash-check'  },
    { code: '6', title: '運送申込内容の修正',icon: 'mdi-pencil-circle-outline'  },
    { code: '7', title: '運送手配内容の修正',icon: 'mdi-pencil-circle-outline'  },
    { code: '8', title: '運送依頼の引受不可',icon: 'mdi-close-circle-outline'  },
    { code: '9', title: '依頼完了' ,icon: 'mdi-check-circle-outline' },
  ]

