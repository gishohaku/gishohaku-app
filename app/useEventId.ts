import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

type EventId = 'gishohaku1' | 'gishohaku2'

const useEventId = () => {
  const { query } = useRouter()
  const [eventId, setEventId] = useState<EventId>(query.eventId as EventId || 'gishohaku2')
  useEffect(() => {
    setEventId(query.eventId as EventId || 'gishohaku2')
  }, [query.eventId])
  return { eventId }
}

export default useEventId
