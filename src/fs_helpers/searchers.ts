import { requiredFieldsData } from "@/properties";

export async function extractPropertyFromConfig(property: string) {
  const regex = new RegExp(property, 'im')
  const field = requiredFieldsData.find((field) => regex.test(field.title))

  if (!field) {
    throw new Error(`Не найдены настройки для свойства '${field}'`)
  }

  return field.values
}