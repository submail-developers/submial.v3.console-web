import { useState, useEffect } from 'react'
import { Flex, Space, Row, Col, Button, Divider, Table, Image } from 'antd'
import { NavLink } from 'react-router-dom'
import type { ColumnsType } from 'antd/es/table'
import PageContent from '@/components/pageContent'
import { API } from 'apis'
import jiqirenImg from '@/assets/rcs/gunali.png'

import './index.scss'

interface DataType extends API.GetChatbotListItem {}
export default function Fn() {
  const [tableData, settableData] = useState([
    { name: '1223' },
    { name: '123' },
  ])

  // const columns: ColumnsType<DataType> = [
  //   {
  //     title: '版本',
  //     className: 'paddingL30',
  //     width: 80,
  //     render: (_, record) => <span>1</span>,
  //   },
  //   {
  //     title: '操作人',
  //     className: 'paddingL30',
  //     width: 100,
  //     render: (_, record) => <span>张涟云</span>,
  //   },
  //   {
  //     title: '操作时间',
  //     width: 160,
  //     render: (_, record) => <span>2024-04-09 21:19:08</span>,
  //   },
  //   {
  //     title: '操作类型',
  //     width: 100,
  //     render: (_, record) => <span>新增</span>,
  //   },
  //   {
  //     title: '操作结果',
  //     width: 100,
  //     render: (_, record) => <span>通过</span>,
  //   },
  //   {
  //     title: '意见',
  //     width: 160,
  //     render: (_, record) => <span>全国下Chatbot调试号码审核免审通过</span>,
  //   },
  // ]
  const list = [
    {
      id: 1,
      version: '1',
      setPerson: '张涟云',
      time: '2024-04-09 21:19:08',
      setType: '新增',
      result: '通过',
      view: '全国下Chatbot调试号码审核免审通过',
    },
    {
      id: 2,
      version: '1',
      setPerson: '张涟云',
      time: '2024-04-09 21:19:08',
      setType: '新增',
      result: '通过',
      view: '-',
    },
  ]
  const columns = [
    {
      title: '版本',
      dataIndex: 'version',
      width: 80,
      className: 'paddingL20',
    },
    {
      title: '操作人',
      width: 100,
      className: 'paddingL20',
      dataIndex: 'setPerson',
    },
    {
      title: '操作时间',
      width: 120,
      className: 'paddingL20',
      dataIndex: 'time',
    },
    {
      title: '操作类型',
      width: 100,
      className: 'paddingL20',
      dataIndex: 'setType',
    },

    {
      title: '操作结果',
      width: 100,
      className: 'paddingL20',
      dataIndex: 'result',
    },

    {
      title: '意见',
      width: 180,
      className: 'paddingL20',
      dataIndex: 'view',
      render: (_, record) => (
        <span className='text g-ellipsis-1 '>
          全国下Chatbot调试号码审核免审通过
        </span>
      ),
    },
  ]

  return (
    <PageContent extClass='account-detail'>
      <Image src={jiqirenImg} preview={false} width={72}></Image>
      <Flex justify='space-between' align='center' style={{ marginTop: '4px' }}>
        <div className='fn22 fw-500'>客户资料管理</div>
        <Space>
          <NavLink to='/console/rcs/account/create/0'>
            <Button type='primary'>
              <i className='icon iconfont icon-bianji'></i>编辑
            </Button>
          </NavLink>

          <Button type='primary' danger>
            <i className='icon iconfont icon-shanchu'></i>
            删除
          </Button>
        </Space>
      </Flex>
      <Divider className='line'></Divider>
      <div className='info-title' style={{ marginBottom: '20px' }}>
        客户信息
        <div className='auditing-status'>审核状态</div>
      </div>
      <table className='border'>
        <tbody>
          <tr>
            <td>客户名称</td>
            <td>上海赛邮云计算有限公司</td>
            <td>客户电话</td>
            <td>18226187949</td>
          </tr>
          <tr>
            <td>归属区域</td>
            <td>华东/上海/上海</td>
            <td>归属运营商</td>
            <td>上海赛邮云计算有限公司</td>
          </tr>
          <tr>
            <td>客户详细地址</td>
            <td colSpan={3}>上海市普陀区金沙江路1977弄金环商务花园3座705</td>
          </tr>
          <tr>
            <td>企业统一社会代码</td>
            <td>918247K12Q910230JF</td>
            <td>企业责任人姓名</td>
            <td>张凯旋</td>
          </tr>
          <tr>
            <td>企业责任人证件类型</td>
            <td>身份证</td>
            <td>企业责任人证件号码</td>
            <td>342224199612050432</td>
          </tr>
          <tr>
            <td>营业执照</td>
            <td colSpan={3}>yingyezhizhao.pdf</td>
          </tr>
          <tr>
            <td>备注</td>
            <td colSpan={3}>-</td>
          </tr>
          <tr>
            <td>合同信息</td>
            <td colSpan={3}>上海璟春科技有限公司-20241011.pdf</td>
          </tr>
        </tbody>
      </table>

      <div
        className='info-title'
        style={{ marginTop: '40px', marginBottom: '20px' }}>
        操作日志
      </div>
      <Table
        className='theme-cell bg-white'
        columns={columns}
        dataSource={list}
        sticky
        pagination={false}
        rowKey={'id'}
        scroll={{ x: 'max-content' }}
      />
    </PageContent>
  )
}
