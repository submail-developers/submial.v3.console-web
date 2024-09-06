import { Fragment } from 'react'
import { Row, Col, Flex, Progress } from 'antd'

import { API } from 'apis'

type Props = {
  data: API.IntentionList
}

type Item = {
  label: string
  value: number
  rate: string
}

export default function Fn(props: Props) {
  let list: Item[] = []

  let total = 0
  if (props.data) {
    Object.values(props.data).forEach((item) => {
      total += Number(item)
    })
    Object.entries(props.data).forEach(([key, value]) => {
      list.push({
        label: key,
        value: value,
        rate: total > 0 ? ((Number(value) / total) * 100).toFixed(2) : '0',
      })
    })
  }

  return (
    <Row gutter={[0, 20]}>
      {list.map((item) => (
        <Fragment key={item.label}>
          <Col span={14}>
            <Flex align='center' wrap='wrap' gap={12}>
              <div>{item.label}类客户</div>
              <div style={{ width: 100 }}>
                <Progress
                  percent={Number(item.rate)}
                  showInfo={false}
                  size={'small'}
                />
              </div>
            </Flex>
          </Col>
          <Col span={5}>{item.value}</Col>
          <Col span={5}>{item.rate}%</Col>
        </Fragment>
      ))}
    </Row>
  )
}
