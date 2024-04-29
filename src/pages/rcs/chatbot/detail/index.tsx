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
} from 'antd'
import type { TreeDataNode, TreeProps } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { EyeOutlined, DownOutlined } from '@ant-design/icons'
import PageContent from '@/components/pageContent'
import { API } from 'apis'
import jiqirenImg from '@/assets/rcs/chatbot_1.png'
import { useParams, NavLink, useNavigate } from 'react-router-dom'
import { getChatbot } from '@/api'
import EditMean from '../edit/index'
import APreviewImg from '@/components/aPreviewImg'

import './index.scss'

const { TextArea } = Input
interface DataType extends API.GetChatbotListItem {}
export default function Fn() {
  const { id } = useParams()
  const [tableData, settableData] = useState([
    { name: '1223' },
    { name: '123' },
  ])
  const [detail, setDetail] = useState<any>({})
  const [isVisible, setIsVisible] = useState(false)
  const [isVisible2, setIsVisible2] = useState(true)
  const [isVisibleAppkey, setIsVisibleAppkey] = useState('********')

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
          <i className='icon iconfont icon-jianpan'></i> 主菜单一
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
      title: '下挂巧克力',
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
      title: '菜单',
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

  return (
    <PageContent extClass='chatbot-detail'>
      <Image src={jiqirenImg} preview={false} width={72}></Image>
      <Flex justify='space-between' align='center' style={{ marginTop: '4px' }}>
        <div className='fn22 fw-500'>Chatbot 详情</div>
        <Space>
          <NavLink to='/console/rcs/account/create/0'>
            <Button type='primary' className='detail-btn'>
              <i className='icon iconfont icon-bianji'></i>
              编辑基本信息
            </Button>
          </NavLink>

          <Button type='primary' danger className='detail-btn'>
            <i className='icon iconfont icon-shanchu'></i>
            删除
          </Button>
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
            <td>{detail.name}</td>
            <td>Chatbo头像</td>
            <td>
              <Image className='info-img' src={detail.logo} />
            </td>
          </tr>
          <tr>
            <td>应用ID</td>
            <td>{detail.id}</td>
            <td>Appkey</td>
            <td>
              <div> {isVisibleAppkey}</div>
              <div>
                <span
                  className='fn12 primary-color'
                  style={{ marginRight: 10 }}>
                  显示
                </span>
                <span className='fn12 primary-color'>重置</span>
              </div>
            </td>
          </tr>
          <tr>
            <td>行业类型</td>
            <td>行业/行业</td>
            <td>消息回落签名</td>
            <td>【{detail.autograph}】</td>
          </tr>
          <tr>
            <td>服务描述</td>
            <td colSpan={3}>提供短信、邮件购买服务</td>
          </tr>
          <tr>
            <td>服务方名称</td>
            <td>上海赛邮云计算有限公司</td>
            <td>服务方电话</td>
            <td>{detail.callback}</td>
          </tr>
          <tr>
            <td>服务方官网</td>
            <td>{detail.website}</td>
            <td>服务条款链接</td>
            <td>{detail.tcPage}</td>
          </tr>
          <tr>
            <td>服务方邮箱</td>
            <td>{detail.email}</td>
            <td>服务方地址</td>
            <td>{detail.address}</td>
          </tr>
          <tr>
            <td>服务方详细地址</td>
            <td colSpan={3}>上海市松江区九亭镇九亭中心路1158号21幢213室-44</td>
          </tr>
          <tr>
            <td>经度/纬度</td>
            <td>经度：90 &nbsp; 纬度：80 </td>
            <td>主题颜色</td>
            <td>#1764ff</td>
          </tr>
          <tr>
            <td>背景图</td>
            <td>
              <Image className='info-img' src={detail.backgroundImage} />
            </td>
            <td>合同信息</td>
            <td>上海璟春科技有限公司-20241011.pdf</td>
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
                // className='theme-cell bg-white'
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
