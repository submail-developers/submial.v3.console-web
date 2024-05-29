import { useState, useEffect } from 'react'
import { Flex, Space, Button, Divider, Image, App } from 'antd'
import PageContent from '@/components/pageContent'
import jiqirenImg from '@/assets/rcs/chatbot_1.png'
import { useParams, NavLink, useNavigate } from 'react-router-dom'
import { getChatbot, refreshAppkey } from '@/api'
import Menu from './menu'
import { API } from 'apis'

import './index.scss'

export default function Fn() {
  const { id } = useParams()
  const { message } = App.useApp()

  const [detail, setDetail] = useState<API.ChatbotItem>()
  const [isVisibleAppkey, setIsVisibleAppkey] = useState(false)
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

  const toggleVisibility = () => {
    setIsVisibleAppkey(!isVisibleAppkey)
  }

  const resetAppkey = async (id) => {
    try {
      let params = {
        appid: id,
      }
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
              <i className='icon iconfont icon-bianji fn18 m-r-4'></i>
              编辑基本信息
            </Button>
          </NavLink>
        </Space>
      </Flex>
      <Divider className='m-t-16 m-b-24'></Divider>
      <div className='info-title' style={{ marginBottom: '20px' }}>
        基本信息
        <div className='auditing-status'>审核状态</div>
      </div>

      {detail && (
        <>
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
                    {isVisibleAppkey ? (
                      <div className='fn14'>{detail.appkey}</div>
                    ) : (
                      '*************************************'
                    )}
                    <span
                      className='fn12 primary-color'
                      style={{
                        marginLeft: 10,
                        marginRight: 10,
                        cursor: 'pointer',
                      }}
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
          <Menu
            entries={detail?.menu?.menu?.entries || []}
            chatbotStatus={detail.status}
            menuStatus={detail.menu_status}
            reloadEvent={getDetail}
          />
        </>
      )}
    </PageContent>
  )
}
