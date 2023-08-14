import { DEFAULT_MATRIX_ELEMENT_VALUE } from '@/components/MatrixBuilder';
import React from 'react';

interface TargetFunctionBuilderProps {
  constraints: number[][]
  setTargetFunction: React.Dispatch<React.SetStateAction<number[]>>
}

function TargetFunctionBuilder({constraints, setTargetFunction}: TargetFunctionBuilderProps) {
  React.useEffect(
    () => {
      setTargetFunction(Array(constraints[0].length).fill(DEFAULT_MATRIX_ELEMENT_VALUE))
    },
    [constraints, setTargetFunction]
  )

  const onCoefficientChange = React.useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const value = Number(event.target.value)
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
            {constraints[0].map((_, index) => (
              <td key={index} className='decorative'>{`x${index}`}</td>
            ))}
          </tr>
          <tr>
            {constraints[0].map((_, index) => (
              <td key={index}>
                <input 
                  type="number"
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