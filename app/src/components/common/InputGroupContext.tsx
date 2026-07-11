import React, { useContext } from 'react'

interface InputGroupContextValue {
  uid?: string
  error?: string | React.ReactNode
}

const InputGroupContext = React.createContext<InputGroupContextValue>({
  uid: undefined,
  error: undefined,
})

export const InputGroupProvider = InputGroupContext.Provider

export const useInputGroup = () => useContext(InputGroupContext)
