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
  ColorPicker,
  Tree,
  Form,
  Tooltip,
  App,
  message,
} from 'antd'
import type { TreeDataNode, TreeProps } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { EyeOutlined, DownOutlined } from '@ant-design/icons'
import PageContent from '@/components/pageContent'
import { API } from 'apis'
import jiqirenImg from '@/assets/rcs/chatbot_1.png'
import { useParams, NavLink, useNavigate } from 'react-router-dom'
import { getChatbot, refreshAppkey } from '@/api'
import EditMean from '../edit/index'
import APreviewImg from '@/components/aPreviewImg'

import './index.scss'
import { constant } from 'lodash'

const { TextArea } = Input
interface DataType extends API.GetChatbotListItem {}
export default function Fn() {
  const { id } = useParams()
  const [tableData, settableData] = useState([
    { name: '1223' },
    { name: '123' },
  ])
  const { message } = App.useApp()

  const [detail, setDetail] = useState<any>({})
  const [isVisible, setIsVisible] = useState(false)
  const [isVisible2, setIsVisible2] = useState(true)
  const [isVisibleAppkey, setIsVisibleAppkey] = useState(false)
  const [eventType, setEventType] = useState('')
  const [menuTitle, setMenuTitle] = useState('')
  const getDetail = async () => {
    try {
      const res = await getChatbot({
        page: 1,
        limit: 20,
        appid: id,
        status: 'all',
      })

      if (res.list.length == 1) {
        setDetail(res.list[0])

        if (res.list[0].menu.menu.entries[0].reply) {
          setEventType('回复事件')
          setMenuTitle(res.list[0].menu.menu.entries[0].reply.displayText)
        }
      }
    } catch (error) {}
  }

  useEffect(() => {
    if (id) {
      getDetail()
    }
  }, [id])

  const list = [
    {
      id: 1,
      event: '二级菜单',
      secondCont: '二级菜单内容',
      mean: '回复消息事件',
      result: '预订成功',
    },
    {
      id: 2,

      event: '二级菜单',
      secondCont: '二级菜单内容',
      mean: '链接事件',
      result: 'https://www.mysubmail.com/',
    },
  ]
  const columns2 = [
    {
      title: (
        <>
          <i className='icon iconfont icon-jianpan'></i>
          {menuTitle}
        </>
      ),
      width: 80,
      className: 'paddingL20',
      dataIndex: 'event',
      render: (_, recoder) => (
        <>
          <i className='icon iconfont icon-a-erjicaidan2'></i> 二级菜单
        </>
      ),
    },
    {
      title: '',
      width: 120,
      className: 'paddingL20',
      dataIndex: 'secondCont',
      render: (_, recoder) => (
        <>
          {recoder.event == '无事件' ? (
            <div></div>
          ) : (
            <div className='secondCont'>{recoder.secondCont}</div>
          )}
        </>
      ),
    },
    {
      title: <>{eventType}</>,
      width: 100,
      className: 'paddingL20',
      dataIndex: 'mean',
    },

    {
      title: '',
      width: 200,
      className: 'paddingL20',
      dataIndex: 'result',
    },
  ]

  const handleVisibility = () => {
    setIsVisible(true)
    setIsVisible2(false)
  }
  const getStatsu = (editStatus) => {
    if (editStatus == false) {
      setIsVisible(false)
      setIsVisible2(true)
    }
  }

  const toggleVisibility = () => {
    setIsVisibleAppkey(!isVisibleAppkey)
  }

  const resetAppkey = async (id) => {
    try {
      let params = {
        appid: id,
      }
      console.log(params)
      const res = await refreshAppkey(params)
      if (res.status == 'success') {
        message.success('重置成功')
        getDetail()
      }
    } catch (error) {}
  }

  return (
    <PageContent extClass='chatbot-detail'>
      <Image src={jiqirenImg} preview={false} width={72}></Image>
      <Flex justify='space-between' align='center' style={{ marginTop: '4px' }}>
        <div className='fn22 fw-500'>Chatbot 详情</div>
        <Space>
          <NavLink to={`/console/rcs/chatbot/create/1?id=${id}`}>
            <Button type='primary' className='detail-btn'>
              <i className='icon iconfont icon-bianji'></i>
              编辑基本信息
            </Button>
          </NavLink>
        </Space>
      </Flex>
      <Divider className='line'></Divider>
      <div className='info-title' style={{ marginBottom: '20px' }}>
        基本信息
        <div className='auditing-status'>审核状态</div>
      </div>

      <table className='border'>
        <tbody>
          <tr>
            <td>Chatbot名称</td>
            <td colSpan={3}>{detail.name}</td>
          </tr>
          <tr>
            <td>应用ID</td>
            <td>{detail.id}</td>
            <td>提供者开关</td>
            <td>{detail.providerSwitchCode == '1' ? '显示' : '不显示'}</td>
          </tr>
          <tr>
            <td>Appkey</td>
            <td colSpan={3}>
              <div className='fx-start-center'>
                {isVisibleAppkey == true ? (
                  <div className='fn14'>{detail.appkey}</div>
                ) : (
                  '*************************************'
                )}
                <span
                  className='fn12 primary-color'
                  style={{ marginLeft: 10, marginRight: 10, cursor: 'pointer' }}
                  onClick={toggleVisibility}>
                  {isVisibleAppkey ? '隐藏' : '显示'}
                </span>
                <span
                  className='fn12 primary-color'
                  onClick={() => resetAppkey(detail.id)}
                  style={{ cursor: 'pointer' }}>
                  重置
                </span>
              </div>
            </td>
          </tr>
          <tr>
            <td>行业类型</td>
            <td>{detail.category}</td>
            <td>实际下发行业</td>
            <td>
              {detail.actualIssueIndustry == '1'
                ? '党政军'
                : detail.actualIssueIndustry == '2'
                ? '民生'
                : detail.actualIssueIndustry == '3'
                ? '金融'
                : detail.actualIssueIndustry == '4'
                ? '物流'
                : detail.actualIssueIndustry == '5'
                ? '游戏'
                : detail.actualIssueIndustry == '6'
                ? '电商'
                : detail.actualIssueIndustry == '7'
                ? '微商（个人）'
                : detail.actualIssueIndustry == '8'
                ? '沿街商铺（中小）'
                : detail.actualIssueIndustry == '9'
                ? '企业（大型）'
                : detail.actualIssueIndustry == '10'
                ? '教育培训'
                : detail.actualIssueIndustry == '11'
                ? '房地产'
                : detail.actualIssueIndustry == '12'
                ? '医疗器械、药店'
                : '其他'}
            </td>
          </tr>
          <tr>
            <td>消息回落签名</td>
            <td>【{detail.autograph}】</td>

            <td>服务方邮箱</td>
            <td>{detail.email}</td>
          </tr>
          <tr>
            <td>服务描述</td>
            <td colSpan={3}>{detail.description}</td>
          </tr>
          <tr>
            <td>服务方名称</td>
            <td>{detail.provider}</td>
            <td>服务方电话</td>
            <td>{detail.callback}</td>
          </tr>
          <tr>
            <td>服务方官网</td>
            <td colSpan={3}>{detail.website}</td>
          </tr>
          <tr>
            <td>服务条款链接</td>
            <td colSpan={3}>{detail.tcPage}</td>
          </tr>

          <tr>
            <td>服务方详细地址</td>
            <td colSpan={3}>{detail.address}</td>
          </tr>

          <tr>
            <td>背景图</td>
            <td>
              <Image
                className='info-img'
                src={detail.backgroundImage}
                style={{ width: '60px', height: '60px' }}
              />
            </td>
            <td>Chatbot头像</td>
            <td>
              <Image
                className='info-img'
                src={detail.logo}
                style={{ width: '60px', height: '60px' }}
              />
            </td>
          </tr>
          <tr>
            <td>Chatbot调试白名单</td>
            <td colSpan={3}>{detail.debugWhiteAddress}</td>
          </tr>
        </tbody>
      </table>

      {isVisible2 && (
        <>
          <div className='info-title' style={{ marginTop: '40px' }}>
            固定菜单
          </div>

          <Row style={{ marginTop: '16px' }} gutter={24}>
            <Col span={24}>
              <Table
                className='tbale1'
                columns={columns2}
                dataSource={list}
                sticky
                pagination={false}
                rowKey={'id'}
                scroll={{ x: 'max-content' }}
              />

              <div className='mean-botm'>
                <Button type='primary' onClick={handleVisibility}>
                  编辑菜单
                </Button>
                <Button type='primary' className='submit-audtitng'>
                  提交审核
                </Button>
              </div>
            </Col>
          </Row>
        </>
      )}

      {isVisible && <EditMean onGetStatsu={getStatsu} />}
    </PageContent>
  )
}
