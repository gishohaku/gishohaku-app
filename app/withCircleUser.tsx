import { useContext, ComponentType } from 'react'
import UserContext from './contexts/UserContext'
import Loader from './components/Loader'

const withCircleUser = (WrappedComponent: ComponentType<any>) => (props: any) => {
  const { isUserLoading, userData } = useContext(UserContext)

  if (isUserLoading) {
    return <Loader />
  }

  if (!userData) {
    return <p>ログインが必要</p>
  }

  if (!userData.circleRef) {
    return <p>not circle user</p>
  }

  return <WrappedComponent {...props} />
}

export default withCircleUser
