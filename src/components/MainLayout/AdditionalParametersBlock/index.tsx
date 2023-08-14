import { useAppSelector } from '@/redux/hooks';
import { TaskMode } from '@/types/enums/TaskMode';
import { ImCheckmark } from 'react-icons/im';
import SimplexMethodParams from './SimplexMethodParams';
import GraphicalMethodParams from './GraphicalMethodParams';

function AdditionalParametersBlock() {
  const {mode} = useAppSelector((state) => state.taskReducer)

  return (
    <section className='p-2 bordered rounded-md'>
      {
        mode === TaskMode.ARTIFICIAL ? (
          <div className='centered gap-2 flex-nowrap flex-row text-green-600'>
            <b>Дополнительные параметры не требуются</b>
            <ImCheckmark/>
          </div>
        ) : (
          mode === TaskMode.SIMPLEX ? (
            <SimplexMethodParams/>
          ) : (
            <GraphicalMethodParams/>
          )
        )
      }
    </section>
  );
}

export default AdditionalParametersBlock;