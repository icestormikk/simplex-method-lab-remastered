/* eslint-disable @typescript-eslint/no-explicit-any */
import {store} from "@/redux/store";
import { MatrixElement, EMPTY_MATRIX_ELEMENT } from "@/types/aliases/MatrixElement";
import Coefficient from "@/types/classes/Coefficient";
import { Equation } from "@/types/classes/Equation";
import SimplexMatrix from "@/types/classes/SimplexMatrix";
import { TargetFunction } from "@/types/classes/TargetFunction";
import { ExtremumType } from "@/types/enums/ExtremumType";
import { copyTwoDimensionalArray } from "../arrayhelper";
import { gauss } from "../gauss";
import { HasErrorTag, HasResultTag, SimplexStepTag } from "@/types/enums/SimplexStepTag";
import { TaskMode } from "@/types/enums/TaskMode";
import { addStep, clearResult, setResult } from "@/redux/slices/SimplexState";
import { SimplexError } from "@/types/exceptions/SimplexError";

/**
 * Adding the next step of the simplex method
 * @param isArtificialStep a parameter indicating whether the current step is a step of the
 * artificial basis method
 * @param target the objective function, the optimal solution of which must be found
 * @param simplexMatrix a simplex matrix constructed based on existing constraints
 * @param bearingElement current bearing element
 * @param possibleElements current possible bearing elements
 * @param appendedCoefficientIndexes indexes of columns added during the execution of the
 * artificial basis method
 * @param content additional step information (column calculations, information tags)
 */
export async function appendSimplexStep(
  type: TaskMode,
  target: TargetFunction,
  simplexMatrix: SimplexMatrix,
  bearingElement: MatrixElement,
  possibleElements: Array<MatrixElement> = [],
  appendedCoefficientIndexes?: number[],
  content?: { calculations?: Array<string>, tags?: Array<SimplexStepTag> }
) {
  if (bearingElement.rowIndex === undefined || bearingElement.columnIndex === undefined) {
    console.warn('Can\'t add a reference element with an undefined column or row index')
    return
  }

  const targetCopy = target.copy()
  store.dispatch(
    addStep({
      type,
      target: targetCopy,
      appendedCoefficientIndexes,
      snapshot: new SimplexMatrix(
        [...simplexMatrix.rows],
        [...simplexMatrix.columns],
        copyTwoDimensionalArray(simplexMatrix.coefficientsMatrix)
      ),
      bearingElement,
      possibleBearingElements: possibleElements,
      additonalContent: {
        calculations: content?.calculations || [],
      },
      tags: content?.tags || []
    })
  )
}

/**
 * The complete algorithm for calculating the simplex method
 * @param targetFunction the objective function, the optimal solution of which must be found
 * @param constraints restrictions imposed on the function
 * @param selectedColumnIndexes indexes of columns relative to which the simplex method works
 * (to which the Gauss method is applied)
 */
export async function simplexMethod(
    targetFunction: TargetFunction,
    constraints: Array<Equation>,
    selectedColumnIndexes: number[],
) {
  const targetCopy = targetFunction.copy()
  const allColumnIndexes = [...Array(targetFunction.func.coefficients.length).keys()]

  if (targetCopy.extremumType === ExtremumType.MAXIMUM) {
    targetCopy.reverse()
  }


  let validatedSelectedColumns: number[]
  try {
    validatedSelectedColumns = await validateColumnsArray(selectedColumnIndexes, allColumnIndexes)
  } catch (e: any) {
    store.dispatch(clearResult())
    throw new SimplexError(`Error while validating of columns: ${e.message}`)
  }

  const matrixConstraints = Equation.toMatrix(constraints)
  try {
    await gauss(matrixConstraints, validatedSelectedColumns)
    const equations = Equation.fromMatrix(matrixConstraints)

    equations.forEach((eq, index) => {
      const column = validatedSelectedColumns[index];
      const solved = eq.solveByCoefficient(column)
      targetCopy.func.replaceCoefficientByIndex(column, solved)
    })

    const simplexMatrix = SimplexMatrix.fromMathObjects(
      targetCopy, equations, allColumnIndexes, selectedColumnIndexes
    )

    await passDefaultSimplexMethod(targetCopy, simplexMatrix);
  } catch (e: any) {
    store.dispatch(clearResult())
    throw new Error(e.message)
  }
}

/**
 * The main part of the work of the simplex method (without preliminary preparations)
 * @param target the objective function, the optimal solution of which must be found
 * @param simplexMatrix a simplex matrix constructed based on existing constraints
 * @param firstStepBearingElement the bearing element of the first step
 */
export async function passDefaultSimplexMethod(
    target: TargetFunction,
    simplexMatrix: SimplexMatrix,
    firstStepBearingElement?: { element: MatrixElement, possibleElements: Array<MatrixElement> }
) {
  for (;!isSolution(simplexMatrix);) {
    const cols = simplexMatrix.findPossibleBearingColumns()
    let bearingElements

    try {
      bearingElements = firstStepBearingElement || simplexMatrix.findBearingElements(cols)
      if (firstStepBearingElement) {
        firstStepBearingElement = undefined
      }

      if (!bearingElements.element) {
        throw new Error('Bearing element is undefined!')
      }
    } catch (e: any) {
      store.dispatch(clearResult())
      await appendSimplexStep(
        TaskMode.SIMPLEX,
        target,
        simplexMatrix,
        EMPTY_MATRIX_ELEMENT,
        [],
        undefined,
        {
          tags: [
              new HasErrorTag("Функция не ограничена снизу")
          ]
        }
      );
      throw new Error(`Cant find the bearing element: ${e.message}`)
    }

    const {newMatrix, calculations} = simplexMatrix.makeStep(bearingElements.element!)
    await appendSimplexStep(
      TaskMode.SIMPLEX,
      target,
      simplexMatrix,
      bearingElements.element,
      bearingElements.possibleElements,
      undefined,
      {calculations}
    );
    simplexMatrix = newMatrix;
  }

  await appendSimplexStep(
    TaskMode.SIMPLEX,
    target,
    simplexMatrix,
    EMPTY_MATRIX_ELEMENT,
    [],
    [],
    {tags: [new HasResultTag()]}
  )

  const extractedResult = extractCoefficients(simplexMatrix)
  store.dispatch(setResult(extractedResult))
  return simplexMatrix;
}

/**
 * Obtaining coefficients b(i) from a simplex matrix
 * @param simplexMatrix simplex matrix from which it is necessary to obtain the necessary coefficients
 */
export function extractCoefficients(simplexMatrix: SimplexMatrix) : Array<Coefficient> {
  const {rows, columns, coefficientsMatrix} = simplexMatrix
  const coefficients: number[] = Array(rows.length + columns.length).fill(0)
  const lastColumnIndex = coefficientsMatrix[0].length - 1

  rows.forEach((rowIndex, index) => {
    coefficients[rowIndex] = coefficientsMatrix[index][lastColumnIndex]
  })

  return coefficients.map((el, index) =>
    new Coefficient(el, index)
  )
}

function isSolution(simplexMatrix: SimplexMatrix) : boolean {
  const lastRowIndex = simplexMatrix.coefficientsMatrix.length - 1

  for (let i = 0; i < simplexMatrix.coefficientsMatrix[lastRowIndex].length - 1; i++) {
    const element = simplexMatrix.coefficientsMatrix[lastRowIndex][i]
    if (element < 0) {
        return false
    }
  }

  return true
}

async function validateColumnsArray(array: number[], allIndexesArray: number[]) {
  const result: number[] = []

  array.forEach((element) => {
    if (element >= 0 && allIndexesArray.includes(element)) {
        result.push(element)
    }
  })

  if (result.length === 0) {
    throw new Error('No suitable column indexes were found')
  }

  return result
}