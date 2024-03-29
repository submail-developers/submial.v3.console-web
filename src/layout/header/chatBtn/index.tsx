import { ChatIcon } from '@/components/aIcons'
import './index.scss'
import { useEffect, useRef, useState } from 'react'
import { Grid } from 'antd'

import { usePoint } from '@/hooks'

type Rect = {
  width?: number | 'auto'
  height?: number | 'auto'
}

let isDev = false

// 开发环境隐藏iframe
if (import.meta.env.MODE === 'development') {
  isDev = true
}

const iframeRects = {
  lg: {
    width: 720,
    height: 770,
  },
  md: {
    width: 720,
    height: 770,
  },
  xs: {
    width: 390,
    height: 690,
  },
}

const feedbackRects = {
  lg: {
    width: 700,
    height: 750,
  },
  md: {
    width: 690,
    height: 750,
  },
  xs: {
    width: '100%',
    height: 670,
  },
}

const { useBreakpoint } = Grid

export default function ChatBtn() {
  const timerRef = useRef(null)
  const iframeDocRef = useRef(null)
  const chatBtnEl = useRef(null)
  const chatCloseBtnEl = useRef(null)
  const [openChat, setOpenChat] = useState(false)
  const points = useBreakpoint()

  const [iframeRect, setiframeRect] = useState<Rect>({
    width: 720,
    height: 655,
  })

  const chatBtnClickEvent = () => {
    setOpenChat(true)
    chatCloseBtnEl.current = iframeDocRef.current.querySelector(
      '.mdi-chat-close-btn',
    )
    chatCloseBtnEl.current.addEventListener('click', chatCloseBtnClickEvent)
  }

  const chatCloseBtnClickEvent = () => {
    setOpenChat(false)
  }

  const init = () => {
    timerRef.current = setTimeout(() => {
      const iframe = document.getElementById('feedback-iframe-window')
      if (iframe) {
        iframeDocRef.current =
          //@ts-ignore
          iframe.contentDocument || iframe.contentWindow.document
        if (iframeDocRef.current) {
          chatBtnEl.current =
            iframeDocRef.current.querySelector('.mdi-chat-btn')
          iframeDocRef.current.classList.remove('shadow')
          iframeDocRef.current.style.boxShadow = '0 0 8px rgba(0, 0, 0, 0.15)'
          if (chatBtnEl.current) {
            chatBtnEl.current.addEventListener('click', chatBtnClickEvent)
          }
        }
      }
    }, 300)
  }

  useEffect(() => {
    return () => {
      timerRef.current && clearTimeout(timerRef.current)
      chatBtnEl.current &&
        chatBtnEl.current.removeEventListener('click', chatBtnClickEvent)
      chatCloseBtnEl.current &&
        chatCloseBtnEl.current.removeEventListener('click', chatBtnClickEvent)
    }
  }, [])

  useEffect(() => {
    if (openChat) {
      let contentEl = iframeDocRef.current.querySelector('mdi-feedback-content')
      let gridEl = iframeDocRef.current.querySelector(
        'mdi-feedback-content grid',
      )
      if (gridEl) {
        gridEl.style.flexWrap = 'nowrap'
      }
      if (contentEl) {
        contentEl.classList.remove('shadow-l')
        contentEl.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.075)'
      }
      if (points.lg) {
        setiframeRect(iframeRects.lg)
        if (contentEl) {
          contentEl.style.width = feedbackRects.lg.width + 'px'
          contentEl.style.height = feedbackRects.lg.height + 'px'
        }
      } else if (points.md) {
        setiframeRect(iframeRects.md)
        if (contentEl) {
          contentEl.style.width = feedbackRects.md.width + 'px'
          contentEl.style.height = feedbackRects.md.height + 'px'
        }
      } else {
        setiframeRect(iframeRects.xs)
        if (contentEl) {
          contentEl.style.width = feedbackRects.xs.width
          contentEl.style.height = feedbackRects.xs.height + 'px'
        }
      }
    }
  }, [points, openChat])
  return (
    <div className='chat-btn'>
      {!isDev && (
        <iframe
          referrerPolicy='same-origin'
          id='feedback-iframe-window'
          name='chatIframe'
          onLoad={init}
          width={openChat ? iframeRect.width : 100}
          height={openChat ? iframeRect.height : 100}
          style={{ border: 'none' }}
          src='/console/welcome/test_index'></iframe>
      )}
    </div>
  )
}
