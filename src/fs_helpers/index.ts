import { FileError } from '@/types/exceptions/UnsupportedFileExtension'
import { InputData, TaskData } from '@/vite-env'
import fs from 'fs/promises'
import * as yaml from 'js-yaml'
import { validateInputData } from './validators'
import { 
  extractConstraints, 
  extractExtremumType, 
  extractFractionView, 
  extractTarget 
} from './extractors'

export async function extractDataFromFile(file: File): Promise<TaskData> {
  const data = await readYamlFile(file.path)

  await validateInputData(data)
  const target = await extractTarget(data as InputData)
  const constraints = await extractConstraints(data as InputData)
  const type = await extractExtremumType(data as InputData)
  const view = await extractFractionView(data as InputData)
  
  return {target, constraints, type, fractionView: view}
}

async function readYamlFile(pathname: string): Promise<Partial<InputData>> {
  const buffer = await fs.readFile(pathname)
  try {
    const data = yaml.load(buffer.toString()) as Partial<InputData>
    return data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new FileError('Ошибка при чтении файла: ' + e.message)
  }
}