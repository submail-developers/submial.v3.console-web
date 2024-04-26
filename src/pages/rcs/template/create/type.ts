export type Media = {
  mediaUrl: string
  mediaContentType: string
  mediaType?: '1' | '2' | '3' // 额外加的字段 1 图片,2 音频,3 视频
  mediaFileSize: string
  height: 'SHORT_HEIGHT' | 'MEDIUM_HEIGHT' | 'TALL_HEIGHT' // 小/中/大图
  thumbnailUrl?: string // 缩略图
  thumbnailContentType?: string // 缩略图类型
  thumbnailFileSize?: number // 缩略图大小
  contentDescription?: string // 卡片描述
}

export type ActionType =
  | 'urlAction'
  | 'dialerAction'
  | 'mapAction'
  | 'calendarAction'
  | 'composeAction'
  | 'deviceAction'
  | 'settingsAction'

export const actionTypeArray: ActionType[] = [
  'urlAction',
  'dialerAction',
  'mapAction',
  'calendarAction',
  'composeAction',
  'deviceAction',
  'settingsAction',
]

export type DialerActionType =
  | 'dialPhoneNumber'
  | 'dialEnrichedCall'
  | 'dialVideoCall'
export const dialerActionTypeArray: DialerActionType[] = [
  'dialPhoneNumber',
  'dialEnrichedCall',
  'dialVideoCall',
]

export type Action = {
  displayText: string
  // 上行文本携带的数据标识
  postback: {
    data: string
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

export const actions = [
  {
    label: '打开浏览器',
    value: 'urlAction',
  },
  {
    label: '拨号事件',
    value: 'dialerAction',
  },
  {
    label: '地图事件',
    value: 'mapAction',
  },
  {
    label: '日历事件',
    value: 'calendarAction',
  },
  // {
  //   label: '草稿事件',
  //   value: 'composeAction',
  // },
  // {
  //   label: '设备事件',
  //   value: 'deviceAction',
  // },
  // {
  //   label: '应用事件',
  //   value: 'settingsAction',
  // },
]

// 上行回复消息
export type Reply = {
  displayText: string
  // 上行文本携带的数据标识
  postback: {
    data: string
  }
}

export type SuggestionItem = {
  action?: Action
  reply?: Reply
}

// 单卡片layout
export type CardLayout = {
  cardOrientation: 'VERTICAL' | 'HORIZONTAL' // 垂直｜水平
  imageAlignment?: 'LEFT' | 'RIGHT' // 水平时必须
  titleFontStyle?: string // 标题 'italics' | 'bold' | 'underline' // 斜体｜粗体｜下划线。可多选，多选用英文逗号隔开
  descriptionFontStyle?: string // 描述
  style?: string
}
// 多卡片layout
export type CardsLayout = {
  cardWidth: 'SMALL_WIDTH' | 'MEDIUM_WIDTH' // 小图｜中图
  titleFontStyle?: string // 标题 'italics' | 'bold' | 'underline' // 斜体｜粗体｜下划线。可多选，多选用英文逗号隔开
  descriptionFontStyle?: string // 描述
  style?: string
}
