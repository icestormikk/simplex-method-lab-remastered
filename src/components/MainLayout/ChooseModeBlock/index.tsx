import React from 'react';
import CardHolder from '../CardHolder';
import { CardData } from '@/vite-env';
import { useAppDispatch } from '@/redux/hooks';
import { setTaskMode } from '@/redux/slices/TaskState';
import { TaskMode } from '@/types/enums/TaskMode';
import SimplexLogo from "@/assets/simplex_logo.svg";
import ArtificialLogo from '@/assets/artificial_logo.svg';
import GraphicalLogo from '@/assets/graphical_logo.svg';

function ChooseModeBlock() {
  const dispatch = useAppDispatch()
  const cards = React.useMemo<CardData[]>(
    () => [
      {
        title: 'Симплекс-метод',
        description: 'Нахождение оптимального решения при предварительном вводе базиса.',
        image: <img src={SimplexLogo} alt='Simplex Logo' className='max-w-[4rem] max-h-[4rem]'/>,
        action() {
          dispatch(setTaskMode(TaskMode.SIMPLEX))
        },
      },
      {
        title: 'Искусственный базис',
        description: 'Построение базиса и нахождение решения с помощью программы',
        image: <img src={ArtificialLogo} alt='Artificial Method Logo' className='max-w-[4rem] max-h-[4rem]'/>,
        action() {
          dispatch(setTaskMode(TaskMode.ARTIFICIAL))
        },
      },
      {
        title: 'Графический метод',
        description: 'Нахождение решения задачи и отображение его на двумерной плоскости',
        image: <img src={GraphicalLogo} alt='Graphical Method Logo' className='max-w-[4rem] max-h-[4rem]'/>,
        action() {
          dispatch(setTaskMode(TaskMode.GRAPHICAL))
        },
      }
    ],
    [dispatch]
  )
  
  return (
    <section>
      <CardHolder cards={cards}/>
    </section>
  );
}

export default ChooseModeBlock;