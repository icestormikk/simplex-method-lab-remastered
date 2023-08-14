import React from 'react';

interface GraphicalDataPanelProps {
  title: string;
  content: string;
  icon: React.ReactNode
}

function GraphicalDataPanel({title, content, icon}: GraphicalDataPanelProps) {
  return (
    <div className='flex flex-row w-full h-fit overflow-hidden border-b-[1px]'>
      <div className='flex justify-start items-start bg-gray-100'>
        <div className='flex justify-start items-start bg-gray-200 text-2xl p-1 text-gray-500 h-full'>
          {icon}
        </div>
        <b className='text-center w-full text-gray-600 px-2'>{title}</b>
      </div>
      <div className='text-gray-500 px-2 flex justify-start items-center whitespace-pre-wrap'>
        <b>{content}</b>
      </div>
    </div>
  );
}

export default GraphicalDataPanel;