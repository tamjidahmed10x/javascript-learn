import { useParams } from '@tanstack/react-router'
import PrototypesDay1 from './PrototypesDay1'
import PrototypesDay2 from './PrototypesDay2'
import PrototypesDay3 from './PrototypesDay3'
import PrototypesDay4 from './PrototypesDay4'
import PrototypesDay5 from './PrototypesDay5'
import PrototypesDay6 from './PrototypesDay6'
import PrototypesDay7 from './PrototypesDay7'
import DayPlaceholder from './DayPlaceholder'

export default function PrototypesDay() {
  const { day } = useParams({ from: '/core-concepts/prototypes-oop/$day' })
  switch (day) {
    case 'day-1':
      return <PrototypesDay1 />
    case 'day-2':
      return <PrototypesDay2 />
    case 'day-3':
      return <PrototypesDay3 />
    case 'day-4':
      return <PrototypesDay4 />
    case 'day-5':
      return <PrototypesDay5 />
    case 'day-6':
      return <PrototypesDay6 />
    case 'day-7':
      return <PrototypesDay7 />
    default:
      return <DayPlaceholder />
  }
}
