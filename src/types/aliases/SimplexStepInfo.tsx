import { Rational } from "../classes/Rational"
import { Matrix } from "./Matrix"

export type SimplexStepInfo = {
    coefficients: Matrix<Rational>,
    bearingElement: {
        row: number,
        column: number
    }
}