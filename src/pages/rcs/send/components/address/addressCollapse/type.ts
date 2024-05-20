import address_blue from '@/assets/rcs/address/address_blue.png'
import address_cyan from '@/assets/rcs/address/address_cyan.png'
import address_green from '@/assets/rcs/address/address_green.png'
import address_icon from '@/assets/rcs/address/address_icon.png'
import address_purple from '@/assets/rcs/address/address_purple.png'
import address_red from '@/assets/rcs/address/address_red.png'
import address_yellow from '@/assets/rcs/address/address_yellow.png'

import folder_red from '@/assets/rcs/address/folder_red.png'
import folder_purple from '@/assets/rcs/address/folder_purple.png'
import folder_cyan from '@/assets/rcs/address/folder_cyan.png'
import folder_blue from '@/assets/rcs/address/folder_blue.png'
import folder_green from '@/assets/rcs/address/folder_green.png'
import folder_yellow from '@/assets/rcs/address/folder_yellow.png'

export enum folderImgEnum {
  folder_red = 1,
  folder_purple,
  folder_cyan,
  folder_blue,
  folder_green,
  folder_yellow,
}
export enum addressImgEnum {
  address_red = 1,
  address_purple,
  address_cyan,
  address_blue,
  address_green,
  address_yellow,
}
// 根据枚举值选择图片路径
export function getFolderPath(imgEnum: folderImgEnum): string {
  switch (imgEnum) {
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
      return folder_blue // 默认返回黄色文件夹图片
  }
}
export function getAddressPath(imgEnum: addressImgEnum): string {
  switch (imgEnum) {
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
      return address_blue // 默认返回黄色文件夹图片
  }
}
