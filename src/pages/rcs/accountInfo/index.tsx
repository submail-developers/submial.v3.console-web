import { useState, useEffect } from 'react'
import { Flex, Space, Row, Col, Button, Divider, Table, Image } from 'antd'
import { NavLink } from 'react-router-dom'
import type { ColumnsType } from 'antd/es/table'
import PageContent from '@/components/pageContent'
import { API } from 'apis'
import jiqirenImg from '@/assets/rcs/jiqiren.png'

import './index.scss'

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
    <PageContent extClass='account-detail' xxl={1200} xl={960}>
      <Image src={jiqirenImg} preview={false} width={48}></Image>
      <Flex justify='space-between' align='center' style={{ marginTop: '4px' }}>
        <div className='fn22'>客户资料管理</div>
        <Space>
          <Button>
            <NavLink to='/console/rcs/account/create/0'>编辑</NavLink>
          </Button>
          <Button>删除</Button>
        </Space>
      </Flex>
      <Divider className='line'></Divider>
      <div className='base-info'>
        <Space className='info-header fx-y-center' size={16}>
          <div className='fn18 fw-500'>上海赛邮云技术部</div>
          <div className='status'>申请成功</div>
        </Space>
        <div className='info-content'>
          <div className='info-title'>基本信息</div>
          <Row gutter={12}>
            <Col span={24} md={12} xl={8}>
              <div className='info-item'>
                <div className='info-label'>客户名称</div>
                <div className='info-value'>上海赛邮云计算有限公司</div>
              </div>
            </Col>
            <Col span={24} md={12} xl={8}>
              <div className='info-item'>
                <div className='info-label'>客户电话</div>
                <div className='info-value'>13112312312</div>
              </div>
            </Col>
            <Col span={24} md={12} xl={8}>
              <div className='info-item'>
                <div className='info-label'>归属区域</div>
                <div className='info-value'>上海/上海/普陀区</div>
              </div>
            </Col>
            <Col span={24} md={12} xl={8}>
              <div className='info-item'>
                <div className='info-label'>客户详细地址</div>
                <div className='info-value'>金环商务花园</div>
              </div>
            </Col>
            <Col span={24} md={12} xl={8}>
              <div className='info-item'>
                <div className='info-label'>企业统一社会信用代码</div>
                <div className='info-value'>上海赛邮云技术部</div>
              </div>
            </Col>
            <Col span={24} md={12} xl={8}>
              <div className='info-item'>
                <div className='info-label'>企业责任人姓名</div>
                <div className='info-value'>上海</div>
              </div>
            </Col>
            <Col span={24} md={12} xl={8}>
              <div className='info-item'>
                <div className='info-label'>企业责任人证件类型</div>
                <div className='info-value'>身份证</div>
              </div>
            </Col>
            <Col span={24} md={12} xl={8}>
              <div className='info-item'>
                <div className='info-label'>企业责任人证件号码</div>
                <div className='info-value'>411123123123123123</div>
              </div>
            </Col>
            <Col span={24} md={12} xl={8}>
              <div className='info-item'>
                <div className='info-label'>营业执照</div>
                <div className='info-value'>pdf</div>
              </div>
            </Col>
            <Col span={24}>
              <div className='info-item'>
                <div className='info-label'>备注</div>
                <div className='info-value'>
                  备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <div className='base-info' style={{ marginTop: '16px' }}>
        <div className='info-content'>
          <div className='info-title'>合同信息</div>
          <Row gutter={12}>
            <Col span={24}>
              <div className='info-item'>
                <div className='info-label'>合同附件</div>
                <div className='info-value'>pdf</div>
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
