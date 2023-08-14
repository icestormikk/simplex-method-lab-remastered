/* eslint-disable @typescript-eslint/no-explicit-any */
import { UnsupportedTypeError } from "@/types/exceptions/UnsupportedTypeError";
import { InputData } from "@/vite-env";
import { extractPropertyFromConfig } from "./searchers";
import { UnsupportedViewError } from "@/types/exceptions/UnsupportedViewError";
import { ConstraintsError } from "@/types/exceptions/ConstraintsError";
import { TargetFunctionError } from "@/types/exceptions/TargetFunctionError";

export async function validateInputData(data: Partial<InputData>): Promise<void> {
  await validateTaskType(data)
  await validateFractionView(data)
  await validateConstraints(data)
  await validateTarget(data)
  await validateConstraints(data)
}

async function validateTaskType(data: Partial<InputData>): Promise<void> {
  const [type] = await getProperties(data, UnsupportedTypeError, 'type')

  const validTypes = (await extractPropertyFromConfig('type')).map((value) => value.toLowerCase())
  if (!validTypes.includes(type.toLowerCase())) {
    throw new UnsupportedTypeError('Неизвестный тип задачи: ' + data.type)
  }
}

async function validateFractionView(data: Partial<InputData>): Promise<void> {
  const [view] = await getProperties(data, UnsupportedViewError, 'view')

  const validViews = (await extractPropertyFromConfig('view')).map((value) => value.toLowerCase())
  if (!validViews.includes(view.toLowerCase())) {
    throw new UnsupportedViewError('Неизвестный вид дробей: ' + data.view)
  }
}

async function validateConstraints(data: Partial<InputData>) {
  const [constraints] = await getProperties(data, ConstraintsError, 'constraints')

  const isConstraintsExist = constraints!.length > 0
  if (!isConstraintsExist) {
    throw new ConstraintsError('Не найдено ни одного ограничения')
  }

  await Promise.all(constraints!.map(async (constraint: any) => {
    const [coefficients] = await getProperties(
      constraint, ConstraintsError, 'coefficients', 'value'
    )
    if (coefficients.length === 0) {
      throw new ConstraintsError('Обнаружено пустое ограничение')
    }
  }))
}

async function validateTarget(data: Partial<InputData>) {
  const [, coefficients,] = await getProperties(
    data, TargetFunctionError, 'target', 'target.coefficients', 'target.constant'
  )

  const isTargetNotEmpty = coefficients.length > 0
  if (!isTargetNotEmpty) {
    throw new TargetFunctionError('Целевая функция пуста')
  }
}

async function getProperties<E extends Error>(
  source: any, 
  Error: new (msg: string) => E, 
  ...paths: string[]
): Promise<any> {
  function getProperty<T>(source: any, path: string): T {
    return path.split('.').reduce((acc, curr) => acc[curr], source)
  }

  const result: any[] = []

  await Promise.all(paths.map(async (path) => {
    const prop = getProperty(source, path)
    if (prop === undefined) {
      throw new Error(`Не удалось найти поле: '${path}'`)
    }

    result.push(prop)
  }))

  return result
}