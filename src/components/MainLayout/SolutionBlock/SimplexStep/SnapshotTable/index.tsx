import { ROUNDING_ACCURACY, VARIABLE_NAME } from '@/constants';
import { useAppSelector } from '@/redux/hooks';
import { MatrixElement } from '@/types/aliases/MatrixElement';
import { Rational } from '@/types/classes/Rational';
import { FractionView } from '@/types/enums/FractionVIew';
import React from 'react';

interface SnapshotTableProps {
  rows: number[];
  columns: number[];
  coefficients: number[][];
  possibleBearingElements?: MatrixElement[];
  bearingElement?: MatrixElement;
  selectedElement?: MatrixElement;
  setSelectedElement?: React.Dispatch<React.SetStateAction<MatrixElement|undefined>> 
}

function SnapshotTable(
  {rows, columns, coefficients, possibleBearingElements, bearingElement, selectedElement, setSelectedElement}: SnapshotTableProps
) {
  const view = useAppSelector((state) => state.taskReducer.fractionView)

  const isBearingElement = React.useCallback(
    (row: number, column: number) => {
      if (!bearingElement) {
        return false
      }
      const {rowIndex, columnIndex} = bearingElement
      return row === rowIndex && column === columnIndex
    },
    [bearingElement]
  )

  const isPossibleBearingElement = React.useCallback(
    (row: number, column: number) => {
      if (!possibleBearingElements) {
        return false
      }

      const element = possibleBearingElements.find((element) => 
        element.rowIndex === row && element.columnIndex === column
      )
      
      return element !== undefined
    },
    [possibleBearingElements]
  )

  const isSelectedElement = React.useCallback(
    (row: number, column: number) => {
      if (!selectedElement) {
        return false
      }

      return selectedElement.rowIndex === row && selectedElement.columnIndex === column
    },
    [selectedElement]
  )
  const onSelect = React.useCallback(
    (row: number, column: number) => {
      if (!setSelectedElement) {
        return
      }

      const isPossible = possibleBearingElements?.find((element) => 
        element.rowIndex === row && element.columnIndex === column
      )
      if (!isPossible) {
        return
      }
 

      if (isSelectedElement(row, column)) {
        setSelectedElement(undefined)
        return
      }

      setSelectedElement(
        {rowIndex: row, columnIndex: column, multiplier: coefficients[row][column]}
      )
    },
    [coefficients, isSelectedElement, possibleBearingElements, setSelectedElement]
  )

  return (
    <table className='matrix-table w-fit'>
      <tbody>
        <tr>
          <td></td>
          {
            columns.map((element, index) => (
              <td key={index} className='decorative'>{`${VARIABLE_NAME}${element}`}</td>
            ))
          }
          <td></td>
        </tr>
        {
          coefficients.map((line, index) => (
            <tr key={index}>
              <td className='decorative'>
                {
                  rows[index] !== undefined && (
                    `${VARIABLE_NAME}${rows[index]}`
                  )
                }
              </td>
              {
                line.map((element, idx) => (
                  <td 
                    key={idx}
                    style={{
                      backgroundColor: 
                        isBearingElement(index, idx) ? 'rgba(22, 171, 70, 0.5)' : (
                          isPossibleBearingElement(index, idx) ? 'rgb(22, 171, 70, 0.3)' : ''
                        ),
                      border: isSelectedElement(index, idx) ? '2px dashed red' : ''
                    }}
                    onClick={() => onSelect(index, idx)}
                  >
                    {view === FractionView.RATIONAL ? Rational.fromNumber(element).toString() : element.toFixed(ROUNDING_ACCURACY)}
                  </td>
                ))
              }
            </tr>
          ))
        }
      </tbody>
    </table>
  );
}

export default SnapshotTable;