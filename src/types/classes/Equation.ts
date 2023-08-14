import { buildTwoDimensionalArray } from "@/algorithms/arrayhelper"
import { coefficientValidator } from "@/algorithms/validators/coefficientIndexValidator"
import { Matrix } from "../aliases/Matrix"
import Polynomial from "./Polynomial"
import Coefficient from "./Coefficient"

/**
 * Equality as a mathematical object
 */
export class Equation {
    constructor(
        public polynomial: Polynomial,
        public value: number
    ) {}

    /**
     * Translating a (simplex) matrix into a set of Equation objects
     * @param matrix the matrix that needs to be translated
     */
    static fromMatrix(matrix: Matrix<number>) : Array<Equation> {
        const result: Array<Equation> = []

        for (let i = 0; i < matrix.length; i++) {
            const coefficients = matrix[i].slice(0, matrix[i].length - 1)
            const constant = matrix[i][matrix[i].length - 1]
            const polynomial = Polynomial.fromNumbersArray(coefficients)

            result.push(new Equation(polynomial, constant))
        }

        return result
    }

    /**
     * Translating a set of equalities into a matrix
     * @param equations a set of equalities for translation
     */
    static toMatrix(equations: Array<Equation>) : Matrix<number> {
        const result = buildTwoDimensionalArray<number>(
            equations.length,
            equations[0].polynomial.coefficients.length + 1
        )

        equations.forEach((equation, eqIndex) => {
            equation.polynomial.coefficients.forEach((coefficient, index) => {
                result[eqIndex][index] = coefficient.multiplier
            })
            result[eqIndex][result[eqIndex].length - 1] = equation.value
        })

        return result
    }

    /**
     * Express the coefficient by its index
     * @param index the index of the coefficient to be expressed
     */
    solveByCoefficient(index: number) : Polynomial {
      const suitableCoefficient = this.polynomial.coefficients.find((el) =>
        el.index === index
      )

      coefficientValidator(suitableCoefficient)

      return new Polynomial(this.polynomial.coefficients, this.polynomial.constant - this.value)
        .solveByCoefficient(index)
    }

    copy(): Equation {
      const copiedCoefficients = this.polynomial.coefficients.map((coefficient) =>
        new Coefficient(coefficient.multiplier, coefficient.index)
      )

      return new Equation(
        new Polynomial(copiedCoefficients, this.polynomial.constant),
        this.value
      )
    }

    public toString() : string {
        return this.polynomial.toString() + ` = ${this.value}`
    }
}