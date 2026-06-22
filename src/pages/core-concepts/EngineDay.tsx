import { useParams } from '@tanstack/react-router'
import EngineDay1 from './EngineDay1'
import EngineDay2 from './EngineDay2'
import EngineDay3 from './EngineDay3'
import EngineDay4 from './EngineDay4'
import EngineDay5 from './EngineDay5'
import EngineDay6 from './EngineDay6'
import EngineDay7 from './EngineDay7'
import DayPlaceholder from './DayPlaceholder'

export default function EngineDay() {
  const { day } = useParams({ from: '/core-concepts/js-engine-internals/$day' })
  switch (day) {
    case 'day-1':
      return <EngineDay1 />
    case 'day-2':
      return <EngineDay2 />
    case 'day-3':
      return <EngineDay3 />
    case 'day-4':
      return <EngineDay4 />
    case 'day-5':
      return <EngineDay5 />
    case 'day-6':
      return <EngineDay6 />
    case 'day-7':
      return <EngineDay7 />
    default:
      return <DayPlaceholder />
  }
}
