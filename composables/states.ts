// ユーザ情報オブジェクト
type UserInfo = {
  id: string;
  category: string;
  companyId: string;
  companyName: string;
  companyAddr: string;
  companyTel: string;
  companyFax: string;
  companyEmail: string;
  // 以降は運送引受会社の設定値
  businessPermitDate: string
  businessPermitNo: string
  businessLicenseArea: string
  // 以降は利用者個人情報
  name: string
  // ログイン時のID
  email: string
  auth: number
  pass: string;
};

/** ユーザ情報を扱うState */
export const useUserInfo = () => {
  const userInfo = useState<UserInfo>('user', () => ({
    id: '',
    category: '',
    companyId: '',
    companyName: '',
    companyAddr: '',
    companyTel: '',
    companyFax: '',
    companyEmail: '',
    businessPermitDate: '',
    businessPermitNo: '',
    businessLicenseArea: '',
    name: '',
    email: '',
    auth: 0,
    pass: '',
  }))

  return {
    userInfo,
    editUserInfo: editUserInfo(userInfo),
    clearUserInfo: clearUserInfo(userInfo),
  }
}

/** ユーザ情報を編集を行うSetter */
const editUserInfo = (userInfo: Ref<UserInfo>) => (editUserInfo: UserInfo) => {
  userInfo.value = editUserInfo
  return {
    userInfo
  }
}


/** ユーザ情報の内容を初期化する */
const clearUserInfo = (userInfo: Ref<UserInfo>) => () => {
  userInfo.value = {
    id: '',
    category: '',
    companyId: '',
    companyName: '',
    companyAddr: '',
    companyTel: '',
    companyFax: '',
    companyEmail: '',
    businessPermitDate: '',
    businessPermitNo: '',
    businessLicenseArea: '',
    name: '',
    email: '',
    auth: 0,
    pass: '',
  }
  return {
    userInfo
  }
}

// 顧客情報オブジェクト
type CustomerInfo = {
  id: string;
  customerId: string;
  customerName: string;
  customerAddr: string;
  customerTel: string;
  customerFax: string;
  customerMail: string;
  customerXXX: string;
  companyId: string,

};

/** 顧客情報を扱うState */
export const useCustomerInfo = () => {
  const customerInfo = useState<CustomerInfo>('customer', () => ({
    id: '',
    customerId: '',
    customerName: '',
    customerAddr: '',
    customerTel: '',
    customerFax: '',
    customerMail: '',
    customerXXX: '',
    // TODO:顧客：ユーザ(申込会社)= 1:N もあり得る 
    companyId: '',
  }))

  return {
    customerInfo,
    editCustomerInfo: editCustomerInfo(customerInfo),
    clearCustomerInfo: clearCustomerInfo(customerInfo),
  }
}

/** 顧客情報の編集を行うSetter */
const editCustomerInfo = (customerInfo: Ref<CustomerInfo>) => (editCustomerInfo: CustomerInfo) => {
  customerInfo.value = editCustomerInfo
  return {
    customerInfo
  }
}


/** 顧客情報の内容を初期化する */
const clearCustomerInfo = (customerInfo: Ref<CustomerInfo>) => () => {
  customerInfo.value = {
    id: '',
    customerId: '',
    customerName: '',
    customerAddr: '',
    customerTel: '',
    customerFax: '',
    customerMail: '',
    customerXXX: '',
    companyId: '',

  }
  return {
    customerInfo
  }
}

// 申込顧客情報オブジェクト
type ApplicantCustomerInfo = {
  id: string;
  customerId: string;
  customerName: string;
  customerAddr: string;
  customerTel: string;
  customerFax: string;
  customerMail: string;
  customerXXX: string;
  companyId: string,

};

/** 申込顧客情報を扱うState */
export const useApplicantCustomerInfo = () => {
  const applicantCustomerInfo = useState<ApplicantCustomerInfo>('applicantCustomer', () => ({
    id: '',
    customerId: '',
    customerName: '',
    customerAddr: '',
    customerTel: '',
    customerFax: '',
    customerMail: '',
    customerXXX: '',
    // TODO:顧客：ユーザ(申込会社)= 1:N もあり得る 
    companyId: '',
  }))

  return {
    applicantCustomerInfo,
    editApplicantCustomerInfo: editApplicantCustomerInfo(applicantCustomerInfo),
    clearApplicantCustomerInfo: clearApplicantCustomerInfo(applicantCustomerInfo),
  }
}

/** 申込顧客情報の編集を行うSetter */
const editApplicantCustomerInfo = (applicantCustomerInfo: Ref<ApplicantCustomerInfo>) => (editApplicantCustomerInfo: ApplicantCustomerInfo) => {
  applicantCustomerInfo.value = editApplicantCustomerInfo
  return {
    applicantCustomerInfo
  }
}


/** 申込顧客情報の内容を初期化する */
const clearApplicantCustomerInfo = (applicantCustomerInfo: Ref<ApplicantCustomerInfo>) => () => {
  applicantCustomerInfo.value = {
    id: '',
    customerId: '',
    customerName: '',
    customerAddr: '',
    customerTel: '',
    customerFax: '',
    customerMail: '',
    customerXXX: '',
    companyId: '',

  }
  return {
    applicantCustomerInfo
  }
}



// 案件情報オブジェクト
type OrderInfo = {
  id: string;
  state: string;
  // 申込会社ID(ログインIDと一緒)
  companyId: string;
  applicant: string;
  applicantCompanyName: string;
  applicantCompanyTel: string;
  applicantCompanyFax: string;
  applicantCompanyAddr: string;
  applicantCompanyEmail: string;
  emergencyContact: string;
  tourOrganization: string;
  customerRemarks: string;
  passengers: number;
  vehicleTypeLiftAmount: number;
  vehicleTypeMediumAmount: number;
  vehicleTypeSmallAmount: number;
  vehicleTypeMicroAmount: number;
  dispatchDate: string;
  dispatchTime: string;
  dispatchTimeHour: number;
  dispatchTimeMinute: number;
  departureTime: string;
  departureTimeHour: number;
  departureTimeMinute: number;
  deliveryLocation: string;
  selectPayment: string;
  selectPaymentOther: string;
  selectDiscount: [];
  selectDiscountOther: string;
  orderAmount: string;
  actualCost: string;
  paymentDueDate: string;
  specialTerms: string;
  remarks: string;
  // 顧客ID(docid)
  customerId: string;
  // 運送引受会社ID(docid)
  deliveryCompanyId: string;
};

/** 案件情報を扱うState */
export const useOrderInfo = () => {
  const orderInfo = useState<OrderInfo>('orderInfo', () => ({
    id: '',
    state: '',
    companyId: '',
    applicant: '',
    applicantCompanyName: '',
    applicantCompanyTel: '',
    applicantCompanyFax: '',
    applicantCompanyAddr: '',
    applicantCompanyEmail: '',
    emergencyContact: '',
    tourOrganization: '',
    customerRemarks: '',
    passengers: 0,
    vehicleTypeLiftAmount: 0,
    vehicleTypeMediumAmount: 0,
    vehicleTypeSmallAmount: 0,
    vehicleTypeMicroAmount: 0,
    dispatchDate: '',
    dispatchTime: '',
    dispatchTimeHour: 0,
    dispatchTimeMinute: 0,
    departureTime: '',
    departureTimeHour: 0,
    departureTimeMinute: 0,
    deliveryLocation: '',
    selectPayment: '',
    selectPaymentOther: '',
    selectDiscount: [],
    selectDiscountOther: '',
    orderAmount: '',
    actualCost: '',
    paymentDueDate: '',
    specialTerms: '',
    remarks: '',

    // 顧客ID
    customerId: '',
    // 運送引受会社ID
    deliveryCompanyId: '',
  }))

  return {
    orderInfo,
    editOrderInfo: editOrderInfo(orderInfo),
    clearOrderInfo: clearOrderInfo(orderInfo),
  }
}

/** 案件情報の編集を行うSetter */
const editOrderInfo = (orderInfo: Ref<OrderInfo>) => (editOrderInfo: OrderInfo) => {
  orderInfo.value = editOrderInfo
  return {
    orderInfo
  }
}


/** 案件情報の内容を初期化する */
const clearOrderInfo = (orderInfo: Ref<OrderInfo>) => () => {
  orderInfo.value = {
    id: '',
    state: '',
    companyId: '',
    applicant: '',
    applicantCompanyName: '',
    applicantCompanyTel: '',
    applicantCompanyFax: '',
    applicantCompanyAddr: '',
    applicantCompanyEmail: '',
    emergencyContact: '',
    tourOrganization: '',
    customerRemarks: '',
    passengers: 0,
    vehicleTypeLiftAmount: 0,
    vehicleTypeMediumAmount: 0,
    vehicleTypeSmallAmount: 0,
    vehicleTypeMicroAmount: 0,
    dispatchDate: '',
    dispatchTime: '',
    dispatchTimeHour: 0,
    dispatchTimeMinute: 0,
    departureTime: '',
    departureTimeHour: 0,
    departureTimeMinute: 0,
    deliveryLocation: '',
    selectPayment: '',
    selectPaymentOther: '',
    selectDiscount: [],
    selectDiscountOther: '',
    orderAmount: '',
    actualCost: '',
    paymentDueDate: '',
    specialTerms: '',
    remarks: '',
    customerId: '',
    deliveryCompanyId: '',

  }
  return {
    orderInfo
  }
}

// 運送引受会社への申込情報オブジェクト
type OrderDeliveryUserInfo = {
  id: string;
  companyId: string;
  companyName: string;
  companyAddr: string;
  companyTel: string;
  companyFax: string;
  companyEmail: string;
  // TODO:(いらない？)運送引受会社の検索方法：画面入力 or Map選択可否
  deliveryChoice: string;
  counterPersonMain: string;
  counterPersonSub: string;

};

/** 運送引受会社への申込情報を扱うState */
export const useOrderDeliveryUserInfo = () => {
  const orderDeliveryUserInfo = useState<OrderDeliveryUserInfo>("orderDeliveryUserInfo", () => ({
    id: "",
    companyId: "",
    companyName: "",
    companyAddr: "",
    companyTel: "",
    companyFax: "",
    companyEmail: "",
    deliveryChoice: '',
    counterPersonMain: '',
    counterPersonSub: '',

  }));

  return {
    orderDeliveryUserInfo,
    editOrderDeliveryUserInfo: editOrderDeliveryUserInfo(orderDeliveryUserInfo),
    clearOrderDeliveryUserInfo: clearOrderDeliveryUserInfo(orderDeliveryUserInfo),
  };
};

/** 運送引受会社への申込情報の編集を行うSetter */
const editOrderDeliveryUserInfo =
  (orderDeliveryUserInfo: Ref<OrderDeliveryUserInfo>) => (editOrderDeliveryUserInfo: OrderDeliveryUserInfo) => {
    orderDeliveryUserInfo.value = editOrderDeliveryUserInfo;
    return {
      orderDeliveryUserInfo,
    };
  };

/** 運送引受会社への申込情報の内容を初期化する */
const clearOrderDeliveryUserInfo = (orderDeliveryUserInfo: Ref<OrderDeliveryUserInfo>) => () => {
  orderDeliveryUserInfo.value = {
    id: "",
    companyId: "",
    companyName: "",
    companyAddr: "",
    companyTel: "",
    companyFax: "",
    companyEmail: "",
    deliveryChoice: '',
    counterPersonMain: '',
    counterPersonSub: '',

  };
  return {
    orderDeliveryUserInfo,
  };
};

// 案件情報-運行情報情報オブジェクト
type OrderOperationInfo = {
  id: string;
  operatingDate: string;
  itinerary1Top: string;
  itinerary1Bottom: string;
  timeschedule1Top: string;
  timeschedule1Bottom: string;
  accommodations1: string;
  accommodationsTel1: string;
  accommodationsAddr1: string;
  endDate: string;
  endingTime: string;
  endingTimeHour: number;
  endingTimeMinute: number;
  terminalLocation: string;

}

/** 案件情報-運行情報を扱うState */
export const useOrderOperationInfo = () => {
  const orderOperationInfo = useState<OrderOperationInfo>("orderOperationInfo", () => ({
    id: '',
    operatingDate: '',
    itinerary1Top: '',
    itinerary1Bottom: '',
    timeschedule1Top: '',
    timeschedule1Bottom: '',
    accommodations1: '',
    accommodationsTel1: '',
    accommodationsAddr1: '',
    endDate: '',
    endingTime: '',
    endingTimeHour: 0,
    endingTimeMinute: 0,
    terminalLocation: '',

  }));

  return {
    orderOperationInfo,
    editOrderOperationInfo: editOrderOperationInfo(orderOperationInfo),
    clearOrderOperationInfo: clearOrderOperationInfo(orderOperationInfo),
  };
};

/** 案件情報-運行情報情報の編集を行うSetter */
const editOrderOperationInfo =
  (orderOperationInfo: Ref<OrderOperationInfo>) => (editOrderOperationInfo: OrderOperationInfo) => {
    orderOperationInfo.value = editOrderOperationInfo;
    return {
      orderOperationInfo,
    };
  };

/** 案件情報-運行情報情報の内容を初期化する */
const clearOrderOperationInfo = (orderOperationInfo: Ref<OrderOperationInfo>) => () => {
  orderOperationInfo.value = {
    id: '',
    operatingDate: '',
    itinerary1Top: '',
    itinerary1Bottom: '',
    timeschedule1Top: '',
    timeschedule1Bottom: '',
    accommodations1: '',
    accommodationsTel1: '',
    accommodationsAddr1: '',
    endDate: '',
    endingTime: '',
    endingTimeHour: 0,
    endingTimeMinute: 0,
    terminalLocation: '',

  };
  return {
    orderOperationInfo,
  };
};


// 案件情報-配車情報オブジェクト
type DispatchInfo = {
  id: string;
  // TODO:配車は案件に紐付くからcompanyIdはいらないかも
  companyId: string;
  orderId: string;
  busList: []
  driverList: []
  guideList: []

}

/** 案件情報-配車情報を扱うState */
export const useDispatchInfo = () => {
  const dispatchInfo = useState<DispatchInfo>("dispatchInfo", () => ({
    id: '',
    companyId: '',
    orderId: '',
    busList: [],
    driverList: [],
    guideList: [],

  }));

  return {
    dispatchInfo,
    editDispatchInfo: editDispatchInfo(dispatchInfo),
    clearDispatchInfo: clearDispatchInfo(dispatchInfo),
  };
};

/** 案件情報-配車情報の編集を行うSetter */
const editDispatchInfo =
  (dispatchInfo: Ref<DispatchInfo>) => (editDispatchInfo: DispatchInfo) => {
    dispatchInfo.value = editDispatchInfo;
    return {
      dispatchInfo,
    };
  };

/** 案件情報-配車情報の内容を初期化する */
const clearDispatchInfo = (dispatchInfo: Ref<DispatchInfo>) => () => {
  dispatchInfo.value = {
    id: '',
    companyId: '',
    orderId: '',
    busList: [],
    driverList: [],
    guideList: [],
  };
  return {
    dispatchInfo,
  };
};



/**
 * ユーザ操作情報オブジェクト
 * いろんなフラグ持たせる汎用state 
 * */
type ActionInfo = {
  // マイページから選択した操作(導線入口)：1
  act: string;
};
/** ユーザーの操作情報を扱うState */
export const useAction = () => {
  const actionInfo = useState<ActionInfo>("action", () => ({
    act: "",
  }));

  return {
    actionInfo,
    editActionInfo: editActionInfo(actionInfo),
    clearActionInfo: clearActionInfo(actionInfo),
  };
};

/** ユーザー操作情報の集を行うSetter */
const editActionInfo =
  (actionInfo: Ref<ActionInfo>) => (editActionInfo: ActionInfo) => {
    actionInfo.value = editActionInfo;
    return {
      actionInfo,
    };
  };

/** ユーザーの操作情報の内容を初期化する */
const clearActionInfo = (actionInfo: Ref<ActionInfo>) => () => {
  actionInfo.value = {
    act: "",
  };
  return {
    actionInfo,
  };
};

// 運転手情報オブジェクト
type DriverInfo = {
  id: string;
  companyId: string;
  driverName: string;
  driverNameKana: string;
  contact: string;
  remarks: string;
  schedule: [{ orderId: string, reservationTo: string, reservationFrom: string }];
};

/** 運転手情報を扱うState */
export const useDriverInfo = () => {
  const driverInfo = useState<DriverInfo>('driver', () => ({
    id: '',
    companyId: '',
    driverName: '',
    driverNameKana: '',
    contact: '',
    remarks: '',
    schedule: [{ orderId: "", reservationTo: "", reservationFrom: "" }],

  }))

  return {
    driverInfo,
    editDriverInfo: editDriverInfo(driverInfo),
    clearDriverInfo: clearDriverInfo(driverInfo),
  }
};

/** 運転手情報を編集を行うSetter */
const editDriverInfo = (driverInfo: Ref<DriverInfo>) => (editDriverInfo: DriverInfo) => {
  driverInfo.value = editDriverInfo
  return {
    driverInfo
  }
};


/** 運転手情報の内容を初期化する */
const clearDriverInfo = (driverInfo: Ref<DriverInfo>) => () => {
  driverInfo.value = {
    id: '',
    companyId: '',
    driverName: '',
    driverNameKana: '',
    contact: '',
    remarks: '',
    schedule: [{ orderId: "", reservationTo: "", reservationFrom: "" }],
  }
  return {
    driverInfo
  }
};


// バスガイド情報オブジェクト
type GuideInfo = {
  id: string;
  companyId: string;
  guideName: string;
  guideNameKana: string;
  contact: string;
  remarks: string;
  schedule: [{ orderId: string, reservationTo: string, reservationFrom: string }];
};

/** バスガイド情報を扱うState */
export const useGuideInfo = () => {
  const guideInfo = useState<GuideInfo>('guide', () => ({
    id: '',
    companyId: '',
    guideName: '',
    guideNameKana: '',
    contact: '',
    remarks: '',
    schedule: [{ orderId: "", reservationTo: "", reservationFrom: "" }],
  }))

  return {
    guideInfo,
    editGuideInfo: editGuideInfo(guideInfo),
    clearGuideInfo: clearGuideInfo(guideInfo),
  }
};

/** バスガイド情報を編集を行うSetter */
const editGuideInfo = (guideInfo: Ref<GuideInfo>) => (editGuideInfo: GuideInfo) => {
  guideInfo.value = editGuideInfo
  return {
    guideInfo
  }
};


/** バスガイド情報の内容を初期化する */
const clearGuideInfo = (guideInfo: Ref<GuideInfo>) => () => {
  guideInfo.value = {
    id: '',
    companyId: '',
    guideName: '',
    guideNameKana: '',
    contact: '',
    remarks: '',
    schedule: [{ orderId: "", reservationTo: "", reservationFrom: "" }],
  }
  return {
    guideInfo
  }
};

// 駐車場情報オブジェクト
type ParkingInfo = {
  id: string;
  companyId: string;
  parking: string;
  parkingAddr: string;
  remarks: string;

};

/** 駐車場情報を扱うState */
export const useParkingInfo = () => {
  const parkingInfo = useState<ParkingInfo>('parking', () => ({
    id: '',
    companyId: '',
    parking: '',
    parkingAddr: '',
    remarks: '',
  }))

  return {
    parkingInfo,
    editParkingInfo: editParkingInfo(parkingInfo),
    clearParkingInfo: clearParkingInfo(parkingInfo),
  }
};

/** 駐車場情報を編集を行うSetter */
const editParkingInfo = (parkingInfo: Ref<ParkingInfo>) => (editParkingInfo: ParkingInfo) => {
  parkingInfo.value = editParkingInfo
  return {
    parkingInfo
  }
};


/** 駐車場情報の内容を初期化する */
const clearParkingInfo = (parkingInfo: Ref<ParkingInfo>) => () => {
  parkingInfo.value = {
    id: '',
    companyId: '',
    parking: '',
    parkingAddr: '',
    remarks: '',
  }
  return {
    parkingInfo
  }
};

// バス情報オブジェクト
type BusInfo = {
  id: string;
  companyId: string;
  vehicleNo: string;
  vehicleType: string;
  remarks: string;
  // バスが配置されている駐車場のdocid
  parkingId: string;
  schedule: [{ orderId: string, reservationTo: string, reservationFrom: string }];

};

/** バス情報を扱うState */
export const useBusInfo = () => {
  const busInfo = useState<BusInfo>('bus', () => ({
    id: '',
    companyId: '',
    vehicleNo: '',
    vehicleType: '',
    remarks: '',
    parkingId: '',
    schedule: [{ orderId: "", reservationTo: "", reservationFrom: "" }],

  }))

  return {
    busInfo,
    editBusInfo: editBusInfo(busInfo),
    clearBusInfo: clearBusInfo(busInfo),
  }
};

/** バス情報を編集を行うSetter */
const editBusInfo = (busInfo: Ref<BusInfo>) => (editBusInfo: BusInfo) => {
  busInfo.value = editBusInfo
  return {
    busInfo
  }
};


/** バス情報の内容を初期化する */
const clearBusInfo = (busInfo: Ref<BusInfo>) => () => {
  busInfo.value = {
    id: '',
    companyId: '',
    vehicleNo: '',
    vehicleType: '',
    remarks: '',
    parkingId: '',
    schedule: [{ orderId: "", reservationTo: "", reservationFrom: "" }],
  }
  return {
    busInfo
  }
};

// 利用者登録されたユーザ(メンバー)情報オブジェクト
type MemberInfo = {
  id: string;
  category: string;
  companyId: string;
  companyName: string;
  companyAddr: string;
  companyTel: string;
  companyFax: string;
  companyEmail: string;
  // 以降は運送引受会社の設定値
  businessPermitDate: string
  businessPermitNo: string
  businessLicenseArea: string
  // 以降は利用者個人情報
  name: string
  // ログイン時のID
  email: string
  auth: number
  pass: string;

};

/** 利用者登録されたユーザ(メンバー)情報を扱うState */
export const useMemberInfo = () => {
  const memberInfo = useState<MemberInfo>('member', () => ({
    id: '',
    category: '',
    companyId: '',
    companyName: '',
    companyAddr: '',
    companyTel: '',
    companyFax: '',
    companyEmail: '',
    businessPermitDate: '',
    businessPermitNo: '',
    businessLicenseArea: '',
    name: '',
    email: '',
    auth: 0,
    pass: '',
  }))

  return {
    memberInfo,
    editMemberInfo: editMemberInfo(memberInfo),
    clearMemberInfo: clearMemberInfo(memberInfo),
  }
}

/** 利用者登録されたユーザ(メンバー)情報の編集を行うSetter */
const editMemberInfo = (memberInfo: Ref<MemberInfo>) => (editMemberInfo: MemberInfo) => {
  memberInfo.value = editMemberInfo
  return {
    memberInfo
  }
}


/** 利用者登録されたユーザ(メンバー)情報の内容を初期化する */
const clearMemberInfo = (memberInfo: Ref<MemberInfo>) => () => {
  memberInfo.value = {
    id: '',
    category: '',
    companyId: '',
    companyName: '',
    companyAddr: '',
    companyTel: '',
    companyFax: '',
    companyEmail: '',
    businessPermitDate: '',
    businessPermitNo: '',
    businessLicenseArea: '',
    name: '',
    email: '',
    auth: 0,
    pass: '',
  }
  return {
    memberInfo
  }
}
