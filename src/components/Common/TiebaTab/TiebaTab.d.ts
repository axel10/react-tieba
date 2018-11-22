import * as React from 'react'
import { IBaseProps } from 'src/mixin/IBaseProps'

export interface ITiebaTabItem {
  key: string,
  component: JSX.Element,
  label: string
}

export interface ITiebaTabProps {
  tabs: ITiebaTabItem[],
  routerKey?: string
}

export default class TiebaTab extends React.Component<ITiebaTabProps, any> {
}
