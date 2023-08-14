import React from 'react';
import GraphicalDataPanel from '../GraphicalDataPanel';

interface GraphicalDataBlockProps {
  items: {
    title: string;
    content: string;
    icon: React.ReactNode
  }[],
  type: 'top'|'bottom'
}

function GraphicalDataBlock({ items, type }: GraphicalDataBlockProps) {
  return (
    <div className={'flex flex-col bordered ' + (type === 'top' ? 'rounded-t-lg' : 'rounded-b-lg')}>
      {items.map((item, index) => (
        <GraphicalDataPanel key={index} title={item.title} content={item.content} icon={item.icon}/>
      ))}
    </div>
  );
}

export default GraphicalDataBlock;