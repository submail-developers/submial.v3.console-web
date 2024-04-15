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
      menu: any
      genericCssTemplate: string
      autograph: string
      attachment: string
      actualIssueIndustry: string
      eTag: string
      debugWhiteAddress: string // 白名单
      sendApi: string
    }
    interface GetChatbotRes {
      status: string
      message: string
      total: 1
      list: ChatbotItem[]
    }

    // 获取行业一级、二级编码信息
    interface GetIndustryRes {
      status: string
      message: string
      data: IndustryItem[]
    }
    interface IndustryItem {
      ctCode: string
      ctName: string
      sub_data: SubIndustryItem[]
    }
    interface SubIndustryItem {
      cmCode: string
      subcode: string
      cmName: string
    }
    // 获取大区，省市相关信息
    interface GetRegionRes {
      status: string
      message: string
      data: RegionItem[]
    }
    interface RegionItem {
      regionCode: string
      region: string
      province: ProvinceItem[]
    }
    interface ProvinceItem {
      provinceCode: string
      province: string
      city: CityItem[]
    }
    interface CityItem {
      cityCode: string
      city: string
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
      page: stirng
      limit: stirng
      keyword?: stirng
      type: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | 'all'
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
      //  1 图片,2 音频,3 视频,4 文档,5 表格,6 演示文件,7 压缩文件,8 其他
      type: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'
      storeAt: string
      filePath: string
      fileSize: string
      expireAt: string
      status: string
      datetime: string
      name: string
    }
  }
}
