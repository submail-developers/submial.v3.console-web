import { API } from 'apis'

// 固定菜单
export type Entries = API.EntriesItem[]

// ;/api/mss / import_data_from_file
// {
//     "org_name": "1.txt",
//     "oss_path": "public/7405f1e8b0b2be6bccf68741d74dc339/sms/20240517013256_c4b1a923b8e0fe4aac2661574936167c.txt",
//     "data": [
//         [
//             "13112313212"
//         ]
//     ]
// }

// addressmod: addressbook
// address_data: [
//   'b0d7862bed050410bfe5ed44afb2e10c',
//   'a9d396e590ba3ee6388bbf555d87b9cc',
// ]

// addressmod: file
// address_data: [
//   { to: '13112312312', vars: { test1: 'aa', test2: 'bb' } },
//   { to: '13212312312', vars: { test1: 'cc', test2: 'dd' } },
// ]

// addressmod: input
// address_data: [{ to: '13112312312', vars: { test1: '131', test2: '32' } }]

// addressmod: input
// address_data: '13112312312'
