import { useState, useEffect } from 'react'
import { Flex, Space, Button, Divider, Image, Spin } from 'antd'
import { NavLink } from 'react-router-dom'
import PageContent from '@/components/pageContent'
import Info from './info'
import { getDicConfig } from '@/api'
import { API } from 'apis'
import faceImg from '@/assets/rcs/face/account.png'

import yidong from '@/assets/rcs/operator/yidong.png'

const Status = {
  '0': '未提交',
  '1': '审核通过',
  '2': '审核未通过',
  '3': '审核中',
  '9': '审核中',
}
const StatusColor = {
  '0': 'color-status-gray',
  '1': 'color-status-success',
  '2': 'color-status-error',
  '3': 'color-status-waiting',
  '9': 'color-status-waiting',
}
const institutionLicenceTypes = {
  '01': '营业执照',
  '02': '组织机构代码证',
  '03': '事业单位法人证书',
  '04': '社会团体法人登记证书',
  '05': '军队代码',
  '06': '个体户（注册号）',
}

import './index.scss'

export default function Fn() {
  const [loading, setloading] = useState(false)
  const [customerData, setCustomerData] = useState<API.GetDicConfigItems>()

  // 获取客户资料
  const getInfo = async () => {
    setloading(true)
    try {
      const res = await getDicConfig()
      setCustomerData(res.data)
      setloading(false)
    } catch (error) {
      setloading(false)
    }
  }
  useEffect(() => {
    getInfo()
  }, [])

  return (
    <PageContent extClass='account-detail'>
      <Image src={faceImg} preview={false} width={72}></Image>
      <Flex justify='space-between' align='center' style={{ height: 40 }}>
        <div className='fn22 fw-500'>客户资料管理</div>
        {['0', '1', '2'].includes(customerData?.status) && (
          <NavLink to='/console/rcs/account/create'>
            <Button
              type='primary'
              icon={<i className='icon iconfont icon-bianji'></i>}>
              编辑客户资料
            </Button>
          </NavLink>
        )}
      </Flex>
      <Divider />
      {customerData && (
        <>
          <div className='info-title m-b-20'>
            <div className='fx-between-center w-100'>
              <Space className='fw-400 fn13' align='center' size={12}>
                <span className='fw-500 fn18'>客户信息</span>
                <div
                  className={`g-radius-12 p-x-10 p-y-2 ${
                    StatusColor[customerData.status]
                  }`}>
                  {Status[customerData.status]}
                </div>
              </Space>
              <Space className='fw-500 fn14' align='center'>
                <span>支持运营商</span>
                <img src={yidong} style={{ width: '30px' }} alt='' />
                <span>移动</span>
              </Space>
            </div>
          </div>
          {customerData.status == '2' && (
            <div className='color-warning-red g-radius-4 p-x-16 p-y-8 fn13 m-t-24'>
              <span className='icon iconfont icon-dengpao fn12 m-r-2'></span>
              未通过原因：{customerData?.reject_reason || '-'}
            </div>
          )}
          <Info customerData={customerData} />
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
