import { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

let container: Element | null = null

export const Portal: React.FC = ({ children }) => {
  const [target] = useState<HTMLDivElement | null>(() => {
    if (typeof document === 'undefined') {
      return null
    }

    if (!container) {
      container = document.createElement('div')
      document.body.appendChild(container)
    }

    const div = document.createElement('div')
    container.appendChild(div)

    return div
  })

  useEffect(() => {
    return () => {
      if (target) {
        container!.removeChild(target)
      }
    }
  }, [target])

  return target ? ReactDOM.createPortal(children, target) : null
}
