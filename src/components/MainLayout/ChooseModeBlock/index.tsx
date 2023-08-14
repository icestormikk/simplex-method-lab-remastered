import React from 'react';
import CardHolder from '../CardHolder';
import { CardData } from '@/vite-env';
import { useAppDispatch } from '@/redux/hooks';
import { setTaskMode } from '@/redux/slices/TaskState';
import { TaskMode } from '@/types/enums/TaskMode';

function ChooseModeBlock() {
  const dispatch = useAppDispatch()
  const cards = React.useMemo<CardData[]>(
    () => [
      {
        title: 'Симплекс-метод',
        description: 'Нахождение оптимального решения при предварительном вводе базиса.',
        image: 'src\\assets\\simplex_logo.svg',
        action() {
          dispatch(setTaskMode(TaskMode.SIMPLEX))
        },
      },
      {
        title: 'Искусственный базис',
        description: 'Построение базиса и нахождение решения с помощью программы',
        image: 'src\\assets\\artificial_logo.svg',
        action() {
          dispatch(setTaskMode(TaskMode.ARTIFICIAL))
        },
      },
      {
        title: 'Графический метод',
        description: 'Нахождение решения задачи и отображение его на двумерной плоскости',
        image: 'src\\assets\\graphical_logo.svg',
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