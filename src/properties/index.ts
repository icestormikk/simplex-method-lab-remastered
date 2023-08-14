import { RequirementProps } from "@/vite-env"

export const requiredFieldsData: RequirementProps[] = [
  {
    title: 'type',
    info: 'Тип экстремума',
    values: ['min', 'max'],
  },
  {
    title: 'view',
    info: 'Вид дробей в приложении',
    values: ['rational', 'real'] 
  },
  {
    title: 'target',
    info: 'Целевая функция, экстремум которой нужно найти',
    values: ['массив вещественных значений']
  },
  {
    title: 'constraints',
    info: 'Набор ограничений на целевую функцию',
    values: ['массив из наборов вещественных чисел']
  }
]

export const example = {
  target: {
    coefficients: '1,2,3,4,5,6',
    constant: 1
  },
  constraints: [
    {
      coefficients: '1,2,3,4,5',
      value: 1
    },
    {
      coefficients: '10,20,30,40,50',
      value: 2
    },
    {
      coefficients: '5, 4, 3, 2, 1',
      value: 3
    }
  ],
  type: 'maximum',
  view: 'real'
}

export const supportedFileExtensions = [
  'yaml'
]

