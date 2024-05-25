import {
  useState,
  forwardRef,
  useImperativeHandle,
  Fragment,
  useEffect,
  useRef,
} from 'react'
import { Table, Row, Col, Upload, Button, Pagination, Flex } from 'antd'
import type { UploadFile } from 'antd'
import { getDataFromFile } from '@/api'
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons'

import './index.scss'

type Props = {
  vars: string[]
}
function Fn(props: Props, ref: any) {
  useImperativeHandle(ref, () => {
    return {
      getValues,
    }
  })
  const [letters, setLetters] = useState<string[]>([]) // 生成字母
  const [data, setData] = useState<string[][]>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(1000)
  const [total, setTotal] = useState(0)
  const allDataRef = useRef<string[][]>([])
  const [uploadLoading, setuploadLoading] = useState(false)

  const [columns, setcolumns] = useState([])
  const uploadProps = {
    accept: '.csv,.xlsx,.xls,.txt',
    beforeUpload: (file) => {
      getFileData(file)
      return false
    },
    fileList: [],
  }
  const getValues = () => {
    const result = []
    const keyLength = props.vars.length
    const arrLength = allDataRef.current.length

    for (let i = 0; i < arrLength; i++) {
      const obj = {
        to: '',
        vars: {},
      }
      const currentItem = allDataRef.current[i]
      if (currentItem[0]) {
        obj['to'] = currentItem[0]
        for (let j = 0; j < keyLength; j++) {
          obj.vars[props.vars[j]] = currentItem[j + 1] || ''
        }
        result.push(obj)
      }
    }
    console.log(result)

    return result
  }

  const getFileData = async (file: UploadFile) => {
    try {
      setuploadLoading(true)
      const res = await getDataFromFile({
        file: file,
      })
      if (res.data) {
        let _columns = []
        letters.forEach((item, index) => {
          let _columnsItem = {
            title:
              index == 0 ? '手机号码' : `@var(${props.vars[index - 1]}) 值`,
            dataIndex: index == 0 ? 'to' : props.vars[index - 1],
            width: index == 0 ? 140 : 120,
            fixed: index == 0 ? 'left' : false,
          }
          _columns.push(_columnsItem)
        })
        setcolumns(_columns)
        allDataRef.current = res.data
        insertData(1)
        setPage(1)
        setTotal(res.data.length)
      }
    } catch (error) {
      setuploadLoading(false)
    }
  }

  const insertData = (page: number) => {
    let sliceArr = allDataRef.current.slice((page - 1) * 1000, page * 1000)
    let _data = []
    sliceArr.forEach((number) => {
      let _dataItem = {}
      letters.forEach((item, index) => {
        if (index == 0) {
          _dataItem['to'] = number[0]
        } else {
          _dataItem[props.vars[index - 1]] = number[index] || ''
        }
      })
      _data.push(_dataItem)
    })
    setData(_data)
    setuploadLoading(false)
  }

  // 切换页码
  const onChangeCurrentPage = (page: number, pageSize: number) => {
    setPage(page)
    setPageSize(pageSize)
  }

  useEffect(() => {
    insertData(page)
  }, [page])

  useEffect(() => {
    // 生成字母
    const _letters = Array.from({ length: props.vars.length + 1 }, (_, index) =>
      String.fromCharCode(65 + (index > 25 ? index + 6 : index)),
    )
    let _columns = []
    let _data = []
    // 生成初始化时的table
    _letters.forEach((item, index) => {
      let _columnsItem = {
        title: item,
        dataIndex: index == 0 ? 'to' : props.vars[index - 1],
        width: index == 0 ? 140 : 120,
      }
      _columns.push(_columnsItem)
    })
    new Array(1, 2, 3).map((number) => {
      let _dataItem = {}
      _letters.forEach((item, index) => {
        if (number == 1) {
          if (index == 0) {
            _dataItem['to'] = '138xxxxxxxx'
          } else {
            _dataItem[props.vars[index - 1]] = `${props.vars[index - 1]}值`
          }
        } else if (number == 2) {
          if (index == 0) {
            _dataItem['to'] = '186xxxxxxxx'
          } else {
            _dataItem[props.vars[index - 1]] = `${props.vars[index - 1]}值`
          }
        } else {
          if (index == 0) {
            _dataItem['to'] = '...'
          } else {
            _dataItem[props.vars[index - 1]] = `...`
          }
        }
      })
      _data.push(_dataItem)
    })

    setLetters(_letters)
    setcolumns(_columns)
    setData(_data)
  }, [props.vars])

  return (
    <div className='p-24 contacts-content file-content'>
      <Row gutter={{ xs: 12, sm: 16, lg: 24 }}>
        <Col span={24}>
          {props.vars.length > 0 && (
            <p>
              您的
              <strong>模板</strong>及<strong>短信回落</strong>
              中包含
              <strong className='error-color'> {props.vars.length}</strong>{' '}
              个文本变量，请在{' '}
              <strong className='error-color'>CSV 或 Excel</strong> 文件中，将
              <strong className='error-color'>第1列（ A 列）</strong>设为接收
              <strong className='error-color'>手机号码</strong>；
              {props.vars.map((item, index) => (
                <Fragment key={item}>
                  <span className='error-color'>
                    第{index + 2}列（ {letters[index + 1]} 列）
                  </span>
                  设为 <span className='error-color'> @var({item}) </span>{' '}
                  对应的值{index + 1 == props.vars.length ? '。' : '；'}
                </Fragment>
              ))}
            </p>
          )}
        </Col>
        <Col span={24}>
          <Table
            className='file-table'
            bordered={true}
            virtual
            columns={columns}
            scroll={{ x: 300, y: 800 }}
            rowKey={'to'}
            dataSource={data}
            pagination={false}
          />
        </Col>
        <Col span={24} className='p-t-16'>
          <Flex justify='end'>
            <Pagination
              defaultCurrent={1}
              current={page}
              defaultPageSize={pageSize}
              pageSizeOptions={[]}
              size='small'
              total={total}
              showSizeChanger={false}
              showQuickJumper
              onChange={onChangeCurrentPage}
              showTotal={(total) => `共 ${total} 条`}></Pagination>
          </Flex>
        </Col>
        <Col span={24}>
          <div className='primary-color fn16 p-y-8'>上传文件</div>{' '}
          <Upload {...uploadProps}>
            <Button
              type='primary'
              icon={
                uploadLoading ? (
                  <LoadingOutlined rev={null} />
                ) : (
                  <UploadOutlined rev={null} />
                )
              }>
              选择文件（csv,xlsx,xls,txt）
            </Button>
          </Upload>
        </Col>
        <Col span={24}>
          <div className='color-warning-blue g-radius-4 p-x-16 p-y-8 fn13 m-t-24'>
            <span className='icon iconfont icon-dengpao fn12 m-r-2'></span>
            支持csv、xls、xlsx、txt文件，txt文件最大支持50万行数据，其他最大支持30万行
            <br />
            请注意：Excel 文件导入时列数应小于 26 列，超过
            26列时导入的数据无效，应转换到 CSV 文件进行导入； 如果您的
            Excel文件中包含“日期”属性的列，为避免出现日期格式的意外，请将日期属性的单元格转换为文本后进行导入
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default forwardRef(Fn)
