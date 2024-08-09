import {
  Image,
  Flex,
  Space,
  Button,
  Divider,
  Collapse,
  Row,
  Col,
  DatePicker,
  Spin,
  Form,
  Statistic,
  ConfigProvider,
  App,
  Progress,
} from 'antd'

export default function Fn() {
  return (
    <Row gutter={[0, 20]}>
      <Col span={14}>
        <Flex align='center' wrap='wrap' gap={12}>
          <div>A类客户</div>
          <div style={{ width: 100 }}>
            <Progress percent={20} showInfo={false} size={'small'} />
          </div>
        </Flex>
      </Col>
      <Col span={5}>200</Col>
      <Col span={5}>20%</Col>
      <Col span={14}>
        <Flex align='center' wrap='wrap' gap={12}>
          <div>A类客户</div>
          <div style={{ width: 100 }}>
            <Progress percent={20} showInfo={false} size={'small'} />
          </div>
        </Flex>
      </Col>
      <Col span={5}>200</Col>
      <Col span={5}>20%</Col>
      <Col span={14}>
        <Flex align='center' wrap='wrap' gap={12}>
          <div>A类客户</div>
          <div style={{ width: 100 }}>
            <Progress percent={20} showInfo={false} size={'small'} />
          </div>
        </Flex>
      </Col>
      <Col span={5}>200</Col>
      <Col span={5}>20%</Col>
      <Col span={14}>
        <Flex align='center' wrap='wrap' gap={12}>
          <div>A类客户</div>
          <div style={{ width: 100 }}>
            <Progress percent={20} showInfo={false} size={'small'} />
          </div>
        </Flex>
      </Col>
      <Col span={5}>200</Col>
      <Col span={5}>20%</Col>
    </Row>
  )
}
