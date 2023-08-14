/* eslint-disable @typescript-eslint/no-explicit-any */
import { simplexMethod } from '@/algorithms/simplex';
import { artificialBasisMethod } from '@/algorithms/simplex/artificial';
import { useAppSelector } from '@/redux/hooks';
import { TaskMode } from '@/types/enums/TaskMode';
import { SimplexError } from '@/types/exceptions/SimplexError';
import { TargetFunctionError } from '@/types/exceptions/TargetFunctionError';
import { motion } from 'framer-motion';
import SimplexStep from './SimplexStep';
import React from 'react';
import { BsInfoCircle } from 'react-icons/bs';
import TaskResult from './TaskResult';
import GraphicalMethodBlock from './GraphicalMethodBlock';

function SolutionBlock() {
  const { target, constraints, mode, parameters } = useAppSelector((state) => state.taskReducer)
  const { steps, calculationsResult } = useAppSelector((state) => state.simplexReducer)
  
  const onStart = React.useCallback(
    async () => {
      switch (mode) {
        case TaskMode.ARTIFICIAL: {
          if (!target) {
            throw new TargetFunctionError('Целевая функция не определена')
          }
  
          await artificialBasisMethod(target, constraints!)
          break
        }
        case TaskMode.SIMPLEX: {
          const basis = parameters['basis'] as number[]
          if (!basis) {
            throw new SimplexError('Базис до момента вызова функции не был определён')
          }
          if (!target) {
            throw new TargetFunctionError('Целевая функция не определена')
          }
  
          await simplexMethod(target, constraints!, basis)
          break
        }
      }
    },
    [constraints, mode, parameters, target]
  )

  return (
    <section className='flex flex-col gap-2'>
      {
        steps.length === 0 && mode !== TaskMode.GRAPHICAL ? (
          <motion.button 
            whileHover={{scale: 1.005}}
            whileTap={{scale: 0.95}}
            className='accept-button w-full py-2' 
            onClick={() => onStart()}
          >
            Решить задачу
          </motion.button>
        ) : (
          <>
            {
              mode !== TaskMode.GRAPHICAL ? (
                <>
                  <div className='flex justify-start items-center gap-4 flex-row text-sm bg-green-500 py-2 rounded-xl shadow-md text-[#efefef]
                  px-4 w-fit mx-4'>
                    <BsInfoCircle className='text-4xl'/>
                    <p>
                      Для изменения опорного элемента, нажмите на новый элемент левой кнопкой мыши. Границы клетки станут красными.
                      После этого нажмите на кнопку <b>"Изменить опорный элемент"</b>, выбранный и последующие шаги будут пересчитаны.
                    </p>
                  </div>
                  {
                    steps.map((step, index) => (
                      <motion.div layout initial={{opacity: 0.0}} animate={{opacity: 1.0}} transition={{delay: index * 0.3}} key={index}>
                        <SimplexStep step={step} index={index}/>
                      </motion.div>
                    ))
                  }
                </>
              ) : (
                <GraphicalMethodBlock/>
              )
            }
            {
              calculationsResult && (
                <motion.div 
                  layout 
                  initial={{opacity: 0.0}} 
                  animate={{opacity: 1.0}} 
                  transition={{delay: steps.length * (mode === TaskMode.GRAPHICAL ? 0 : 0.3)}}
                >
                  <TaskResult/>
                </motion.div>
              )
            }
          </>
        )
      }
    </section>
  );
}

export default SolutionBlock;