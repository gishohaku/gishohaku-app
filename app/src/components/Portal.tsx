import { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

let container: Element | null = null

export const Portal: FCC = ({ children }) => {
  const [target, setTarget] = useState<HTMLDivElement | null>(null)

  // SSR とクライアント初回レンダの出力を一致させるため、portal 用の DOM 生成は
  // マウント後(useEffect)に行う。これによりサーバー側 null / クライアント初回 null と
  // なり hydration mismatch を防ぐ。
  useEffect(() => {
    if (!container) {
      container = document.createElement('div')
      document.body.appendChild(container)
    }

    const div = document.createElement('div')
    container.appendChild(div)
    setTarget(div)

    return () => {
      container!.removeChild(div)
    }
  }, [])

  return target ? ReactDOM.createPortal(children, target) : null
}
