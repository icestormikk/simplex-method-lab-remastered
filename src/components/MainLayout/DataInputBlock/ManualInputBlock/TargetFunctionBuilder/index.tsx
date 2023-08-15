/* eslint-disable @typescript-eslint/no-explicit-any */
import { fromRationalString } from '@/algorithms/numberhelper';
import { DEFAULT_MATRIX_ELEMENT_VALUE } from '@/constants';
import { Rational } from '@/types/classes/Rational';
import React from 'react';

interface TargetFunctionBuilderProps {
  constraints: number[][]
  setTargetFunction: React.Dispatch<React.SetStateAction<number[]>>
}

function TargetFunctionBuilder({constraints, setTargetFunction}: TargetFunctionBuilderProps) {
  React.useEffect(
    () => {
      setTargetFunction((prevState) => {
        const newArray = Array(constraints[0].length).fill(DEFAULT_MATRIX_ELEMENT_VALUE)
        prevState.forEach((element, index) => {
          newArray[index] = element
        })

        return newArray
      })
    },
    [constraints, setTargetFunction]
  )

  const onCoefficientChange = React.useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
      let {value}: any = event.target
      
      if (Rational.isRational(value)) {
        value = fromRationalString(value)
      } else {
        const convertedValue = Number(value)
        if (!Number.isNaN(convertedValue)) {
          value = convertedValue
        } else {
          value = DEFAULT_MATRIX_ELEMENT_VALUE
        }
      }


      setTargetFunction((prevState) => {
        prevState[index] = value
        return prevState
      })
    },
    [setTargetFunction]
  )

  return (
    <section>
      <table className='matrix-table mb-4'>
        <tbody>
          <tr>
            {constraints[0].slice(0, constraints[0].length - 1).map((_, index) => (
              <td key={index} className='decorative'>{`x${index}`}</td>
            ))}
            <td className='decorative'>c0</td>
          </tr>
          <tr>
            {constraints[0].map((_, index) => (
              <td key={index}>
                <input 
                  type="text"
                  defaultValue={0}
                  name={`tf-${index}`} 
                  id={`tf-${index}`}
                  onChange={(event) => onCoefficientChange(event, index)}
                />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </section>
  );
}

export default TargetFunctionBuilder;