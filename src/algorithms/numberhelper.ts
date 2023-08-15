import { ROUNDING_ACCURACY } from "@/constants";
import { Rational } from "@/types/classes/Rational";

const EPSILON = 10**(ROUNDING_ACCURACY * (-1))
const FRACTION_DIGITS = 20;

/**
 * Getting the error between a number and its integer value
 * @param value the number for which the error must be calculated
 */
function getDifference(value: number) {
    return Math.abs(value - parseInt(`${value.toFixed(FRACTION_DIGITS)}`))
}

/**
 * Neutralizing the calculation error
 * @param value the number for which it is necessary to neutralize the error
 */
export function normalize(value: number) : number {
    if (getDifference(value) < EPSILON) {
        value = parseInt(`${value.toFixed(FRACTION_DIGITS)}`)
    }

    return value
}

/**
 * Get a rational fraction from a string (an object of the Rational class)
 * @param value string to convert
 */
export function fromRationalString(value: string) : number {
    if (!Rational.isRational(value)) {
        return 0
    }

    const nums = value.split('/')
    const result = Number(nums[0]) / Number(nums[1])
    return result !== Infinity ? result : 1
}
