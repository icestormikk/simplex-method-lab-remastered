import Coefficient from "@/types/classes/Coefficient";
import { Equation } from "@/types/classes/Equation";
import Polynomial from "@/types/classes/Polynomial";
import { TargetFunction } from "@/types/classes/TargetFunction";
import { ExtremumType } from "@/types/enums/ExtremumType";
import { FractionView } from "@/types/enums/FractionVIew";
import { UnsupportedTypeError } from "@/types/exceptions/UnsupportedTypeError";
import { UnsupportedViewError } from "@/types/exceptions/UnsupportedViewError";
import { InputData } from "@/vite-env";

export async function extractTarget(data: InputData): Promise<TargetFunction> {
  const {target} = data
  const numbers = await convertToNumbers(target.coefficients)
  const coefficients = numbers.map((num, index) => new Coefficient(num, index))
  const [constant] = await convertToNumbers(`${target.constant}`)

  const type = await extractExtremumType(data)
  const polynomial = new Polynomial(coefficients, constant)

  return new TargetFunction(polynomial, type);
}

export async function extractConstraints(data: InputData): Promise<Equation[]> {
  return await Promise.all(
    data.constraints.map(async (constraint) => {
      const numbers = await convertToNumbers(constraint.coefficients)
      const coefficients = numbers.map((num, index) => new Coefficient(num, index))
      const [value] = await convertToNumbers(`${constraint.value}`)
      const polynomial = new Polynomial(coefficients, 0)
      
      return new Equation(polynomial, value)
    })
  )
}

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

async function convertToNumbers(line: string): Promise<number[]> {
  return line.split(',').map((str) => {
    const num = Number(str)
    if (Number.isNaN(num)) {
      throw new Error('Не удалось преобразовать строку в число: ' + str)
    }

    return num
  })
}