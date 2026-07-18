import type { FunctionComponent, PropsWithChildren } from 'react'

// React 18 の @types/react は FunctionComponent(旧 React.FC / React.SFC)から
// 暗黙の children を削除した。本アプリの多数のコンポーネントは children を明示宣言
// せず利用しているため、children を含む関数コンポーネント型 FCC を用意し、
// 旧 React.FC の置き換え先とする。(ランタイム挙動は不変。型のみの互換対応)
declare global {
  type FCC<P = {}> = FunctionComponent<PropsWithChildren<P>>
}

export {}
