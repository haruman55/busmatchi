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
  companyId: string;
  applicant: string;
  emergencyContact: string;
  tourOrganization: string;
  remarks: string;
  customerId: string;
  deliveryCompanyId: string;
};

/** 案件情報を扱うState */
export const useOrderInfo = () => {
  const orderInfo = useState<OrderInfo>('orderInfo', () => ({
    id: '',
    state: '',
    companyId: '',
    applicant: '',
    emergencyContact: '',
    tourOrganization: '',
    remarks: '',
    customerId: '',
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
    emergencyContact: '',
    tourOrganization: '',
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
  dispatchDate: string;
  dispatchTime: string;
  departureTime : string;
  deliveryLocation: string;
  deliveryChoice: string;

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
    dispatchDate:  '',
    dispatchTime:  '',
    departureTime :  '',
    deliveryLocation: '',
    deliveryChoice:  '',

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
    dispatchDate:  '',
    dispatchTime:  '',
    departureTime :  '',
    deliveryLocation: '',
    deliveryChoice:  '',

  };
  return {
    orderDeliveryUserInfo,
  };
};



/**
 * ユーザ操作情報オブジェクト
 * いろんなフラグ持たせる汎用state 
 * */ 
type ActionInfo = {
  // マイページから選択した操作(導線入口)：案件(1)、利用顧客(2)、契約(3)、運送引受会社(4)
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



