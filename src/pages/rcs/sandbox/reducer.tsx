import { useContext, createContext, useReducer } from 'react'

import { API } from 'apis'

const StateCtx = createContext(null)
const DispatchCtx = createContext(null)

const reduser = (state, action) => {
  switch (action.type) {
    case 'changeChatbot': {
      return {
        ...state,
        chatbot: action.payload,
        chats: [],
      }
    }
    case 'changeTemplate': {
      return {
        ...state,
        template: action.payload,
        chats: [],
      }
    }
    case 'changeChats': {
      return {
        ...state,
        chats: action.payload,
      }
    }
  }
}
type InitData = {
  // 当前chatbot
  chatbot: API.ChatbotItem | null
  // 当前模版
  template: API.RcsTempListItem | null
  // 模拟交互的信息
  chats: API.GetRcsInteractiveListResItem[]
  interactives: {
    fixeds: API.GetRcsInteractiveListResItem[]
    texts: API.GetRcsInteractiveListResItem[]
    btns: API.GetRcsInteractiveListResItem[]
    sugs: API.GetRcsInteractiveListResItem[]
  }
}

const initData: InitData = {
  chatbot: {
    id: '1024252',
    chatbotID: null,
    account: '508284d4749fcbf0750ee9c1b28302af',
    name: '名称11111',
    appkey: '9df6d38289296394b5b0c01de5214b3d',
    enable: '1',
    bind: '0.0.0.0',
    datetime: '2024-04-09 07:23:51',
    status: '1',
    menu_status: '3',
    logo: 'rcs/39cdee6050bd28ae89dacd2afd3b3f8f/user/2a2a2228bc3e75c37837b985a0f09a5f.png',
    callback: '15012341234',
    email: '123@qq.com',
    website: 'https://www.baidu.com',
    tcPage: 'https://www.baidu.com',
    address: '金环商务花园3号楼705',
    colour: '#1E90FF',
    backgroundImage:
      'rcs/39cdee6050bd28ae89dacd2afd3b3f8f/user/2a2a2228bc3e75c37837b985a0f09a5f.png',
    category: '信息传输',
    provider: '上海赛邮云计算有限公司',
    providerSwitchCode: '0',
    description: '机器人描述',
    menu: {
      menu: {
        entries: [
          {
            reply: {
              displayText: '建议回复',
              postback: {
                data: '01e317f0-c08a-7e38-c848-54ae73fb87f9',
              },
            },
          },
          {
            action: {
              urlAction: {
                openUrl: {
                  url: 'https://www.baidu.com',
                  application: 'browser',
                },
              },
              displayText: '打开URL',
              postback: {
                data: 'd1645b98-1436-8572-88de-0f8c118aadaf',
              },
            },
          },
          {
            menu: {
              displayText: '二级菜单',
              entries: [
                {
                  reply: {
                    displayText: '你好',
                    postback: {
                      data: '450c32fc-612e-13e0-e8d2-20dcccb20657',
                    },
                  },
                },
                {
                  action: {
                    urlAction: {
                      openUrl: {
                        url: 'https://www.10086.cn',
                        application: 'browser',
                      },
                    },
                    displayText: '访问主页',
                    postback: {
                      data: '64ad8f1a-7da9-8b01-fa59-2d873cf153a4',
                    },
                  },
                },
                {
                  action: {
                    dialerAction: {
                      dialPhoneNumber: {
                        dialPhoneNumber: '13800000002',
                      },
                    },
                    displayText: '客服电话',
                    postback: {
                      data: '30596c8b-5625-9726-aaf8-496d9e12d227',
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    },
    genericCssTemplate: '',
    autograph: 'SUBMAIL',
    attachment: '',
    actualIssueIndustry: '6',
    debugWhiteAddress: '15012341234,15012311231',
    sendApi: '0',
    eTag: '1',
  },
  template: {
    id: '4',
    account: '508284d4749fcbf0750ee9c1b28302af',
    sign: 'RJNBF1',
    title: '测试',
    type: 2,
    contentType: 'application/vnd.gsma.botmessage.v1.0+json',
    message: {
      message: {
        generalPurposeCard: {
          content: {
            media: {
              mediaUrl:
                'https://libraries.mysubmail.com/rcs/508284d4749fcbf0750ee9c1b28302af/user/613748b34d3885d6c085bbfd681016defad8682820240430013919.jpg',
              mediaContentType: 'image/png',
              mediaFileSize: '169906',
              height: 'MEDIUM_HEIGHT',
            },
            title: '标题',
            description: '内容',
            suggestions: [
              {
                action: {
                  urlAction: {
                    openUrl: {
                      application: 'browser',
                      url: 'https://www.mysubmail.com/',
                      parameters: '123',
                    },
                  },
                  displayText: '按钮',
                  postback: {
                    data: 'cbad46e5af5b0f114f7a2e0872272b76',
                  },
                },
              },
            ],
          },
          layout: {
            cardOrientation: 'HORIZONTAL',
            imageAlignment: 'LEFT',
            titleFontStyle: 'bold',
            descriptionFontStyle: 'italics',
          },
        },
      },
    },
    suggestions: {
      suggestions: [
        {
          reply: {
            displayText: '上行YES',
            postback: {
              data: 'YES',
            },
          },
        },
        {
          action: {
            displayText: '打开链接(系统自带浏览器)',
            postback: {
              data: 'open_url_browser',
            },
            urlAction: {
              openUrl: {
                url: 'https://rcs.10086.cn/',
                application: 'browser',
              },
            },
          },
        },
      ],
    },
    sms: 'true',
    smsContent: '这里是短信正文。。',
    mms: 'true',
    mmsSubject: '这里是彩信标题',
    mmsFilePath:
      'https://ftnj01.xnq.r.10086.cn:10099/s/0030320240327111WsE0Nzfw20040FD.bin',
    mmsFileSize: '27245',
    mmsFileExpired: '2024-04-30 11:16:29',
    createAt: '2024-04-01 16:40:22',
    updateAt: '2024-04-01 16:40:22',
    del: '0',
    checked: '1',
    api: '1',
    ipAddress: '127.0.0.1',
    rejectReason: '',
    folder: '0',
    bcTemplate: null,
  },
  chats: [],
  interactives: {
    fixeds: [
      {
        id: '53',
        title: '配置标题',
        type: '1',
        keywords: '',
        match_type: '0',
        chatbotId: '1024251',
        fixed_button: 'dc7a468ecd1b9fbf3eaa428f6c85b2a3',
        fixed_button_title: '我是标题4',
        fixed_button_action: 'reply',
        card_id: '',
        card_button: '',
        card_button_title: '',
        card_button_action: '',
        create_at: '2024-05-24 06:47:04',
        update_at: '2024-05-24 06:47:09',
        enabled: '1',
        reply_title: '测试',
        reply_sign: 'RJNBF1',
        reply_id: '4',
        card_template_title: '',
        card_template_sign: '',
      },
    ],
    texts: [
      {
        id: '39',
        title: '交互配置-文字匹配-正则表达式',
        type: '3',
        keywords: '/(键盘|鼠标)/',
        match_type: '3',
        chatbotId: '1024252',
        fixed_button: '',
        fixed_button_title: '',
        fixed_button_action: '',
        card_id: '',
        card_button: '',
        card_button_title: '',
        card_button_action: '',
        create_at: '2024-05-23 06:19:02',
        update_at: null,
        enabled: '1',
        reply_title: '123',
        reply_sign: 'uMNvIv',
        reply_id: '2',
        card_template_title: '',
        card_template_sign: '',
      },
    ],
    btns: [
      {
        id: '72',
        title: '321',
        type: '2',
        keywords: '',
        match_type: '0',
        chatbotId: '0',
        fixed_button: '',
        fixed_button_title: '',
        fixed_button_action: '',
        card_id: '4',
        card_button: 'cbad46e5af5b0f114f7a2e0872272b76',
        card_button_title: '按钮',
        card_button_action: 'urlAction',
        create_at: '2024-05-25 05:52:30',
        update_at: null,
        enabled: '1',
        reply_title: '测试',
        reply_sign: 'RJNBF1',
        reply_id: '4',
        card_template_title: '测试',
        card_template_sign: 'RJNBF1',
      },
    ],
    sugs: [
      {
        id: '71',
        title: '1323',
        type: '2',
        keywords: '',
        match_type: '0',
        chatbotId: '0',
        fixed_button: '',
        fixed_button_title: '',
        fixed_button_action: '',
        card_id: '4',
        card_button: 'open_url_browser',
        card_button_title: '打开链接(系统自带浏览器)',
        card_button_action: 'urlAction',
        create_at: '2024-05-25 05:51:34',
        update_at: '2024-05-25 05:52:41',
        enabled: '1',
        reply_title: '测试',
        reply_sign: 'RJNBF1',
        reply_id: '4',
        card_template_title: '测试',
        card_template_sign: 'RJNBF1',
      },
    ],
  },
}

export function StorePage(props: any) {
  const [store, dispatch] = useReducer(reduser, initData)
  return (
    <StateCtx.Provider value={store}>
      <DispatchCtx.Provider value={dispatch}>
        {props.children}
      </DispatchCtx.Provider>
    </StateCtx.Provider>
  )
}

export function useStateStore() {
  return useContext(StateCtx)
}
export function useStateDispatch() {
  return useContext(DispatchCtx)
}
