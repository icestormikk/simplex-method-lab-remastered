import React from 'react';
import Article from '../FileBlock/Article';
import MatrixBuilder from '@/components/MatrixBuilder';
import TargetFunctionBuilder from './TargetFunctionBuilder';
import { ExtremumType } from '@/types/enums/ExtremumType';
import { FractionView } from '@/types/enums/FractionVIew';
import { useAppDispatch } from '@/redux/hooks';
import { setConfiguration } from '@/redux/slices/TaskState';
import { Equation } from '@/types/classes/Equation';
import Polynomial from '@/types/classes/Polynomial';
import { TargetFunction } from '@/types/classes/TargetFunction';
import Coefficient from '@/types/classes/Coefficient';
import { DEFAULT_MATRIX_ELEMENT_VALUE, MIN_ROWS_COUNT, MIN_COLUMNS_COUNT } from '@/constants';
import PreviewScreen from '../PreviewScreen';

interface ManualInputBlockProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function createConstraintsMatrix(rowsCount: number, columnsCount: number): number[][] {
  const result: number[][] = []
  for (let i = 0; i < rowsCount; i++) {
    const line = Array(columnsCount).fill(DEFAULT_MATRIX_ELEMENT_VALUE)
    result.push(line)
  }

  return result
}


function ManualInputBlock({ setIsModalOpen }: ManualInputBlockProps) {
  const dispatch = useAppDispatch()
  const [targetFunction, setTargetFunction] = React.useState<number[]>(
    Array(MIN_COLUMNS_COUNT).fill(0)
  ) 
  const [constraints, setConstraints] = React.useState<number[][]>(
    createConstraintsMatrix(MIN_ROWS_COUNT, MIN_COLUMNS_COUNT)
  )
  const [type, setType] = React.useState(ExtremumType.MINIMUM)
  const [view, setView] = React.useState(FractionView.REAL)
  const [screenMode, setScreenMode] = React.useState<'input'|'preview'>('input')

  const onTypeChange = React.useCallback(
    async (event: React.ChangeEvent<HTMLSelectElement>) => {
      const {value} = event.target
      switch (value.toLowerCase()) {
        case ExtremumType.MAXIMUM: {
          setType(ExtremumType.MAXIMUM)
          break
        } 
        case ExtremumType.MINIMUM: {
          setType(ExtremumType.MINIMUM)
          break
        } 
        default: {
          throw new Error('Неизвестный тип экстремума: ' + value)
        }
      }
    },
    []
  )

  const onViewChange = React.useCallback(
    async (event: React.ChangeEvent<HTMLSelectElement>) => {
      const {value} = event.target
      switch (value.toLowerCase()) {
        case FractionView.REAL: {
          setView(FractionView.REAL)
          break
        } 
        case FractionView.RATIONAL: {
          setView(FractionView.RATIONAL)
          break
        } 
        default: {
          throw new Error('Неизвестный вид дробей: ' + value)
        }
      }
    },
    []
  )

  const createTargetFunction = React.useCallback(
    () => {
      if (targetFunction.every((element) => element === 0)) {
        return
      }

      const targetConstant = targetFunction.pop()
      const targetCoefficients = targetFunction.map((element, index) => new Coefficient(element, index))
      const targetPolynomial = new Polynomial(targetCoefficients, targetConstant!)
      return new TargetFunction(targetPolynomial, type)
    },
    [targetFunction, type]
  )
  const createConstraints = React.useCallback(
    () => {
      const result: Equation[] = []
      
      for (const [...line] of constraints) {
        if (line.every((element) => element === 0)) {
          continue
        }

        const equationConstant = line.pop()
        const equationCoefficients = line.map((el, index) => new Coefficient(el, index))
        const polynomial = new Polynomial(equationCoefficients, 0)

        result.push(new Equation(polynomial, equationConstant!))
      }

      return result
    },
    [constraints]
  )
  const saveState = React.useCallback(
    async () => {
      const targetFunc = createTargetFunction()
      const constraintEquations = createConstraints()

      if (!targetFunc || constraintEquations.length === 0) {
        return
      }

      dispatch(
        setConfiguration(
          {target: targetFunc, constraints: constraintEquations, type, fractionView: view}
        )
      )

      setIsModalOpen(false)
    },
    [createConstraints, createTargetFunction, dispatch, setIsModalOpen, type, view]
  )
  
  return (
    <div className='centered min-w-[600px] w-fit max-w-[96wv] p-2 flex flex-col gap-2'>
      <Article
        title='Инструкция'
        content={(
          <>
            <p>
              В этом окошке вы можете вручную ввести данные о целевой функции, ограничениях, типе экстремума и желаемом
              виде дробей. Для удобного ввода коэффициентов используйте таблицу, представленную ниже.
            </p>
            <p>
              После ввода всех данных и их проверки нажмите на кнопку "Принять", данные сохранятся автоматически.
            </p>
          </>
        )}
      />
      <Article
        title={'Панель конфигурации'}
        content={(
          screenMode === 'input' ? (
            <div id='config-panel' className='flex w-full flex-col'>
              <b className='text-gray-400'>Ввод данных</b>
              <div id='types-chooser'>
                <label htmlFor="type">
                  <b>Тип задачи:</b>
                  <select className='centered gap-2 w-full' id='type' onChange={onTypeChange} defaultValue={type}>
                    <option value={ExtremumType.MAXIMUM}>Максимум</option>
                    <option value={ExtremumType.MINIMUM}>Минимум</option>
                  </select>
                </label>
                <label htmlFor="view">
                  <b>Вид дробей:</b>
                  <select className='centered gap-2 w-full' id='view' onChange={onViewChange} defaultValue={view}>
                    <option value={FractionView.RATIONAL}>Рациональные</option>
                    <option value={FractionView.REAL}>Вещественные</option>
                  </select>
                </label>
              </div>
              <div>
                <b>Целевая функция</b>
                <TargetFunctionBuilder constraints={constraints} setTargetFunction={setTargetFunction}/>
              </div>
              <div>
                <b>Ограничения на целевую функцию</b>
                <MatrixBuilder matrix={constraints} setMatrix={setConstraints}/>
              </div>
              <button
                className='accept-button my-4 py-2' 
                onClick={() => setScreenMode('preview')}
              >
                Сохранить
              </button>
            </div>
          ) : (
            <div>
              <b className='text-gray-400'>Подтверждение данных</b>
              <div className='bordered p-2 rounded-md'>
                <PreviewScreen 
                  target={createTargetFunction()} 
                  constraints={createConstraints()} 
                  view={view}
                />
              </div>
              <div className='w-full centered gap-2 py-4'>
                {
                  (createTargetFunction() && createConstraints().length > 0) && (
                    <button 
                      className='accept-button w-full'
                      onClick={() => saveState()}
                    >
                      Принять
                    </button>
                  )
                }
                <button 
                  className='accept-button w-full' 
                  style={{backgroundColor: '#e33131'}}
                  onClick={() => setScreenMode('input')}
                >
                  Отменить
                </button>
              </div>
            </div>
          )
        )}
      />
    </div>
  );
}

export default ManualInputBlock;