import { Divider } from 'antd'

export default function Fn() {
  return (
    <div>
      <div className='success-color fw-500' style={{ fontSize: 32 }}>
        谢谢。
      </div>
      <div className='fn24 fw-500'>订单已完成支付</div>
      <Divider />
      <div>
        感谢你选择SUBMAIL的服务，订单：己完成，该笔订单中包含的的资源包现已生效！
      </div>
      <ul>
        <li>
          如果您的订单已提交了纸质发票申请，我们将在每周二和每周五使用顺丰快递寄出，届时请留意您的手机短信提醒。
        </li>
        <li>
          如果悠选择接收电子发票，稍后您将会收到电子发票凭证的短信和邮件，请注意查收。
        </li>
      </ul>
      <div>感谢您的使用。</div>
    </div>
  )
}
