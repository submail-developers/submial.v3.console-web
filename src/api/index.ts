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
      account: 'duanlangjd@126.com',
      password: 'yanzhi2010',
      // account: '18616200024@163.com',
      // password: 'sumeng+123',
      // account: '514030829@qq.com',
      // password: 'yanzhi2010',
      // account: '627321363@qq.com',
      // password: 'Zjh514523',
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
export const getRegion = () => {
  return request.post<any, API.Response<API.RegionItem[]>, any>(
    '/console/api/rcs/get_district_list',
    {},
  )
}

// 开通产品
export const openRcs = (data: { agreement: boolean }) => {
  return request.post<any, any, { agreement: boolean }>(
    '/console/api/rcs/save_configure',
    data,
  )
}
// 是否展示页面引导提示
export const getUseTourStatus = () => {
  return request.post<any, any, any>('/console/api/rcs/show_hint_status', {})
}
// 隐藏页面引导提示
export const hideUseTour = () => {
  return request.post<any, any, any>(
    '/console/api/rcs/set_show_hint_status',
    {},
  )
}
// 账户概览
export const getRcsOverview = () => {
  return request.post<any, API.Response<API.GetRcsOverviewRes>, any>(
    '/console/api/rcs/get_rcs_overview',
    {},
  )
}
// 账户概览-echarts数据
export const getRcsAnalysisOverview = (
  data: API.GetRcsAnalysisOverviewParams,
) => {
  return request.post<
    any,
    API.GetRcsAnalysisOverviewRes,
    API.GetRcsAnalysisOverviewParams
  >('/console/api/rcs/get_rcs_analysis_overview', data)
}
// 账户概览-获取RCS资源包
export const getRcsPackages = () => {
  return request.post<any, API.GetRcsPackagesRes, any>(
    '/console/api/store/get_rcs_packages',
    {},
  )
}
// 账户概览-获取发票列表
export const getInvoices = () => {
  return request.post<any, API.GetInvoicesRes, any>(
    '/console/api/store/get_invoices',
    {},
  )
}
// 账户概览-创建订单
export const createOrder = (data: API.CreateOrderParams) => {
  return request.post<any, API.CreateOrderRes, API.CreateOrderParams>(
    '/console/api/store/create_order',
    data,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )
}
// 取消订单
export const cancalOrder = (data: API.CancalOrderParams) => {
  return request.post<any, any, API.CancalOrderParams>(
    '/console/api/store/cancel_order',
    data,
  )
}
// 查询订单支付状态
export const getPayStatus = (data: API.GetPayStatusParams) => {
  return request.post<any, API.GetPayStatusRes, API.GetPayStatusParams>(
    '/console/api/store/get_order_status',
    data,
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
// 删除文件 合同、logo等。不删了
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
// 提交审核chatbot
export const saveChatbot = (data: API.SaveChatbotParams) => {
  return request.post<any, any, API.SaveChatbotParams>(
    '/console/api/rcs/save_chatbot',
    {
      ...data,
    },
  )
}
// 保存chatbot
export const temporarySaveChatbot = (data: API.temporarySaveChatbotParams) => {
  return request.post<any, any, API.temporarySaveChatbotParams>(
    '/console/api/rcs/temporary_save_chatbot',
    {
      ...data,
    },
  )
}
// 删除chatbot
export const deleteChatbot = (data: API.DeleteChatbotParams) => {
  return request.post<any, any, API.DeleteChatbotParams>(
    '/console/api/rcs/delete_chatbot',
    {
      ...data,
    },
  )
}

// 获取chatbot
export const getChatbot = (data: API.GetChatbotParams) => {
  // 默认menu_status=all
  const _data: API.GetChatbotParams = { menu_status: 'all', ...data }
  return request.post<any, API.GetChatbotRes, API.GetChatbotParams>(
    '/console/api/rcs/get_chatbot',
    {
      ..._data,
    },
  )
}
// 更新chatbot-appkey
export const refreshAppkey = (data: API.RefreshAppkeyParams) => {
  return request.post<any, any, API.RefreshAppkeyParams>(
    '/console/api/rcs/refresh_appkey',
    {
      ...data,
    },
  )
}
// 获取chatbot交互日志
export const getRcsChatbotLogs = (data: API.GetRcsChatbotLogsParams) => {
  return request.post<
    any,
    API.GetRcsChatbotLogsRes,
    API.GetRcsChatbotLogsParams
  >('/console/api/rcs/get_interactive_log', {
    ...data,
  })
}
// 导出chatbot交互日志
export const exportRcsChatbotLogs = (data: API.ExportRcsChatbotLogsParams) => {
  return request.post<any, any, API.ExportRcsChatbotLogsParams>(
    '/console/api/rcs/export_interactive_log',
    {
      ...data,
    },
  )
}
//编辑固定菜单
export const saveFixedMenu = (data: API.SaveFixedMenuParams) => {
  return request.post<any, any, API.SaveFixedMenuParams>(
    '/console/api/rcs/save_fixed_menu',
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
// 删除RCS模版列表
export const delRcsTemp = (data: API.DelRcsTempParams) => {
  return request.post<any, any, API.DelRcsTempParams>(
    '/console/api/rcs/delete_template',
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
  return request.post<
    any,
    API.Response<API.UploadMmsLibsRes>,
    API.UploadMmsLibsParams
  >('console/api/rcs/upload_mms_libs', { ...data })
}

// 获取非直签客户信息
export const getDicConfig = () => {
  return request.post<any, API.Response<API.GetDicConfigItems>, any>(
    'console/api/rcs/dic_config',
    {},
  )
}

// 注册非直签客户信息
export const signupForCspAccount = (data: API.signupForCspAccountParams) => {
  return request.post<
    any,
    API.Response<API.signupForCspAccountItems>,
    API.signupForCspAccountParams
  >('console/api/rcs/signup_for_csp_account', { ...data })
}
// 保存非直签客户信息
export const saveupForCspAccount = (data: API.saveupForCspAccountParams) => {
  return request.post<
    any,
    API.Response<API.saveupForCspAccountItems>,
    API.saveupForCspAccountParams
  >('console/api/rcs/temporary_storage_csp_account', { ...data })
}

// 通过文件获取号码数据
export const getDataFromFile = (data: API.GetDataFromFileParams) => {
  return request.post<any, API.GetDataFromFileRes, API.GetDataFromFileParams>(
    'console/api/rcs/import_data_from_file',
    {
      ...data,
    },
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )
}
// 通过文件获取号码数据
export const getSendAddress = (data: API.GetSendAddressParams) => {
  return request.post<any, API.GetSendAddressRes, API.GetSendAddressParams>(
    'console/api/addressbook/get_mob_send_addressbooks',
    {
      ...data,
    },
  )
}
// 发送条数
export const getSendNumber = (data: API.getSendNumberParams) => {
  return request.post<any, API.getSendNumberRes, API.getSendNumberParams>(
    'console/api/rcs/statistical_billing',
    { ...data },
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )
}

// 创建发送任务
export const createRcsSend = (data: API.CreateRcsSendParams) => {
  return request.post<any, any, API.CreateRcsSendParams>(
    'console/api/rcs/send',
    { ...data },
  )
}
// 更新chatbot信息
export const updateChatbot = (data: API.updateChatbotParams) => {
  return request.post<
    any,
    API.Response<API.updateChatbotItems>,
    API.updateChatbotParams
  >('console/api/rcs/update_chatbot', { ...data })
}

// 获取地址簿
export const getMobAddressbooks = (data: API.GetMobAddressbooksParams) => {
  return request.post<any, API.GetAddressListRes, API.GetMobAddressbooksParams>(
    '/console/api/addressbook/get_mob_addressbooks',
    {
      ...data,
    },
  )
}
// 获取地址簿详情
export const getMobAddressbookDetail = (
  data: API.GetMobAddressbookDetailParams,
) => {
  return request.post<
    any,
    API.GetAddressbookDetailRes,
    API.GetMobAddressbookDetailParams
  >('/console/api/addressbook/get_mob_addressbook', {
    ...data,
  })
}

// 创建地址簿
export const createAddressbooks = (data: API.CreateAddressbooksParams) => {
  return request.post<any, any, API.CreateAddressbooksParams>(
    'console/api/addressbook/save_mob_addressbook',
    { ...data },
  )
}

// 删除地址簿
export const deleteAddressbooks = (data: API.DeleteAddressbooksParams) => {
  return request.post<any, any, API.DeleteAddressbooksParams>(
    'console/api/addressbook/delete_mob_addressbook',
    {
      ...data,
    },
  )
}
// 新增地址簿手机号码
export const addAddressMobileList = (data: API.AddAddressMobileListParams) => {
  return request.post<any, API.Response<any>, API.AddAddressMobileListParams>(
    'console/api/addressbook/import_address_for_mob_addressbook',
    { ...data },
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )
}

// 上传地址簿文件
export const uploadAddressFile = (data: API.UploadAddressFileParams) => {
  return request.post<
    any,
    API.UploadAddressFileRes,
    API.UploadAddressFileParams
  >('/console/api/addressbook/upload_file_for_mob_addressbook', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

// 删除手机号
export const deleteAddressMob = (data: API.DeleteAddressMobParams) => {
  return request.post<any, any, API.DeleteAddressMobParams>(
    'console/api/addressbook/delete_mob_address',
    {
      ...data,
    },
  )
}
// 清空地址簿
export const truncateMob = (data: API.TruncateMobParams) => {
  return request.post<any, any, API.TruncateMobParams>(
    'console/api/addressbook/truncate_mob_addressbook',
    {
      ...data,
    },
  )
}
// 移动、移出地址簿到文件夹
export const moveAddressBook = (data: API.MoveAddressBookParams) => {
  return request.post<any, any, API.MoveAddressBookParams>(
    'console/api/addressbook/move_addressbook_to_folder',
    {
      ...data,
    },
  )
}
// 更新地址簿标签
export const updateAddressBookTag = (data: API.UpdateAddressBookTagParams) => {
  return request.post<any, any, API.UpdateAddressBookTagParams>(
    'console/api/addressbook/update_batch_tag_folder_addressbook',
    {
      ...data,
    },
  )
}

// 获取地址簿文件夹
export const getAddressbooksFolder = (
  data: API.GetAddressbooksFolderParams,
) => {
  return request.post<
    any,
    API.GetAddressFolderListRes,
    API.GetAddressbooksFolderParams
  >('/console/api/addressbook/get_addressbook_folder', {
    ...data,
  })
}

// 创建地址簿文件夹
export const createAddressbooksFolder = (
  data: API.CreateAddressbooksFolderParams,
) => {
  return request.post<any, any, API.CreateAddressbooksFolderParams>(
    'console/api/addressbook/submit_addressbook_folder',
    { ...data },
  )
}
// 删除地址簿文件夹
export const deleteAddressbooksFolder = (
  data: API.DeleteAddressbooksFolderParams,
) => {
  return request.post<any, any, API.DeleteAddressbooksFolderParams>(
    'console/api/addressbook/delete_addressbook_folder',
    {
      ...data,
    },
  )
}

// 获取地址簿文件夹详情
export const getFolderDetail = (data: API.GetFolderDetailParams) => {
  return request.post<any, API.GetFolderDetailRes, API.GetFolderDetailParams>(
    '/console/api/addressbook/get_folder_addressbook',
    {
      ...data,
    },
  )
}

// 清空地址簿中文件夹
export const clearFolderAddress = (data: API.ClearFolderAddressParams) => {
  return request.post<any, any, API.ClearFolderAddressParams>(
    'console/api/addressbook/delete_batch_folder_addressbook',
    {
      ...data,
    },
  )
}
// 批量删除文件夹
export const batchDeleteFolder = (data: API.BatchDeleteFolderParams) => {
  return request.post<any, any, API.BatchDeleteFolderParams>(
    'console/api/addressbook/batch_delete_addressbook_folder',
    {
      ...data,
    },
  )
}
// 批量更新文件夹颜色标签
export const batchUpdateFolderTag = (data: API.BatchUpdateFolderTagParams) => {
  return request.post<any, any, API.BatchUpdateFolderTagParams>(
    'console/api/addressbook/batch_update_addressbook_folder_tag',
    {
      ...data,
    },
  )
}
// 获取交互列表
export const getRcsInteractiveList = (
  data: API.GetRcsInteractiveListParams,
) => {
  return request.post<
    any,
    API.Response<API.GetRcsInteractiveListResItem[]>,
    API.GetRcsInteractiveListParams
  >('console/api/rcs/get_interactive_list', {
    ...data,
  })
}
// 创建上行交互
export const createRcsInteractive = (data: API.CreateRcsInteractiveParams) => {
  return request.post<any, any, API.CreateRcsInteractiveParams>(
    'console/api/rcs/save_interactive',
    {
      ...data,
    },
  )
}
// 删除交互配置
export const delRcsInteractive = (data: { id: string }) => {
  return request.post<any, any, { id: string }>(
    'console/api/rcs/delete_interactive',
    {
      ...data,
    },
  )
}
// 切换交互配置开关
export const changeRcsInteractiveStatus = (data: {
  id: string
  status: boolean
}) => {
  return request.post<any, any, { id: string; status: boolean }>(
    'console/api/rcs/interactive_status',
    {
      ...data,
    },
  )
}
// 切换交互配置开关
export const changeRcsInteractiveAllStatus = (
  data: API.ChangeRcsInteractiveAllStatusParams,
) => {
  return request.post<any, any, API.ChangeRcsInteractiveAllStatusParams>(
    'console/api/rcs/interactive_all_status',
    {
      ...data,
    },
  )
}
// 获取api错误日志
export const getErrorsLogs = (data: API.GetErrorsLogsParams) => {
  return request.post<any, API.GetErrorsLogsRes, API.GetErrorsLogsParams>(
    '/console/api/rcs/get_errors',
    {
      ...data,
    },
  )
}
// 获取api历史明细
export const getHistory = (data: API.GetHistoryParams) => {
  return request.post<any, API.GetHistoryRes, API.GetHistoryParams>(
    '/console/api/rcs/get_history',
    {
      ...data,
    },
  )
}

// 获取批量任务发送报告
export const getSendlists = (data: API.GetSendlistsParams) => {
  return request.post<any, API.GetSendlistsRes, API.GetSendlistsParams>(
    '/console/api/rcs/get_sendlists',
    {
      ...data,
    },
  )
}
// 取消任务
export const cancelRcsTask = (data: { id: string }) => {
  return request.post<any, any, { id: string }>(
    '/console/api/rcs/cancel_timetosend_task',
    {
      ...data,
    },
  )
}
// 获取批量任务发送报告详情
export const getSendlistReport = (data: API.GetSendlistReportParams) => {
  return request.post<
    any,
    API.GetSendlistReportRes,
    API.GetSendlistReportParams
  >('console/api/rcs/get_sendlist_report', {
    ...data,
  })
}
// 获取批量任务发送报告概览详情
export const getSendlistSendanalysisreport = (
  data: API.GetSendanalysisreportParams,
) => {
  return request.post<
    any,
    API.Response<API.GetSendanalysisreportRes>,
    API.GetSendanalysisreportParams
  >('console/api/rcs/get_sendlist_send_analysis_report', {
    ...data,
  })
}
// 概览数据分析
export const getSendlistDeepAnalysisReport = (
  data: API.GetSendlistDeepAnalysisParams,
) => {
  return request.post<
    any,
    API.Response<API.GetSendlistDeepAnalysisRes>,
    API.GetSendlistDeepAnalysisParams
  >('/console/api/rcs/get_sendlist_deep_analysis_report', {
    ...data,
  })
}
// 发送明细
export const getSendlistLogs = (data: API.GetSendlistLogsParams) => {
  return request.post<any, API.GetSendlistLogsRes, API.GetSendlistLogsParams>(
    '/console/api/rcs/get_sendlist_logs',
    {
      ...data,
    },
  )
}

// 获取api分析报告
export const getUnionAnalysis = (data: API.GetUnionAnalysisParams) => {
  return request.post<any, API.GetUnionAnalysisRes, API.GetUnionAnalysisParams>(
    '/console/api/rcs/get_union_analysis',
    {
      ...data,
    },
  )
}

// subhook
export const getRcsSubhookList = (data: API.GetRcsSubhookListParams) => {
  return request.post<
    any,
    API.GetRcsSubhookListRes,
    API.GetRcsSubhookListParams
  >('/console/api/rcs/get_subhooks', {
    ...data,
  })
}
// 修改subhook状态
export const changeRcsSubhookStatus = (
  data: API.ChangeRcsSubhookStatusParams,
) => {
  return request.post<any, any, API.ChangeRcsSubhookStatusParams>(
    '/console/api/rcs/subhook_status',
    {
      ...data,
    },
  )
}
// 重置subhook密钥
export const resetRcsSubhookKey = (data: { id: string }) => {
  return request.post<any, any, { id: string }>(
    '/console/api/rcs/reset_subhook_key',
    {
      ...data,
    },
  )
}
// 新增/修改subhook
export const saveRcsSubhook = (data: any) => {
  return request.post<any, any, any>('/console/api/rcs/save_subhook', {
    ...data,
  })
}
// 删除subhook
export const delRcsSubhook = (data: { id: string }) => {
  return request.post<any, any, { id: string }>(
    '/console/api/rcs/delete_subhook',
    {
      ...data,
    },
  )
}
// 测试subhook
export const testRcsSubhook = (data: { id: string }) => {
  return request.post<any, API.RcsTestSubhookRes, { id: string }>(
    '/console/api/rcs/test_subhook',
    {
      ...data,
    },
  )
}
// 计费日志
export const getRcsFeeLogs = (data: API.GetRcsFeeLogsParams) => {
  return request.post<any, API.GetRcsFeeLogsRes, API.GetRcsFeeLogsParams>(
    '/console/api/rcs/get_feelogs',
    {
      ...data,
    },
  )
}
// 获取Rcs偏好配置
export const getRcsSetting = () => {
  return request.post<any, API.RcsSettingRes, any>(
    '/console/api/rcs/get_settings',
    {},
  )
}
// 修改提醒上限
export const changeRcsSettingLess = (data: API.ChangeRcsSettingLessParams) => {
  return request.post<any, any, API.ChangeRcsSettingLessParams>(
    '/console/api/rcs/save_settings',
    { ...data },
  )
}
// 修改Rcs偏好配置:reminder_mail 邮件提醒，reminder_message 短信提醒，credits_reminder 提醒上限
export const changeRcsSetting = (data: API.ChangeRcsSettingSwitchParams) => {
  return request.post<any, any, API.ChangeRcsSettingSwitchParams>(
    '/console/api/rcs/save_settings_switch',
    { ...data },
  )
}
// message_send_confirm 在线批量发送时需要输入手机验证码
// message_sent_reminder 在线发送完成时提醒我
// export_confrim 导出时需要输入手机验证码
// account_verify_code_display  在历史明细查询或导出时隐藏验证码
// account_mob_display  在历史明细查询或导出时隐藏手机号码
// address_mob_display  地址簿加密
export const changeRcsSettingSafe = (
  data: API.ChangeRcsSettingSafeSwitchParams,
) => {
  return request.post<any, any, API.ChangeRcsSettingSafeSwitchParams>(
    '/console/api/rcs/save_settings_switch_confirm',
    { ...data },
  )
}

// 获取手机验证码
export const getMobCode = (data: { address: string }) => {
  return request.post<
    any,
    any,
    {
      address: string
    }
  >('/console/api/account/send_optional_verify_code_by_sms', { ...data })
}

// 获取邮箱验证码
export const getEmailCode = (data: { address: string }) => {
  return request.post<
    any,
    any,
    {
      address: string
    }
  >('/console/api/account/send_optional_verify_code_by_mail', { ...data })
}
// Rcs偏好配置-保存邮箱
export const saveRcsSetting = (data: API.SaveSettingParams) => {
  return request.post<any, any, API.SaveSettingParams>(
    '/console/api/rcs/save_reminder_list',
    { ...data },
  )
}
// Rcs偏好配置-删除邮箱/手机号
export const delRcsSettingMobEmail = (data: { id: string }) => {
  return request.post<
    any,
    any,
    {
      id: string
    }
  >('/console/api/rcs/delete_reminder_list', { ...data })
}

/**
 * 导出-start
 * */
// 批量发送任务-导出
export const exportRcsSendTask = (data: API.ExportRcsSendTaskParams) => {
  return request.post<any, any, API.ExportRcsSendTaskParams>(
    '/console/api/rcs/export_sendlists',
    {
      ...data,
    },
  )
}
// 批量发送任务-导出
export const exportRcsAnalysis = (data: API.ExportRcsAnalysis) => {
  return request.post<any, any, API.ExportRcsAnalysis>(
    '/console/api/rcs/export_union_analysis',
    {
      ...data,
    },
  )
}
// 历史明细-导出
export const exportRcsHistory = (data: API.ExportRcsHistory) => {
  return request.post<any, any, API.ExportRcsHistory>(
    '/console/api/rcs/export_history',
    {
      ...data,
    },
  )
}

// 发送验证码至默认账户
export const getDefaultMobCode = () => {
  return request.post<any, any, any>(
    '/console/api/account/send_verify_code_by_sms',
    {},
  )
}
// 发送验证码至默认账户 - 验证该验证码
export const verifyDefaultMobCode = (data: { code: string }) => {
  return request.post<any, any, { code: string }>(
    '/console/api/account/sms_code_verify',
    {
      ...data,
    },
  )
}
// 导出地址簿
export const exportAddress = (data: { id: string; type: string }) => {
  return request.post<any, any, { id: string; type: string }>(
    '/console/api/addressbook/export_mob_addressbook',
    {
      ...data,
    },
  )
}

// 导出历史明细
export const exportHistory = (data: API.ExportHistoryParams) => {
  return request.post<any, any, API.ExportHistoryParams>(
    '/console/api/rcs/export_history',
    {
      ...data,
    },
  )
}
// 下载文件
export const downLaodFile = () => {
  return request.post<any, any, any>(
    '/console/api/services/download_export_file',
  )
}

/**
 * 导出-end
 * */

/**
 * 语音机器人-start
 * */
// 账户概览
export const getVCOverview = () => {
  return request.post<any, API.GetVCOverviewRes, any>(
    '/console/api/VoiceChatbot/get_info',
  )
}
// 账户概览-图表
export const getVCAnalysisOverview = () => {
  return request.post<any, API.GetVCAnalysisOverviewRes, any>(
    '/console/api/VoiceChatbot/get_info_analysis',
    {},
  )
}

export const openVoiseChatbot = () => {
  return request.post<any, API.Response<string>, any>(
    '/console/api/VoiceChatbot/save_configure',
    {
      agreement: true,
    },
  )
}
// 账户概览-获取语音机器人资源包
export const getVCPackages = () => {
  return request.post<any, API.GetRcsPackagesRes, any>(
    '/console/api/store/get_balance_packages',
    {},
  )
}

// 获取token
export const getTalkToken = () => {
  return request.post<any, API.Response<string>, any>(
    '/console/api/VoiceChatbot/get_talk_token',
  )
}
// 话术列表
export const getTalkList = (data: API.GetTalkListParams) => {
  return request.post<any, API.GetTalkListRes, API.GetTalkListParams>(
    '/console/api/VoiceChatbot/get_talk_list',
    {
      ...data,
    },
  )
}

// 删除话术 话术id 支持多个， 用英文逗号隔开
export const createTalk = (data: API.CreateTalkParams) => {
  return request.post<
    any,
    API.Response<API.CreateTalkRes>,
    API.CreateTalkParams
  >('/console/api/VoiceChatbot/create_talk', {
    ...data,
  })
}

// 删除话术 话术id 支持多个， 用英文逗号隔开
export const delTalkItem = (data: { ids: string }) => {
  return request.post<any, any, { ids: string }>(
    '/console/api/VoiceChatbot/delete_talk',
    {
      ...data,
    },
  )
}
// 提审话术
export const submitTalk = (data: { id: string; name: string }) => {
  return request.post<any, any, { id: string; name: string }>(
    '/console/api/VoiceChatbot/save_audit_speechskill',
    {
      ...data,
    },
  )
}
// 测试话术
export const testTalk = (data: { id: string; mob: string }) => {
  return request.post<any, any, { id: string; mob: string }>(
    '/console/api/VoiceChatbot/test_speechskill',
    {
      ...data,
    },
  )
}

// 外呼任务-话术列表
export const getUsableTalkList = () => {
  return request.post<any, API.Response<API.UsableTalkItem[]>, any>(
    '/console/api/VoiceChatbot/get_usable_talk_list',
  )
}
// 外呼任务列表
export const getVCTaskList = (data: API.GetVCTaskListParams) => {
  return request.post<any, API.GetVCTaskListRes, API.GetVCTaskListParams>(
    '/console/api/VoiceChatbot/get_task_list',
    {
      ...data,
    },
  )
}
// 发送条数
export const getVCSendNumber = (data: API.getSendPriceParams) => {
  return request.post<any, API.getSendPriceRes, API.getSendPriceParams>(
    'console/api/VoiceChatbot/statistical_billing',
    { ...data },
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )
}
// 创建外呼任务-挂机短信列表
export const getSmsTempList = (data: any) => {
  return request.post<any, any, any>(
    '/console/api/sms/get_templates',
    {
      ...data,
    },
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )
}
// 创建外呼任务
export const createVCTask = (data: any) => {
  return request.post<any, any, any>('/console/api/VoiceChatbot/create_task', {
    ...data,
  })
}
// 一键重呼-创建外呼任务
export const reCreateVCTask = (data: any) => {
  return request.post<any, any, any>(
    '/console/api/VoiceChatbot/one_touch_recall',
    {
      ...data,
    },
  )
}
// 一键重呼-各状态获取手机号码数量
export const getRecallMobileNumber = (data: {
  sendlist: string // 任务id
}) => {
  return request.post<
    any,
    API.GetRecallMobileNumberRes,
    {
      sendlist: string // 任务id
    }
  >('/console/api/VoiceChatbot/one_touch_recall_mob_num', {
    ...data,
  })
}
// 通过文件获取号码数据
export const getVCDataFromFile = (data: API.GetDataFromFileParams) => {
  return request.post<any, API.GetDataFromFileRes, API.GetDataFromFileParams>(
    'console/api/voiceChatbot/import_data_from_file',
    {
      ...data,
    },
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )
}
// 修改外呼任务状态
export const changeVCTaskStatus = (data: API.ChangeVCTaskStatusParams) => {
  return request.post<any, any, API.ChangeVCTaskStatusParams>(
    '/console/api/VoiceChatbot/update_task_status',
    {
      ...data,
    },
  )
}
// 外呼任务详情
export const getVCTaskDetail = (data: {
  sendlist: string // 任务id
}) => {
  return request.post<
    any,
    API.Response<API.GetVCTaskDetailRes>,
    {
      sendlist: string // 任务id
    }
  >('/console/api/VoiceChatbot/get_task_detail', {
    ...data,
  })
}
// 外呼任务进度
export const getVCTaskSchedule = (data: {
  sendlist: string // 任务id
}) => {
  return request.post<
    any,
    API.Response<API.GetVCTaskScheduleRes>,
    {
      sendlist: string // 任务id
    }
  >('/console/api/VoiceChatbot/get_task_schedule', {
    ...data,
  })
}
// 外呼任务进度-导出
export const exportVCTaskSchedule = (data: any) => {
  return request.post<any, any, any>(
    '/console/api/VoiceChatbot/export_task_schedule',
    {
      ...data,
    },
  )
}
// 外呼任务详情-获取通话概览+对话轮次概览
export const getVCTaskTalkInfo = (data: {
  sendlist: string // 任务id
}) => {
  return request.post<
    any,
    API.Response<API.GetVCTaskTalkRes>,
    {
      sendlist: string // 任务id
    }
  >('/console/api/VoiceChatbot/get_talk_analysis_report', {
    ...data,
  })
}
// 外呼任务详情-意向客户
export const getVCTaskGradeInfo = (data: {
  sendlist: string // 任务id
}) => {
  return request.post<
    any,
    API.GetVCTaskGradeRes,
    {
      sendlist: string // 任务id
    }
  >('/console/api/VoiceChatbot/get_task_customer_proportion', {
    ...data,
  })
}
// 外呼任务详情-城市/省份信息
export const getVCTaskCityInfo = (data: {
  sendlist: string // 任务id
}) => {
  return request.post<
    any,
    API.Response<API.GetVCTaskCityRes>,
    {
      sendlist: string // 任务id
    }
  >('/console/api/VoiceChatbot/get_city_analysis_report', {
    ...data,
  })
}
// 外呼任务详情-已外呼号码
export const getVCTaskCalledList = (data: API.GetVCTaskCalledListParams) => {
  return request.post<
    any,
    API.GetVCTaskCalledListRes,
    API.GetVCTaskCalledListParams
  >('/console/api/VoiceChatbot/get_task_history', {
    ...data,
  })
}
// 外呼任务详情-未外呼号码
export const getVCTaskCallingList = (data: API.GetVCTaskCallingListParams) => {
  return request.post<
    any,
    API.GetVCTaskCallingListRes,
    API.GetVCTaskCallingListParams
  >('/console/api/VoiceChatbot/get_outbound_history', {
    ...data,
  })
}
// 外呼任务详情-导出已外呼号码
export const exportVCTaskCalledList = (data: any) => {
  return request.post<any, any, any>(
    '/console/api/VoiceChatbot/export_task_history',
    {
      ...data,
    },
  )
}
// 外呼任务详情-导出未外呼号码
export const exportVCTaskCallingList = (data: any) => {
  return request.post<any, any, any>(
    '/console/api/VoiceChatbot/export_outbound_history',
    {
      ...data,
    },
  )
}

// 意向客户列表
export const getVCGadeRate = () => {
  return request.post<any, API.GetVCGadeRateRes, any>(
    '/console/api/VoiceChatbot/get_customer_proportion',
  )
}
// 意向客户列表
export const getVCGadeList = (data: API.GetVCGadeListParams) => {
  return request.post<any, API.GetVCGadeListRes, API.GetVCGadeListParams>(
    '/console/api/VoiceChatbot/get_customer_list',
    {
      ...data,
    },
  )
}
// 删除意向客户
export const delVCGadeMobile = (data: { mobiles: string }) => {
  return request.post<any, any, { mobiles: string }>(
    '/console/api/VoiceChatbot/delete_customer_list',
    {
      ...data,
    },
  )
}
// 导出意向客户
export const exportVCGadeMobile = (data: API.ExportVCGadeListParams) => {
  return request.post<any, any, API.ExportVCGadeListParams>(
    '/console/api/VoiceChatbot/export_customer_list',
    {
      ...data,
    },
  )
}
// 计费日志
export const getVCFeeList = (data: any) => {
  return request.post<any, API.GetVCFeeListRes, any>(
    '/console/api/VoiceChatbot/get_feelogs',
    {
      ...data,
    },
  )
}

// 获取智能语音机器人偏好配置
export const getVCSetting = () => {
  return request.post<any, API.VCSettingRes, any>(
    '/console/api/VoiceChatbot/get_settings',
    {},
  )
}
// 修改提醒上限
export const changeVCSettingLess = (data: API.ChangeVCSettingLessParams) => {
  return request.post<any, any, API.ChangeVCSettingLessParams>(
    '/console/api/VoiceChatbot/save_settings',
    { ...data },
  )
}
// 修改偏好配置:reminder_mail 邮件提醒，reminder_message 短信提醒，credits_reminder 提醒上限
export const changeVCSetting = (data: API.ChangeVCSettingSwitchParams) => {
  return request.post<any, any, API.ChangeVCSettingSwitchParams>(
    '/console/api/VoiceChatbot/save_settings_switch',
    { ...data },
  )
}
// message_send_confirm 在线批量发送时需要输入手机验证码
// message_sent_reminder 在线发送完成时提醒我
// export_confrim 导出时需要输入手机验证码
// account_verify_code_display  在历史明细查询或导出时隐藏验证码
// account_mob_display  在历史明细查询或导出时隐藏手机号码
// address_mob_display  地址簿加密
export const changeVCSettingSafe = (
  data: API.ChangeVCSettingSafeSwitchParams,
) => {
  return request.post<any, any, API.ChangeVCSettingSafeSwitchParams>(
    '/console/api/VoiceChatbot/save_settings_switch_confirm',
    { ...data },
  )
}
// Rcs偏好配置-保存邮箱
export const saveVCSetting = (data: API.SaveSettingParams) => {
  return request.post<any, any, API.SaveSettingParams>(
    '/console/api/rcs/save_reminder_list',
    { ...data },
  )
}
// Rcs偏好配置-删除邮箱/手机号
export const delVCSettingMobEmail = (data: { id: string }) => {
  return request.post<
    any,
    any,
    {
      id: string
    }
  >('/console/api/rcs/delete_reminder_list', { ...data })
}

/**
 * 语音机器人-end
 * */
