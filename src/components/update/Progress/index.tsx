import { motion } from 'framer-motion'
import React from 'react'

const Progress: React.FC<React.PropsWithChildren<{
  color?: string,
  percent?: number
}>> = props => {
  const { percent = 0, color = 'green'} = props

  return (
    <div className='h-2 w-full bg-gray-200 shadow-inner shadow-gray-400 rounded-md overflow-hidden'>
      <motion.div
        initial={{width: '0%'}}
        animate={{width: `${percent}%`}}
        className='h-2 w-full'
        style={{backgroundColor: color}}
      />
    </div>
  )
}

export default Progress
