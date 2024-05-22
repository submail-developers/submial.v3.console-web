declare module 'apis' {
  namespace API {
    interface Response<T = any> {
      data: T
      message?: string
      status?: string
    }

    interface BaseParams {
      // loading?: boolean // 是否需要loading， 默认false
      // token?: boolean // 是否需要token， 默认为true
      contentType?: string // 默认application/json
    }

    /**
     * 示例接口及测试接口start
     */

    type Tag = {
      id: number
      name: string
    }

    interface PetInfoRes {
      id: number
      name: string
      photoUrls: string[]
      category: {
        id: number
        name: string
      }
      tags: Tag[]
    }

    // 示例接口-get
    interface PetInfoParams extends BaseParams {
      id: number
    }

    // 示例接口-post
    interface CreatePetParams extends BaseParams {
      name: string
      status: string
    }

    /**
     * 示例接口及测试接口end
     */

    interface GetInfoRes {
      feedback: number
      notification: number
      status: string
    }

    interface GetNoticeListParams {
      page: number
      tim?: stirng
    }
    interface NoticeItem {
      create_at: string
      id: string
      msg: string
      subject: string
    }
    interface GetNoticeListRes {
      notifications: NoticeItem[]
      page: number
      status: string
    }

    interface GetChatbotListItem {
      name: string
    }
    // 创建chatbot
    interface SaveChatbotParams {
      appid: string
      name: string
      bind: string
      logo: string
      callback: string
      email: string
      website: string
      tcPage: string
      address: string
      colour: string
      backgroundImage: string
      category: string
      provider: string
      providerSwitchCode: string
      description: string
      menu: string
      genericCssTemplate: string
      autograph: string
      attachment: string
      actualIssueIndustry: string
      debugWhiteAddress: string
    }
    // 保存chatbot
    interface temporarySaveChatbotParams {
      appid: string
      name: string
      bind: string
      logo: string
      callback: string
      email: string
      website: string
      tcPage: string
      address: string
      colour: string
      backgroundImage: string
      category: string
      provider: string
      providerSwitchCode: string
      description: string
      menu: string
      genericCssTemplate: string
      autograph: string
      attachment: string
      actualIssueIndustry: string
      debugWhiteAddress: string
    }
    // 删除chatbot
    interface DeleteChatbotParams {
      appid: string
    }

    // 获取chatbot
    interface GetChatbotParams {
      page: number
      limit: number
      appid?: string
      keywords?: string
      status?: 'all' | '0' | '1' | '2' | '3' // 默认all   0=未提交，1=我方通过，2=我们驳回，3=我方审核中
    }
    interface ChatbotItem {
      index?: number
      id: string
      chatbotID: string
      account: string
      name: string
      appkey: string
      enable: '1' | '0'
      bind: string
      datetime: string
      status: '1' | '2' | '3'
      logo: string
      callback: string
      email: string
      website: string
      tcPage: string
      address: string
      colour: string
      backgroundImage: string
      category: string
      provider: string
      providerSwitchCode: '1' | '0'
      description: string
      menu: {
        menu: {
          entries: EntriesItem[]
        }
      }
      menu_status: '1' | '2' | '3' // 固定菜单审核状态 1通过  2不通过  3审核中
      genericCssTemplate: string
      autograph: string
      attachment: string
      actualIssueIndustry: string
      eTag: string
      debugWhiteAddress: string // 白名单
      sendApi: string
    }
    interface EntriesItem extends RcsSuggestionItem {
      menu: {
        displayText: string
        entries?: EntriesItem[]
      }
    }
    interface GetChatbotRes {
      status: string
      message: string
      total: 1
      list: ChatbotItem[]
    }

    //更新chatbot-appkey
    interface RefreshAppkeyParams {
      appid: string
    }

    // 获取行业一级、二级编码信息
    interface GetIndustryRes {
      status: string
      message: string
      data: IndustryItem[]
    }
    interface IndustryItem {
      label: string
      value: string
      children: IndustryItem[]
    }
    interface SubIndustryItem {
      cmCode: string
      subcode: string
      cmName: string
    }
    // 获取大区，省市相关信息
    interface RegionItem {
      label: string
      value: string
      children: RegionItem[]
    }
    // 上传文件  合同、logo等  单个文件上传
    interface UploadCustomerFileParams {
      // 1合同   2logo  3联系人身份证正面  4联系人身份证反面  5法人身份证正面  6法人身份证反面  7营业执照
      type: '1' | '2' | '3' | '4' | '5' | '6' | '7'
      file: any
    }
    interface UploadCustomerFileRes {
      status: string
      message: string
      path: string
    }
    // 删除文件 合同、logo等
    interface DeleteCustomerFileParams {
      path: string // 文件路径
    }

    // 获取rcs素材列表
    interface GetRcsMeteialListParams {
      id?: stirng
      page: number
      limit: number
      keyword?: stirng
      type: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | 'all'
      status: '0' | '1' | '9' | 'all' // 审核状态 0通过 1驳回 9审核中
    }
    interface GetRcsMeteialListRes {
      status: string
      message: string
      total: number
      libs: RcsMeteialItem[]
    }
    interface RcsMeteialItem {
      id: string
      sign: string
      account: string
      //  1 图片,2 音频,3 视频,4 文档,5 表格,6 演示文件,7 压缩文件,8 mms彩信 9 未知
      type: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
      storeAt: string // 素材资源路径
      filePath: string
      fileSize: string
      file_type: string
      expireAt: string
      // 素材审核状态  9=我方审核，0=通过，1=驳回，8=我方通过
      status: '0' | '1' | '8' | '9'
      datetime: string
      name: string
      tid: string
    }

    // 获取创建模版时使用的素材
    interface GetRcsOnlineMeteialListParams {
      id?: stirng
      page: number
      limit: number
      keyword?: stirng
      type: '1' | '2' | '3' | 'all' //   1 图片,2 音频,3 视频
      status: '0' | '1' | '9' | 'all' // 审核状态 0通过 1驳回 9审核中
    }
    interface GetRcsOnlineMeteialListRes {
      status: string
      message: string
      total: number
      libs: RcsOnlineMeteialItem[]
    }
    interface RcsOnlineMeteialItem extends RcsMeteialItem {
      type: '1' | '2' | '3' //   1 图片,2 音频,3 视频
    }

    interface CreateRcsTempParams {
      id?: string
      type: '1' | '2' | '3' | '4' // 1纯文本  2单卡片  3多卡片  4文件
      title: string
      sms: string // 是否支持短信回落， true：转短信，false：不转短信
      smsContent: string
      mms: string // 是否支持彩信回落，true：转彩信，false：不转彩信
      mmsSubject: string // 彩信标题，最长60个字节
      // 彩信模板素材ID  （六位短ID，对应素材数据列表的sign字段）。
      // 彩信模板需要客服报备后才能使用，作为素材回落，彩信正文内容不支持变量。
      mmsTemplate: string
      mmsFilePath?: string
      mmsFileSize?: string
      mmsFileExpired?: string
      suggestions: string // 悬浮菜单
      message: string
    }

    interface GetRcsTempListParams {
      id?: string
      page: number
      limit: number
      keyword?: string
      type?: 'all' | RcsTempType
      status?: 'all' | '0' | '1' | '2' // 默认all    0等待审核，1通过，2驳回
    }
    interface DelRcsTempParams {
      id: string
    }
    interface GetRcsTempListRes {
      status: string
      message: string
      total: 1
      list: RcsTempListItem[]
    }
    type RcsTempType = 1 | 2 | 3 | 4 // 1纯文本  2单卡片  3多卡片  4文件
    interface RcsTempListItem {
      id: string
      account: string
      sign: string
      title: string
      type: RcsTempType
      contentType: string
      message?: any
      suggestions?: {
        suggestions: RcsSuggestionItem[]
      }
      sms: string
      smsContent: string
      mms: string
      mmsSubject: string
      mmsFilePath: string
      mmsFileSize: string
      mmsFileExpired: string
      mmsTemplate: string
      createAt: string
      updateAt: string
      del: string
      checked: '0' | '1' | '2' //0等待审核，1通过，2驳回
      api: string
      ipAddress: string
      rejectReason: string
      folder: string
      bcTemplate: null
      rejectReason: string
    }

    interface RcsSuggestionItem {
      // 回复事件
      reply?: RcsReply
      // 交互事件
      action?: RcsAction
    }

    interface RcsReply {
      displayText: string
      // 上行文本携带的数据标识
      postback?: {
        data: string
      }
    }
    interface RcsAction {
      displayText?: string
      // 链接事件
      urlAction?: {
        openUrl: {
          url: string
          application: 'browser' | 'webview' // 内置浏览器 | 默认浏览器
          // application为webview可用，可选值：<br/>full：全屏<br/>half：半屏<br/>tall：浮屏
          viewMode?: 'full' | 'half' | 'tall'
          parameters?: string // url的参数 如 "visitorId=10001&code=123456"
        }
      }
      // 拨打电话
      dialerAction?: {
        dialPhoneNumber?: {
          dialPhoneNumber: string
          fallbackUrl?: string // 话单推送地址
        }
        // 	增强通话事件
        dialEnrichedCall?: {
          dialPhoneNumber: string
          fallbackUrl?: string // 话单推送地址
          subject?: string
        }
        // 视频通话
        dialVideoCall?: {
          dialPhoneNumber: string
          fallbackUrl?: string // 话单推送地址
        }
      }
      // 地图事件
      mapAction?: {
        // mapType: '0' ｜ "1" // 地图类型 0经纬度1位置
        location: {
          longitude?: number | string
          latitude?: number | string
          label?: string
          query?: string
        }
      }
    }

    interface GetMmsListParams {
      id?: string
      page: number
      limit: number
    }
    interface GetMmsListRes {
      status: string
      message: string
      data: MmsListItem[]
    }
    interface MmsListItem {
      id: string
      sign: string
      account: string
      type: string
      file_type: string
      storeAt: string
      filePath: string
      fileSize: string
      expireAt: string
      status: string
      datetime: string
    }
    // 获取彩信素材模板参数
    interface GetMmsMaterialListParams {
      page: number
      tag: string
      status: string
      order_by: string
      search_type: string
      keywords: string
    }

    // 获取彩信素材模板返回值
    interface getMmsMaterialItem {
      category: string
      checked: string
      cm_status: string
      create_at: string
      ct_status: string
      cu_status: string
      edit_at: string
      fct: string
      folder: string
      id: string
      message: any
      mms_type: string
      partofsubject: string
      reject_reson: string
      sign: string
      signature: string
      status: string
      subject: string
      tag: string
      title: string
    }
    interface GetMmsMaterialListRes {
      rows: number
      templates: getMmsMaterialItem[]
    }
    // 将彩信模板上报至运营商
    interface UploadMmsLibsParams {
      mms_template_id: string
    }
    interface UploadMmsLibsRes {
      mmsSubject: string
      sign: string
    }

    // 获取非直签客户信息参数
    interface GetDicConfigParams {}

    // 非直签客户信息返回值
    interface GetDicConfigItems {
      id: string
      credits: string
      datetime: string
      status: string
      belongRegionCode: string
      customerName: string
      customerContactName: string
      customerContactMob: string
      customerContactEmail: string
      businessType: string
      industryTypeCode: string
      companyLogo: string
      contractNo: string
      contractName: string
      contractEffectiveDate: string
      contractExpiryDate: string
      contractRenewStatus: string
      contractRenewDate: string
      contractAccessory: string
      subhook_signature: string
      subhook_url: string
      unifySocialCreditCodes: string
      enterpriseOwnerName: string
      certificateType: '01' | '02' | '03' // 1居民身份证,2人名
      certificateCode: string
      region: string
      province: string
      city: string
    }

    // / 注册非直签客户信息参数
    interface signupForCspAccountParams {
      customerName: string
      customerContactName: string
      customerContactMob: string
      customerContactEmail: string
      businessType: string
      industryTypeCode: string
      contractNo: string
      contractName: string
      contractEffectiveDate: string
      contractExpiryDate: string
      contractRenewStatus: string
      contractRenewDate: string
      companyLogo: string
      contractAccessory: string
      unifySocialCreditCodes: string
      enterpriseOwnerName: string
      certificateType: string
      certificateCode: string
      regionCode: string
      provinceCode: string
      cityCode: string
    }
    interface signupForCspAccountItems {}

    // / 注册非直签客户信息参数
    interface saveupForCspAccountParams {
      customerName: string
      customerContactName: string
      customerContactMob: string
      customerContactEmail: string
      businessType: string
      industryTypeCode: string
      contractNo: string
      contractName: string
      contractEffectiveDate: string
      contractExpiryDate: string
      contractRenewStatus: string
      contractRenewDate: string
      companyLogo: string
      contractAccessory: string
      unifySocialCreditCodes: string
      enterpriseOwnerName: string
      certificateType: string
      certificateCode: string
      regionCode: string
      provinceCode: string
      cityCode: string
    }
    interface saveupForCspAccountItems {}

    // 通过文件获取号码数据
    interface GetDataFromFileParams {
      file: any
    }
    interface GetDataFromFileRes {
      data: string[][]
      org_name: string
      oss_path: string
      status: string
      message?: string
    }

    // 获取发送任务地址簿
    interface GetSendAddressParams {
      page: number
      type: number
    }
    interface GetSendAddressRes {
      addressbooks: Addressbooks
      parent_addressbooks: Addressbooks
      exportconfirm: string
      mob: string
      page: number
      rows: number
      sendconfirm: string
      status: number
      subaccount_sms_addressbook_shared: boolean
    }
    type Addressbooks = AddressbooksObj | AddressbooksItem[][]
    interface AddressbooksObj {
      [key in string]: AddressbooksItem[]
    }
    interface AddressbooksItem {
      address: string
      addressbook_name: string
      folder: string
      folder_name: string
      folder_sign: string
      folder_tag: '0' | '1' | '2' | '3' | '4' | '5' | '6'
      id: string
      sign: string
      tag: '0' | '1' | '2' | '3' | '4' | '5' | '6'
      update_at: string
    }
    type Addressmod =
      | 'addressbook'
      | 'file'
      | 'input'
      | 'paste'
      | 'parent_addressbook'
    type AddressDataToItem = {
      to: string
      var: {
        [key in string]: string
      }
    }
    type AddressData = AddressDataToItem | string[] | string
    interface getSendNumberParams {
      addressmod: Addressmod
      address_data: AddressData
    }
    interface getSendNumberRes {
      total: number
      status: string
      message?: string
    }

    // 创建发送任务
    interface CreateRcsSendParams {
      appid: string
      template_id: string
      tos: string
      vars: string
      mms: 'true' | 'false'
      sms: 'true' | 'false'
      addressmod: Addressmod
      address_data: AddressData
      isTimetosend: 'true' | 'false'
      timetosend_date: string
      timetosend_hour: string
      timetosend_minute: string
      title: string
    }
    // 更新chatbot信息参数
    interface updateChatbotParams {
      name: string
      bind: string
      logo: string
      callback: string
      email: string
      website: string
      tcPage: string
      address: string
      colour: string
      backgroundImage: string
      category: string
      provider: string
      providerSwitchCode: string
      description: string
      menu: string
      genericCssTemplate: string
      autograph: string
      attachment: string
      actualIssueIndustry: string
      debugWhiteAddress: string
      appid: string
    }
    interface updateChatbotItems {}
    interface SaveFixedMenuParams {
      appid: string
      message: string
    }
    // 获取地址簿参数
    interface GetMobAddressbooksParams {
      page: number
      tag: string
      order_by: string
      search_type: string
      keywords: string
    }
    // 获取地址簿返回值
    interface GetMobAddressbooksItems {
      address: string
      folder: string
      id: string
      name: string
      sign: string
      tag: string
    }
    interface GetAddressListRes {
      rows: number
      addressbooks: GetMobAddressbooksItems[]
    }
    // 获取地址簿详情参数
    interface GetMobAddressbookDetailParams {
      page: number
      id: string
      address: string
    }
    // 获取地址簿详情返回值
    interface GetMobAddressbookDetailItems {
      address: string
      id: string
    }
    interface GetAddressbookDetailRes {
      rows: number
      addressbook: GetMobAddressbookDetailItems[]
    }
    interface CreateAddressbooksParams {
      name: string
      tag: string
    }
    // 删除地址簿
    interface DeleteAddressbooksParams {
      id: string
    }
    // 添加地址簿号码
    interface AddAddressMobileListParams {
      id: string
      address: string
      data: any
    }
    // 上传地址簿文件
    interface UploadAddressFileParams {
      file: any
    }
    interface UploadAddressFileRes {
      id: string
      hascontact: number
      status: string
      type: string
      file: string
    }
    // 删除手机号参数
    interface DeleteAddressMobParams {
      id: string
      addressbook: string
    }
    // 清空地址簿参数
    interface TruncateMobParams {
      id: string
    }

    // 获取地址簿文件夹参数
    interface GetAddressbooksFolderParams {
      id: string
      type: number
      page: number
      tag: string
      order_by: string
      search_type: string
      keywords: string
    }
    // 获取地址簿文件夹返回值
    interface GetMobAddressbooksFolderItems {
      create_at: string
      description: string
      id: string
      num: string
      sign: string
      tag: string
      title: string
      update_at: string
    }
    interface GetAddressFolderListRes {
      rows: number
      folders: GetMobAddressbooksFolderItems[]
    }

    // 移动地址簿
    interface MoveAddressBookParams {
      ids: string //地址簿id
      folder: string //文件夹id
      type: number
      flag: number
    }
    // 更新地址簿标签
    interface UpdateAddressBookTagParams {
      ids: string //地址簿id
      type: number
      tag: string
    }
    // 创建地址簿文件夹
    interface CreateAddressbooksFolderParams {
      id: string
      title: string
      description: string
      type: 1
      tag: string
    }
    // 删除地址簿文件夹
    interface DeleteAddressbooksFolderParams {
      id: string
      type: number
    }
    // 获取地址簿详文件夹
    interface GetFolderDetailParams {
      id: string
      type: number
      tag: string
      order_by: string
      page: number
      keywords: string
      search_type: string
    }
    interface GetFolderDetailItems {
      id: string
      account: string
      address: string
      datetime: string
      name: string
      sign: string
      tag: string
      update_at: string
    }
    interface GetFolderDetailRes {
      rows: number
      addressbook: GetFolderDetailItems[]
    }
    //清空地址簿中文件夹
    interface ClearFolderAddressParams {
      ids: string
      folder: string
      type: number
    }
    //批量删除文件夹
    interface BatchDeleteFolderParams {
      id: string
      type: number
    }
    //批量更新文件夹颜色标签
    interface BatchUpdateFolderTagParams {
      id: string
      type: number
      tag: string
    }
  }
}
