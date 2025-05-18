import type {
  FieldValue
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
  setDoc,
  updateDoc,
  Timestamp
} from "firebase/firestore/lite";//利用機能(/lite)を限定することで速度アップ

import dayjs from 'dayjs';


type Information = {
  id: String;
  orderId: string;
  informationCode: String;
  isRead: Boolean;
  isDelete: Boolean;
  acceptCompanyId: String;
  acceptCompanyName: String;
  operateCompanyId: String;
  operateCompanyName: String;
  dispDate: String;
  remarks: string;
  createdAt: Timestamp | FieldValue;

}



/**
 * インフォメーション関連のデータアクセス
 */
export const useInformation = () => {
  const db = getFirestore();
  const { $Const } = useNuxtApp()



  /**
   * 指定会社へのインフォメーション情報を取得する
   * @param acceptCompanyId docid
   * @param isReadDelete 
   * @returns 
   */
  const getInformation = async (acceptCompanyId: string, isDelete: boolean) => {
    const information: Information[] = [];

    let q = null;
    q = query(collection(db, "information"), where("acceptCompanyId", "==", acceptCompanyId), where("isDelete", "==", isDelete), orderBy("createdAt", "desc"), orderBy("informationCode", "desc"));
    const querySnapshot = await getDocs(q);
    let index = 0;
    let newInformationCount = 0;
    let isNewInformation = false;
    querySnapshot.docs.map((doc) => {
      information.push(doc.data() as Information);
      information[index]["id"] = doc.id;
      const date = doc.data().createdAt.toDate();
      const dispDate = dayjs(date).format(
        "YYYY/MM/DD"
      );
      information[index]["dispDate"] = dispDate;
      
      // 開封していないインフォメーションがあればカウントアップ
      if (information[index].isRead === false) {
        newInformationCount++
      }
      index++;
    });
    return {newInformationCount, information}
  };

    /**
   * 指定ドックIDでのインフォメーション情報(ユニーク)を取得する
   * @param doc_id 
   * @returns 
   */
    const getInformationData = async (doc_id: String) => {
      const docRef = doc(db, "information", doc_id as string);
  
      try {
        // ドキュメントを取得
        const docSnap = await getDoc(docRef);
  
        // ドキュメントが存在するか確認
        if (docSnap.exists()) {
          // データを取得
          return docSnap.data() as Information;
        } else {
          // ドキュメントが存在しない場合の処理
          console.log("No such document! Information");
          return null;
        }
      } catch (error) {
        // エラー処理
        console.error("Error getting document Information :", error);
        return null;
      }
  
    };
  
      /**
   * インフォメーションを登録する.
   * @param information 
   * @returns 
   */
  const addInformation = async (informationCode: String,orderId:String, acceptCompanyId: String,acceptCompanyName: String ,operateCompanyId: String,operateCompanyName: String ) => {

    const title = $Const.INFORMATION_CODE.find((item) => item.code === informationCode)?.title || null;
    if (title == null) {
      console.error("Invalid information code:", informationCode);
      return null;
    }
    // codeの値によってremarksに設定する内容を生成する
    let remarks = null;
    switch (informationCode) {
      case $Const.INFORMATION_CODE_DM:
        remarks = `${operateCompanyName}から${title}がきました。`;
        break;

      case $Const.INFORMATION_CODE_APPLICATION:
        remarks = `${operateCompanyName}から${title}通知がきました。`;
        break;
      case $Const.INFORMATION_CODE_ARRANGEMENTS:
        remarks = `${operateCompanyName}から${title}通知がきました。`;
        break;
      case $Const.INFORMATION_CODE_CONTENT_CONFIRMATION:
        remarks = `${operateCompanyName}から${title}通知がきました。`;
        break;
      case $Const.INFORMATION_CODE_ARRANGEMENTS_COMPLETED:
        remarks = `${operateCompanyName}から${title}通知がきました。`;
        break;
      case $Const.INFORMATION_CODE_PAYMENT:
        remarks = `${operateCompanyName}から${title}通知がきました。`;
        break;
      case $Const.INFORMATION_CODE_CHANGE_APPLICATION:
        remarks = `${operateCompanyName}から${title}通知がきました。`;
        break;
      case $Const.INFORMATION_CODE_CHANGE_ARRANGEMENTS:
        remarks = `${operateCompanyName}から${title}通知がきました。`;
        break;
      case $Const.INFORMATION_CODE_DENY_ARRANGEMENTS:
        remarks = `${operateCompanyName}から${title}通知がきました。`;
        break;
      case $Const.INFORMATION_CODE_ORDER_COMPLETED:
        remarks = `${operateCompanyName}から${title}通知がきました。`;
        break;
      default:
        console.error("Invalid information code:", informationCode);
    }


    const informationData = {
      informationCode: informationCode,
      orderId: orderId,
      isRead: false,
      isDelete: false,
      acceptCompanyId: acceptCompanyId,
      acceptCompanyName: acceptCompanyName,
      operateCompanyId: operateCompanyId,
      operateCompanyName: operateCompanyName,
      // dispDate: ',
      remarks: remarks,
      createdAt: Timestamp.now(),
    };


    const docRef = await addDoc(collection(db, "information"), informationData);
    return docRef.id

  };

  /**
   * 指定のinformation情報を削除状態に更新する
   * @param information 
   * @returns 
   */
  const deleteInformation = async (doc_id: string) => {
    if (doc_id == null) {
      return null;
    }
    const informationDocRef = doc(db, "information", doc_id);
    // statusを更新（
    const update = {
      isDelete: true,
    };
    await updateDoc(informationDocRef, update);
  };

  /**
   * 指定のinformation情報を既読状態に更新する
   * @param information 
   * @returns 
   */
  const readInformation = async (doc_id: string) => {
    if (doc_id == null) {
      return null;
    }
    const informationDocRef = doc(db, "information", doc_id);
    // statusを更新（
    const update = {
      isRead: true,
    };
    await updateDoc(informationDocRef, update);
  };






  return {
    db,
    getInformation,
    getInformationData,
    addInformation,
    deleteInformation,
    readInformation,

  };
};
