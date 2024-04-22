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
} from 'antd'
import type { TreeDataNode, TreeProps } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { EyeOutlined, DownOutlined } from '@ant-design/icons'
import PageContent from '@/components/pageContent'
import { API } from 'apis'
import jiqirenImg from '@/assets/rcs/chatbot_1.png'
import { useParams, NavLink, useNavigate } from 'react-router-dom'
import { getChatbot } from '@/api'
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
  const [detail, setDetail] = useState<API.ChatbotItem>()
  const [visible, setVisible] = useState(false)

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

  const treeData: TreeDataNode[] = [
    {
      title: 'parent 1',
      key: '0-0',
      children: [
        {
          title: 'parent 1-0',
          key: '0-0-0',
        },
        {
          title: 'parent 1-1',
          key: '0-0-1',
        },
        {
          title: 'parent 1-2',
          key: '0-0-2',
        },
      ],
    },
  ]
  const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info)
  }

  useEffect(() => {
    if (id) {
      getDetail()
    }
  }, [id])

  return (
    <PageContent extClass='chatbot-detail'>
      <Image src={jiqirenImg} preview={false} width={72}></Image>
      <Flex justify='space-between' align='center' style={{ marginTop: '4px' }}>
        <div className='fn22 fw-500'>Chatbot 详情hatbot</div>
        <Space>
          <NavLink to='/console/rcs/account/create/0'>
            <Button type='primary'>
              <i className='icon iconfont icon-bianji'></i>编辑基本信息
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
        Chatbot 信息
        <div className='auditing-status'>审核状态</div>
      </div>

      <table className='border'>
        <tbody>
          <tr>
            <td>Chatbot名称</td>
            <td>赛邮技术部</td>
            <td>Chatbo头像</td>
            <td>预览</td>
          </tr>
          <tr>
            <td>应用ID</td>
            <td>10010</td>
            <td>Appkey</td>
            <td>*******************</td>
          </tr>
          <tr>
            <td>行业类型</td>
            <td>行业/行业</td>
            <td>消息回落签名</td>
            <td>【SUBMAIL】</td>
          </tr>
          <tr>
            <td>服务描述</td>
            <td colSpan={3}>提供短信、邮件购买服务</td>
          </tr>
          <tr>
            <td>服务方名称</td>
            <td>上海赛邮云计算有限公司</td>
            <td>服务方电话</td>
            <td>18226187949</td>
          </tr>
          <tr>
            <td>服务方官网</td>
            <td>https://www.mysubmail.com/</td>
            <td>服务条款链接</td>
            <td>https://www.mysubmail.com/documents</td>
          </tr>
          <tr>
            <td>服务方邮箱</td>
            <td>zkx@submail.com</td>
            <td>服务方地址</td>
            <td>上海/上海/松江区</td>
          </tr>
          <tr>
            <td>服务方详细地址</td>
            <td colSpan={3}>上海市松江区九亭镇九亭中心路1158号21幢213室-44</td>
          </tr>
          <tr>
            <td>经度/纬度</td>
            <td>经度：90 </td>
            <td>主题颜色</td>
            <td>#1764ff</td>
          </tr>
          <tr>
            <td>背景图</td>
            <td>预览</td>
            <td>合同信息</td>
            <td>上海璟春科技有限公司-20241011.pdf</td>
          </tr>
          <tr>
            <td>Chatbot调试白名单</td>
            <td colSpan={3}>-</td>
          </tr>
        </tbody>
      </table>

      <div className='info-title' style={{ marginTop: '40px' }}>
        固定菜单
        <Button type='primary' className='auditing-status'>
          <i className='icon iconfont icon-bianji'></i>编辑固定菜单
        </Button>
      </div>

      <Row style={{ marginTop: '16px' }} gutter={24}>
        <Col span={24} xl={4}>
          <Form.Item label=''>
            <Tree
              showLine
              switcherIcon={<DownOutlined />}
              defaultExpandedKeys={['0-0-0']}
              onSelect={onSelect}
              treeData={treeData}
            />
          </Form.Item>
        </Col>
      </Row>
    </PageContent>
  )
}
