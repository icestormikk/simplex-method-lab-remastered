/* eslint-disable @typescript-eslint/no-explicit-any */
import {store} from "@/redux/store";
import {clearResult} from "@/redux/slices/SimplexState";
import { deleteColumnByIndex } from "@/algorithms/arrayhelper";
import { Matrix } from "@/types/aliases/Matrix";
import { MatrixElement, EMPTY_MATRIX_ELEMENT } from "@/types/aliases/MatrixElement";
import Coefficient from "@/types/classes/Coefficient";
import { Equation } from "@/types/classes/Equation";
import Polynomial from "@/types/classes/Polynomial";
import SimplexMatrix from "@/types/classes/SimplexMatrix";
import { TargetFunction } from "@/types/classes/TargetFunction";
import { ExtremumType } from "@/types/enums/ExtremumType";
import { ArtificialSimplexEndTag, ArtificialSimplexStartTag, DefaultSimplexStartTag, HasErrorTag } from "@/types/enums/SimplexStepTag";
import { appendSimplexStep, passDefaultSimplexMethod } from "..";
import { ArtificialSimplexError } from "@/types/exceptions/ArtificialSimplexError";
import { TaskMode } from "@/types/enums/TaskMode";

/**
 * The main algorithm for performing the artificial basis method (without preparatory operations)
 * @param target the objective function, the optimal solution of which must be found
 * @param simplex a simplex matrix constructed based on existing constraints
 * @param additionalCoefficientIndexes column indexes that were added to solve an additional task
 * @param firstStepBearingElement the bearing element of the first step
 */
export async function passArtificialSimplexMethod(
  target: TargetFunction,
  simplex: SimplexMatrix,
  additionalCoefficientIndexes: Array<number>,
  firstStepBearingElement?: { element: MatrixElement, possibleElements: Array<MatrixElement> }
) {
  for (;!isArtificialSolution(simplex);) {
    const cols = simplex.findPossibleBearingColumns()
    const brokenElements: MatrixElement[] = []
    let bearingElements;

    try {
      bearingElements = firstStepBearingElement || simplex.findBearingElements(cols)
      if (firstStepBearingElement) {
        firstStepBearingElement = undefined
      }

      if (!bearingElements.element) {
        throw new ArtificialSimplexError('Не определён опорный элемент (undefined)!')
      }

      const {newMatrix, calculations, errorsData} = simplex.makeStep(bearingElements.element)
      if (errorsData) {
        brokenElements.push(errorsData)
        throw new ArtificialSimplexError('Неверно выбран опорный элемент')
      }

      await appendSimplexStep(
        TaskMode.ARTIFICIAL,
        target,
        simplex,
        bearingElements.element,
        bearingElements.possibleElements,
        additionalCoefficientIndexes,
        {
          calculations,
          tags: (store.getState().simplexReducer.steps.length === 0)
            ? [new ArtificialSimplexStartTag()]
            : []
        },
      )
      simplex = newMatrix

      deleteUnnecessaryColumnsFrom(simplex, additionalCoefficientIndexes)
    } catch (e: any) {
      await appendSimplexStep(
        TaskMode.ARTIFICIAL,
        target,
        simplex,
        bearingElements?.element || EMPTY_MATRIX_ELEMENT,
        bearingElements?.possibleElements,
        additionalCoefficientIndexes,
        {
          tags: [new HasErrorTag(e.message || "Система условий противоречива.", brokenElements)]
        }
      )
      store.dispatch(clearResult())
      throw new Error(`Система условий противоречива.`)
    }
  }

  await appendSimplexStep(
    TaskMode.ARTIFICIAL,
    target,
    simplex,
    EMPTY_MATRIX_ELEMENT,
    [],
    additionalCoefficientIndexes,
    {tags: [
      new ArtificialSimplexEndTag(), new DefaultSimplexStartTag()
    ]}
  )

  const updatedSimplex = passToDefaultSimplex(target, simplex)
  return await passDefaultSimplexMethod(target, updatedSimplex);
}

/**
 * The complete algorithm of the artificial basis method
 * @param target the objective function, the optimal solution of which must be found
 * @param constraints restrictions imposed on the function
 */
export async function artificialBasisMethod(
  target: TargetFunction,
  constraints: Array<Equation>
) {
  const targetCopy = target.copy()
  const constraintsCopy = await copyConstraints(constraints)

  validateArguments(targetCopy, constraintsCopy)
  const appendedCoefficients = appendCoefficients(constraintsCopy)
  const allIndexes = [...Array(appendedCoefficients[appendedCoefficients.length - 1].index + 1).keys()]

  const simplex = SimplexMatrix.fromMathObjects(
    targetCopy, constraintsCopy, allIndexes,
    appendedCoefficients.map((el) => el.index)
  )
  fillSimplexMatrixLastRow(simplex.coefficientsMatrix)

  return await passArtificialSimplexMethod(
    targetCopy,
    simplex,
    appendedCoefficients.map((el) => el.index)
  )
}

function validateArguments(
  target: TargetFunction,
  constraints: Array<Equation>
) {
  if (target.extremumType === ExtremumType.MAXIMUM) {
    target.reverse()
  }

  for (const constraint of constraints) {
    if (constraint.value < 0) {
      constraint.polynomial.coefficients.forEach((coefficient) => {
          coefficient.multiplier *= -1
      })
      constraint.value *= -1
    }
  }
}

/**
 * Creating a deep copy of a series of constraints
 * @param source constraints that need to be copied
 */
export async function copyConstraints(source: Array<Equation>) : Promise<Equation[]> {
  const result: Array<Equation> = []
  for (const equation of source) {
    const copied = equation.copy()
    result.push(copied)
  }
  return result
}

function isArtificialSolution(simplexMatrix: SimplexMatrix) : boolean {
  const lastMatrixRowIndex = simplexMatrix.coefficientsMatrix.length - 1

  for (let i = 0; i < simplexMatrix.coefficientsMatrix[lastMatrixRowIndex].length; i++) {
    if (simplexMatrix.coefficientsMatrix[lastMatrixRowIndex][i] !== 0) {
      return false
    }
  }

  return true
}

function passToDefaultSimplex(
  target: TargetFunction,
  simplex: SimplexMatrix
) {
  simplex.coefficientsMatrix.pop()
  const newEquations = convertToEquations(simplex.rows, simplex.columns, simplex.coefficientsMatrix)

  newEquations.forEach((equation) => {
      const index = equation.polynomial.coefficients[0].index;
      const solved = equation.solveByCoefficient(index)
      target.func.replaceCoefficientByIndex(index, solved)
  })

  return SimplexMatrix.fromMathObjects(
      target, newEquations, simplex.columns, simplex.rows
  )
}

function convertToEquations(
  rows: Array<number>,
  columns: Array<number>,
  coefficients: Matrix<number>
) : Array<Equation> {
  const result: Array<Equation> = []

  coefficients.forEach((line, index) => {
    const lastColumnIndex = line.length - 1

    const eq = new Equation(
      new Polynomial([new Coefficient(1, rows[index])]),
      line[lastColumnIndex]
    )
    for (let i = 0; i < lastColumnIndex; i++) {
      eq.polynomial.coefficients.push(
          new Coefficient(line[i], columns[i])
      )
    }
    result.push(eq)
  })

  return result
}

function deleteUnnecessaryColumnsFrom(
    source: SimplexMatrix, additionalCoefficientIndexes: Array<number>
) {
  source.columns.forEach((column, index) => {
    if (additionalCoefficientIndexes.includes(column)) {
      source.columns.splice(index, 1)
      deleteColumnByIndex(source.coefficientsMatrix, index)
    }
  })
}

function appendCoefficients(constraints: Array<Equation>) : Array<Coefficient> {
  function findLongestConstraint(source: Array<Equation>) : Equation {
    let result = source[0]
    for (const equation of source) {
      if (result.polynomial.coefficients.length < equation.polynomial.coefficients.length) {
        result = equation
      }
    }
    return result
  }

  const addedCoefficients: Array<Coefficient> = []
  const startIndex = findLongestConstraint(constraints).polynomial.coefficients.length
  constraints.forEach((constraint, index) => {
    const newCoefficient = new Coefficient(1, startIndex + index)
    constraint.polynomial.coefficients.push(newCoefficient)
    addedCoefficients.push(newCoefficient)
  })

  return addedCoefficients
}

function fillSimplexMatrixLastRow(source: Matrix<number>) {
  const lastRowIndex = source.length - 1

  for (let i = 0; i < source[lastRowIndex].length; i++) {
    let sum = 0
    for (let j = 0; j < source.length - 1; j++) {
        sum += source[j][i]
    }
    source[lastRowIndex][i] = sum * (sum ? -1 : 1)
  }
}
