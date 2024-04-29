import request from './request'
import { API } from 'apis'

/**
 * 示例接口及测试接口start
 */

// 示例接口-get
export const getPetInfo = (params: API.PetInfoParams) => {
  return request.get<any, API.Response<API.PetInfoRes>, API.PetInfoParams>(
    'mytest/console/api/pet/',
    {
      params,
    },
  )
}

// 示例接口-post
export const createPet = (data: API.CreatePetParams) => {
  return request.post<any, API.Response<API.PetInfoRes>, API.CreatePetParams>(
    'mytest/console/api/pet',
    { ...data },
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
  )
}

// 示例接口-get
export const getNumberList = () => {
  return request.get<any, API.Response<number[]>, API.PetInfoParams>(
    'console/api/customer/zjhtest_get/',
  )
}

/**
 * 示例接口及测试接口end
 */

export const loginInit = () => {
  return request.post<any, API.Response<any>, any>('hmc/init', {})
}

// 登陆
export const login = () => {
  return request.post<any, API.Response<any>, any>(
    'console/api/account/login',
    {
      // account: 'duanlangjd@126.com',
      // password: 'yanzhi2010',
      // account: '18616200024@163.com',
      // password: 'sumeng',
      account: '514030829@qq.com',
      password: 'yanzhi2010',
      //
    },
  )
}

// 获取用户信息
export const getInfo = () => {
  const url = `/console/api/info/getinfo?tim=${Math.random()}`
  return request.get<any, API.GetInfoRes, any>(url, {})
}

// 获取用户信息
export const getNoticeList = (data: API.GetNoticeListParams) => {
  const url = `/console/api/notification/get_notification`
  const tim = Math.random() + ''
  return request.post<any, API.GetNoticeListRes, API.GetNoticeListParams>(url, {
    ...data,
    tim,
  })
}

// 删除通知
export const delNotice = (data: { id: string }) => {
  const url = `/console/api/notification/clear`
  const tim = Math.random() + ''
  return request.post<any, any, { id: string; tim: string }>(url, {
    ...data,
    tim,
  })
}

// 删除所有通知
export const delAllNotice = () => {
  const url = `/console/api/notification/clearall`
  const tim = Math.random() + ''
  return request.post<any, any, { tim: string }>(url, {
    tim,
  })
}

// 获取行业一级、二级编码信息
export const getIndustry = () => {
  return request.post<any, API.GetIndustryRes, any>(
    '/console/api/rcs/get_industry_list',
    {},
  )
}

// 获取大区，省市相关信息
export const getRegionRes = () => {
  return request.post<any, API.GetRegionRes, any>(
    '/console/api/rcs/get_district_list',
    {},
  )
}

// 上传文件  合同、logo等  单个文件上传
export const uploadCustomerFile = (data: API.UploadCustomerFileParams) => {
  return request.post<
    any,
    API.UploadCustomerFileRes,
    API.UploadCustomerFileParams
  >('/console/api/rcs/upload_customer_file', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
// 删除文件 合同、logo等
export const delCustomerFile = (data: API.DeleteCustomerFileParams) => {
  return request.post<any, any, API.DeleteCustomerFileParams>(
    '/console/api/rcs/delete_customer_file',
    data,
  )
}

// 上传素材
export const uploadRcsMeteialFile = (data: { file: any }) => {
  return request.post<any, any, { file: any }>(
    '/console/api/rcs/submit_lib',
    data,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )
}
// 获取素材列表
export const getRcsMeteialList = (data: API.GetRcsMeteialListParams) => {
  return request.post<
    any,
    API.GetRcsMeteialListRes,
    API.GetRcsMeteialListParams
  >('/console/api/rcs/get_libs', data)
}
// 获取创建模版时使用的素材列表
export const getRcsOnlineMeteialList = (
  data: API.GetRcsOnlineMeteialListParams,
) => {
  return request.post<
    any,
    API.GetRcsOnlineMeteialListRes,
    API.GetRcsOnlineMeteialListParams
  >('/console/api/rcs/get_online_libs', data)
}

// 删除素材列表
export const delRcsMeteial = (data: { id: string }) => {
  return request.post<any, any, { id: string }>(
    '/console/api/rcs/delete_libs',
    data,
  )
}

// 获取chatbot
export const getChatbot = (data: API.GetChatbotParams) => {
  return request.post<any, API.GetChatbotRes, API.GetChatbotParams>(
    '/console/api/rcs/get_chatbot',
    {
      ...data,
    },
  )
}
// 创建/修改RCS模版
export const createRcsTemp = (data: API.CreateRcsTempParams) => {
  return request.post<any, any, API.CreateRcsTempParams>(
    '/console/api/rcs/save_template',
    {
      ...data,
    },
  )
}
// 获取RCS模版列表
export const getRcsTempList = (data: API.GetRcsTempListParams) => {
  return request.post<any, API.GetRcsTempListRes, API.GetRcsTempListParams>(
    '/console/api/rcs/get_templates',
    {
      ...data,
    },
  )
}
// 获取已上报成功的彩信模板
export const getMmsList = (data: API.GetMmsListParams) => {
  return request.post<any, API.GetMmsListRes, API.GetMmsListParams>(
    '/console/api/rcs/get_mms_libs',
    {
      ...data,
    },
  )
}
// 获取彩信素材模板
export const getMmsMaterialList = (data: API.GetMmsMaterialListParams) => {
  return request.post<
    any,
    API.GetMmsMaterialListRes,
    API.GetMmsMaterialListParams
  >('/console/api/mms/get_templates', {
    ...data,
  })
}

// 将彩信模板上报至运营商
export const uploadMmsLibs = (data: API.UploadMmsLibsParams) => {
  return request.post<any, API.Response<any>, API.UploadMmsLibsParams>(
    'console/api/rcs/upload_mms_libs',
    { ...data },
  )
}

// 获取非直签客户信息
export const getDicConfig = (data: API.GetDicConfigParams) => {
  return request.post<
    any,
    API.Response<API.GetDicConfigItems>,
    API.GetDicConfigParams
  >('console/api/rcs/dic_config', { ...data })
}
