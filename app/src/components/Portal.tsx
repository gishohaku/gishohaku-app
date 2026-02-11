import { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

let container: Element | null = null

export const Portal: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [target, setTarget] = useState<HTMLDivElement | null>(null)

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
