import { API } from 'apis'

// 素材
export type Media = {
  mediaUrl: string
  mediaContentType: string
  mediaType?: '1' | '2' | '3' // 额外加的字段 1 图片,2 音频,3 视频
  mediaOssUrl?: string // 额外加的字段 展示图片使用
  mediaFileSize: string
  height: 'SHORT_HEIGHT' | 'MEDIUM_HEIGHT' | 'TALL_HEIGHT' // 小/中/大图
  thumbnailUrl?: string // 缩略图
  thumbnailContentType?: string // 缩略图类型
  thumbnailFileSize?: number // 缩略图大小
  contentDescription?: string // 卡片描述
}

// 事件类型
export type ActionType =
  | 'urlAction'
  | 'dialerAction'
  | 'mapAction'
  | 'calendarAction'
// | 'composeAction'
// | 'deviceAction'
// | 'settingsAction'

export const actionTypeArray: ActionType[] = [
  'urlAction',
  'dialerAction',
  'mapAction',
  'calendarAction',
  // 'composeAction',
  // 'deviceAction',
  // 'settingsAction',
]

// 拨号类型: 普通通话 | 增强通话 | 视频通话
export type DialerActionType =
  | 'dialPhoneNumber'
  | 'dialEnrichedCall'
  | 'dialVideoCall'
export const dialerActionTypeArray: DialerActionType[] = [
  'dialPhoneNumber',
  'dialEnrichedCall',
  'dialVideoCall',
]

export type Action = API.RcsSuggestionItem

// 事件类型
export const menuTypes = [
  {
    label: '菜单',
    value: 'menu',
  },
  {
    label: '回复事件',
    value: 'reply',
  },
  {
    label: '交互事件',
    value: 'action',
  },
]
// 事件类型
export const btnTypes = [
  {
    label: '回复事件',
    value: 'reply',
  },
  {
    label: '交互事件',
    value: 'action',
  },
]
// 事件类型
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

// 单卡片message
export type CardMessage = {
  generalPurposeCard: GeneralPurposeCard
}
export type GeneralPurposeCard = {
  content: CardContent
  layout: CardLayout
}
// 单卡片content
export type CardContent = {
  title: string
  description: string
  media: Media
  suggestions: Action[]
}
// 单卡片layout
export type CardLayout = {
  cardOrientation: 'VERTICAL' | 'HORIZONTAL' // 垂直｜水平
  imageAlignment?: 'LEFT' | 'RIGHT' // 水平时必须
  titleFontStyle?: string // 标题 'italics' | 'bold' | 'underline' // 斜体｜粗体｜下划线。可多选，多选用英文逗号隔开
  descriptionFontStyle?: string // 描述
  style?: string
}

// 多卡片 message
export type CardsMessage = {
  generalPurposeCardCarousel: GeneralPurposeCards
}
export type GeneralPurposeCards = {
  content: CardContent[]
  layout: CardsLayout
}
// 多卡片layout
export type CardsLayout = {
  cardWidth: 'SMALL_WIDTH' | 'MEDIUM_WIDTH' // 小图｜中图
  titleFontStyle?: string // 标题 'italics' | 'bold' | 'underline' // 斜体｜粗体｜下划线。可多选，多选用英文逗号隔开
  descriptionFontStyle?: string // 描述
}
export type CardsItem = {
  media: Media
  title: string
  description: string
  suggestions: Action[]
}
export type ContentItem = {
  media: Media
  title: string
  description: string
  suggestions: Action[]
}
