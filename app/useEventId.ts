import { useEffect, useState } from 'react'
import { useRouter, NextRouter } from 'next/router'

import { EventId } from './utils/event'

const getEventId = (router: NextRouter): EventId => {
  const { query } = router
  if (query.eventId) return query.eventId as EventId
  const pathname = process.browser ? location.pathname : router.pathname
  console.log(query, pathname)
  const [_, eventId] = pathname.split('/')
  if (eventId) return eventId as EventId
  return 'gishohaku2'
}

const useEventId = (): {
  eventId: EventId
} => {
  const router = useRouter()
  return { eventId: getEventId(router) }
  const [eventId, setEventId] = useState<EventId>()
  useEffect(() => {
    const eventId = getEventId(router)
    setEventId(eventId)
  }, [router.pathname])
}

export default useEventId
