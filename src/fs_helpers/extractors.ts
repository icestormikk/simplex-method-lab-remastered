import { fromRationalString } from "@/algorithms/numberhelper";
import Coefficient from "@/types/classes/Coefficient";
import { Equation } from "@/types/classes/Equation";
import Polynomial from "@/types/classes/Polynomial";
import { Rational } from "@/types/classes/Rational";
import { TargetFunction } from "@/types/classes/TargetFunction";
import { ExtremumType } from "@/types/enums/ExtremumType";
import { FractionView } from "@/types/enums/FractionVIew";
import { TargetFunctionError } from "@/types/exceptions/TargetFunctionError";
import { UnsupportedTypeError } from "@/types/exceptions/UnsupportedTypeError";
import { UnsupportedViewError } from "@/types/exceptions/UnsupportedViewError";
import { InputData } from "@/vite-env";

/**
 * Obtaining data about the target function converting them into entities suitable for use in the program
 * @param data all information read from the file is in a special format
 * @returns an object of the TargetFunction class
 */
export async function extractTarget(data: InputData): Promise<TargetFunction> {
  const {target} = data
  const numbers = await convertToNumbers(target.coefficients)

  if (numbers.every((element) => element === 0)) {
    throw new TargetFunctionError('Целевая функция пуста.')
  }

  const coefficients = numbers.map((num, index) => new Coefficient(num, index))
  const [constant] = await convertToNumbers(`${target.constant}`)

  const type = await extractExtremumType(data)
  const polynomial = new Polynomial(coefficients, constant)

  return new TargetFunction(polynomial, type);
}

/**
 * Getting data about constraints on the target function and converting them into entities 
 * suitable for use in the program
 * @param data all information read from the file is in a special format
 * @returns array of objects of the Equation class
 */
export async function extractConstraints(data: InputData): Promise<Equation[]> {
  const result: Equation[] = []
  
  for (const constraint of data.constraints) {
    const numbers = await convertToNumbers(constraint.coefficients)
    if (numbers.every((element) => element === 0)) {
      continue
    }

    const coefficients = numbers.map((num, index) => new Coefficient(num, index))
    const [value] = await convertToNumbers(`${constraint.value}`)
    const polynomial = new Polynomial(coefficients, 0)
    result.push(new Equation(polynomial, value))
  }

  return result
}

/**
 * Obtaining data about the type of extremum in the problem and converting it into an entity 
 * suitable for use in the program
 * @param data all information read from the file is in a special format
 * @returns one of the values of the ExtremumType enumeration
 */
export async function extractExtremumType(data: InputData): Promise<ExtremumType> {
  const {type} = data

  switch (type.toLowerCase()) {
    case ExtremumType.MINIMUM.toLowerCase(): {
      return ExtremumType.MINIMUM
    }
    case ExtremumType.MAXIMUM.toLowerCase(): {
      return ExtremumType.MAXIMUM
    }
    default: {
      throw new UnsupportedTypeError('Обнаружен неизвестный тип: ' + type)
    }
  }
}

/**
 * Getting data about the desired type of fractions in the program
 * @param data all information read from the file is in a special format
 * @returns one of the values of the FractionView enumeration
 */
export async function extractFractionView(data: InputData): Promise<FractionView> {
  const {view} = data

  switch (view.toLowerCase()) {
    case FractionView.RATIONAL.toLowerCase(): {
      return FractionView.RATIONAL
    }
    case FractionView.REAL.toLowerCase(): {
      return FractionView.REAL
    }
    default: {
      throw new UnsupportedViewError('Обнаружен неизвестный вид дробей: ' + view)
    }
  }
}

/**
 * Converting a string containing comma-separated numbers into an array of numbers
 * @param line a string containing comma-separated numbers
 * @returns array of numbers that were found in the string
 */
async function convertToNumbers(line: string): Promise<number[]> {
  return line.split(',').map((str) => {
    let num = 0
    if (Rational.isRational(str)) {
      num = fromRationalString(str)
      return num
    }

    num = Number(str)
    if (Number.isNaN(num)) {
      throw new Error('Не удалось преобразовать строку в число: ' + str)
    }
    return num
  })
}