import { useParams } from '@tanstack/react-router'
import ClosuresDay1 from './ClosuresDay1'
import ClosuresDay2 from './ClosuresDay2'
import ClosuresDay3 from './ClosuresDay3'
import ClosuresDay4 from './ClosuresDay4'
import ClosuresDay5 from './ClosuresDay5'
import ClosuresDay6 from './ClosuresDay6'
import ClosuresDay7 from './ClosuresDay7'
import DayPlaceholder from './DayPlaceholder'

export default function ClosuresDay() {
  const { day } = useParams({ from: '/core-concepts/closures-functions/$day' })
  switch (day) {
    case 'day-1':
      return <ClosuresDay1 />
    case 'day-2':
      return <ClosuresDay2 />
    case 'day-3':
      return <ClosuresDay3 />
    case 'day-4':
      return <ClosuresDay4 />
    case 'day-5':
      return <ClosuresDay5 />
    case 'day-6':
      return <ClosuresDay6 />
    case 'day-7':
      return <ClosuresDay7 />
    default:
      return <DayPlaceholder />
  }
}
