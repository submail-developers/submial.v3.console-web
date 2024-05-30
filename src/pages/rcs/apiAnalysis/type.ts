import address_blue from '@/assets/rcs/address/address_blue.png'
import address_cyan from '@/assets/rcs/address/address_cyan.png'
import address_green from '@/assets/rcs/address/address_green.png'
import address_purple from '@/assets/rcs/address/address_purple.png'
import address_red from '@/assets/rcs/address/address_red.png'
import address_yellow from '@/assets/rcs/address/address_yellow.png'

import folder_red from '@/assets/rcs/address/folder_red.png'
import folder_purple from '@/assets/rcs/address/folder_purple.png'
import folder_cyan from '@/assets/rcs/address/folder_cyan.png'
import folder_blue from '@/assets/rcs/address/folder_blue.png'
import folder_green from '@/assets/rcs/address/folder_green.png'
import folder_yellow from '@/assets/rcs/address/folder_yellow.png'

import apiIco1 from '@/assets/rcs/analysis/apiInfo1.png'
import apiIco2 from '@/assets/rcs/analysis/apiInfo2.png'
import apiIco3 from '@/assets/rcs/analysis/apiInfo3.png'
import apiIco4 from '@/assets/rcs/analysis/apiInfo4.png'
import apiIco5 from '@/assets/rcs/analysis/apiInfo5.png'
import apiIco6 from '@/assets/rcs/analysis/apiInfo6.png'

export enum apiImgEnum {
  apiIco1 = 1,
  apiIco2,
  apiIco3,
  apiIco4,
  apiIco5,
  apiIco6,
}

// 根据枚举值选择图片路径
export function getApiIcoPath(imgEnum: apiImgEnum): string {
  switch (imgEnum) {
    case apiImgEnum.apiIco1:
      return apiIco1
    case apiImgEnum.apiIco2:
      return apiIco2
    case apiImgEnum.apiIco3:
      return apiIco3
    case apiImgEnum.apiIco3:
      return address_blue
    case apiImgEnum.apiIco4:
      return apiIco4
    case apiImgEnum.apiIco5:
      return apiIco5
    default:
      return apiIco6
  }
}
