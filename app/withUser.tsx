import { useContext, ComponentType } from 'react'
import UserContext from './contexts/UserContext'
import Loader from './components/Loader'

const withUser = (WrappedComponent: ComponentType<any>) => (props: any) => {
  const { isUserLoading, user, userData } = useContext(UserContext)

  if (isUserLoading) {
    return <Loader />
  }

  if (!userData) {
    return <p>ログインが必要です</p>
  }

  return <WrappedComponent user={user} userData={userData} {...props} />
}

export default withUser
