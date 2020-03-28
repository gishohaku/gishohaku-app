import { GetStaticProps } from 'next'
import Top from "../../components/top"
export default Top

export const getStaticProps: GetStaticProps<{
  eventId: string
}> = async () => {
  return { props: { eventId: 'gishohaku1' } }
}