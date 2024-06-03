import { useState, useEffect } from 'react'
import {
  Flex,
  Table,
  Row,
  Col,
  Button,
  Divider,
  Image,
  DatePicker,
  Form,
  Select,
  Switch,
} from 'antd'
import PageContent from '@/components/pageContent'

// import { getErrorLogs } from '@/api'
import { API } from 'apis'
import topIco from '@/assets/rcs/setting/set_ico.png'
import './index.scss'
import { useSize } from '@/hooks'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
const { Option } = Select

const { RangePicker } = DatePicker
interface FormValues {
  chatbot: any
  time: [Dayjs, Dayjs] | null
}

export default function Fn() {
  const size = useSize()
  const [form] = Form.useForm()

  useEffect(() => {
    // getList()
  }, [])

  return (
    <PageContent extClass='setting'>
      <Form
        form={form}
        className='setting-form p-b-90'
        name='setting'
        layout='vertical'
        autoComplete='off'>
        <Image src={topIco} preview={false} width={72}></Image>
        <Flex
          justify='space-between'
          align='center'
          style={{ marginTop: '4px' }}>
          <div className='fn22 fw-500'>
            偏好设置
            <div
              className='fn12 gray-color m-t-10'
              style={{ fontWeight: 'normal' }}>
              配置您的5G消息账户，更改或更新余额共享设置、余额提醒、提醒列表、安全设置以及其他设置
            </div>
          </div>
        </Flex>
        <Divider className='line'></Divider>
        <div className='one-part'>
          <div className='top-item'>
            <div className='fx-y-center'>
              <i className='icon iconfont icon-dengpao fn16 m-r-10'></i>
              <span>5G消息余额提醒</span>
            </div>
            <ul>
              <li>单击或拖动滑块控件改变提醒状态</li>
              <li>单击提醒列表中“删除”按钮删除该联系人</li>
              <li>单击“添加”按钮添加提醒列表</li>
              <li>单击“添加”按钮添加提醒列表</li>
            </ul>
          </div>
          <div className='middle-item fx m-t-40'>
            <div className='m-r-30 w-title'>5G消息余额提醒</div>
            <div>
              <div className='fx-y-center'>
                <Switch size='small' defaultChecked className='m-r-10' />
                开启
              </div>
              <div className='gray-color m-t-20 m-b-20 '>
                当前余额 <span>12,122,12元</span>
              </div>
              <div className='fx-y-center gray-color'>
                发出提醒当余额低于 <span>12,122,12元</span>
                <div className='color m-l-10'>更改</div>
              </div>
            </div>
          </div>
          <Divider className='line'></Divider>
          <div className='middle-item fx m-t-40'>
            <div className='m-r-30 w-title'>邮件提示</div>
            <div>
              <div className='fx-y-center'>
                <Switch size='small' defaultChecked className='m-r-10' />
                开启
              </div>
              <div className='gray-color m-t-20 m-b-20 '>
                1231231231@qq.com <span>(账户邮箱不可更改)</span>
              </div>
              <div className='fx-y-center gray-color m-b-20'>
                dadasdad@qq.com
                <div className='color m-l-10'>
                  <i className='icon iconfont icon-shanchu fn14'></i>
                </div>
              </div>
              <div className='fx-y-center gray-color  m-b-20'>
                dadasdad@qq.com
                <div className='color m-l-10'>
                  <i className='icon iconfont icon-shanchu fn14'></i>
                </div>
              </div>
              <div className='color'>
                <i className='icon iconfont icon-jia fn14 m-r-10'></i> 新增
              </div>
            </div>
          </div>
          <Divider className='line'></Divider>
          <div className='middle-item fx m-t-40'>
            <div className='m-r-30 w-title'>短信提示</div>
            <div>
              <div className='fx-y-center'>
                <Switch size='small' defaultChecked className='m-r-10' />
                开启
              </div>
              <div className='fx-y-center gray-color m-t-20 m-b-20'>
                132322233223
                <div className='color m-l-10'>
                  <i className='icon iconfont icon-shanchu fn14'></i>
                </div>
              </div>
              <div className='gray-color  m-b-20 '>
                132322233223 <span>(账户手机不可更改)</span>
              </div>
              <div className='fx-y-center gray-color m-b-20'>
                132322233223
                <div className='color m-l-10'>
                  <i className='icon iconfont icon-shanchu fn14'></i>
                </div>
              </div>
              <div className='fx-y-center gray-color  m-b-20'>
                132322233223
                <div className='color m-l-10'>
                  <i className='icon iconfont icon-shanchu fn14'></i>
                </div>
              </div>
              <div className='color'>
                <i className='icon iconfont icon-jia fn14 m-r-10'></i> 新增
              </div>
            </div>
          </div>
          <Divider className='line'></Divider>
          <div className='top-item'>
            <div className='fx-y-center'>
              <i className='icon iconfont icon-dengpao fn16 m-r-10'></i>
              <span>安全设置</span>
            </div>
            <ul>
              <li>单击或拖动滑块控件改变提醒状态</li>
            </ul>
          </div>
          <div className='middle-item fx m-t-40'>
            <div className='m-r-30 w-title'>安全设置</div>
            <div>
              <div className='fx-y-center m-b-20'>
                <div className='fx-y-center m-r-40'>
                  <Switch size='small' defaultChecked className='m-r-10' />
                  开启
                </div>
                <div>在线批量发送时需要输入手机验证码</div>
              </div>
              <div className='fx-y-center  m-b-20'>
                <div className='fx-y-center m-r-40'>
                  <Switch size='small' defaultChecked className='m-r-10' />
                  开启
                </div>
                <div>在线发送完成时提醒我</div>
              </div>
              <div className='fx-y-center  m-b-20'>
                <div className='fx-y-center m-r-40'>
                  <Switch size='small' defaultChecked className='m-r-10' />
                  开启
                </div>
                <div>导出时需输入手机验证码</div>
              </div>
              <div className='fx-y-center  m-b-20'>
                <div className='fx-y-center m-r-40'>
                  <Switch size='small' defaultChecked className='m-r-10' />
                  开启
                </div>
                <div>在历史明细查询或导出时隐藏验证码</div>
              </div>
              <div className='fx-y-center  m-b-20'>
                <div className='fx-y-center m-r-40'>
                  <Switch size='small' defaultChecked className='m-r-10' />
                  开启
                </div>
                <div>在历史明细查询或导出时隐藏手机号码</div>
              </div>
              <div className='fx-y-center  m-b-20'>
                <div className='fx-y-center m-r-40'>
                  <Switch size='small' defaultChecked className='m-r-10' />
                  开启
                </div>
                <div>地址簿加密</div>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </PageContent>
  )
}
