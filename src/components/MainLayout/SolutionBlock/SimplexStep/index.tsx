import { SimplexStepInfo, dropStepsAfter } from '@/redux/slices/SimplexState';
import React from 'react';
import SnapshotTable from './SnapshotTable';
import { AiFillEye } from 'react-icons/ai';
import { LiaEditSolid } from 'react-icons/lia';
import Modal from '@/components/update/Modal';
import { MatrixElement } from '@/types/aliases/MatrixElement';
import { useAppDispatch } from '@/redux/hooks';
import { TaskMode } from '@/types/enums/TaskMode';
import { passArtificialSimplexMethod } from '@/algorithms/simplex/artificial';
import { passDefaultSimplexMethod } from '@/algorithms/simplex';
import { HasErrorTag, HasResultTag } from '@/types/enums/SimplexStepTag';

interface SimplexStepProps {
  step: SimplexStepInfo,
  index: number
}

function SimplexStep({ step, index }: SimplexStepProps) {
  const dispatch = useAppDispatch()
  const {
    type, target, snapshot, tags, bearingElement, possibleBearingElements, additonalContent, appendedCoefficientIndexes
  } = step
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [selectedElement, setSelectedElement] = React.useState<MatrixElement>()
  const calculations = React.useMemo(
    () => {
      if (!additonalContent) {
        return []
      }

      return additonalContent['calculations'] as string[]
    },
    [additonalContent]
  )
  
  const onSubmitChange = React.useCallback(
    async () => {
      if (!selectedElement) {
        return
      }

      dispatch(dropStepsAfter(index))
      switch (type) {
        case TaskMode.ARTIFICIAL: {
          passArtificialSimplexMethod(
            target,
            snapshot,
            appendedCoefficientIndexes!,
            {
              element: selectedElement,
              possibleElements: possibleBearingElements
            }
          )
          break
        }
        case TaskMode.SIMPLEX: {
          passDefaultSimplexMethod(
            target,
            snapshot,
            {
              element: selectedElement,
              possibleElements: possibleBearingElements
            }
          )
          break
        }
      }
    },
    [appendedCoefficientIndexes, dispatch, index, possibleBearingElements, selectedElement, snapshot, target, type]
  )

  return (
    <div className='step-container'>
      <SnapshotTable 
        rows={snapshot.rows} 
        columns={snapshot.columns} 
        coefficients={snapshot.coefficientsMatrix}
        bearingElement={bearingElement}
        possibleBearingElements={possibleBearingElements}
        selectedElement={selectedElement}
        setSelectedElement={setSelectedElement}
      />
      <div className='flex flex-col gap-1 h-auto justify-between items-start'>
        <div className='flex flex-col gap-2 h-full overflow-y-scroll bar'>
          {
            tags.map((tag, index) => (
              <div 
                key={index} 
                className={
                  'flex justify-start items-center flex-row gap-1 font-bold text-sm bordered px-2 rounded-md ' +
                  (tag instanceof HasResultTag ? 'bg-green-500 text-[#efefef]': (tag instanceof HasErrorTag ? 'bg-red-500 text-white' : 'bg-gray-200'))
                }
              >
                {tag.icon}
                <p>{tag.message}</p>
              </div>
            ))
          }
        </div>
        <div className='simplex-step-buttons'>
          {
            calculations.length !== 0 && (
              <button onClick={() => setIsModalOpen(true)}>
                <AiFillEye className='text-sm'/>
                <p>Посмотреть вычисления</p>
              </button>
             )
          }
          {
            possibleBearingElements.length !== 0 && (
              <button onClick={() => onSubmitChange()}>
                <LiaEditSolid/>
                <p>Изменить опорный элемент</p>
              </button>
            )
          }
        </div>
      </div>
      {
        isModalOpen && (
          <Modal
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            title='Вычисления, выполненные в выбранном шаге'
          >
            <ul className='w-fit whitespace-nowrap flex flex-col gap-2 font-bold p-2'>
              {
                calculations.length !== 0 ? (
                  calculations.map((calculation, index) => (
                    <li key={index} className='hover:bg-gray-200 duration-100'>
                       <b className='p-2 text-lg'>{index + 1}.</b>
                       <span>{calculation}</span>
                    </li>
                  ))
                ) : (
                  <b>Отсутствуют</b>
                )
              }
            </ul>
          </Modal>
        )
      }
    </div>
  );
}

export default SimplexStep;