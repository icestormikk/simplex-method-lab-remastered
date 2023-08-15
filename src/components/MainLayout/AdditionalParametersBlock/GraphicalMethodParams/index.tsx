import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { appendParameters } from '@/redux/slices/TaskState';
import React from 'react';
import WarningMessage from '../WarningMessage';

function GraphicalMethodParams() {
  const dispatch = useAppDispatch()
  const {constraints} = useAppSelector((state) => state.taskReducer)
  const indexes = React.useMemo(
    () => {
      if (!constraints) {
        return
      }

      return constraints[0].polynomial.coefficients.map((_, index) => index)
    },
    [constraints]
  )
  const [selectedColumns, setSelectedColumns] = React.useState<number[]>([...Array(constraints?.length).keys()])
  const isBlocked = React.useMemo(
    () => selectedColumns.length !== new Set(selectedColumns).size,
    [selectedColumns]
  )

  const onSubmit = React.useCallback(
    async () => {
      if (isBlocked) {
        return
      }

      dispatch(appendParameters({selectedColumns: [...selectedColumns]}))
    },
    [dispatch, isBlocked, selectedColumns]
  )

  return (
    <div id='additional-params' className='flex flex-col gap-2 w-fit'>
      <b>Введите индексы переменных, к которым будет применён метод Гаусса: </b>
      <div className='flex flex-row gap-2 flex-nowrap'>
        {
          constraints?.map((_, index) => (
            <label key={index} htmlFor="x-axis" className='flex flex-row gap-2'>
              {`V${index}:`}
              <select 
                name={`${index}-var`} 
                id={`${index}-var`}
                defaultValue={selectedColumns[index]}
                onChange={(event) => setSelectedColumns((prevState) => {
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