import * as React from 'react'

export interface ITiebaTabItem {
  key: string
  component: JSX.Element
  label: string
  isFull?: boolean
}

export interface ITiebaTabProps {
  tabs: ITiebaTabItem[]
  routerKey?: string
}

export default class TiebaTab extends React.Component<ITiebaTabProps, any> {
}
