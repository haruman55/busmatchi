import type {
  FieldValue
  ,
  Timestamp
} from "firebase/firestore/lite";//利用機能(/lite)を限定することで速度アップ
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore/lite";//利用機能(/lite)を限定することで速度アップ


/**
 * 
 */
type Discount = {
  id: string;
  code: string;
  title: string;
  discount: number;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
};





/**
 * Firestore へのアクセス
 */
export const useMasterData = () => {
  const db = getFirestore();

  /**
   * 割引情報の選択肢一覧を返却する
   * @returns 
   */
  const getDiscountList = async () => {
    const discount: Discount[] = [];
    let q = null;
      q = query(
        collection(db, "discount"),
        orderBy('code')
      );
    const querySnapshot = await getDocs(q);
    let index = 0
    querySnapshot.docs.map((doc) => {
      discount.push(doc.data() as Discount);
      discount[index]["id"] = doc.id;
      index++
    });
    return discount;
  };










  return {
    db,
    getDiscountList,

  };
};
