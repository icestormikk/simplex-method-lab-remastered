/**
 * A rational fraction consisting of a numerator and a denominator
 */
export class Rational {
    constructor(
        public numerator: number,
        public denominator: number
    ) {
        if (denominator === 0) {
            throw new Error('Can not create Rational object with zero denominator')
        }
    }

    /**
     * Converting a real fraction to a rational one
     * @param value real fraction
     */
    static fromNumber(value: number) : Rational {
        const maxDenominator = 10000
        const bestRational = { numerator: 1, denominator: 1, error: Math.abs(value - 1) }

        for (let denominator = 1; bestRational.error > 0 && denominator < maxDenominator; denominator++) {
            const numerator = Math.round(value * denominator)
            const currentError = Math.abs(value - numerator / denominator)

            if (currentError >= bestRational.error) {
                continue
            }

            bestRational.numerator = numerator
            bestRational.denominator = denominator
            bestRational.error = currentError
        }

        return new Rational(bestRational.numerator, bestRational.denominator)
    }

    /**
     * Checking whether a rational fraction is written in the transmitted string
     * @param value a string possibly containing a rational fraction
     */
    static isRational(value: string) : boolean {
        return RegExp(/[0-9]+\/[0-9]+/ig).test(value)
    }

    add(value: Rational) : Rational {
        const {numerator, denominator} = Rational.fromNumber(this.toNumber() + value.toNumber())
        this.numerator = numerator
        this.denominator = denominator
        return this
    }

    subtraction(value: Rational) : Rational {
        return this.add(
            new Rational(value.numerator * (-1), value.denominator)
        )
    }

    multiply(value: Rational) : Rational {
        const {numerator, denominator} = Rational.fromNumber(this.toNumber() * value.toNumber())
        this.numerator = numerator
        this.denominator = denominator
        return this
    }

    divide(value: Rational) : Rational {
        return this.multiply(
            new Rational(value.denominator, value.numerator)
        )
    }

    /**
     * Converting a rational fraction to a real fraction
     */
    toNumber() : number {
        return this.numerator / this.denominator
    }

    public toString() : string {
        return `${this.numerator}` + (this.denominator !== 1 ? `/${this.denominator}` : ``)
    }
}