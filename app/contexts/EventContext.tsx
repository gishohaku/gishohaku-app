import { createContext, useState, useEffect } from "react";
import { EventId } from "../utils/event";
import { useRouter, NextRouter } from "next/router";

export const getEventId = (router: NextRouter): EventId => {
  const { query } = router
  if (query.eventId) return query.eventId as EventId
  const pathname = process.browser ? location.pathname : router.asPath
  const [_, eventId] = pathname.split('/')
  if (eventId) return eventId as EventId
  return 'gishohaku2'
}

export const EventProvider: React.FC<{
  initialId: EventId
}> = ({ initialId, children }) => {
  const [eventId, setEventId] = useState<EventId>(initialId)
  const router = useRouter()

  useEffect(() => {
    setEventId(getEventId(router))
  }, [router])

  // let serverEventId: EventId | undefined = undefined
  // if (!process.browser) {
  //   serverEventId = getEventId(router)
  // }

  return <EventContext.Provider value={{ eventId }}>
    {eventId}
    {children}
  </EventContext.Provider>
}

const EventContext = createContext<{
  eventId?: EventId
}>({})

export default EventContext