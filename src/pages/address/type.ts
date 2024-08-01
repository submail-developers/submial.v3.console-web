import address_none from '@/assets/rcs/address/address_none.png'
import address_red from '@/assets/rcs/address/address_red.png'
import address_cyan from '@/assets/rcs/address/address_cyan.png'
import address_purple from '@/assets/rcs/address/address_purple.png'
import address_blue from '@/assets/rcs/address/address_blue.png'
import address_green from '@/assets/rcs/address/address_green.png'
import address_yellow from '@/assets/rcs/address/address_yellow.png'

import folder_none from '@/assets/rcs/address/folder_none.png'
import folder_red from '@/assets/rcs/address/folder_red.png'
import folder_purple from '@/assets/rcs/address/folder_purple.png'
import folder_cyan from '@/assets/rcs/address/folder_cyan.png'
import folder_blue from '@/assets/rcs/address/folder_blue.png'
import folder_green from '@/assets/rcs/address/folder_green.png'
import folder_yellow from '@/assets/rcs/address/folder_yellow.png'

export enum folderImgEnum {
  folder_none,
  folder_red,
  folder_purple,
  folder_cyan,
  folder_blue,
  folder_green,
  folder_yellow,
}
export enum addressImgEnum {
  address_none,
  address_red,
  address_purple,
  address_cyan,
  address_blue,
  address_green,
  address_yellow,
}

export enum TagsColorEnum {
  'tag-none',
  'tag-red',
  'tag-purple',
  'tag-cyan',
  'tag-blue',
  'tag-green',
  'tag-yellow',
}

// 根据枚举值选择图片路径
export function getFolderPath(imgEnum: folderImgEnum): string {
  switch (imgEnum) {
    case folderImgEnum.folder_none:
      return folder_none
    case folderImgEnum.folder_red:
      return folder_red
    case folderImgEnum.folder_purple:
      return folder_purple
    case folderImgEnum.folder_cyan:
      return folder_cyan
    case folderImgEnum.folder_blue:
      return folder_blue
    case folderImgEnum.folder_green:
      return folder_green
    case folderImgEnum.folder_yellow:
      return folder_yellow
    default:
      return folder_none // 默认返回无标签
  }
}
export function getAddressPath(imgEnum: addressImgEnum): string {
  switch (imgEnum) {
    case addressImgEnum.address_none:
      return address_none
    case addressImgEnum.address_red:
      return address_red
    case addressImgEnum.address_purple:
      return address_purple
    case addressImgEnum.address_cyan:
      return address_cyan
    case addressImgEnum.address_blue:
      return address_blue
    case addressImgEnum.address_green:
      return address_green
    case addressImgEnum.address_yellow:
      return address_yellow
    default:
      return address_none // 默认返回无标签
  }
}

export const tags = [
  { label: '无标签', value: 'tag-none' },
  { label: '红色标签', value: 'tag-red' },
  { label: '紫色标签', value: 'tag-purple' },
  { label: '青色标签', value: 'tag-cyan' },
  { label: '蓝色标签', value: 'tag-blue' },
  { label: '绿色标签', value: 'tag-green' },
  { label: '黄色标签', value: 'tag-yellow' },
]

let _tags_key = []
let _tags_number = []
tags.forEach((item) => {
  _tags_key.push({
    label: item.label,
    key: item.value,
  })
  _tags_number.push({
    label: item.label,
    value: `${TagsColorEnum[item.value]}`,
  })
})

export const tags_key = _tags_key
export const tags_number = _tags_number
