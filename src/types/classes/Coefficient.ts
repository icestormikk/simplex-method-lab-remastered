import { VARIABLE_NAME } from "@/constants";
import { Rational } from "./Rational";

/**
 * The coefficient of a polynomial as a mathematical object
 */
export default class Coefficient {
    constructor(
      public multiplier: number,
      public index: number
    ) {}

    public toString() : string {
        return `${Rational.fromNumber(this.multiplier)}${this.index !== undefined ? `*${VARIABLE_NAME}${this.index}` : ''}`
    }
}