import React from 'react';
import Article from '../FileBlock/Article';
import MatrixBuilder from '@/components/MatrixBuilder';
import TargetFunctionBuilder from './TargetFunctionBuilder';
import { ExtremumType } from '@/types/enums/ExtremumType';
import { FractionView } from '@/types/enums/FractionVIew';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setConfiguration } from '@/redux/slices/TaskState';
import { Equation } from '@/types/classes/Equation';
import Polynomial from '@/types/classes/Polynomial';
import { TargetFunction } from '@/types/classes/TargetFunction';
import Coefficient from '@/types/classes/Coefficient';

interface ManualInputBlockProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function ManualInputBlock({ setIsModalOpen }: ManualInputBlockProps) {
  const dispatch = useAppDispatch()
  const constr = useAppSelector((state) => state.taskReducer.constraints)
  const [targetFunction, setTargetFunction] = React.useState<number[]>([0, 0]) 
  const [constraints, setConstraints] = React.useState<number[][]>([[0,0], [0,0]])
  const [type, setType] = React.useState(ExtremumType.MINIMUM)
  const [view, setView] = React.useState(FractionView.REAL)

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

  const saveState = React.useCallback(
    async () => {
      const targetConstant = targetFunction.pop()
      const targetCoefficients = targetFunction.map((element, index) => new Coefficient(element, index))
      const targetPolynomial = new Polynomial(targetCoefficients, targetConstant!)
      const targetFunc = new TargetFunction(targetPolynomial, type)

      const constraintEquations = constraints.map((line) => {
        const equationConstant = line.pop()
        const equationCoefficients = line.map((el, index) => new Coefficient(el, index))
        const polynomial = new Polynomial(equationCoefficients, 0)
        return new Equation(polynomial, equationConstant!)
      })

      dispatch(
        setConfiguration(
          {target: targetFunc, constraints: constraintEquations, type, fractionView: view}
        )
      )

      setIsModalOpen(false)
    },
    [constraints, dispatch, setIsModalOpen, targetFunction, type, view]
  )

  React.useEffect(
    () => {
      console.log(constr)
    },
    [constr]
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
        title='Панель конфигурации'
        content={(
          <div id='config-panel' className='flex w-full flex-col'>
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
            <motion.button
              whileHover={{scale: 1.02}}
              whileTap={{scale: 0.95}} 
              className='accept-button my-4 py-2' 
              onClick={() => saveState()}
            >
              Сохранить
            </motion.button>
          </div>
        )}
      />
    </div>
  );
}

export default ManualInputBlock;