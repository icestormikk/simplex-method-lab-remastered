/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { passPlotStep } from './graphical_core';
import { artificialBasisMethod } from '@/algorithms/simplex/artificial';
import { graphicalMethod } from '@/algorithms/graphical';
import { useAppSelector } from '@/redux/hooks';
import { Inequality } from '@/types/classes/Inequality';
import { PiFunctionBold } from 'react-icons/pi';
import { TargetFunction } from '@/types/classes/TargetFunction';
import { FaBorderTopLeft } from 'react-icons/fa6'
import GraphicalDataBlock from './GraphicalDataBlock';
import { extractCoefficients } from '@/algorithms/simplex';
import ErrorScreen from './ErrorScreen';

function GraphicalMethodBlock() {
  const { target, constraints, parameters } = useAppSelector((state) => state.taskReducer)
  const { calculationsResult, steps } = useAppSelector((state) => state.simplexReducer)
  const [error, setError] = React.useState<string|undefined>(undefined)
  const [methodData, setMethodData] = React.useState<Partial<{
    updatedTarget: TargetFunction,
    inequalities: Inequality[],
    extremum: {
      coordinates: number[],
      value: number
    }
  }>>({})
  const dataOnTop = React.useMemo(
    () => {
      const result = [{
        title: 'Исходная целевая функция', 
        content: target!.toString(),
        icon: <PiFunctionBold/>
      }]

      if (methodData.updatedTarget) {
        result.push({
          title: 'Новая целевая функция', 
          content: methodData.updatedTarget.toString(),
          icon: <PiFunctionBold/>
        })
      }
      if (methodData.inequalities) {
        result.push({
          title: 'Ограничения на новую функцию',
          content:
            methodData.inequalities
              .map((inequality) => inequality.toString())
              .join('\n'),
          icon: <FaBorderTopLeft/>
        })
      }

      return result
    },
    [target, methodData]
  )

  const onStart = React.useCallback(
    async () => {
      try {
        if (!target || !constraints || !parameters) {
          return
        }
  
        const selectedColumns = JSON.parse(JSON.stringify(parameters['selectedColumns'])) as number[]
        const {updatedTarget, constraintsList} = await graphicalMethod(target, constraints, selectedColumns)
        const inequalities = constraintsList
          .map((polynomial) => new Inequality(polynomial, ">=", 0))
        const resultSimplex = await artificialBasisMethod(target, constraints)
        const resultCoefficients = extractCoefficients(resultSimplex).map((coefficient) => coefficient.multiplier)
        
        if (!selectedColumns) {
          return
        }
  
        const {plotAxis} = await passPlotStep(resultCoefficients, updatedTarget, inequalities)
        const plotResult = resultCoefficients.filter((_, index) => plotAxis.includes(index)) || []

        setMethodData({
          updatedTarget,
          inequalities,
          extremum: {
            coordinates: plotResult,
            value: updatedTarget.func.getValueIn(...plotResult)
          }
        })
      } catch (e: any) {
        setError(e.message)
        return
      }
    },
    [constraints, parameters, target]
  )

  React.useEffect(
    () => {
      onStart()
    },
    []
  )

  return (
    !calculationsResult ? (
      <ErrorScreen reason={steps[steps.length - 1].tags[0]?.message}/>
    ) : (
      <div>
        <GraphicalDataBlock 
          items={dataOnTop} 
          type='top'        
        />
        <div id='jxgbox' className='h-[800px] bordered'/>
        <div className='bordered rounded-b-lg'>
          <div className='flex gap-4'>
            <div className='border-r-[1px] border-r-gray-300 px-2 py-1 bg-gray-100'>
              <b>Результаты графического этапа</b>
            </div>
            <div className='flex justify-start items-center gap-4'>
              {
                error ? (
                  <span className='text-red-600'>Произошла ошибка: {error}</span>
                ) : (
                  methodData.extremum && (
                    <>
                      <p>X* = <b>({methodData.extremum.coordinates.join(', ')})</b></p>
                      <p>F(X*) = <b>{methodData.extremum.value}</b></p>
                    </>
                  )
                )
              }
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default GraphicalMethodBlock;