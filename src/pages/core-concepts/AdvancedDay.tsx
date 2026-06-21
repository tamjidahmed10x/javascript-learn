import { useParams } from '@tanstack/react-router'
import AdvancedDay1 from './AdvancedDay1'
import AdvancedDay2 from './AdvancedDay2'
import AdvancedDay3 from './AdvancedDay3'
import AdvancedDay4 from './AdvancedDay4'
import AdvancedDay5 from './AdvancedDay5'
import AdvancedDay6 from './AdvancedDay6'
import AdvancedDay7 from './AdvancedDay7'
import DayPlaceholder from './DayPlaceholder'

export default function AdvancedDay() {
  const { day } = useParams({ from: '/core-concepts/advanced-patterns/$day' })
  switch (day) {
    case 'day-1':
      return <AdvancedDay1 />
    case 'day-2':
      return <AdvancedDay2 />
    case 'day-3':
      return <AdvancedDay3 />
    case 'day-4':
      return <AdvancedDay4 />
    case 'day-5':
      return <AdvancedDay5 />
    case 'day-6':
      return <AdvancedDay6 />
    case 'day-7':
      return <AdvancedDay7 />
    default:
      return <DayPlaceholder />
  }
}
