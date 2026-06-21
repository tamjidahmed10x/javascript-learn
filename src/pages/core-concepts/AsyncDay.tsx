import { useParams } from '@tanstack/react-router'
import AsyncDay1 from './AsyncDay1'
import AsyncDay2 from './AsyncDay2'
import AsyncDay3 from './AsyncDay3'
import AsyncDay4 from './AsyncDay4'
import AsyncDay5 from './AsyncDay5'
import AsyncDay6 from './AsyncDay6'
import AsyncDay7 from './AsyncDay7'
import DayPlaceholder from './DayPlaceholder'

export default function AsyncDay() {
  const { day } = useParams({ from: '/core-concepts/async-js/$day' })
  switch (day) {
    case 'day-1':
      return <AsyncDay1 />
    case 'day-2':
      return <AsyncDay2 />
    case 'day-3':
      return <AsyncDay3 />
    case 'day-4':
      return <AsyncDay4 />
    case 'day-5':
      return <AsyncDay5 />
    case 'day-6':
      return <AsyncDay6 />
    case 'day-7':
      return <AsyncDay7 />
    default:
      return <DayPlaceholder />
  }
}
