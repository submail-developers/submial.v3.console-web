import { Dropdown, Button } from 'antd'
import { DownOutlined } from '@ant-design/icons'

const items = [
  {
    label: '导出 TXT (仅手机号码)',
    key: '0',
  },
  {
    label: '导出 CSV',
    key: '1',
  },

  {
    label: '导出 EXCEL',
    key: '2',
  },
  {
    label: '导出 JSON',
    key: '3',
  },
  {
    label: '导出 XML',
    key: '4',
  },
]
export default function Fn() {
  const exportEvent = (e) => {
    console.log(e)
  }
  return (
    <Dropdown
      className='export'
      menu={{ items, selectable: true, onClick: exportEvent }}
      trigger={['click']}>
      <Button type='primary'>
        <span className='m-r-8'>导出</span>
        <DownOutlined rev={null} />
      </Button>
    </Dropdown>
  )
}
