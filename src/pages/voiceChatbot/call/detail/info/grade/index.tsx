import { Fragment, useEffect, useState } from 'react'
import { Flex, Row, Col, Progress } from 'antd'
import { API } from 'apis'

type Props = {
  data: API.VCTaskGradeItem[]
}

type T = API.VCTaskGradeItem & {
  rate: string
}

const initData: T[] = [
  {
    intention: 'A',
    num: 0,
    rate: '0',
  },
  {
    intention: 'B',
    num: 0,
    rate: '0',
  },
  {
    intention: 'C',
    num: 0,
    rate: '0',
  },
  {
    intention: 'D',
    num: 0,
    rate: '0',
  },
]

// 意向客户
export default function Fn(props: Props) {
  const [list, setList] = useState<T[]>([])
  useEffect(() => {
    if (props.data.length > 0) {
      let total = 0
      total = props.data.reduce(
        (accumulator, currentValue) => accumulator + Number(currentValue.num),
        0,
      )
      let _list: T[] = []
      props.data.forEach((item) => {
        _list.push({
          ...item,
          rate: total > 0 ? ((Number(item.num) / total) * 100).toFixed(2) : '0',
        })
      })
      setList(_list)
    } else {
      setList(initData)
    }
  }, [props.data])
  return (
    <Row gutter={[0, 20]}>
      {list.map((item) => (
        <Fragment key={item.intention}>
          <Col span={14}>
            <Flex align='center' wrap='wrap' gap={12}>
              <div>{item.intention}类客户</div>
              <div style={{ width: 100 }}>
                <Progress
                  percent={Number(item.rate)}
                  showInfo={false}
                  size={'small'}
                />
              </div>
            </Flex>
          </Col>
          <Col span={5}>{item.num}</Col>
          <Col span={5}>{item.rate}%</Col>
        </Fragment>
      ))}
    </Row>
  )
}
