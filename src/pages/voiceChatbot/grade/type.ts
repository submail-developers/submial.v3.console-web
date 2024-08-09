import AImg from '@/assets/voiceChatbot/grade/A.png'
import BImg from '@/assets/voiceChatbot/grade/B.png'
import CImg from '@/assets/voiceChatbot/grade/C.png'
import DImg from '@/assets/voiceChatbot/grade/D.png'

export enum gradeImgEnum {
  AImg,
  BImg,
  CImg,
  DImg,
}

export type GradeType = 'A' | 'B' | 'C' | 'D'

// 根据枚举值选择图片路径
/**
 *
 */
export function getGradeTypePath(imgEnum: GradeType): string {
  switch (imgEnum) {
    case 'A':
      return AImg
    case 'B':
      return BImg
    case 'C':
      return CImg
    case 'D':
      return DImg
    default:
      return AImg // 默认返回AImg
  }
}
