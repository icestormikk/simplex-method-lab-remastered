import Line from "./Line";

/**
 * A point as a mathematical object
 */
export default class Point {
  readonly coordinates: Array<number>
  
  constructor(...coordinates: Array<number>) {
    this.coordinates = coordinates
  }

  /**
   * Checking whether a point belongs to a straight line
   * @param line the line to which you need to check the affiliation
   */
  isBelong(line: Line) : boolean {
    const result = this.coordinates.map((el, index) =>
      line.coefficients[index].multiplier * el
    ).reduce((a,b) => a + b, 0)
    return result + line.constant === 0.0
  }
}