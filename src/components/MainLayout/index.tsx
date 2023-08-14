import React from 'react';
import Menu from './Menu';
import { AiOutlineHome } from 'react-icons/ai'
import { TbBinary } from 'react-icons/tb'
import { BsFillPersonLinesFill } from 'react-icons/bs'
import LayoutHeader from './LayoutHeader';
import { motion } from 'framer-motion';
import { StepStatus } from '@/types/enums/StepStatus';
import DataInputBlock from './DataInputBlock';
import { MenuItem, StepInfoData } from '@/vite-env';
import StepInfo from './StepInfo';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import ChooseModeBlock from './ChooseModeBlock';
import AdditionalParametersBlock from './AdditionalParametersBlock';
import { TaskMode } from '@/types/enums/TaskMode';
import SolutionBlock from './SolutionBlock';
import { clearConfiguration, clearParameters, clearTaskMode } from '@/redux/slices/TaskState';
import { clearSimplexState, clearSteps } from '@/redux/slices/SimplexState';
import MainPageBlock from './MainPageBlock';

function MainLayout() {
  const dispatch = useAppDispatch()
  const DEFAULT_MESSAGE_ON_BLOCK = 'Не выполнены условия в предыдущем шаге'
  const {target, constraints, type, fractionView, mode, parameters} = useAppSelector((state) => state.taskReducer)
  const isFirstStepCompleted = React.useMemo(
    () => {
      return Boolean(target) && constraints!.length !== 0 && Boolean(type) && Boolean(fractionView)
    },
    [target, constraints, type, fractionView]
  )
  const isSecondStepCompleted = React.useMemo(
    () => {
      return isFirstStepCompleted && mode !== undefined
    },
    [isFirstStepCompleted, mode]
  )
  const isThirdStepCompleted = React.useMemo(
    () => {
      if (!mode) {
        return false
      }
      if (mode === TaskMode.ARTIFICIAL) {
        return true
      }

      switch (mode) {
        case TaskMode.GRAPHICAL: {
          return parameters && parameters['axis'] !== undefined
        }
        case TaskMode.SIMPLEX: {
          return parameters && parameters['basis'] !== undefined
        }
      }
    },
    [mode, parameters]
  )

  const menuItems = React.useMemo<MenuItem[]>(
    () => [
      {
        title: 'Главная страница',
        icon: <AiOutlineHome/>,
        address: '1'
      },
      {
        title: 'Решить задачу',
        icon: <TbBinary/>,
        address: '2'
      },
      {
        title: 'Об авторе',
        icon: <BsFillPersonLinesFill/>,
        address: '3'
      }
    ],
    []
  )
  const steps = React.useMemo<(StepInfoData & {content: React.JSX.Element})[]>(
    () => [
      {
        title: 'Ввод данных',
        description: 'Перед началом работы необходимо ввести данные в программу и задать параметры. ' + 
        'Выберите способ ввода и значения параметров.',
        status: isFirstStepCompleted ? StepStatus.SUCCESS : StepStatus.IN_PROCESS,
        isLocked: false,
        content: (<DataInputBlock/>)
      },
      {
        title: 'Выбрать способ решения',
        description: 'Теперь необходимо выбрать желаемый способ решения. На данный момент реализовано три способа.',
        status: isSecondStepCompleted ? StepStatus.SUCCESS : StepStatus.IN_PROCESS,
        isLocked: !isFirstStepCompleted,
        lockedMessage: DEFAULT_MESSAGE_ON_BLOCK,
        content: (<ChooseModeBlock/>)
      },
      {
        title: 'Ввести дополнительные параметры',
        description: 'Для некоторых способов решения требуется ввести дополнительные параметры.',
        status: isThirdStepCompleted ? StepStatus.SUCCESS : StepStatus.IN_PROCESS,
        isLocked: !isSecondStepCompleted,
        lockedMessage: DEFAULT_MESSAGE_ON_BLOCK,
        content: <AdditionalParametersBlock/>
      },
      {
        title: 'Решение задачи',
        description: 'Интерактивное решение поставленной задачи',
        status: StepStatus.IN_PROCESS,
        isLocked: !isThirdStepCompleted,
        lockedMessage: DEFAULT_MESSAGE_ON_BLOCK,
        content: <SolutionBlock/>
      }
    ],
    [isFirstStepCompleted, isSecondStepCompleted, isThirdStepCompleted]
  )
  const [selectedItem, setSelectedItem] = React.useState<MenuItem|undefined>()
  const variants = {
    selected: { opacity: 1.0 },
    closed: { opacity: 0.0 }
  }

  const onRestart = React.useCallback(
    async (index: number) => {
      switch (index) {
        case 1: {
          dispatch(clearConfiguration())
          dispatch(clearSimplexState())
          break
        }
        case 2: {
          dispatch(clearSimplexState())
          dispatch(clearTaskMode())
          break
        }
        case 3: {
          dispatch(clearParameters())
          break
        }
      }
      dispatch(clearSteps())
    },
    [dispatch]
  )

  return (
    <section className='w-full h-full'>
      <div className='flex justify-start items-start flex-col md:flex-row gap-2 m-2'>
        <Menu items={menuItems} setSelectedItem={setSelectedItem}/>
        <section id='main-layout' className='flex flex-col flex-nowrap gap-2 w-full'>
          {
            !selectedItem ? (
              <LayoutHeader title='Ничего не выбрано'/>
            ) : (
              <LayoutHeader 
                title={selectedItem.title}  
                icon={selectedItem.icon}
                onClose={() => {
                  setSelectedItem(undefined)
                }}
              />
            )
          }
          <motion.div
            layout
            animate={selectedItem ? "selected" : "closed"}
            transition={{duration: 0.2}}
            variants={variants}
          >
            {
              selectedItem?.title === 'Главная страница' ? (
                <MainPageBlock/>
              ) : (
                selectedItem?.title === 'Решить задачу' ? (
                  <div className='flex flex-col gap-2'>
                    {
                      steps.map((step, index) => (
                        <React.Fragment key={index}>
                          <StepInfo item={step} index={index + 1} onRestart={onRestart}/>
                          {
                            (!step.isLocked && step.status === StepStatus.IN_PROCESS) && step.content
                          }
                        </React.Fragment>
                      ))
                    }
                  </div>
                ) : (
                  <h1>Не реализовано</h1>
                )
              )
            }
          </motion.div>
        </section>
      </div>
    </section>
  );
}

export default MainLayout;