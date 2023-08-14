import { ExtremumType } from "../enums/ExtremumType"
import Coefficient from "./Coefficient"
import Polynomial from "./Polynomial"

/**
 * Objective function, the main object of the problem being solved
 */
export class TargetFunction {
    constructor(
      public func: Polynomial,
      public extremumType: ExtremumType
    ) {}

    /**
     * Changing the task type to the reverse (minimization -> maximization and vice versa)
     */
    reverse(): TargetFunction {
      this.func.coefficients.forEach((el) => el.multiplier *= (-1))
      if (this.extremumType === ExtremumType.MINIMUM) {
        this.extremumType = ExtremumType.MAXIMUM
      } else {
        this.extremumType = ExtremumType.MINIMUM
      }

      return this
    }

    /**
     * Checking whether all coefficients of the function are equal to zero
     */
    isEmpty() : boolean {
        let result = true
        this.func.coefficients.forEach((coefficient) => {
            if (coefficient.multiplier !== 0) {
                result = false
            }
        })

        if (this.func.constant !== 0) {
            result = false
        }

        return result;
    }

    copy() : TargetFunction {
      const {func, extremumType} = this
      const {coefficients, constant} = func
      const newCoefficients = coefficients.map((el) => new Coefficient(el.multiplier, el.index))
      const newPolynomial = new Polynomial([...newCoefficients], constant)

      return new TargetFunction(newPolynomial, extremumType)
    }

    public toString() : string {
        return this.func.toString() + ` -> ${this.extremumType.valueOf()}`
    }
}