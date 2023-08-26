import { Matrix } from "@/types/aliases/Matrix";
import {GaussState} from "./gaussState";

export let REVERSE_NUMBER_SIGN = false

/**
 * Gaussian algorithm for solving matrices of size m*n
 * @param matrix the matrix to be solved
 * @param selectedColumns indexes of columns relative to which the Gauss method will
 * be executed
 * @param mode the stage to which the Gauss method will work
 */
export async function gauss(
    matrix: Matrix<number>,
    selectedColumns: Array<number> = Array.from(Array(matrix.length).keys()),
    mode: GaussState = GaussState.DIAGONALIZING
) {
    validateInput(selectedColumns, matrix)

    for (const columnIndex of selectedColumns) {
      const i = selectedColumns.indexOf(columnIndex)
      if (matrix[i][columnIndex] === 0) {
        swipeByMainElement(matrix, i)
      }

      for (let j = matrix.length - 1; j >= 0; j--) {
        if (j === i) {
          continue
        }

        const coefficient = matrix[j][columnIndex] / matrix[i][columnIndex]
        for (let k = 0; k < matrix[j].length; k++) {
          matrix[j][k] -= coefficient * matrix[i][k]
        }
      }
    }

    if (mode === GaussState.TRIANGULATE) {
      return
    }

    for (const columnIndex of selectedColumns) {
        const i = selectedColumns.indexOf(columnIndex)

        const coefficient = matrix[i][columnIndex];
        if (coefficient === 0) { continue }
        for (let j = 0; j < matrix[0].length; j++) {
            matrix[i][j] /= coefficient
        }
    }

    if (mode === GaussState.FULL_TRIANGULATION) {
      return
    }

    for (const columnIndex of toReversed(selectedColumns)) {
        const i = selectedColumns.indexOf(columnIndex)
        for (let j = 0; j < i; j++) {
            if (matrix[i][columnIndex] === 0) {
              continue
            }

            const coefficient = matrix[j][columnIndex] / matrix[i][columnIndex]
            for (let k = i; k < matrix[0].length; k++) {
              matrix[j][k] -= coefficient * matrix[i][k]
            }
        }
    }
}

function validateInput(
    selectedColumns: Array<number>,
    sourceMatrix: Matrix<number>
) {
    selectedColumns = selectedColumns.splice(
      0, selectedColumns.length, ...new Set(selectedColumns)
    )
    selectedColumns.forEach((el, index) => {
      if (el < 0 || el > sourceMatrix[0].length) {
        selectedColumns.splice(index, 1)
      }
    })

    if (selectedColumns.length !== sourceMatrix.length) {
      throw new Error('Count of selected columns !== source matrix size')
    }
}

function swipeByMainElement(
  matrix: Matrix<number>,
  selectedRowIndex: number
) {
  const max = {rowIndex: selectedRowIndex, value: Number.MIN_VALUE}

  for (let i = 0; i < matrix.length; i++) {
      const current = matrix[i][selectedRowIndex]
      if (current !== 0 && Math.abs(current) > max.value) {
          max.rowIndex = i; max.value = Math.abs(current)
      }
  }

  if (max.rowIndex !== selectedRowIndex) {
      REVERSE_NUMBER_SIGN = !REVERSE_NUMBER_SIGN
      for (let i = 0; i < matrix[0].length; i++) {
        [matrix[max.rowIndex][i],  matrix[selectedRowIndex][i]] = 
          [matrix[selectedRowIndex][i], matrix[max.rowIndex][i]]
      }
  }

  return matrix
}

function toReversed<T>(source: Array<T>) : Array<T> {
  const result: Array<T> = []
  for (let i = source.length - 1; i >= 0; i--) {
      result.push(source[i])
  }

  return result
}