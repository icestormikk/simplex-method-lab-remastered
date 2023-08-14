import { Equation } from "@/types/classes/Equation"
import Polynomial from "@/types/classes/Polynomial"
import { TargetFunction } from "@/types/classes/TargetFunction"
import { gauss } from "../gauss"
import { copyConstraints } from "../simplex/artificial"

/**
 * A graphical method for solving a linear programming problem
 * @param target the objective function, the optimal solution of which must be found
 * @param constraints restrictions imposed on the function
 */
export async function graphicalMethod(
  target: TargetFunction,
  constraints: Array<Equation>,
  selectedColumnIndexes: number[]
) {
  const constraintsCopy = await copyConstraints(constraints)
  const targetCopy = target.copy()
  const constraintsMatrix = Equation.toMatrix(constraintsCopy)

  gauss(constraintsMatrix, selectedColumnIndexes)
  const newConstraints = Equation.fromMatrix(constraintsMatrix)
  const constraintsList: Array<Polynomial> = []

  newConstraints.forEach((constraint, index) => {
    const column = selectedColumnIndexes[index]
    const solved = constraint.solveByCoefficient(column)
    constraintsList.push(solved)

    targetCopy.func.replaceCoefficientByIndex(column, solved)
  })

  return {
    updatedTarget: targetCopy,
    constraintsList
  }
}