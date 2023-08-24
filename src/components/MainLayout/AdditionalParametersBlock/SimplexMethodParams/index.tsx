import React from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { appendParameters } from '@/redux/slices/TaskState';
import WarningMessage from '../WarningMessage';
import { DEFAULT_MATRIX_ELEMENT_VALUE } from '@/constants';

function SimplexMethodParams() {
  const dispatch = useAppDispatch()
  const {target, constraints} = useAppSelector((state) => state.taskReducer)
  const [basisCoefficients, setBasisCoefficients] = React.useState(
    Array(target?.func.coefficients.length).fill(DEFAULT_MATRIX_ELEMENT_VALUE)
  )
  const isBlocked = React.useMemo(
    () => {
      if (!constraints || basisCoefficients.every((element) => element === 0)) {
        return true
      }

      const nonZeroElements = basisCoefficients.filter((element) => element > 0)
      return nonZeroElements.length < 0 || nonZeroElements.length > constraints.length
    },
    [basisCoefficients, constraints]
  )

  const onSubmit = React.useCallback(
    async () => {
      const refactoredBasis: number[] = []
      basisCoefficients.forEach((element, index) => {
        if (element > 0) {
          refactoredBasis.push(index)
        }
      })
      console.log(refactoredBasis)

      dispatch(
        appendParameters({basis: [...refactoredBasis]})
      )
    },
    [basisCoefficients, dispatch]
  )

  return (
    <div id="additional-params" className='flex flex-col gap-2 w-fit'>
      <b>Введите базис: </b>
      <div className='flex flex-row gap-2 flex-nowrap'>
        {
          basisCoefficients.map((_, index) => (
            <label key={index} htmlFor={`b-${index}`} className='flex flex-row gap-2'>
              {`V${index}`}
              <input 
                type="number" 
                name={`b-${index}`} 
                id={`b-${index}`}
                defaultValue={0}
                className='bordered w-12 rounded-sm px-2'
                onChange={(event) => {
                  const value = Number(event.target.value)
                  setBasisCoefficients((prevState) => {
                    prevState[index] = value
                    return [...prevState]
                  })
                }}
              />
            </label>
          ))
        }
      </div>
      <div className='centered gap-2 flex-row w-fit'>
        <button 
          className='accept-button w-fit hover:scale-[1.02] duration-100 disabled:bg-red-600'
          onClick={onSubmit}
          disabled={isBlocked}
        >
          Принять
        </button>
        {
          isBlocked && (
            <WarningMessage message='Неверно задан базис' />
          )
        }
      </div>
    </div>
  );
}

export default SimplexMethodParams;