import { Matrix } from "@/types/aliases/Matrix"

/**
 * Build a two-dimensional array filled with zeros
 * @param rowCount number of rows of the new array
 * @param columnCount number of columns of the new array
 */
export function buildTwoDimensionalArray<T>(rowCount: number, columnCount: number) : Array<Array<T>> {
    const rows = Array(rowCount)
    for (let i = 0; i < rows.length; i++) {
        rows[i] = Array(columnCount).fill(0)
    }

    return rows
}

/**
 * Deep copying of an existing two-dimensional array
 * @param source the array to copy
 */
export function copyTwoDimensionalArray<T>(source: Matrix<T>) : Matrix<T> {
    const result: Matrix<T> = Array(source.length)

    for (let i = 0; i < source.length; i++) {
        result[i] = [...source[i]]
    }

    return result
}

/**
 * Removing a column from the matrix by its index
 * @param source the matrix from which to delete the column
 * @param index index of the column to be deleted
 */
export function deleteColumnByIndex<T>(source: Matrix<T>, index: number) {
    if (index < 0) {
        throw new Error('Index can not be negative!')
    }

    for (let i = 0; i < source.length; i++) {
        if (index >= source[i].length) {
            console.warn(`Can not delete element with index ${index} in line ${i}. It does not exist.`)
            continue
        }
        source[i].splice(index, 1)
    }
}

/**
 * Getting the longest string in an array with different string lengths
 * @param source array in which to find the longest string
 */
export function getLongestLineInMatrix<T>(source: Matrix<T>) : Array<T> {
    let result = [...source[0]]
    for (const line of source) {
        if (line.length > result.length) {
            result = [...line]
        }
    }

    return result
}

/**
 * Checking whether the array is filled with zeros
 * @param source array to check
 */
export function allElementsAreZero(source: Array<number>) {
    for (let i = 0; i < source.length; i++) {
        if (source[i] !== 0) {
            return false
        }
    }

    return true
}
