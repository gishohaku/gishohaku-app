import React, {
  useState,
  createContext,
  useCallback,
  FC,
  useContext,
} from 'react'

type ToastProps = {
  title: string
  intent: string
}

const ToastContext = createContext({} as (props: ToastProps) => void)

export const ToastProvider: FC = ({ children }) => {
  const [current, setCurrent] = useState<ToastProps | null>(null)
  const show = useCallback((toast: ToastProps) => {
    setCurrent(toast)
    setTimeout(() => {
      setCurrent(null)
    }, 5000)
  }, [])

  console.log(current)

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: '#212529',
          zIndex: 100,
          padding: '20px 16px',
          lineHeight: 1.5,
          color: 'white',
          fontSize: 16,
          transform: `translateY(${!!current ? '0' : '-120%'})`,
          transition: 'transform .3s ease-out',
        }}>
        {current?.title}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const show = useContext(ToastContext)
  return show
}
