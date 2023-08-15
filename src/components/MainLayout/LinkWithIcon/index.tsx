import { shell } from 'electron';
import React from 'react';

interface LinkWithIconProps {
  title: string;
  url: string;
  icon?: JSX.Element;
  color?: string
}

function LinkWithIcon({ title, url, icon, color }: LinkWithIconProps) {
  const onOpen = React.useCallback(
    async () => {
      shell.openExternal(url)
    },
    [url]
  )
  
  return (
    <a 
      onClick={onOpen} 
      className='centered w-fit h-fit gap-2 cursor-pointer'
      style={{color: color ? color : ''}}
    >
      {icon}
      {title}  
    </a>
  );
}

export default LinkWithIcon;