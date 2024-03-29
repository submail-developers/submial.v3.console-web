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
  }
}
