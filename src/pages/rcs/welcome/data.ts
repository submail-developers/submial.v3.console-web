import { API } from 'apis'
export const points: {
  request: API.PointItem[]
  deliveryed: API.PointItem[]
  dropped: API.PointItem[]
} = {
  deliveryed: [
    {
      dateflg: '2024-06-06',
      cnt: '9',
    },
    {
      dateflg: '2024-06-07',
      cnt: '40',
    },
    {
      dateflg: '2024-06-08',
      cnt: '7',
    },
    {
      dateflg: '2024-06-09',
      cnt: '26',
    },
    {
      dateflg: '2024-06-10',
      cnt: '26',
    },
    {
      dateflg: '2024-06-11',
      cnt: '26',
    },
    {
      dateflg: '2024-06-12',
      cnt: '11',
    },
  ],
  request: [
    {
      dateflg: '2024-06-06',
      cnt: '14',
    },
    {
      dateflg: '2024-06-07',
      cnt: '41',
    },
    {
      dateflg: '2024-06-08',
      cnt: '10',
    },
    {
      dateflg: '2024-06-09',
      cnt: '26',
    },
    {
      dateflg: '2024-06-10',
      cnt: '26',
    },
    {
      dateflg: '2024-06-11',
      cnt: '617',
    },
    {
      dateflg: '2024-06-12',
      cnt: '15',
    },
  ],
  dropped: [
    {
      dateflg: '2024-06-06',
      cnt: '5',
    },
    {
      dateflg: '2024-06-07',
      cnt: '1',
    },
    {
      dateflg: '2024-06-08',
      cnt: '3',
    },
    {
      dateflg: '2024-06-09',
      cnt: '26',
    },
    {
      dateflg: '2024-06-10',
      cnt: '26',
    },
    {
      dateflg: '2024-06-11',
      cnt: '591',
    },
    {
      dateflg: '2024-06-12',
      cnt: '4',
    },
  ],
}

export const hotPoints: API.HotPointItem[] = [
  {
    dateflg: '2024-06-06',
    hourflg: '10',
    cnt: '1',
  },
  {
    dateflg: '2024-06-06',
    hourflg: '17',
    cnt: '1',
  },
  {
    dateflg: '2024-06-06',
    hourflg: '9',
    cnt: '12',
  },
  {
    dateflg: '2024-06-07',
    hourflg: '14',
    cnt: '3',
  },
  {
    dateflg: '2024-06-07',
    hourflg: '17',
    cnt: '21',
  },
  {
    dateflg: '2024-06-07',
    hourflg: '18',
    cnt: '15',
  },
  {
    dateflg: '2024-06-07',
    hourflg: '9',
    cnt: '2',
  },
  {
    dateflg: '2024-06-08',
    hourflg: '16',
    cnt: '2',
  },
  {
    dateflg: '2024-06-08',
    hourflg: '17',
    cnt: '6',
  },
  {
    dateflg: '2024-06-08',
    hourflg: '18',
    cnt: '2',
  },
  {
    dateflg: '2024-06-11',
    hourflg: '10',
    cnt: '6',
  },
  {
    dateflg: '2024-06-11',
    hourflg: '11',
    cnt: '21',
  },
  {
    dateflg: '2024-06-11',
    hourflg: '13',
    cnt: '2',
  },
  {
    dateflg: '2024-06-11',
    hourflg: '14',
    cnt: '5',
  },
  {
    dateflg: '2024-06-11',
    hourflg: '15',
    cnt: '580',
  },
  {
    dateflg: '2024-06-11',
    hourflg: '17',
    cnt: '3',
  },
  {
    dateflg: '2024-06-12',
    hourflg: '11',
    cnt: '13',
  },
  {
    dateflg: '2024-06-12',
    hourflg: '9',
    cnt: '2',
  },
]
