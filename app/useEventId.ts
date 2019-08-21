import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

type EventId = 'gishohaku1' | 'gishohaku2'

const useEventId = () => {
  const { pathname } = useRouter()
  const [eventId, setEventId] = useState<EventId>()
  useEffect(() => {
    // @ts-ignore
    const [_, eventId] = pathname.split('/')
    setEventId(eventId as EventId)
  }, [pathname])
  return { eventId }
}

export default useEventId
