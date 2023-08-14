import Point from "./Point";
import Polynomial from "./Polynomial";

/**
 * Inequality as a mathematical object
 */
export class Inequality {
  constructor(
    readonly polynomial: Polynomial,
    readonly sign: ">=" | ">" | "<=" | "<",
    readonly constant: number
  ) {}

  /**
   * Checking whether a point satisfies the inequality
   * @param point the point that needs to be checked
   */
  isValid(point: Point): boolean {
    let left = this.polynomial.coefficients
      .map((coefficient) => {
        const coordinate = point.coordinates[coefficient.index];
        if (coordinate === undefined) {
          return 0
        }
        return coefficient.multiplier * coordinate
      })
      .reduce((a,b) => a + b)
    left += this.polynomial.constant

    return this.calculate(left, this.constant)
  }

  private calculate(left: number, right: number) : boolean {
    switch (this.sign) {
      case ">=":
        return left >= right
      case ">":
        return left > right
      case "<=":
        return left <= right
      case "<":
        return left < right
      default:
        throw new Error('Unknown inequality operator: ' + this.sign)
    }
  }

  public toString(): string {
      return `${this.polynomial.toString()} ${this.sign} ${this.constant}`
  }
}
