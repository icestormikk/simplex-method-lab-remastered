import React from 'react';
import { FaRegSadTear } from 'react-icons/fa';

interface ErrorScreenProps {
  reason?: string
}

function ErrorScreen({ reason }: ErrorScreenProps) {
  return (
    <div className='bordered border-red-300 rounded-md centered flex-col gap-2 py-4'>
      <FaRegSadTear className='text-[12rem] text-gray-200'/>
      <span className='text-xl font-bold text-red-300 w-2/3 text-center'>
        {'График построить не удалось по ' + (reason ? `причине: ${reason}` : 'неизвестной причине.')}
      </span>
    </div>
  );
}

export default ErrorScreen;