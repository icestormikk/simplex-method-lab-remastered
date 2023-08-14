/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode } from 'react';
import { ImMinus, ImPlus } from 'react-icons/im';

export const MAX_MATRIX_SIZE = 16
export const MIN_MAXTRIX_SIZE = 3
export const DEFAULT_MATRIX_ELEMENT_VALUE = 0

type ControllerButton = {
  title: string|ReactNode,
  action: (...args: any[]) => void,
  isBlocked: boolean
}

interface DoubleButtonProps {
  mainTitle: string,
  first: ControllerButton,
  second: ControllerButton
}

interface MatrixBuilderProps {
  matrix: number[][]
  setMatrix: React.Dispatch<React.SetStateAction<number[][]>>
}

function MatrixBuilder({ matrix, setMatrix }: MatrixBuilderProps) {
  const columns = React.useMemo<string[]>(
    () => matrix[0].map((_, index) => `x${index}`),
    [matrix[0].length]
  )
  const rows = React.useMemo<string[]>(
    () => matrix.map((_, index) => `f${index}`),
    [matrix]
  )

  const expandMatrixVertically = React.useCallback(
    async () => {
      if (matrix[0].length >= MAX_MATRIX_SIZE) {
        return
      }

      setMatrix((prevState) => {
        const updatedMatrix = JSON.parse(
          JSON.stringify(prevState)
        ) as number[][]
        updatedMatrix.forEach((row) => {
          row.push(DEFAULT_MATRIX_ELEMENT_VALUE)
        })
        
        return updatedMatrix
      })
    },
    [matrix]
  )
  const expandMatrixHorizontally = React.useCallback(
    async () => {
      if (matrix.length >= MAX_MATRIX_SIZE) {
        return
      }
      
      setMatrix((prevState) => {
        const updatedMatrix = JSON.parse(
          JSON.stringify(prevState)
        ) as number[][]
        const newLine = Array(updatedMatrix[0].length).fill(DEFAULT_MATRIX_ELEMENT_VALUE)
        updatedMatrix.push(newLine)

        return updatedMatrix
      })
    },
    [matrix]
  )
  const reduceMatrix = React.useCallback(
    async (type: "col"|"row") => {
      switch (type) {
        case "col": {
          setMatrix((prevState) => {
            prevState.forEach((line) => line.pop())
            return [...prevState]
          })
          break
        }
        case 'row': {
          setMatrix((prevState) => {
            prevState.pop()
            return [...prevState]
          })
          break
        }
      }
    },
    [matrix]
  )

  return (
    <section className='flex flex-col gap-4'>
      <div className='centered flex-row gap-2 w-full'>
        <DoubleButton
          mainTitle='Столбцы'
          first={{
            title: <ImPlus/>, 
            action: expandMatrixVertically, 
            isBlocked: matrix[0].length >= MAX_MATRIX_SIZE
          }} 
          second={{
            title: <ImMinus/>, 
            action: () => reduceMatrix('col'),
            isBlocked: matrix[0].length < MIN_MAXTRIX_SIZE
          }}
        />
        <DoubleButton
          mainTitle='Строки'
          first={{
            title: <ImPlus/>, 
            action: expandMatrixHorizontally,
            isBlocked: matrix.length >= MAX_MATRIX_SIZE
          }} 
          second={{
            title: <ImMinus/>, 
            action: () => reduceMatrix('row'),
            isBlocked: matrix.length < MIN_MAXTRIX_SIZE
          }}
        />
      </div>
      <table className='matrix-table'>
        <tbody>
          <tr>
            <td></td>
            {columns.map((column, index) => (
              <td key={index} className='decorative'>
                {column}
              </td>
            ))}
          </tr>
          {
            matrix.map((line, index) => (
              <tr key={index}>
                <td className='decorative'>
                  {rows[index]}
                </td>
                {
                  line.map((_, idx) => (
                    <td key={idx}>
                      <input 
                        type="number" 
                        defaultValue={0}
                        name={`m-${index}-${idx}`} 
                        id={`m-${index}-${idx}`}
                        onChange={(event) => {
                          matrix[index][idx] = Number(event.target.value)
                          setMatrix(matrix)
                        }}
                      />
                    </td>
                  ))
                }
              </tr>
            ))
          }
        </tbody>
      </table>
    </section>
  );
}

function DoubleButton({first, second, mainTitle}: DoubleButtonProps) {
  return (
    <div className='w-fit overflow-hidden rounded-md bordered text-center border-gray-400 shadow-lg flex flex-row'>
      <p className='px-4'>{mainTitle}</p>
      <div className='flex flex-row flex-nowrap text-white text-[0.8em]'>
        <button
          className='bg-green-600 rounded-none border-none centered'
          onClick={first.action}
          disabled={first.isBlocked}
          style={{backgroundColor: first.isBlocked ? 'darkgray' : ''}}
        >
          {first.title}
        </button>
        <button
          className='bg-red-600 rounded-none border-none centered'
          onClick={second.action}
          disabled={second.isBlocked}
          style={{backgroundColor: second.isBlocked ? 'darkgray' : ''}}
        >
          {second.title}
        </button>
      </div>
    </div>
  )
}

export default MatrixBuilder;