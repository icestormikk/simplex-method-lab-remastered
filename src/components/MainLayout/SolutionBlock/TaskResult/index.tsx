import { useAppSelector } from '@/redux/hooks';
import { Rational } from '@/types/classes/Rational';
import React from 'react';
import { ImCheckmark } from 'react-icons/im';

function TaskResult() {
  const {target} = useAppSelector((state) => state.taskReducer)
  const {calculationsResult} = useAppSelector((state) => state.simplexReducer)

  return (
    <div className='p-2 bordered bg-green-200 rounded-md relative'>
      <b className='text-green-700'>Результат вычислений</b>
      <div className='flex justify-start items-center flex-row gap-4'>
        <ImCheckmark className='text-6xl text-green-500 absolute right-0 top-1/2 -translate-y-1/2 
        -translate-x-1/2 opacity-50'/>
        <div className='flex flex-col'>
          {
            (calculationsResult && target) && (
              <>
                <b>{`X = (${calculationsResult.map((num) => Rational.fromNumber(num)).join(', ')})`}</b>
                <b>{`F(X) = ${Rational.fromNumber(target.func.getValueIn(...calculationsResult))}`}</b>
              </>
            )
          }
        </div>
      </div>
    </div>
  );
}

export default TaskResult;