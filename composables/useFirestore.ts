import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
  startAt,
  endAt,
  limit,
  runTransaction,
  type FieldValue,
  type Timestamp,
  type Query,
  type WhereFilterOp,
  type OrderByDirection,
  type Transaction,
} from 'firebase/firestore/lite'
//利用機能(/lite)を限定することで速度アップ

// 会社オブジェクト
type Company = {
  id: string
  category: string
  companyName: string
  companyAddr: string
  companyTel: string
  companyFax: string
  companyEmail: string
  // 以降は運送引受会社の設定値
  businessPermitDate: string
  businessPermitNo: string
  businessLicenseArea: string
}

// ユーザーオブジェクト
type User = {
  id: string
  name: string
  // ログイン時のID
  email: string
  pass: string
  auth: number
  // Companyのdocid
  companyId: string
  createdAt: Timestamp | FieldValue
  updatedAt: Timestamp | FieldValue
}

// 顧客情報オブジェクト
type Customer = {
  id: string
  customerId: string
  customerName: string
  customerAddr: string
  customerTel: string
  customerFax: string
  customerMail: string
  customerXXX: string
  companyId: string
}

// 案件情報オブジェクト
type Order = {
  id: string
  state: string
  // 申込会社ID
  companyId: string
  applicant: string
  emergencyContact: string
  tourOrganization: string
  customerRemarks: string
  passengers: number
  vehicleTypeLiftAmount: number
  vehicleTypeMediumAmount: number
  vehicleTypeSmallAmount: number
  vehicleTypeMicroAmount: number
  deliveryLocation: string
  dispatchDate: string
  dispatchTimeHour: number
  dispatchTimeMinute: number
  departureTimeHour: number
  departureTimeMinute: number
  itinerary1Top: string
  itinerary1Bottom: string
  timeschedule1Top: string
  timeschedule1Bottom: string
  accommodations1: string
  accommodationsTel1: string
  accommodationsAddr1: string
  endDate: string
  endingTimeHour: number
  endingTimeMinute: number
  terminalLocation: string
  // 申込対象の顧客のdocid
  customerId: string
  // 申込対象の運送引受会社のdocid
  deliveryCompanyId: string
  // 案件に紐付く配車情報のdocid
  dispatchId: string
  // 運送引受会社の案件担当者
  counterPersonMain: string
  counterPersonSub: string
  // 支払いに関わる情報
  selectPayment: string
  selectPaymentOther: string
  selectDiscount: []
  selectDiscountOther: string
  orderAmount: string
  actualCost: string
  paymentDueDate: string
  specialTerms: string
  remarks: string
  createdAt: Timestamp | FieldValue
  updatedAt: Timestamp | FieldValue
}

// 案件情報-配車情報オブジェクト
type Dispatch = {
  id: string
  orderId: string
  busList: string[]
  driverList: string[]
  guideList: string[]
  reservationFrom: Timestamp | FieldValue
  reservationTo: Timestamp | FieldValue
  createdAt: Timestamp | FieldValue
  updatedAt: Timestamp | FieldValue
}

// バス、運転手、ガイドの配車、出勤予約管理
type Reservation = {
  id: string
  // TODO:仕様で固定 0:バス 1:運転手 2:ガイド
  category: string
  // 各種バス、運転手、ガイドのDocId
  itemId: string
  title: string
  reservationFrom: Timestamp | FieldValue
  reservationTo: Timestamp | FieldValue
  // 案件に紐付く予約の場合は案件IDが設定される
  orderId: string
  createdAt: Timestamp | FieldValue
  updatedAt: Timestamp | FieldValue
}

// 運送引受会社保有情報-駐車地情報オブジェクト
type Parking = {
  id: string
  companyId: string
  parking: string
  parkingAddr: string
  remarks: string
  createdAt: Timestamp | FieldValue
  updatedAt: Timestamp | FieldValue
}

// 運送引受会社保有情報-バスガイド情報オブジェクト
type Guide = {
  id: string
  companyId: string
  guideName: string
  guideNameKana: string
  contact: string
  remarks: string
  createdAt: Timestamp | FieldValue
  updatedAt: Timestamp | FieldValue
}

// 運送引受会社保有情報-バス運転手情報オブジェクト
type Driver = {
  id: string
  companyId: string
  driverName: string
  driverNameKana: string
  contact: string
  remarks: string
  createdAt: Timestamp | FieldValue
  updatedAt: Timestamp | FieldValue
}

// 運送引受会社保有情報-バス情報オブジェクト
type Bus = {
  id: string
  companyId: string
  vehicleNo: string
  vehicleType: string
  remarks: string
  // バスが配置されている駐車場のdocid
  parkingId: string
  createdAt: Timestamp | FieldValue
  updatedAt: Timestamp | FieldValue
}

// コレクション名 → 型のマッピング
type TableMap = {
  company: Company
  user: User
  customer: Customer
  order: Order
  dispatch: Dispatch
  reservation: Reservation
  parking: Parking
  guide: Guide
  driver: Driver
  bus: Bus
}

/**
 * Firestore へのアクセス
 */
export const useFirestore = () => {
  const db = getFirestore()

  /**
   * UIDを新規取得
   * @param {string} path コレクション名
   * @return {string} 新規UID
   */
  const createDocId = (path: string): string => {
    return doc(collection(db, path)).id
  }

  /**
   * 指定したUIDを元にFirestoreからドキュメントを読み込む
   * @param {Object} param 引数のデータ
   * @param {string} param.path コレクション名
   * @param {string} param.docId ドキュメントのUID
   * @returns {Promise<TableMap[keyof TableMap] | null>} 読み込んだドキュメントのデータ
   */
  const getDocument = async ({
    path,
    docId,
  }: {
    path: keyof TableMap
    docId: string
  }): Promise<TableMap[keyof TableMap] | null> => {
    try {
      const docRef = doc(db, path as string, docId)
      const docSnap = await getDoc(docRef)
      return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as TableMap[typeof path]) : null
    } catch (error) {
      console.error('Failed to fetch the document:', error)
      return null
    }
  }

  /**
   * クエリを作成してDB読み込み
   * @param {object} param
   * @param {string} param.path コレクション名
   * @param {Array} param.where where句
   * @param {Array} param.orderBy orderBy句
   * @param {Date} param.startAt 開始日時
   * @param {Date} param.endAt 終了日時
   * @param {number} param.limit 取得件数
   * @returns {Promise<TableMap[keyof TableMap] | null>} 読み込んだドキュメントのデータ
   */
  const getQueryDocument = async (param: {
    path: string
    where: { fieldPath: string; opStr: WhereFilterOp; value: string }[]
    orderBy: { fieldPath: string; directionStr: OrderByDirection | undefined }[]
    startAt: Date | undefined
    endAt: Date | undefined
    limit: number | undefined
  }): Promise<TableMap[keyof TableMap] | TableMap[keyof TableMap][] | null> => {
    try {
      let ref: Query = collection(db, param.path)

      if (param.where) for (const w of param.where) ref = query(ref, where(w.fieldPath, w.opStr, w.value))
      if (param.orderBy) for (const o of param.orderBy) ref = query(ref, orderBy(o.fieldPath, o.directionStr))
      if (param.startAt) ref = query(ref, startAt(param.startAt))
      if (param.endAt) ref = query(ref, endAt(param.endAt))
      if (param.limit) ref = query(ref, limit(param.limit))

      const querySnapshot = await getDocs(ref)
      const data = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as TableMap[keyof TableMap][]

      // 1件取得の場合、オブジェクトを返す
      return param.limit === 1 ? data[0] : data
    } catch (error) {
      console.error('Failed to fetch the document:', error)
      return null
    }
  }

  /**
   * 書き込みトランザクション
   * @param {array} items
   * @return {Promise<object>} 実行結果
   */
  const writeTransaction = async (
    items: { method: string; path: string; docId: string; data: object }[]
  ): Promise<object> => {
    const result = await runTransaction(db, (transaction: Transaction) => {
      for (const item of items) {
        const ref = doc(db, item.path, item.docId)
        if (item.method == 'set') transaction.set(ref, item.data)
        if (item.method == 'merge') transaction.set(ref, item.data, { merge: true })
        if (item.method == 'update') transaction.update(ref, item.data)
        if (item.method == 'delete') transaction.delete(ref)
      }
      return Promise.resolve()
    })
      .then(() => {
        return { status: 'success' }
      })
      .catch((error) => {
        console.log('Transaction failed:', error)
        return { status: 'error', message: error.message }
      })

    return result
  }

  return {
    createDocId,
    getDocument,
    getQueryDocument,
    writeTransaction,
  }
}
