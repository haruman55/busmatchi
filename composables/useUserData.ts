import type {
  FieldValue
} from "firebase/firestore";
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
  startAt,
  endAt,
  serverTimestamp,
  setDoc,
  updateDoc,
  deleteDoc,
  Timestamp
} from "firebase/firestore";

import dayjs from 'dayjs';

type User = {
  id: string;
  category: string;
  companyId: string;
  companyName: string;
  companyAddr: string;
  companyTel: string;
  companyFax: string;
  companyEmail: string;
  pass: string;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
};

// 顧客情報オブジェクト
type Customer = {
  id: string;
  customerId: string;
  customerName: string;
  customerAddr: string;
  customerTel: string;
  customerFax: string;
  customerMail: string;
  customerXXX: string;
  companyId: string;
};

// 案件情報オブジェクト
type Order = {
  id: string;
  state: string;
  // 申込会社ID(ログインユーザのIDと一緒)
  companyId: string;
  applicant: string;
  emergencyContact: string;
  tourOrganization: string;
  remarks: string;
  passengers: number;
  vehicleTypeLiftAmount:number;
  vehicleTypeMediumAmount: number;
  vehicleTypeSmallAmount: number;
  vehicleTypeMicroAmount: number;
  deliveryLocation: string;
  dispatchDate: string;
  dispatchTime: string;
  departureTime: string;
  itinerary1Top: string;
  itinerary1Bottom: string;
  timeschedule1Top: string;
  timeschedule1Bottom: string;
  accommodations1: string;
  accommodationsTel1: string;
  accommodationsAddr1: string;
  endDate: string;
  endingTime: string;
  terminalLocation: string;
  // 申込対象の顧客のdocid
  customerId: string;
  // 申込対象の運送引受会社のdocid
  deliveryCompanyId: string;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
};

// 運送引受会社保有情報-駐車地情報オブジェクト
type Parking = {
  id: string;
  companyId: string;
  parking: string;
  parkingAddr: string;
  remarks: string;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;

};
// 運送引受会社保有情報-バスガイド情報オブジェクト
type Guide = {
  id: string;
  companyId: string;
  guideName: string;
  guideNameKana: string;
  contact: string;
  remarks: string;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;

};

// 運送引受会社保有情報-バス運転手情報オブジェクト
type Driver = {
  id: string;
  companyId: string;
  driverName: string;
  driverNameKana: string;
  contact: string;
  remarks: string;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
};

// 運送引受会社保有情報-バス情報オブジェクト
type Bus = {
  id: string;
  companyId: string;
  vehicleNo: string;
  vehicleType: string;
  remarks: string;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
};







// ポイントやり取り情報
type ExchangeInfo = {
  id: string;
  acceptUserId: string;
  acceptUserName: string;
  acceptUserHandleName: string;
  operateUserId: string;
  operateUserName: string;
  operateUserHandleName: string;
  exchangeCode: string;
  exchangeComment: string;
  exchangePoint: number;
  exchangeDate: string;
  myComment: boolean;
  dispDate: string;
  dispHour: string;
  exchangeTimestamp: Timestamp | FieldValue;

}



/**
 * Firestore へのアクセス
 */
export const useUserData = () => {
  const db = getFirestore();

  /**
   * ログインユーザ情報の取得
   * @param email 
   * @param pass 
   * @returns 
   */
  const getUser = async (companyId: string | "", pass: string | "") => {
    const user: User[] = [];
    let q = null;
    if (companyId == "" || pass == "") {
      return null
    } else {
      q = query(
        collection(db, "user"),
        where("companyId", "==", companyId),
        where("pass", "==", pass),
      );
    }
    const querySnapshot = await getDocs(q);
    let index = 0
    querySnapshot.docs.map((doc) => {
      user.push(doc.data() as User);
      user[index]["id"] = doc.id;
      index++
    });
    return user[0];
  };

  /**
 * 指定ユーザの情報(ユニーク)を取得する
 * @param doc_id 
 * @returns 
 */
  const getUserData = async (doc_id: string) => {
    const docRef = doc(db, "user", doc_id as string);

    try {
      // ドキュメントを取得
      const docSnap = await getDoc(docRef);

      // ドキュメントが存在するか確認
      if (docSnap.exists()) {
        // データを取得
        return docSnap.data() as User;
      } else {
        // ドキュメントが存在しない場合の処理
        console.log("No such document! user");
        return null;
      }
    } catch (error) {
      // エラー処理
      console.error("Error getting document user :", error);
      return null;
    }

  };

  /**
   * 指定emailのユーザが存在するか確認する.
   * @param email 
   * @returns 同一のアドレスが存在する:true
   */
  const isUserExists = async (companyId: string) => {
    try {
      // ドキュメントを取得
      const user: User[] = [];
      let q = null;
      if (companyId == "") {
        return null
      } else {
        q = query(
          collection(db, "user"),
          where("companyId", "==", companyId),
        );
      }
      const querySnapshot = await getDocs(q);

      // ドキュメントが存在するか確認
      if (querySnapshot.docs.length > 0) {
        // ドキュメントが存在する:true
        return true;
      } else {
        // ドキュメントが存在しない場合の処理
        return false;
      }
    } catch (error) {
      // エラー処理
      console.error("Error getting document user :", error);
      return null;
    }

  };



  /**
   * ユーザ情報を更新する
   * @param user 
   * @returns 
   */
  const updateUser = async (user: User) => {
    if (user == null) {
      return null;
    }
    const userRef = doc(db, "user", user.id as string);
    const updateUser = {
      category: user.category,
      companyName: user.companyName,
      companyAddr: user.companyAddr,
      companyTel: user.companyTel,
      companyFax: user.companyFax,
      companyEmail: user.companyEmail,
      

    };
    await updateDoc(userRef, updateUser);
  };




  /**
   * ユーザ情報を登録する
   * @param user 
   * @returns ドキュメントID
   */
  const addUser = async (user: User) => {
    if (user == null) {
      return null;
    }
    const docRef = await addDoc(collection(db, "user"), user);
    return docRef.id

  };



  /**
 * 運送引受会社情報の取得
 * @returns 
 */
  const getDeliveryUser = async () => {
    const user: User[] = [];
    let q = null;
    q = query(
      collection(db, "user"),
      where("category", "==", '2'),
    );
    const querySnapshot = await getDocs(q);
    let index = 0
    querySnapshot.docs.map((doc) => {
      user.push(doc.data() as User);
      user[index]["id"] = doc.id;
      index++
    });
    console.log('getDeliveryUser')

    console.log(user)
    return user;
  };



  /**
 * 顧客の情報(docidユニーク)を取得する
 * @param doc_id 
 * @returns 
 */
  const getCustomerData = async (doc_id: string) => {
    const docRef = doc(db, "customer", doc_id as string);

    try {
      // ドキュメントを取得
      const docSnap = await getDoc(docRef);

      // ドキュメントが存在するか確認
      if (docSnap.exists()) {
        // データを取得
        return docSnap.data() as Customer;
      } else {
        // ドキュメントが存在しない場合の処理
        console.log("No such document! customer");
        return null;
      }
    } catch (error) {
      // エラー処理
      console.error("Error getting document customer :", error);
      return null;
    }

  };


  /**
   * 指定ユーザの指定顧客情報を取得する
   * @param supervisor_id 
   * @returns 
   */
  const getUserCustomer = async (companyId: string | "", customerId: string) => {
    const customer: Customer[] = [];
    let q = null;
    if (companyId == "" || customerId == "") {
      return null
    } else {

      q = query(
        collection(db, "customer"),
        where("companyId", "==", companyId),
        where("customerId", "==", customerId),
      );

    }
    const querySnapshot = await getDocs(q);
    let index = 0
    querySnapshot.docs.map((doc) => {
      customer.push(doc.data() as Customer);
      customer[index]["id"] = doc.id;
      index++
    });
    // TODO:一意にしかならないという想定
    return customer[0];
  };

  /**
 * 指定ユーザの顧客情報（一覧）を取得する
 * @param supervisor_id 
 * @returns 
 */
  const getUserCustomerList = async (companyId: string | "") => {
    const customer: Customer[] = [];
    let q = null;
    if (companyId == "") {
      return null
    } else {
      q = query(
        collection(db, "customer"),
        where("companyId", "==", companyId),
      );
    }
    const querySnapshot = await getDocs(q);
    let index = 0
    querySnapshot.docs.map((doc) => {
      customer.push(doc.data() as Customer);
      customer[index]["id"] = doc.id;
      index++
    });
    return customer;
  };



  /**
   * 顧客情報を登録する.
   * @param customer 
   * @returns 
   */
  const addCustomer = async (customer: Customer) => {
    if (customer == null) {
      return null;
    }
    const docRef = await addDoc(collection(db, "customer"), customer);
    return docRef.id

  };

  /**
 * 案件情報を登録する
 * @param order
 * @returns ドキュメントID
 */
  const addOrder = async (order: Order) => {
    if (order == null) {
      return null;
    }
    const docRef = await addDoc(collection(db, "order"), order);
    return docRef.id

  };

  /**
* 指定ユーザの案件情報を取得する
* @param companyId 
* @returns 
*/
  const getOrderList = async (companyId: string | "") => {
    const order: Order[] = [];
    let q = null;
    if (companyId == "") {
      return null
    } else {
      q = query(
        collection(db, "order"),
        where("companyId", "==", companyId),
        orderBy("state", "asc")
      );
    }
    const querySnapshot = await getDocs(q);
    let index = 0
    querySnapshot.docs.map((doc) => {
      order.push(doc.data() as Order);
      order[index]["id"] = doc.id;
      index++;
    });

    return order;
  };

  /**
* 指定の案件情報(ユニーク)を取得する
* @param doc_id 
* @returns 
*/
  const getOrderData = async (doc_id: string) => {
    const docRef = doc(db, "order", doc_id as string);

    try {
      // ドキュメントを取得
      const docSnap = await getDoc(docRef);

      // ドキュメントが存在するか確認
      if (docSnap.exists()) {
        // データを取得
        return docSnap.data() as Order;
      } else {
        // ドキュメントが存在しない場合の処理
        console.log("No such document! order");
        return null;
      }
    } catch (error) {
      // エラー処理
      console.error("Error getting document order :", error);
      return null;
    }

  };

/**
* 運送引受会社へ依頼された案件情報を取得する
* @param deliveryCompanyId : 運送引受会社のcompanyId(運送引受会社で利用する際の機能)
* @returns 
*/
const getOrderDeliveryList = async (companyId: string | "") => {
  const order: Order[] = [];
  let q = null;
  if (companyId == "") {
    return null
  } else {
    q = query(
      collection(db, "order"),
      where("deliveryCompanyId", "==", companyId),
      orderBy("state", "asc")
    );
  }
  const querySnapshot = await getDocs(q);
  let index = 0
  querySnapshot.docs.map((doc) => {
    order.push(doc.data() as Order);
    order[index]["id"] = doc.id;
    index++;
  });

  return order;
};


  /**
* 案件情報を更新する
* @param user 
* @returns 
*/
  const updateOrder = async (order: Order) => {
    if (order == null) {
      return null;
    }
    const userRef = doc(db, "order", order.id as string);
    await setDoc(userRef, order, { merge: true });
  };


  /**
* 指定ユーザの駐車地情報を取得する
* @param companyId 
* @returns 
*/
  const getParkingList = async (companyId: string | "") => {
    const parking: Parking[] = [];
    let q = null;
    if (companyId == "") {
      return null
    } else {
      q = query(
        collection(db, "parking"),
        where("companyId", "==", companyId),
      );
    }
    const querySnapshot = await getDocs(q);
    let index = 0
    querySnapshot.docs.map((doc) => {
      parking.push(doc.data() as Parking);
      parking[index]["id"] = doc.id;
      index++;
    });

    return parking;
  };


  /**
* 指定の駐車地情報(ユニーク)を取得する
* @param doc_id 
* @returns 
*/
  const getParkingData = async (doc_id: string) => {
    const docRef = doc(db, "parking", doc_id as string);

    try {
      // ドキュメントを取得
      const docSnap = await getDoc(docRef);

      // ドキュメントが存在するか確認
      if (docSnap.exists()) {
        // データを取得
        return docSnap.data() as Parking;
      } else {
        // ドキュメントが存在しない場合の処理
        console.log("No such document! order");
        return null;
      }
    } catch (error) {
      // エラー処理
      console.error("Error getting document order :", error);
      return null;
    }

  };

  /**
 * 駐車地情報を登録する
 * @param parking
 * @returns ドキュメントID
 */
  const addParking = async (parking: Parking) => {
    if (parking == null) {
      return null;
    }
    const docRef = await addDoc(collection(db, "parking"), parking);
    return docRef.id

  };

  /**
* 駐車地情報を更新する
* @param parking 
* @returns 
*/
  const updateParking = async (parking: Parking) => {
    if (parking == null) {
      return null;
    }
    const userRef = doc(db, "parking", parking.id as string);
    await setDoc(userRef, parking, { merge: true });

  };


  /**
* 指定ユーザの保有バスガイド情報を取得する
* @param companyId 
* @returns 
*/
  const getGuideList = async (companyId: string | "") => {
    const guide: Guide[] = [];
    let q = null;
    if (companyId == "") {
      return null
    } else {
      q = query(
        collection(db, "guide"),
        where("companyId", "==", companyId),
      );
    }
    const querySnapshot = await getDocs(q);
    let index = 0
    querySnapshot.docs.map((doc) => {
      guide.push(doc.data() as Guide);
      guide[index]["id"] = doc.id;
      index++;
    });
    return guide;
  };

  /**
* 指定の駐車地情報(ユニーク)を取得する
* @param doc_id 
* @returns 
*/
  const getGuideData = async (doc_id: string) => {
    const docRef = doc(db, "guide", doc_id as string);

    try {
      // ドキュメントを取得
      const docSnap = await getDoc(docRef);

      // ドキュメントが存在するか確認
      if (docSnap.exists()) {
        // データを取得
        return docSnap.data() as Guide;
      } else {
        // ドキュメントが存在しない場合の処理
        console.log("No such document! Guide");
        return null;
      }
    } catch (error) {
      // エラー処理
      console.error("Error getting document order :", error);
      return null;
    }

  };

  /**
 * バスガイド情報を登録する
 * @param guide
 * @returns ドキュメントID
 */
  const addGuide = async (guide: Guide) => {
    if (guide == null) {
      return null;
    }
    const docRef = await addDoc(collection(db, "guide"), guide);
    return docRef.id

  };

  /**
* バスガイド情報を更新する
* @param guide 
* @returns 
*/
  const updateGuide = async (guide: Guide) => {
    if (guide == null) {
      return null;
    }
    const userRef = doc(db, "guide", guide.id as string);
    await setDoc(userRef, guide, { merge: true });

  };


  /**
* 指定ユーザの保有バス運転手情報を取得する
* @param companyId 
* @returns 
*/
  const getDriverList = async (companyId: string | "") => {
    const driver: Driver[] = [];
    let q = null;
    if (companyId == "") {
      return null
    } else {
      q = query(
        collection(db, "driver"),
        where("companyId", "==", companyId),
      );
    }
    const querySnapshot = await getDocs(q);
    let index = 0
    querySnapshot.docs.map((doc) => {
      driver.push(doc.data() as Driver);
      driver[index]["id"] = doc.id;
      index++;
    });
    return driver;
  };

  /**
  * 指定のバス運転手情報(ユニーク)を取得する
  * @param doc_id 
  * @returns 
  */
  const getDriverData = async (doc_id: string) => {
    const docRef = doc(db, "driver", doc_id as string);

    try {
      // ドキュメントを取得
      const docSnap = await getDoc(docRef);

      // ドキュメントが存在するか確認
      if (docSnap.exists()) {
        // データを取得
        return docSnap.data() as Driver;
      } else {
        // ドキュメントが存在しない場合の処理
        console.log("No such document! Driver");
        return null;
      }
    } catch (error) {
      // エラー処理
      console.error("Error getting document Driver :", error);
      return null;
    }

  };

  /**
  * バス運転手情報を登録する
  * @param driver
  * @returns ドキュメントID
  */
  const addDriver = async (driver: Driver) => {
    if (driver == null) {
      return null;
    }
    const docRef = await addDoc(collection(db, "driver"), driver);
    return docRef.id

  };

  /**
  * バス運転手情報を更新する
  * @param guide 
  * @returns 
  */
  const updateDriver = async (driver: Driver) => {
    if (driver == null) {
      return null;
    }
    const userRef = doc(db, "driver", driver.id as string);
    await setDoc(userRef, driver, { merge: true });
  };

  /**
* 指定ユーザの保有バス情報を取得する
* @param companyId 
* @returns 
*/
  const getBusList = async (companyId: string | "") => {
    const bus: Bus[] = [];
    let q = null;
    if (companyId == "") {
      return null
    } else {
      q = query(
        collection(db, "bus"),
        where("companyId", "==", companyId),
      );
    }
    const querySnapshot = await getDocs(q);
    let index = 0
    querySnapshot.docs.map((doc) => {
      bus.push(doc.data() as Bus);
      bus[index]["id"] = doc.id;
      index++;
    });
    return bus;
  };

  /**
  * 指定のバス情報(ユニーク)を取得する
  * @param doc_id 
  * @returns 
  */
  const getBusData = async (doc_id: string) => {
    const docRef = doc(db, "bus", doc_id as string);

    try {
      // ドキュメントを取得
      const docSnap = await getDoc(docRef);

      // ドキュメントが存在するか確認
      if (docSnap.exists()) {
        // データを取得
        return docSnap.data() as Bus;
      } else {
        // ドキュメントが存在しない場合の処理
        console.log("No such document! bus");
        return null;
      }
    } catch (error) {
      // エラー処理
      console.error("Error getting document bus :", error);
      return null;
    }

  };

  /**
  * バス情報を登録する
  * @param bus
  * @returns ドキュメントID
  */
  const addBus = async (bus: Bus) => {
    if (bus == null) {
      return null;
    }
    const docRef = await addDoc(collection(db, "bus"), bus);
    return docRef.id

  };

  /**
  * バス情報を更新する
  * @param bus 
  * @returns 
  */
  const updateBus = async (bus: Bus) => {
    if (bus == null) {
      return null;
    }
    const userRef = doc(db, "bus", bus.id as string);
    await setDoc(userRef, bus, { merge: true });

  };







  /**
   * ユーザ情報を検索取得.
   * @param name 検索条件(前方一致検索)
   * @param myDocId docummentid:指定があった場合、このdocidは含まない
   * @returns 
   */
  const searchUser = async (name: string, myDocId: string) => {
    const user: User[] = [];

    let q = null;
    q = query(collection(db, "user"), orderBy("handleName"), startAt(name), endAt(name + "\uf8ff"));
    const querySnapshot = await getDocs(q);
    let index = 0;
    querySnapshot.docs.map((doc) => {
      const docId = doc.id
      if (docId == myDocId) {
        // console.log("docId:" + docId + "/ myDocId:" + myDocId)
        return
      } else {
        user.push(doc.data() as User);
        user[index]["id"] = docId;
      }
      index++;
    });

    return user;
  };

  /**
   * 指定ユーザのポイントのやり取り情報を取得
   * @param operateUserId ：ポイントの受け渡しユーザ
   * @param acceptUserId ：ポイントの受け取りユーザ
   * @returns 
   */
  const getExchangeInfo = async (operateUserId: string, acceptUserId: string, myComment: boolean) => {
    const exchangeInfo: ExchangeInfo[] = [];

    let q = null;
    q = query(collection(db, "exchangeInfo"), where("operateUserId", "==", operateUserId), where("acceptUserId", "==", acceptUserId), orderBy("exchangeTimestamp"));
    const querySnapshot = await getDocs(q);
    let index = 0;
    querySnapshot.docs.map((doc) => {
      exchangeInfo.push(doc.data() as ExchangeInfo);
      exchangeInfo[index]["id"] = doc.id;
      const date = doc.data().exchangeTimestamp.toDate();
      const exchangeDate = dayjs(date).format(
        "YYYY/MM/DD"
      );
      const exchangeHour = dayjs(date).format(
        "HH:mm"
      );

      exchangeInfo[index]["dispDate"] = exchangeDate;
      exchangeInfo[index]["dispHour"] = exchangeHour;
      // ログイン(操作)ユーザのコメント(true)はLINEのように右端で表示するためのフラグ
      exchangeInfo[index]["myComment"] = myComment;

      index++;
    });
    return exchangeInfo;
  };

  /**
   * AWSOMEの制限(1日1回まで)チェック
   * @param operateUserId 
   * @returns 
   */
  const isExchange = async (operateUserId: string) => {
    const today = Timestamp.now().toDate()
    const nowDate = dayjs(today).format("YYYY/MM/DD");
    let isExchange = false;
    let q = null;
    q = query(collection(db, "exchangeInfo"), where("operateUserId", "==", operateUserId), where("exchangeDate", "==", nowDate));
    const querySnapshot = await getDocs(q);
    querySnapshot.docs.map((doc) => {
      const exchangeDate = doc.data().exchangeDate;
      if (exchangeDate == nowDate) {
        isExchange = true;
        return;
      }
    });
    return isExchange;
  };

  /**
 * ポイントのやり取り情報を登録する
 * @param exchangeInfo 
 * @returns ドキュメントID
 */
  const addExchangeInfo = async (exchangeInfo: ExchangeInfo) => {
    if (exchangeInfo == null) {
      return null;
    }
    const docRef = await addDoc(collection(db, "exchangeInfo"), exchangeInfo);
    return docRef.id

  };




  return {
    db,
    getUser,
    getUserData,
    isUserExists,
    updateUser,
    getCustomerData,
    getUserCustomer,
    getUserCustomerList,
    addCustomer,
    addUser,
    getDeliveryUser,
    getOrderList,
    getOrderData,
    getOrderDeliveryList,
    addOrder,
    updateOrder,
    getParkingList,
    getParkingData,
    addParking,
    updateParking,
    getGuideList,
    getGuideData,
    addGuide,
    updateGuide,
    getDriverList,
    getDriverData,
    addDriver,
    updateDriver,
    getBusList,
    getBusData,
    addBus,
    updateBus,
    searchUser,
    getExchangeInfo,
    isExchange,
    addExchangeInfo,
  };
};
