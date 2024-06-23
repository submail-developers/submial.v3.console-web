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
      status: '0' | '1' | '2' | '3' //  0=未提交(保存)，1=我方通过，2=我们驳回，3=我方审核中
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
      menu?: {
        menu: {
          entries: EntriesItem[]
        }
      }
      menu_status: '1' | '2' | '3' // 固定菜单审核状态 1通过  2不通过  3审核中
      genericCssTemplate: string
      autograph: string
      attachment: string
      actualIssueIndustry: string
      eTag?: string
      debugWhiteAddress: string // 白名单
      sendApi: string
      messageId?: string
      menu_etag?: string
      interactive?: '0' | '1' // 是否配置交互 0未配置1已配置
    }
    interface EntriesItem extends RcsSuggestionItem {
      menu?: {
        displayText: string
        postback?: {
          data?: string
        }
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
    interface GetRcsOverviewRes {
      credits: number
      account_status: '0' | '1' | '2' | '9' //账户状态 0-未提交,1-通过,2-未通过,9-待审核
      template: {
        all: number
        pass: number
      }
      chatbot: {
        all: number
        pass: number
      }
      task: {
        all: number
        timetosend: number
      }
      addressbook: {
        addressbooks: number
        folder: number
      }
    }

    // 账户概览-echarts
    interface PointItem {
      cnt: number | string // 数量
      dateflg: string // 日期
    }
    interface HotPointItem {
      cnt: number | string // 数量
      dateflg: string // 日期
      hourflg: number | string // 小时
    }
    interface SendAnalysis {
      dropped: number
      pending: number
      rcs: number
      sms: number
      mms: number
    }
    interface RcsAnalysis {
      // 发送概览
      points: {
        request: PointItem[]
        deliveryed: PointItem[]
        dropped: PointItem[]
      }
      // 发送时段
      hotpoints: HotPointItem[]
      // 发送详情
      send_analysis: SendAnalysis
    }
    interface GetRcsAnalysisOverviewParams {
      start: string
      end: string
    }
    interface GetRcsAnalysisOverviewRes {
      analysis: RcsAnalysis
      message?: string
      status?: string
    }

    // rcs资源包
    interface RcsPackagesItem {
      id: string
      type: string
      title: string // 标题
      credit: string // 条数
      price: string // 价格
      old_price: string // 旧的价格
      sale: string
      tn: string
      unit_price: string
      enable: string
      extra: string
      for_promotions: string
      ngp_package: string
    }
    interface GetRcsPackagesRes {
      message?: string
      status?: string
      packages: RcsPackagesItem[]
    }

    // 发票
    // 0普票，1专票，2电子普票，3电子专票，现在0跟1已经没有了，只有电子发票普票跟专票了
    type InvoiceType = '0' | '1' | '2' | '3'
    interface InvoiceItem {
      id: string
      invoice_type: InvoiceType
      first_name: string
      last_name: string
      tel: string
      province: string
      city: string
      district: string
      address: string
      invoice_title: string
      invoice_tax_code: string
      invoice_address: string
      invoice_tel: string
      invoice_bank: string
      invoice_bank_account: string
      remark: string
      default: string
    }
    interface GetInvoicesRes {
      message?: string
      status?: string
      invoices: InvoiceItem[]
    }
    interface ShopcarItem extends RcsPackagesItem {
      vol: number // 数量
    }
    // 创建订单
    interface CreateOrderParams {
      shopcar: CreateOrderParamsItem[]
      invoice: string
    }
    interface CreateOrderRes {
      create_at: string
      ordernumber: string
      price: number
      status?: string
    }
    interface CancalOrderParams {
      ordernumber: string
    }
    interface GetPayStatusParams {
      ordernumber: string
    }
    interface GetPayStatusRes {
      order: 'pending' | 'complete' | 'canceled' // pending支付中, complete支付成功, canceled取消
      status: string
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
      mmsTemplate?: string
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
      interactive?: '0' | '1' // 是否配置交互 0未配置1已配置
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
      postback?: {
        data?: string
      }

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
          phoneNumber: string
          fallbackUrl?: string // 话单推送地址
        }
        // 	增强通话事件
        dialEnrichedCall?: {
          phoneNumber: string
          fallbackUrl?: string // 话单推送地址
          subject?: string
        }
        // 视频通话
        dialVideoCall?: {
          phoneNumber: string
          fallbackUrl?: string // 话单推送地址
        }
      }
      // 地图事件
      mapAction?: {
        // mapType: '0' ｜ "1" // 地图类型 0经纬度1位置
        showLocation: {
          location: {
            longitude?: number | string
            latitude?: number | string
            label?: string
            query?: string
          }
        }
      }
      calendarAction?: {
        createCalendarEvent?: {
          title?: string
          description?: string
          startTime?: string
          endTime?: string
          fallbackUrl?: string
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
      status: '0' | '1' | '2' | '9' // 0未提交 1审核通过 2审核驳回 9审核中
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
      contractRenewStatus: '0' | '1'
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
      remarkText: string
      reject_reason: string
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
      addressfile_oss_path?: string // 文件导入时传递文件的路径
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
      exportconfirm: string
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
    //获取上行交互列表
    interface GetRcsInteractiveListParams {
      appid?: string // chatbot id
      template_id?: string // 模版id
      id?: string
    }
    interface GetRcsInteractiveListResItem {
      card_id: string // 模版的信息
      card_template_sign: string
      card_template_title: string
      card_button: string // 模版对应的按钮的信息(模版按钮/悬浮按钮)
      card_button_action: string
      card_button_title: string
      chatbotId: string
      create_at: string
      fixed_button: string // chatbot的固定菜单信息
      fixed_button_action: string
      fixed_button_title: string
      id: string
      keywords: string
      match_type: '1' | '2' | '3' // 1全文匹配  2关键字包含  3正则表达式
      reply_id: string // 下行模版信息
      reply_sign: string
      reply_title: string
      title: string
      type: '1' | '2' | '3' //  1chatbot固定菜单  2模板-悬浮菜单和message交互按键  3纯文字消息
      update_at: string
      enabled: '0' | '1' // 0关闭1开启
    }
    //创建上行交互
    interface CreateRcsInteractiveParams {
      id?: string
      title?: string
      type?: '1' | '2' | '3' //  1chatbot固定菜单  2模板-悬浮菜单和message交互按键  3纯文字消息
      reply_message?: string // 模版id
      chatbotId?: string // type 1/3必传
      card_id?: string // 模版id // type 2必传
      match_type?: '1' | '2' | '3' // 1全文匹配  2关键字包含  3正则表达式
      keywords?: string // 关键字/正则
      button_data?: string
    }

    interface ChangeRcsInteractiveAllStatusParams {
      appid?: string
      template_id?: string
      status: boolean
    }

    // 获取错误日志
    interface GetErrorLogsParams {
      page: number
      start: string
      end: string
    }
    // 获取地址簿文件夹返回值
    interface GetErrorLogsItems {
      api: string
      appid: string
      code: string
      date: string
      description: string
      ip: string
      message: string
    }
    interface GetErrorLogsRes {
      rows: number
      errors: GetErrorLogsItems[]
    }
    // 获取错误日志
    interface GetErrorsLogsParams {
      appid: string
      page: number
      limit: number
      start: string
      end: string
    }
    // 获取api错误日志返回值
    interface GetErrorsLogsItems {
      account: string
      api: string
      appid: string
      code: string
      datetime: string
      error_key: string
      message: string
      id: string
      ip: string
      msg: string
      product: string
    }
    interface GetErrorsLogsRes {
      rows: number
      data: GetErrorsLogsItems[]
    }
    // 获取批量任务发送报告
    interface GetSendlistsParams {
      page: number
      limit: number
      start: string
      end: string
      status: string
      type: string
      order_by: string
      keywords: string
    }
    // 获取批量任务发送报告返回值
    interface GetSendlistsItems {
      account: string
      api: string
      appid: string
      code: string
      datetime: string
      error_key: string
      message: string
      id: string
      ip: string
      msg: string
      product: string
    }
    interface GetSendlistsRes {
      rows: number
      data: GetSendlistsItems[]
    }
    // 获取批量报告参数
    interface GetSendlistReportParams {
      sendlist: string
    }
    interface GetSendlistReportResInfo {
      id: string
      title: string
      account: string
      appid: string
      project: string
      address: string
      type: string
      timetosend: string
      send: string
      sent: string
      status: '0' | '1' | '9' // '1发送完成  0尚未开始  9已撤销',
      ip_address: string
      errors: string
      shortMessageSupported: 'true' | 'false' // 是否支持短信回落
      smsBodyText: string
      multimediaMessageSupported: 'true' | 'false' // 是否支持彩信回落
      mmsSubject: string
      mmsContentLength: string
      mmsBodyText: string
      addressbook: string
      addressfile_oss_path: string // 通过文件导入的方式创建发送任务的文件地址
      resend_status: string
      resend_enable: string
      resend_sendlist: string
      chatbot_name: string
      template_id: string
      template_name: string
    }
    interface SendAddressItem {
      address: string
      create_at: string
      folder: string
      name: string
      sign: string
      tag: string
      update_at: string
    }
    interface GetSendlistReportRes {
      status: string
      sendlist: GetSendlistReportResInfo
      addressbooks: []
      exportconfirm: string
      mob: string
    }

    interface GetSendanalysisreportParams {
      sendlist: string
    }
    interface GetSendanalysisreportRes {
      rate: AnalysisRate
      address: string
    }
    // 概览数据分析参数
    interface GetSendlistDeepAnalysisParams {
      sendlist: string
    }
    interface GetSendlistDeepAnalysisRes {
      city: AnalysisCityItem[]
      province: AnalysisProvinceItem[]
      dropreason: AnalysisDropreasonItem[]
      successreason: AnalysisSuccessItem[]
      points: AnalysisPoints
    }
    // 发送明细参数
    interface GetSendlistLogsParams {
      sendlist: string
    }
    interface SendLogItem {
      sendID: string
      send: string
      sent: string
      appid: string
      serviceCode: string
      to: string
      sign: string
      api: string
      ipAddress: string
      message: string
      suggestions: string
      sendlist: string
      conversationID: string
      contributionID: string
      inReplyToContributionID: string
      sms: string
      smsContent: string
      mms: string
      mmsSubject: string
      mmsContent: string
      mobileType: string
      mobileArea: string
      sentType: string
      status: string
      desc: string
    }
    interface GetSendlistLogsRes {
      exportconfirm: string
      history: SendLogItem[]
      mob: string
      page: string
      row: string
    }
    // 获取发送明细返回值
    interface GetSendlistLogsItems {
      sendID: string
      send: string
      sent: string
      appid: string
      serviceCode: string
      to: string
      sign: string
      api: string
      ipAddress: string
      mobileType: string
      mobileArea: string
      status: string
    }
    interface GetSendlistLogsRes {
      row: sting
      history: GetSendlistLogsItems[]
    }

    // 获取api历史明细
    interface GetHistoryParams {
      page: number
      limit: number
      start: string
      end: string
      appid: string
      status: string
      send_id: string
      to: string
      content: string
    }
    // 获取api历史明细返回值
    interface GetHistoryItems {
      account: string
      api: string
      appid: string
      code: string
      datetime: string
      error_key: string
      message: string
      id: string
      ip: string
      msg: string
      product: string
    }
    interface GetHistoryRes {
      exportconfirm: sting
      row: number
      history: GetHistoryItems[]
    }
    // 短信验证
    interface VerifyCodeSmsParams {}
    // api分析报告参数
    interface GetUnionAnalysisParams {
      start: string
      end: string
      appid: string
    }

    type AnalysisCityItem = {
      cnt: string
      city: string
    }
    type AnalysisProvinceItem = {
      cnt: string
      province: string
    }
    type sentType = '0' | '1' | '2' // 0下发为5G消息 1回落为短信 2回落为彩信
    type AnalysisDropreasonItem = {
      cnt: string
      reason: string
    }
    type AnalysisSuccessItem = {
      cnt: string
      sentType: sentType
    }
    type AnalysisRate = {
      request: string
      deliveryed: string
      dropped: string
      fee: string
      address: string
    }
    type AnalysisPoints = {
      request: PointItem[]
      deliveryed: PointItem[]
      dropped: PointItem[]
      fee: PointItem[]
    }
    type GetUnionAnalysis = {
      city: AnalysisCityItem[]
      province: AnalysisProvinceItem[]
      dropreason: AnalysisDropreasonItem[]
      successreason: AnalysisSuccessItem[]
      rate: AnalysisRate
      points: AnalysisPoints
    }
    interface GetUnionAnalysisRes {
      analysis: GetUnionAnalysis
      status: string
    }

    // 短信验证
    interface VerifyCodeSmsParams {}

    // 导出历史明细
    interface ExportHistoryParams {
      start: string
      end: string
      appid: string
      status: string
      send_id: string
      to: string
      content: string
      type: string
    }
  }
}
