// 案件の状況定義
export const ORDER_STATUS_DISP = {
  1: { text: '案件登録中', icon: 'mdi-note-plus-outline', color: 'green' },
  2: { text: '運送依頼中', icon: 'mdi-note-plus-outline', color: '#bae6fd' },
  3: { text: '運送手配完了', icon: 'mdi-bus', color: 'yellow-lighten-2' },
  4: { text: '運送手配申込', icon: 'mdi-bus', color: 'green' },
  5: { text: '運送手配引受完了', icon: 'mdi-bus', color: 'yellow-lighten-2' },
  6: { text: '運送手配引受完了(支払い完了)', icon: 'mdi-bus', color: 'yellow-lighten-2' },
  8: { text: '運送手配引受不可', icon: 'mdi-bus', color: 'grey' },
  9: { text: '案件完了', icon: 'mdi-check-circle-outline', color: 'grey' },
}

// 案件状況-申込会社
export const STATUS_DRAFT = '1'
// 案件状況-依頼中
export const STATUS_REQUEST = '2'
// 案件状況-運送手配完了
export const STATUS_RESERVATION = '3'
// 案件状況-運送手配申込
export const STATUS_APPLICATION = '4'
// 案件状況-手配確認完了
export const STATUS_ARRANGEMENTS_COMPLETED = '5'
// 案件状況-支払い完了
export const STATUS_PATMENT_COMPLETED = '6'

// 案件状況-運送手配引受不可
export const ORDER_DENY = '8'
// 案件状況-案件完了
export const ORDER_COMPLETED = '9'

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









// ユーザー種別
export const USER_CATEGORY_DISP = {
  1: { text: '申込会社' },
  2: { text: '運送引受会社' },
}

// カテゴリ-申込会社
export const CATEGORY_APPLICANT = '1'
// カテゴリ-運送引受会社
export const CATEGORY_DELIVERY = '2'

// 操作(導線入口)：案件(1)
export const USER_ACTION_ORDER = '1'
// 操作(導線入口)：利用顧客(2)
export const USER_ACTION_CUSTOMER = '2'
// 操作(導線入口)：契約履歴(3)
export const USER_ACTION_CONTRACT = '3'
// 操作(導線入口)：配送引受会社(4)
export const USER_ACTION_DELIVERY = '4'



// 投稿するテーマの表示名称
export const THEME_DISP = {
  11: "会社の規則について",
  12: "いまの仕事について",
  13: "部活について",
  19: "プライベート、その他について",
  21: "衣食住",
  22: "イベント",
  23: "趣味",
  24: "部活動",
  29: "その他、ちょっと聞いてよ！",
  31: "研修",
  32: "Udemy,Progateなどのオンライン学習",
  33: "資格",
  34: "技術全般",
  39: "その他、ちょっと聞いてよ！"
}
// 投稿したレビューのおススメの表示情報
export const RECOMMEND_DISP = {
  0: { text: 'おススメしない' },
  1: { text: 'おススメ' },
  2: { text: '絶対おススメ' },
  9: { text: 'どちらでもない' },
}

// 投稿するカテゴリの選択肢
export const TOPIC_KIND = [
  { disp: '', code: '' },
  { disp: 'Q&A', code: '1' },
  { disp: 'Fun', code: '2' },
  { disp: 'Reviews', code: '3' },
]

// 投稿するQAテーマの選択肢
export const THEME_QA_KIND = [
  { disp: '', code: '' },
  { disp: '会社の規則について', code: '1' },
  { disp: 'いまの仕事について', code: '2' },
  { disp: '部活について', code: '3' },
  { disp: 'プライベート、その他について', code: '9' },
]
// 投稿するFUNテーマの選択肢
export const THEME_FUN_KIND = [
  { disp: '', code: '' },
  { disp: '衣食住', code: '1' },
  { disp: 'イベント', code: '2' },
  { disp: '趣味', code: '3' },
  { disp: '部活動', code: '4' },
  { disp: 'その他、ちょっと聞いてよ！', code: '9' },
]


// 投稿するReviewsテーマの選択肢
export const THEME_REVIEWS_KIND = [
  { disp: '', code: '' },
  { disp: '研修', code: '2' },
  { disp: 'Udemy,Progateなどのオンライン学習', code: '2' },
  { disp: '資格', code: '3' },
  { disp: '技術全般', code: '4' },
  { disp: 'その他、ちょっと聞いてよ！', code: '9' },
]
// 投稿するharassmentテーマの選択肢
export const THEME_HARASSMENT_KIND = [
  { disp: '', code: '' },
]

// ハラスメント対応状況のカテゴリの選択肢
export const HARASSMENT_STATUS_KIND = [
  { disp: '', code: '' },
  { disp: '変更なし', code: '0' },
  { disp: '対応中', code: '1' },
  { disp: '対応完了', code: '2' },
  { disp: 'リファー（他へ紹介）', code: '3' },
]


// [ハラスメント]状況の表示名称
export const SITUATION_DISP = {
  0: "ハラスメントをうけている",
  1: "ハラスメントを目撃している",
  2: "ハラスメント加害者かもしれない",
}

// [ハラスメント]窓口への要求の表示名称
export const REQUEST_DISP = {
  0: "相談したい  ",
  1: "全体集会などで事例として周知してほしい",
  2: "今回は投稿のみで様子見としたい。",
}

// [ハラスメント]関係者の表示名称
export const PEOPLE_CONCERNED_DISP = {
  0: "社員  ",
  1: "協力会社社員",
  2: "お客様",
  3: "その他",
}
// [ハラスメント]対応状況の表示名称
export const HARASSMENT_STATUS_DISP = {
  0: "変更なし",
  1: "対応中",
  2: "対応完了",
  3: "リファー（他へ紹介）",
}


// WEB勤怠のURL
export const URL_WEBATTENDANCE = 'https://secure.tsone.co.jp/WebAttendance/'
// LINEWOEKSのURL
export const URL_LINEWORKS = 'https://board.worksmobile.com/'
// TSOneBOXのURL
export const URL_TSONEBOX = 'https://tsone-box.web.app/'
// SPTsのURL
export const URL_SPTS = 'https://spts-ef732.web.app/'
// giftreのURL
export const URL_GIFTRE = 'https://giftre-ce095.web.app/'

// スキル区分-言語
export const CATEGORY_SKILL_LANGUAGE = '01'
// スキル区分-OS
export const CATEGORY_SKILL_OS = '02'
// スキル区分-DB
export const CATEGORY_SKILL_DB = '03'
// スキル区分-その他
export const CATEGORY_SKILL_OTHER = '04'
// スキルコード-その他
export const CODE_SKILL_OTHER = '999'
// 資格コード-その他
export const CODE_QUALIFICATION_OTHER = '999'
// レベルコード-初期値
export const CODE_LEVEL_INIT = '00'

// その他取り組み策カテゴリ-ヒューマンスキル
export const CODE_OTHEREFFORTS_HUMAN = '1'
// その他取り組み策カテゴリ-フィジカル
export const CODE_OTHEREFFORTS_PHYSICAL = '2'
// その他取り組み策カテゴリ-社内スキル
export const CODE_OTHEREFFORTS_CAMPANY = '3'
// その他取り組み策のカテゴリ毎の表示名と背景色の定義
export const OTHEREFFORTS_CATEGORY_DISPLAY = {
  1: { text: 'ヒューマンスキル', color: 'white' },
  2: { text: 'フィジカル', color: 'white' },
  3: { text: '社内スキル', color: 'white' }
}

// キャリアシートステータス-ドラフト
export const CAREER_SHEET_STATUS_DRAFT = '1'
// キャリアシートステータス-目標設定中
export const CAREER_SHEET_STATUS_SET = '2'
// キャリアシートステータス-完了
export const CAREER_SHEET_SHEET_COMPLETION = '3'
// キャリアシートステータス-削除
export const CAREER_SHEET_SHEET_DELETE = '9'

// ポイント：目標完了時のポイント
export const COMMIT_POINT = 500
// ポイント：保有スキル追加時のポイント
export const SKILL_POINT = 500
// ポイント：保有スキル習熟レベル更新時のポイント
export const SKILL_LEVELUP_POINT = 500
// ポイント：その他取組策完了時のポイント
export const COMMIT_OTHEREFFORTS_POINT = 500

// ポイント：AWSOMEで受け取りれるポイント：固定100ポイントの仕様
export const AWESOME_POINT = 100

// ポイント：取得グレード資格とポイントの連想配列
export const LEVEL_POINT = {
  G1: 1000,
  G2: 2000,
  G3: 3000,
  G4: 4000,
  G5: 5000,
  G6: 10000,
  G7: 10000,
  '-': 1000
}

// キャリアシートのステータス毎の表示名と背景色の定義
export const STATUS_DISPLAY = {
  1: { text: '一次保存中', color: 'light-blue-lighten-4' },
  2: { text: '目標管理中', color: 'secondary' },
  3: { text: '目標完了', color: 'success' },
  9: { text: 'シート削除', color: 'blue-grey-darken-2' }
}


// ランクに紐つく画像URLの定義
export const RANK_IMAGES = {
  0: { text: 'ランクE', img: '/img/rankback1.png' },
  1: { text: 'ランクD', img: '/img/rankback1.png' },
  2: { text: 'ランクC', img: '/img/rankback2.png' },
  3: { text: 'ランクB', img: '/img/rankback3.png' },
  4: { text: 'ランクA', img: '/img/rankback4.png' },
  5: { text: 'ランクS', img: '/img/rankback5.png' },
  6: { text: 'ランクSS', img: '/img/rankback5.png' }
}

// インフォメーション：AWSOMEでポイントゲット
export const INFORMATION_AWSOME = "0"

// インフォメーション：管理者からポイント付与
export const INFORMATION_CHARGE = "1"
// インフォメーション：管理者からポイント一斉配信：イベント
export const INFORMATION_EVENT = "2"
// インフォメーション：管理者から詫びポイント：障害報告
export const INFORMATION_ERROR = "9"

// イベント：種別
export const EVENT_KIND = [
  { label: '基本スキルチェッククリア達成', value: '0' },
  { label: 'スキル達成', value: '1' },
  { label: '資格達成', value: '2' },
  { label: 'キャリアシート達成', value: '3' }
]
// イベント：定数：基本スキルチェッククリア達成
export const BASIC_SKILL_EVENT = "0"
// イベント：定数：スキル達成
export const SKILL_EVENT = "1"
// イベント：定数：資格達成
export const QUALIFICATION_EVENT = "2"
// イベント：定数：キャリアシート達成
export const CAREER_EVENT = "3"

// イベント：達成数量選択肢
export const QUANTITYS = [
  {
    disp: '1個',
    code: '0',
    amount: 1,
  },
  {
    disp: '5個以上',
    code: '1',
    amount: 5,
  },
  {
    disp: '10個以上',
    code: '2',
    amount: 10,
  },
  {
    disp: '対象を指定する',
    code: '9',
    amount: 1,
  },
]
// イベント：定数：達成数1個
export const ONE = "0"
// イベント：定数：達成数5個以上
export const FIVE_OVER = "1"
// イベント：定数：達成数10個以上
export const TEN_OVER = "2"
// イベント：定数：指定する
export const ASSIGNMENT = "9"

