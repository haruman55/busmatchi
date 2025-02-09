import type {
  FieldValue
  ,
  Timestamp
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
  deleteDoc
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
  vehicleTypeLiftAmount: number;
  vehicleTypeMediumAmount: number;
  vehicleTypeSmallAmount: number;
  vehicleTypeMicroAmount: number;
  deliveryLocation: string;
  dispatchDate: string;
  dispatchTimeHour: number;
  dispatchTimeMinute: number;
  departureTimeHour: number;
  departureTimeMinute: number;
  itinerary1Top: string;
  itinerary1Bottom: string;
  timeschedule1Top: string;
  timeschedule1Bottom: string;
  accommodations1: string;
  accommodationsTel1: string;
  accommodationsAddr1: string;
  endDate: string;
  endingTimeHour: number;
  endingTimeMinute: number;
  terminalLocation: string;
  // 申込対象の顧客のdocid
  customerId: string;
  // 申込対象の運送引受会社のdocid
  deliveryCompanyId: string;
  // 運送引受会社の設定した配車情報のdocid
  dispatchId: string;
  // 運送引受会社の案件担当者
  counterPersonMain: string;
  counterPersonSub: string;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
};

// 案件情報-配車情報オブジェクト
type Dispatch = {
  id: string;
  orderId: string;
  busList: string[]
  driverList: string[]
  guideList: string[]
  reservationFrom: Timestamp | FieldValue;
  reservationTo: Timestamp | FieldValue;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;

}

// バス、運転手、ガイドの配車、出勤予約管理
type Reservation = {
  id: string;
  // TODO:仕様で固定 0:バス 1:運転手 2:ガイド
  category: string;
  // 各種バス、運転手、ガイドのDocId
  itemId: string;
  title: string;
  reservationFrom: Timestamp | FieldValue;
  reservationTo: Timestamp | FieldValue;
  // 案件に紐付く予約の場合は案件IDが設定される
  orderId: string;
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
  // バスが配置されている駐車場のdocid
  parkingId: string;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
};






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
   * ユーザ情報の取得（companyId指定でのユニーク）
   * @param companyId 
   * @returns 
   */
  const getUserCompanyKey = async (companyId: string) => {
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
    let index = 0
    querySnapshot.docs.map((doc) => {
      user.push(doc.data() as User);
      user[index]["id"] = doc.id;
      index++
    });
    // 1件しか存在しない想定
    return user[0];
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
  * @param state : 取得対象の案件のステータス情報
  * @returns 
  */
  const getOrderDeliveryList = async (companyId: string | "", state: string[]) => {
    const order: Order[] = [];
    let q = null;
    if (companyId == "") {
      return null
    } else {
      q = query(
        collection(db, "order"),
        where("deliveryCompanyId", "==", companyId),
        where("state", "in", state),
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
* 指定運送引受会社が請け負っている配車情報の一覧を取得する(TODO:未使用だと思う)
* @param companyId 
* @returns 
*/
  const getDispatchList = async (companyId: string | "") => {
    const dispatch: Dispatch[] = [];
    let q = null;
    if (companyId == "") {
      return null
    } else {
      q = query(
        collection(db, "dispatch"),
        where("companyId", "==", companyId),
      );
    }
    const querySnapshot = await getDocs(q);
    let index = 0
    querySnapshot.docs.map((doc) => {
      dispatch.push(doc.data() as Dispatch);
      dispatch[index]["id"] = doc.id;
      index++;
    });
    return dispatch;
  };

  /**
  * 指定の配車情報(ユニーク)を取得する
  * @param doc_id 
  * @returns 
  */
  const getDispatchData = async (doc_id: string) => {
    const docRef = doc(db, "dispatch", doc_id as string);

    try {
      // ドキュメントを取得
      const docSnap = await getDoc(docRef);

      // ドキュメントが存在するか確認
      if (docSnap.exists()) {
        // データを取得
        return docSnap.data() as Dispatch;
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
  * 配車情報を登録する
  * @param dispatch
  * @returns ドキュメントID
  */
  const addDispatch = async (dispatch: Dispatch) => {
    if (dispatch == null) {
      return null;
    }
    const docRef = await addDoc(collection(db, "dispatch"), dispatch);
    return docRef.id

  };

  /**
  * 配車情報を更新する
  * @param dispatch 
  * @returns 
  */
  const updateDispatch = async (dispatch: Dispatch) => {
    if (dispatch == null) {
      return null;
    }
    const userRef = doc(db, "dispatch", dispatch.id as string);
    await setDoc(userRef, dispatch, { merge: true });

  };

    /**
   * 配車情報を削除する.
   * @param docid 
   */
    const deleteDispatch = async (docid: string) => {
      // 指定データの削除
      await deleteDoc(doc(db, "dispatch", docid));
      console.log(`ドキュメント ${docid} が削除されました`);
  
    };
  

    /**
     * 指定案件に紐付くリソースの登録情報の一覧を取得する.
     * @param companyId 
     * @returns 
     */
    const getReservationList = async (orderId: string | "") => {
      const reservation: Reservation[] = [];
      let q = null;
      if (orderId == "") {
        return null
      } else {
        q = query(
          collection(db, "reservation"),
          where("orderId", "==", orderId),
        );
      }
      const querySnapshot = await getDocs(q);
      let index = 0
      querySnapshot.docs.map((doc) => {
        reservation.push(doc.data() as Reservation);
        reservation[index]["id"] = doc.id;
        index++;
      });
      return reservation;
    };
  
  

  /**
  * 予約情報を登録する
  * @param busReservation
  * @returns ドキュメントID
  */
  const addReservation = async (reservation: Reservation) => {
    if (reservation == null) {
      return null;
    }
    const docRef = await addDoc(collection(db, "reservation"), reservation);
    return docRef.id

  };

  /**
   * 予約情報を削除する.
   * @param docid 
   */
  const deleteReservation = async (docid: string) => {
    // 指定データの削除
    await deleteDoc(doc(db, "reservation", docid));
    console.log(`ドキュメント ${docid} が削除されました`);

  };

  /**
   * 案件登録に紐付く期間での、配車可能なリソースの予約状況を検索する
   * @param category 
   * @param itemId 
   * @param reservationFrom 
   * @param reservationTo 
   * @returns 
   */
  const searchReservation = async (category: string, itemId: string, reservationFrom: Timestamp, reservationTo: Timestamp) => {

    const reservationFromArray: Reservation[] = [];
    const reservationToArray: Reservation[] = [];

    // reservationFrom 基準でのデータ取得
    let qFrom = null;
    qFrom = query(
      collection(db, "reservation"),
      where("category", "==", category),
      where("itemId", "==", itemId),
      orderBy("reservationFrom"),
      startAt(reservationFrom),
      endAt(reservationTo)
    );
    const querySnapshotFromBase = await getDocs(qFrom);

    // reservationTo 基準でのデータ取得
    let qTo = null;
    qTo = query(
      collection(db, "reservation"),
      where("category", "==", category),
      where("itemId", "==", itemId),
      where("reservationFrom", "<=", reservationFrom),
      orderBy("reservationTo"),
      startAt(reservationFrom),
    );
    const querySnapshotToBase = await getDocs(qTo);

    let index = 0;
    querySnapshotFromBase.docs.map((doc) => {
      const docId = doc.id
      reservationFromArray.push(doc.data() as Reservation);
      reservationFromArray[index]["id"] = docId;
      index++;
    });

    index = 0;
    querySnapshotToBase.docs.map((doc) => {
      const docId = doc.id
      reservationToArray.push(doc.data() as Reservation);
      reservationToArray[index]["id"] = docId;
      index++;
    });

    // TODO:From/To基点で取得した情報をマージ(ChatGPT)
    const mergedMap = new Map();
    // From基点 のデータをマップに登録
    reservationFromArray.forEach(item => mergedMap.set(item.id, item));

    // TO基点 のデータで上書きまたは追加
    reservationToArray.forEach(item => mergedMap.set(item.id, item));

    // マップを配列に変換
    const reservation = Array.from(mergedMap.values());

    return reservation;
  };


  /**
   * 指定日時に該当する予約開始日時(reservationFrom)を検索する
   * @param busId 
   * @param reservationDate 
   * @returns 
   */
  const searchReservationFromBase = async (category: string, itemId: string, reservationFrom: Timestamp, reservationTo: Timestamp) => {

    const reservation: Reservation[] = [];

    let q = null;
    q = query(
      collection(db, "reservation"),
      where("category", "==", category),
      where("itemId", "==", itemId),
      orderBy("reservationFrom"),
      startAt(reservationFrom),
      endAt(reservationTo)
    );
    const querySnapshot = await getDocs(q);


    let index = 0;
    querySnapshot.docs.map((doc) => {
      const docId = doc.id
      reservation.push(doc.data() as Reservation);
      reservation[index]["id"] = docId;
      index++;
    });

    return reservation;
  };

  /**  
 * 指定日時に該当する予約終了日時(reservationTo)を検索する：日跨ぎで予約された場合の終了日時基点でのデータ取得
 * @param busId 
 * @param reservationDate 
 * @returns 
 */
  const searchReservationToBase = async (category: string, itemId: string, reservationFrom: Timestamp, reservationTo: Timestamp) => {

    const reservation: Reservation[] = [];

    let q = null;
    q = query(
      collection(db, "reservation"),
      where("category", "==", category),
      where("itemId", "==", itemId),
      where("reservationFrom", "<=", reservationFrom),
      orderBy("reservationTo"),
      startAt(reservationFrom),
    );
    const querySnapshot = await getDocs(q);


    let index = 0;
    querySnapshot.docs.map((doc) => {
      const docId = doc.id
      reservation.push(doc.data() as Reservation);
      reservation[index]["id"] = docId;
      index++;
    });

    return reservation;
  };




  /**
  * 指定の予約情報(ユニーク)を取得する
  * @param doc_id 
  * @returns 
  */
  const getReservationData = async (doc_id: string) => {
    const docRef = doc(db, "reservation", doc_id as string);

    try {
      // ドキュメントを取得
      const docSnap = await getDoc(docRef);

      // ドキュメントが存在するか確認
      if (docSnap.exists()) {
        // データを取得
        return docSnap.data() as Reservation;
      } else {
        // ドキュメントが存在しない場合の処理
        console.log("No such document! Reservation");
        return null;
      }
    } catch (error) {
      // エラー処理
      console.error("Error getting document Reservation :", error);
      return null;
    }

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





  return {
    db,
    getUser,
    getUserData,
    isUserExists,
    getUserCompanyKey,
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
    getDispatchList,
    getDispatchData,
    addDispatch,
    updateDispatch,
    deleteDispatch,
    getReservationList,
    addReservation,
    deleteReservation,
    searchReservationFromBase,
    searchReservationToBase,
    getReservationData,
    searchReservation,
    searchUser,

  };
};
