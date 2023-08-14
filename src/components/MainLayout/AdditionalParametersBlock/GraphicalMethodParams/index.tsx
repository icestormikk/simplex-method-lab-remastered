import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { appendParameters } from '@/redux/slices/TaskState';
import React from 'react';
import WarningMessage from '../WarningMessage';

function GraphicalMethodParams() {
  const dispatch = useAppDispatch()
  const {constraints, parameters} = useAppSelector((state) => state.taskReducer)
  const indexes = React.useMemo(
    () => {
      if (!constraints) {
        return
      }

      return constraints[0].polynomial.coefficients.map((_, index) => index)
    },
    [constraints]
  )
  const [axis, setAxis] = React.useState<number[]>([0, 1])
  const isBlocked = React.useMemo(
    () => axis[0] === axis[1], [axis]
  )

  const onSubmit = React.useCallback(
    async () => {
      if (isBlocked) {
        return
      }

      dispatch(appendParameters({axis: [...axis]}))
    },
    [axis, dispatch, isBlocked]
  )

  React.useEffect(
    () => {
      console.log(parameters)
    },
    [parameters]
  )

  return (
    <div id='additional-params' className='flex flex-col gap-2 w-fit'>
      <b>Введите индексы переменных, которые будут взяты в качестве осей графика: </b>
      <div className='flex flex-row gap-2 flex-nowrap'>
        {
          ['X', 'Y'].map((line, index) => (
            <label key={index} htmlFor="x-axis" className='flex flex-row gap-2'>
              {`Ось ${line}:`}
              <select 
                name={`${line}-axis`} 
                id={`${line}-axis`}
                defaultValue={axis[index]}
                onChange={(event) => setAxis((prevState) => {
                  prevState[index] = Number(event.target.value)
                  return [...prevState]
                })}
              >
                {
                  indexes?.map((variant, vIndex) => (
                    <option key={vIndex} value={variant}>{variant}</option>
                  ))
                }
              </select>
            </label>
          ))
        }
        {
          isBlocked && (
            <WarningMessage message='Нельзя выбирать одинаковые индексы' />
          )
        }
      </div>
      <button
        className='accept-button w-fit disabled:bg-red-600'
        disabled={isBlocked}
        onClick={onSubmit}
      >
        Принять
      </button>
    </div>
  );
}

export default GraphicalMethodParams;