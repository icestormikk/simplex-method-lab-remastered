import { motion } from 'framer-motion';
import { AiOutlineWarning } from 'react-icons/ai';

interface WarningMessageProps {
  message: string
}

function WarningMessage({ message }: WarningMessageProps) {
  return (
    <motion.div initial={{opacity: 0.0}} animate={{opacity: 1.0}} className='text-red-600 font-bold centered flex-row gap-2'>
      <AiOutlineWarning className='text-2xl'/>
      <span>{message}</span>
    </motion.div>
  );
}

export default WarningMessage