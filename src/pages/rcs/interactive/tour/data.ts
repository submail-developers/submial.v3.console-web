import { API } from 'apis'
export const chatbotList: API.ChatbotItem[] = [
  {
    id: 'chatbot0',
    chatbotID: null,
    account: '',
    name: '演示chatbot-1',
    appkey: '',
    enable: '1',
    bind: '0.0.0.0',
    datetime: '2024-03-20 10:48:33',
    status: '1',
    menu_status: '3',
    logo: '',
    callback: '',
    email: '',
    website: '',
    tcPage: '',
    address: '上海市普陀区金沙江路1977弄3号楼705室',
    colour: '',
    backgroundImage: '',
    category: '',
    provider: '上海鼎邮云计算有限公司',
    providerSwitchCode: '0',
    description: '',
    menu: {
      menu: {
        entries: [
          {
            reply: {
              displayText: '建议回复12',
              postback: {
                data: 'cb9cb4f732a447b31180e235c887ec13',
              },
            },
          },
          {
            action: {
              postback: {
                data: '8bc9037fda8a38730772bc67f22a6fbe',
              },
              dialerAction: {
                dialPhoneNumber: {
                  phoneNumber: '13112312312',
                  fallbackUrl: '',
                },
              },
              displayText: '客服电话',
            },
          },
        ],
      },
    },
    genericCssTemplate: null,
    autograph: '',
    attachment: null,
    actualIssueIndustry: '',
    debugWhiteAddress: '',
    sendApi: '1',
    messageId: '',
    menu_etag: '1',
  },
]
export const templateList: API.RcsTempListItem[] = [
  {
    id: 'template0',
    account: '',
    sign: 'RJNBF1',
    title: '演示模版-1',
    type: 2,
    contentType: '',
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
            cardOrientation: 'VERTICAL',
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
    sms: 'false',
    smsContent: '',
    mms: 'false',
    mmsSubject: '',
    mmsFilePath: '',
    mmsFileSize: '',
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
]
