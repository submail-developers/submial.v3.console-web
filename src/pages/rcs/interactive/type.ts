import { API } from 'apis'

export type Options = {
  label: string
  value: string
  disabled: boolean
  item: API.EntriesItem | API.RcsSuggestionItem
}
