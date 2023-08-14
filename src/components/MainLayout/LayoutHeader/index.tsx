import { GrClose } from 'react-icons/gr';

interface LayoutHeaderProps {
  title: string;
  icon?: React.JSX.Element,
  onClose?: (...args: unknown[]) => unknown
}

function LayoutHeader({title, icon, onClose}: LayoutHeaderProps) {
  return (
    <div id='main-layout-header'>
      <div id='icon'>
        {icon || ''}
        <p>{title}</p>
      </div>
      {
        onClose && (
          <button type='button' onClick={onClose}>
            <GrClose/>
          </button>
        )
      }
    </div>
  );
}

export default LayoutHeader;