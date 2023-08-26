import { requiredFieldsData } from "@/properties";

/**
 * Getting valid property values that were previously set in the program
 * @param property name of the property whose value should be found
 * @returns acceptable variants of the values of this property, if such is available in the program
 */
export async function extractPropertyFromConfig(property: string) {
  const regex = new RegExp(property, 'im')
  const field = requiredFieldsData.find((field) => regex.test(field.title))

  if (!field) {
    throw new Error(`Не найдены настройки для свойства '${field}'`)
  }

  return field.values
}