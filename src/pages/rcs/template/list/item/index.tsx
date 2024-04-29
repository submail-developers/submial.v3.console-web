import { useEffect, useState } from 'react'
import {
  Flex,
  Button,
  Divider,
  Form,
  Input,
  Select,
  Row,
  Col,
  Table,
  Image,
  Space,
  Pagination,
  Popconfirm,
  App,
  Tooltip,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { NavLink, useNavigate, Link } from 'react-router-dom'
import PageContent from '@/components/pageContent'
import {
  UploadOutlined,
  RedoOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  EyeOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import codeImg from '@/assets/rcs/code.png'
import { usePoint } from '@/hooks'
import { getRcsMeteialList, delRcsMeteial, getRcsTempList } from '@/api'
import { IDIcon } from '@/components/aIcons'
import ACopy from '@/components/aCopy'

import audioTypeImg from '@/assets/rcs/fileType/audio.png'
import imgTypeImg from '@/assets/rcs/fileType/img.png'
import pptTypeImg from '@/assets/rcs/fileType/ppt.png'
import unknowTypeImg from '@/assets/rcs/fileType/unknow.png'
import wordTypeImg from '@/assets/rcs/fileType/word.png'
import xlsTypeImg from '@/assets/rcs/fileType/xls.png'
import zipTypeImg from '@/assets/rcs/fileType/zip.png'

import { API } from 'apis'

import './index.scss'

type Props = {
  item: API.RcsTempListItem
  onSelect?: () => void
}
export default function Fn({ item, onSelect }: Props) {
  const handleItem = () => {
    if (onSelect) onSelect()
  }
  return (
    <div className='rcs-temp-item'>
      <Tooltip title={onSelect ? '' : '审核备注'} placement='bottom'>
        <div
          className={`temp-item-content ${onSelect ? 'openSelect' : ''}`}
          onClick={handleItem}>
          <div className='name g-ellipsis'>{item.title}</div>
          <div className='time'>创建时间：{item.createAt}</div>
          <div
            className={`status ${
              item.checked == '0'
                ? 'fail'
                : item.checked == '1'
                ? 'success'
                : 'waiting'
            }`}>
            {item.checked == '0' && '未通过'}
            {item.checked == '1' && '通过'}
            {(item.checked == '8' || item.checked == '9') && '审核中'}
          </div>
          <div className='preview-model'>
            <div className='preview-content'>
              {/* <PreviewCard data={item} showName /> */}
            </div>
          </div>
          <Flex
            justify='space-between'
            align='center'
            style={{ paddingTop: '12px' }}>
            <Button
              className='id-btn'
              style={{ padding: '0 4px', color: '#fd29a4' }}
              size='small'
              icon={
                <IDIcon
                  style={{
                    color: '#fd29a4',
                    fontSize: '14px',
                  }}
                />
              }>
              {item.sign}
            </Button>
          </Flex>
        </div>
      </Tooltip>
    </div>
  )
}
