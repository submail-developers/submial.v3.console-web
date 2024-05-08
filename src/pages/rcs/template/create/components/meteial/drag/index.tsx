import { API } from 'apis'
import './index.scss'
import { config as dndConfig } from '@/pages/rcs/template/create/dnd'
import { useDrag } from 'react-dnd'

type MediaType = '1' | '2' | '3' // 1图片 2音频 3视频
type T = MediaType | 'all'

type ItemProps = {
  item: API.RcsOnlineMeteialItem
}
type DropResult = API.RcsOnlineMeteialItem

export default function MediaDrag(props: ItemProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: dndConfig.accept,
    item: props.item,
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>()
      if (item && dropResult) {
        console.log(item, dropResult)
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }))
  return <div className='rcs-drag-item' ref={drag} data-testid={`box`}></div>
}
