import { MenuItem } from "@/vite-env";
import { motion } from "framer-motion";
import React from "react";

interface MenuProps {
  items: MenuItem[],
  setSelectedItem: React.Dispatch<React.SetStateAction<MenuItem|undefined>>
}

function Menu({ items, setSelectedItem }: MenuProps) {
  const onClick = React.useCallback(
    (item: MenuItem) => {
      return () => {
        setSelectedItem(item)
      }
    },
    [setSelectedItem]
  )

  return (
    <aside id='menu' className='flex md:flex-col w-full md:w-fit flex-row gap-1 bordered p-1 shadow-inner rounded-md sticky top-2 left-2'>
      {
        items.map((item, index) => (
          <motion.button 
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick(item)} 
            className='centered whitespace-nowrap w-full rounded-md border-2 px-4 py-1 gap-2'
          >
            {item.icon || ''}
            <span>{item.title}</span>
          </motion.button>
        ))
      }
    </aside>
  );
}

export default Menu;