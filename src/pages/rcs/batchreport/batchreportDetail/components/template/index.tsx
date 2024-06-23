import { useEffect, useState } from 'react'
import { Space, Flex, Button, Skeleton, Empty } from 'antd'

import './index.scss'
import { API } from 'apis'
import { getRcsTempList } from '@/api'
import ACopy from '@/components/aCopy'
import TextItem from '@/pages/rcs/template/create/text/item'
import CardItem from '@/pages/rcs/template/create/card/item'
import CardsItem from '@/pages/rcs/template/create/cards/item'

type Props = {
  templateId: string
}
export default function Fn({ templateId }: Props) {
  const [loading, setLoading] = useState(false)
  const [item, setItem] = useState<API.RcsTempListItem>()
  const getTemp = async () => {
    try {
      const res = await getRcsTempList({
        page: 1,
        limit: 10,
        id: templateId,
        keyword: '',
        status: '1',
      })
      if (res.list[0]) {
        setItem(res.list[0])
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  useEffect(() => {
    setLoading(true)
    if (templateId) {
      getTemp()
    }
  }, [templateId])
  return (
    <div className='batch-template'>
      {item && !loading && (
        <>
          <Flex justify='space-between'>
            <div>
              <div className='fn18 fw-500'>{item?.title}</div>
              <div>创建时间：{item?.createAt}</div>
            </div>

            <Button
              style={{ padding: '0 4px', color: '#fd29a4' }}
              size='small'
              icon={<span className='icon iconfont icon-id fn14'></span>}>
              {item?.sign}
              <ACopy text={item?.sign} title='点击复制ID' />
            </Button>
          </Flex>
          <div className='preview-model p-12'>
            <div className='temp-type fx-center-center p-x-16 fn12'>
              {item.type == 1 && '纯文本模版'}
              {item.type == 2 && '单卡片模版'}
              {item.type == 3 && '多卡片模版'}
              {item.type == 4 && '文件模版'}
            </div>
            <div className='preview-content'>
              {item.type == 1 && <TextItem message={item.message.message} />}
              {item.type == 2 && <CardItem message={item.message.message} />}
              {item.type == 3 && <CardsItem message={item.message.message} />}
              {item.type == 4 && <div>文件模版暂未开发</div>}
            </div>

            <Space align='center' className='float-wrap'>
              {item.suggestions?.suggestions
                .filter((item) => Boolean(item.action))
                .map((item, index) => (
                  <div className='float-item' key={index}>
                    {item.action.displayText}
                  </div>
                ))}
            </Space>
          </div>
        </>
      )}
      {loading && (
        <div className='w-100'>
          <Flex justify='space-between'>
            <Skeleton.Node
              active
              style={{ width: 200, height: 32 }}
              className='m-t-4'>
              <div style={{ width: 200 }}></div>
            </Skeleton.Node>
            <Skeleton.Node
              active
              style={{ width: 60, height: 32 }}
              className='m-t-4'>
              <div style={{ width: 60 }}></div>
            </Skeleton.Node>
          </Flex>
          <Skeleton.Node
            active
            style={{ width: 240, height: 24 }}
            className='m-t-4'>
            <div style={{ width: 240 }}></div>
          </Skeleton.Node>
          <Skeleton.Node
            active
            style={{ width: 324, height: 300 }}
            className='m-t-12'>
            <div style={{ width: 324 }}></div>
          </Skeleton.Node>
        </div>
      )}
      {!item && !loading && (
        <div>
          <Flex justify='space-between'>
            <Skeleton.Node style={{ width: 200, height: 32 }} className='m-t-4'>
              <div style={{ width: 200 }}></div>
            </Skeleton.Node>
            <Skeleton.Node style={{ width: 60, height: 32 }} className='m-t-4'>
              <div style={{ width: 60 }}></div>
            </Skeleton.Node>
          </Flex>
          <Skeleton.Node style={{ width: 240, height: 24 }} className='m-t-4'>
            <div style={{ width: 240 }}></div>
          </Skeleton.Node>
          <Empty description='未查询到模版' className='m-t-24' />
        </div>
      )}
    </div>
  )
}
