import { useState, useEffect } from 'react'
import {
  Flex,
  Space,
  Row,
  Col,
  Button,
  Divider,
  Input,
  Table,
  Image,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import PageContent from '@/components/pageContent'
import { API } from 'apis'
import jiqirenImg from '@/assets/rcs/jiqiren.png'

import './index.scss'

const { TextArea } = Input
interface DataType extends API.GetChatbotListItem {}
export default function Fn() {
  const [tableData, settableData] = useState([
    { name: '1223' },
    { name: '123' },
  ])

  const columns: ColumnsType<DataType> = [
    {
      title: '版本',
      className: 'paddingL30',
      width: 80,
      render: (_, record) => <span>1</span>,
    },
    {
      title: '操作人',
      className: 'paddingL30',
      width: 100,
      render: (_, record) => <span>张涟云</span>,
    },
    {
      title: '操作时间',
      width: 160,
      render: (_, record) => <span>2024-04-09 21:19:08</span>,
    },
    {
      title: '操作类型',
      width: 100,
      render: (_, record) => <span>新增</span>,
    },
    {
      title: '操作结果',
      width: 100,
      render: (_, record) => <span>通过</span>,
    },
    {
      title: '意见',
      width: 160,
      render: (_, record) => <span>全国下Chatbot调试号码审核免审通过</span>,
    },
  ]

  return (
    <PageContent extClass='chatbot-detail'>
      <Image src={jiqirenImg} preview={false} width={48}></Image>
      <Flex justify='space-between' align='center' style={{ marginTop: '4px' }}>
        <div className='fn22'>申请/管理 Chatbot</div>
        <Space>
          <Button>编辑</Button>
          <Button>注销</Button>
        </Space>
      </Flex>
      <Divider className='line'></Divider>
      <div className='base-info'>
        <Space className='info-header fx-y-center' size={16}>
          <span className='icon iconfont icon-jiqiren1 jiqiren'></span>
          <div className='fn18 fw-500'>上海赛邮云技术部</div>
          <div className='status'>申请成功</div>
        </Space>
        <div className='info-content'>
          <div className='info-title'>基本信息</div>
          <Row gutter={12}>
            <Col span={24} md={12} xl={8}>
              <div className='info-item'>
                <div className='info-label'>服务代码</div>
                <div className='info-value'>1321321312312312</div>
              </div>
            </Col>
            <Col span={24} md={12} xl={8}>
              <div className='info-item'>
                <div className='info-label'>Chatbot ID</div>
                <div className='info-value'>1321321312312312</div>
              </div>
            </Col>
            <Col span={24} md={12} xl={8}>
              <div className='info-item'>
                <div className='info-label'>签名</div>
                <div className='info-value'>上海赛邮云</div>
              </div>
            </Col>
            <Col span={24} md={12} xl={8}>
              <div className='info-item'>
                <div className='info-label'>行业类型</div>
                <div className='info-value'>上海赛邮云技术部</div>
              </div>
            </Col>
            <Col span={24} md={12} xl={8}>
              <div className='info-item'>
                <div className='info-label'>关联的CSP</div>
                <div className='info-value'>上海赛邮云技术部</div>
              </div>
            </Col>
            <Col span={24} md={12} xl={8}>
              <div className='info-item'>
                <div className='info-label'>实际下发的CSP</div>
                <div className='info-value'>上海赛邮云技术部</div>
              </div>
            </Col>
            <Col span={24}>
              <div className='info-item'>
                <div className='info-label'>证明材料</div>
                <div className='info-value'>材料</div>
              </div>
            </Col>
            <Col span={24}>
              <div className='info-item'>
                <div className='info-label fx-y-center'>
                  Chatbot 调试白名单
                  <div style={{ color: '#888' }}>（0.0.0.0为无限制）</div>
                </div>
                <div className='info-value'>
                  <TextArea
                    disabled
                    value={'0.0.0.0'}
                    style={{ color: '#333' }}
                    autoSize={{ minRows: 3, maxRows: 5 }}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <div className='base-info' style={{ marginTop: '16px' }}>
        <div className='info-content'>
          <div className='info-title'>更多信息</div>
          <Row gutter={12}>
            <Col span={24} md={12} xl={8}>
              <div className='info-item'>
                <div className='info-label'>服务方电话</div>
                <div className='info-value'>13163434353</div>
              </div>
            </Col>
            <Col span={24} md={12} xl={8}>
              <div className='info-item'>
                <div className='info-label'>服务方官网</div>
                <div className='info-value'>1321321312312312</div>
              </div>
            </Col>
            <Col span={24} md={12} xl={8}>
              <div className='info-item'>
                <div className='info-label'>服务条款链接</div>
                <div className='info-value'>上海赛邮云</div>
              </div>
            </Col>
            <Col span={24} md={12} xl={8}>
              <div className='info-item'>
                <div className='info-label'>服务方地址</div>
                <div className='info-value'>上海赛邮云技术部</div>
              </div>
            </Col>
            <Col span={24} md={12} xl={8}>
              <div className='info-item'>
                <div className='info-label'>经纬度</div>
                <div className='info-value'>上海赛邮云技术部</div>
              </div>
            </Col>
            <Col span={24} md={12} xl={8}>
              <div className='info-item'>
                <div className='info-label'>主题颜色</div>
                <div className='info-value'>上海赛邮云技术部</div>
              </div>
            </Col>
            <Col span={24} md={12} xl={8}>
              <div className='info-item'>
                <div className='info-label'>背景图</div>
                <div className='info-value'>上海赛邮云技术部</div>
              </div>
            </Col>
            <Col span={24} md={12} xl={8}>
              <div className='info-item'>
                <div className='info-label'>短信端口号</div>
                <div className='info-value'>上海赛邮云技术部</div>
              </div>
            </Col>
            <Col span={24} md={12} xl={8}>
              <div className='info-item'>
                <div className='info-label'>Chatbot提供者</div>
                <div className='info-value'>不显示</div>
              </div>
            </Col>
            <Col span={24}>
              <div className='info-item'>
                <div className='info-label fx-y-center'>服务描述</div>
                <div className='info-value'>
                  <TextArea
                    disabled
                    value={'服务描述'}
                    style={{ color: '#333' }}
                    autoSize={{ minRows: 3, maxRows: 5 }}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <div className='base-info' style={{ marginTop: '16px' }}>
        <div className='info-content'>
          <div className='info-title'>操作日志</div>
          <Table
            className='theme-cell reset-table'
            columns={columns}
            dataSource={tableData}
            rowKey={'name'}
            sticky
            pagination={{ position: ['none'] }}
            scroll={{ x: 'max-content' }}
            style={{ marginTop: '24px' }}
          />
        </div>
      </div>
    </PageContent>
  )
}
