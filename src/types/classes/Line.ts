import Polynomial from "./Polynomial";
import Point from "./Point";
import { ROUNDING_ACCURACY } from "@/constants";

/**
 * А straight line as a mathematical object
 */
export default class Line extends Polynomial {
    private static counter = 0
    readonly id: number = Line.counter++

    constructor(
        readonly xCoefficient: number,
        readonly yCoefficient: number,
        readonly constant: number = 0
    ) {
        const pol = Polynomial.fromNumbersArray([xCoefficient, yCoefficient], constant)
        super(pol.coefficients, pol.constant);
    }

    /**
     * Get a set of points belonging to a straight line
     * @param count the number of points to get
     */
    getPoints(count: number) : Array<Point> | undefined {
        const line = this.solveByCoefficient(0)
        const coefficientsUnknown = line.toString().match(/x\d+/ig)

        const coefficients : Array<Array<number>> = Array.from(Array(count).keys())
            .map(() => {
                const array = Array.from(Array(line.coefficients.length).fill(0))
                for (let i = 0; i < array.length; i++) {
                    array[i] = Math.random() * 100
                }
                return array
            })

        return coefficients.map((currentCoefficients) => {
            let tempEquation = line.toString()
            coefficientsUnknown?.forEach((el, index) => {
                tempEquation = tempEquation.replace(el, `${currentCoefficients[index]}`)
            })

            const anotherCoefficient: number = Function(`return ${tempEquation}`)()
            return new Point(anotherCoefficient, ...currentCoefficients)
        })
    }

    getIntersectionPoint2d(line: Line) : Point | undefined {
        const points1 = this.getPoints(2)
        const points2 = line.getPoints(2)

        if (points1 === undefined || points2 === undefined) {
            return undefined
        }

        const x1 = points1[0].coordinates[0]
        const y1 = points1[0].coordinates[1]
        const x2 = points1[1].coordinates[0]
        const y2 = points1[1].coordinates[1]
        const x3 = points2[0].coordinates[0]
        const y3 = points2[0].coordinates[1]
        const x4 = points2[1].coordinates[0]
        const y4 = points2[1].coordinates[1]

        const denom = (y4 - y3)*(x2 - x1) - (x4 - x3)*(y2 - y1)
        if (denom === 0) {
            return undefined
        }

        const ua = ((x4 - x3)*(y1 - y3) - (y4 - y3)*(x1 - x3)) / denom

        const x = Number((x1 + ua * (x2 - x1)).toFixed(ROUNDING_ACCURACY))
        const y = Number((y1 + ua * (y2 - y1)).toFixed(ROUNDING_ACCURACY))
        return new Point(y, x)
    }
}