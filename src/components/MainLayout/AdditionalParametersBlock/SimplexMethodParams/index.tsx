import React from 'react';
import { DEFAULT_MATRIX_ELEMENT_VALUE } from '@/components/MatrixBuilder';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { appendParameters } from '@/redux/slices/TaskState';
import WarningMessage from '../WarningMessage';

function SimplexMethodParams() {
  const dispatch = useAppDispatch()
  const {target, constraints} = useAppSelector((state) => state.taskReducer)
  const [basisCoefficients, setBasisCoefficients] = React.useState(
    Array(target?.func.coefficients.length).fill(DEFAULT_MATRIX_ELEMENT_VALUE)
  )
  const isBlocked = React.useMemo(
    () => {
      if (!constraints) {
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
    <div className='flex flex-col gap-2 w-fit'>
      <b>Введите базис: </b>
      <table className='matrix-table w-fit'>
        <tbody>
          <tr>
            {
              basisCoefficients.map((_, index) => (
                <td key={index}>
                  <input 
                    type="number" 
                    name={`b-${index}`} 
                    id={`b-${index}`}
                    defaultValue={0}
                    onChange={(event) => {
                      const value = Number(event.target.value)
                      setBasisCoefficients((prevState) => {
                        prevState[index] = value
                        return [...prevState]
                      })
                    }}
                  />
                </td>   
              ))
            }
          </tr>
        </tbody>
      </table>
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