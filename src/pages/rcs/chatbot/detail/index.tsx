import { useState, useEffect } from 'react'
import { Flex, Space, Button, Divider, Image, App, Spin } from 'antd'
import PageContent from '@/components/pageContent'
import faceImg from '@/assets/rcs/face/chatbot.png'
import { useParams, NavLink, useNavigate } from 'react-router-dom'
import { getChatbot, refreshAppkey, getIndustry } from '@/api'
import Menu from './menu'
import { API } from 'apis'

import {
  actualIssueIndustryOptions,
  EnmuMenuStatusText,
  EnmuMenuStatusColor,
  ChatbotStatus,
  ChatbotColor,
} from '@/pages/rcs/chatbot/type'
import './index.scss'

export default function Fn() {
  const { id } = useParams()
  const { message } = App.useApp()
  const [detail, setDetail] = useState<API.ChatbotItem>()
  const [industryList, setindustryList] = useState<API.IndustryItem[]>([])
  const [categoryText, setcategoryText] = useState('')
  const [loading, setLoading] = useState(false)
  const [isVisibleAppkey, setIsVisibleAppkey] = useState(false)
  const getDetail = async () => {
    setLoading(true)
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
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  const getIndustryList = async () => {
    try {
      const res = await getIndustry()
      setindustryList(res?.data || [])
    } catch (error) {}
  }

  useEffect(() => {
    getIndustryList()
    if (id) {
      getDetail()
    }
  }, [id])

  useEffect(() => {
    if (detail && industryList.length > 0) {
      let arr = []
      const categoryArr = detail.category.split(',')
      categoryArr.forEach((item) => {
        let obj = industryList.find((i) => i.value == item)
        if (obj) {
          arr.push(obj.label)
        }
      })
      setcategoryText(arr.join('；'))
    }
  }, [detail, industryList])

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
      <Image src={faceImg} preview={false} width={72}></Image>
      <Flex justify='space-between' align='center' style={{ height: 40 }}>
        <div className='fn22 fw-500'>Chatbot 详情</div>
        {detail && detail?.status != '3' && (
          <NavLink to={`/console/rcs/chatbot/create/1?id=${id}`}>
            <Button type='primary' className='detail-btn'>
              <i className='icon iconfont icon-bianji fn18 m-r-4'></i>
              编辑基本信息
            </Button>
          </NavLink>
        )}
      </Flex>
      <Divider />
      <div className='info-title' style={{ marginBottom: '20px' }}>
        <Flex justify='space-between' className='w-100'>
          <span>基本信息</span>
          <span className={`${ChatbotColor[detail?.status]} fw-500 fn16`}>
            {ChatbotStatus[detail?.status]}
          </span>
        </Flex>
      </div>
      {/* <div className='color-warning-red g-radius-4 p-x-16 p-y-8 fn13 m-b-24'>
        <span className='icon iconfont icon-dengpao fn12 m-r-2'></span>
        未通过原因：123
      </div> */}

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
                <td>{categoryText}</td>
                <td>实际下发行业</td>
                <td>
                  {
                    actualIssueIndustryOptions.find(
                      (item) => item.value == detail.actualIssueIndustry,
                    )?.label
                  }
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
                  {detail.backgroundImage && (
                    <Image
                      className='info-img'
                      src={detail.backgroundImage}
                      style={{ width: '60px', height: '60px' }}
                    />
                  )}
                </td>
                <td>Chatbot头像</td>
                <td>
                  {detail.logo && (
                    <Image
                      className='info-img'
                      src={detail.logo}
                      preview={false}
                      style={{ width: 40 }}
                    />
                  )}
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
      {loading && (
        <div className='fx-center-center m-t-32'>
          <Spin />
        </div>
      )}
    </PageContent>
  )
}
