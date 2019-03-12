import axios from 'axios';
import util from '../../src/common/js/util';

const Base64 = require('js-base64').Base64;
const Message = require('element-ui').Message;
axios.defaults.withCredentials = true;

// 添加一个请求拦截器
axios.interceptors.request.use(
  config => {
    // if (window.sessionStorage.getItem('access-token')) {
    //   config.headers.Authorization = window.sessionStorage.getItem('access-token');
    // }
    const user = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')):null;
    const loginId = user ? user.login_id : null;
    config.headers.AuthorLoginId = Base64.encode(loginId);
    return config
  },
  error => {
    return Promise.reject(error)
  }
);
// 添加一个响应拦截器
axios.interceptors.response.use(function (response) {
  if (typeof response.data.errCode != undefined && response.data.errCode != 0) {
    if (response.data.errCode !="200") {
      Message({
        showClose: true,
        message: response.data.errMsg || '网络有误，请稍后重试',
        type: 'error'
      });
      return Promise.reject(response);
    }
    ;
  }
  if (response.data && response.data.errCode) {
    if (parseInt(response.data.errCode) === 401) {
      this.$router.push("/login")
    }
  }
  return response;
}, function (error) {
  return Promise.reject(error);
});

// let base = 'http://192.168.0.77:8091';
let base = '/api/clouddo-crm';
// let base = '/api';

const POST = (url, params) => {
  return axios.post(`${base}${url}`, params).then(res => res.data)
}

//登录
export const login = params => {
  return POST('/login/login', params)
};
//修改密码
export const updateUserPassword = params => {
  return POST('/userInfo/updateUserPassword', params)
};
//用户管理页面
export const getUserInfoByParam = params => {
  return POST('/userInfo/getUserInfoByParam', params)
};
export const getUserInfoById = params => {
  return POST('/userInfo/getUserInfoById', params)
};
export const insertUserInfo = params => {
  return POST('/userInfo/insertUserInfo', params)
};
export const updateUserInfoById = params => {
  return POST('/userInfo/updateUserInfoById', params)
};
export const deleteUserInfoById = params => {
  return POST('/userInfo/deleteUserInfoById', params)
};
//菜单管理
export const getMenuList = params => {
  return POST('/menu/getMenuList', params)
};
export const insertMenu = params => {
  return POST('/menu/insertMenu', params)
};
export const updateMenuById = params => {
  return POST('/menu/updateMenuById', params)
};
export const deleteMenuById = params => {
  return POST('/menu/deleteMenuById', params)
};

//通道号码对照表
export const getChannelByParam = params => {
  return POST('/channel/getChannelByParam', params)
};
export const insertChannel = params => {
  return POST('/channel/insertChannel', params)
};
export const updateChannelById = params => {
  return POST('/channel/updateChannelById', params)
};
export const deleteChannelById = params => {
  return POST('/channel/deleteChannelById', params)
};
export const getChannelById = params => {
  return POST('/channel/getChannelById', params)
};
export const uploadChannelByParam = params => {
  return POST('/channel/uploadChannelByParam', params)
};
//通道信息


//导入
export const exportExcel = params => {
  return POST('/upload/exportExcel', params)
};

//收款信息
export const getCompanyCollectionByParam = params => {
  return POST('/collection/getCompanyCollectionByParam', params)
};
export const insertCompanyCollection = params => {
  return POST('/collection/insertCompanyCollection', params)
};
export const updateCompanyCollectionById = params => {
  return POST('/collection/updateCompanyCollectionById', params)
};
export const deleteCompanyCollectionById = params => {
  return POST('/collection/deleteCompanyCollectionById', params)
};
export const getCompanyCollectionById = params => {
  return POST('/collection/getCompanyCollectionById', params)
};
export const uploadGatheringByParam = params => {
  return POST('/collection/uploadCollectionByParam', params)
};

//客户号码对照表
export const getCustomerListByParam = params => {
  return POST('/customer/getCustomerListByParam', params)
};
export const insertCustomer = params => {
  return POST('/customer/insertCustomer', params)
};
export const updateCustomerById = params => {
  return POST('/customer/updateCustomerById', params)
};
export const deleteCustomerById = params => {
  return POST('/customer/deleteCustomerById', params)
};
export const getCustomerById = params => {
  return POST('/customer/getCustomerById', params)
};
export const uploadClientTableByParam = params => {
  return POST('/customer/uploadCustomerByParam', params)
};
//客户信息
export const getSalesCustomerByParam = params => {
  return POST('/salesCustomer/getSalesCustomerByParam', params)
};
export const insertSalesCustomer = params => {
  return POST('/salesCustomer/insertSalesCustomer', params)
};
export const updateSalesCustomerById = params => {
  return POST('/salesCustomer/updateSalesCustomerById', params)
};
export const deleteSalesCustomerById = params => {
  return POST('/salesCustomer/deleteSalesCustomerById', params)
};
//线索信息
export const getClueByParam = params => {
  return POST('/clue/getClueByParam', params)
};
export const insertclue = params => {
  return POST('/clue/insertclue', params)
};
export const updateClueById = params => {
  return POST('/clue/updateClueById', params)
};
export const deleteClueById = params => {
  return POST('/clue/deleteClueById', params)
};
export const insertDistributionClue = params => {
  return POST('/clue/insertDistributionClue', params)
};
export const getClueById = params => {
  return POST('/clue/getClueById', params)
};
//线索信息跟踪
export const getSalesClueByParam = params => {
  return POST('/salesClue/getSalesClueByParam', params)
};
export const insertSalesClue = params => {
  return POST('/salesClue/insertSalesClue', params)
};
export const updateSalesClueById = params => {
  return POST('/salesClue/updateSalesClueById', params)
};
export const deleteSalesClueById = params => {
  return POST('/salesClue/deleteSalesClueById', params)
};

//角色管理
export const getRoleInfoByParam = params => {
  return POST('/roleInfo/getRoleInfoByParam', params)
};
export const insertRoleInfo = params => {
  return POST('/roleInfo/insertRoleInfo', params)
};
export const updateRoleInfoById = params => {
  return POST('/roleInfo/updateRoleInfoById', params)
};
export const deleteRoleInfoById = params => {
  return POST('/roleInfo/deleteRoleInfoById', params)
};
export const insertMenuRole = params => {
  return POST('/menu/insertMenuRole', params)//编辑菜单权限
};
export const getMenuListByUserRoleId = params => {
  return POST('/menu/getMenuListByUserRoleId', params)//获取某个角色下拥有的菜单
};

//接入流程

//小水智能
export const getXsznProcessByParam = params => {
  return POST('/xszn/getXsznProcessByParam', params)
};
export const insertXsznProcess = params => {
  return POST('/xszn/insertXsznProcess', params)
};
export const updateXsznProcessById = params => {
  return POST('/xszn/updateXsznProcessById', params)
};
export const deleteXsznProcessById = params => {
  return POST('/xszn/deleteXsznProcessById', params)
};
export const getXsznProcessById = params => {
  return POST('/xszn/getXsznProcessById', params)
};
export const uploadRobotByParam = params => {
  return POST('/xszn/uploadXsznByParam', params)
};

//小水总机pass
export const getZjPaasProcessByParam = params => {
  return POST('/zjpaas/getZjPaasProcessByParam', params)
};
export const insertZjPaasProcess = params => {
  return POST('/zjpaas/insertZjPaasProcess', params)
};
export const updateZjPaasProcessById = params => {
  return POST('/zjpaas/updateZjPaasProcessById', params)
};
export const deleteZjPaasProcessById = params => {
  return POST('/zjpaas/deleteZjPaasProcessById', params)
};
export const getZjPaasProcessById = params => {
  return POST('/zjpaas/getZjPaasProcessById', params)
};
export const uploadSwitchboardByParam = params => {
  return POST('/zjpaas/uploadZjPaasByParam', params)
};


//财务对账信息
export const getReconciliationByParam = params => {
  return POST('/reconciliation/getReconciliationByParam', params)
};
export const insertReconciliation = params => {
  return POST('/reconciliation/insertReconciliation', params)
};
export const updateReconciliationById = params => {
  return POST('/reconciliation/updateReconciliationById', params)
};
export const deleteReconciliationById = params => {
  return POST('/reconciliation/deleteReconciliationById', params)
};
export const uploadReconciliationByParam = params => {
  return POST('/reconciliation/uploadReconciliationByParam', params)
};

//接入流程（合同与发票）
export const getContractProcessByParam = params => {
  return POST('/contract/getContractProcessByParam', params)
};
export const insertContractProcess = params => {
  return POST('/contract/insertContractProcess', params)
};
export const updateContractProcessById = params => {
  return POST('/contract/updateContractProcessById', params)
};
export const deleteContractProcessById = params => {
  return POST('/contract/deleteContractProcessById', params)
};
export const getContractProcessById = params => {
  return POST('/contract/getContractProcessById', params)
};
export const uploadContractByParam = params => {
  return POST('/contract/uploadContractByParam', params)
};

//系统参数管理

export const getSystemParamByParam = params => {
  return POST('/param/getSystemParamByParam', params)
};
export const insertSystemParam = params => {
  return POST('/param/insertSystemParam', params)
};
export const updateSystemParamById = params => {
  return POST('/param/updateSystemParamById', params)
};
export const deleteSystemParamById = params => {
  return POST('/param/deleteSystemParamById', params)
};

//新增提交审核
export const insertProcess = params => {
  return POST('/process/insertProcess', params)
};

//待办事项
export const getProcessByParam = params => {
  return POST('/process/getProcessListByParam', params)
};
export const updateProcessById = params => {
  return POST('/process/updateProcessById', params)
};
export const deleteProcessById = params => {
  return POST('/process/deleteProcessById', params)
};
export const updateReProcessById = params => {
  return POST('/process/updateReProcessById', params)
};

export const getCityById = params => {
  return POST('/city/getCityById', params)
};