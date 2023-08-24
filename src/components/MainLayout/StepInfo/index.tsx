import { StepStatus } from '@/types/enums/StepStatus';
import { StepInfoData } from '@/vite-env';
import { motion } from 'framer-motion';
import { BiSolidLockAlt } from 'react-icons/bi'
import { ImCheckmark } from 'react-icons/im';
import { VscDebugRestart } from 'react-icons/vsc'

interface StepInfoProps {
  item: StepInfoData,
  index: number,
  onRestart: (index: number) => unknown
}

function StepInfo({ item, index, onRestart }: StepInfoProps) {
  return (
    <div className='task-step-container'>
      <div 
        className='flex flex-row flex-nowrap justify-between items-center rounded-md p-1'
        style={{
          color: item.status === StepStatus.SUCCESS ? 'green' : (item.status === StepStatus.FAILED ? 'darkred' : ''),
          backgroundColor: item.status === StepStatus.SUCCESS ? 'rgba(0,255,0,0.2)' : ''
        }}
      >
        <div className='flex justify-start items-center w-full'>
          <motion.div 
            layout
            className='w-10 h-10 min-w-[2.5rem] min-h-[2.5rem] centered border-[1px] rounded-lg text-2xl
            font-bold border-gray-400'
          >
            {item.isLocked ? <BiSolidLockAlt/> : index}
          </motion.div>
          <div className='px-2 w-5/6'>
            <h3 className='font-bold'>{item.title}</h3>
            <p className='text-gray-400'>{item.isLocked ? item.lockedMessage : item.description}</p>
          </div>
        </div>
        {
          item.status === StepStatus.SUCCESS && (
            <div className='centered gap-2 flex-row text-xl'>
              <button className='reboot-button p-0' onClick={() => onRestart(index)}>
                <VscDebugRestart/>
              </button>
              <ImCheckmark/>
            </div>
          )
        }
      </div>
    </div>
  );
}

export default StepInfo;