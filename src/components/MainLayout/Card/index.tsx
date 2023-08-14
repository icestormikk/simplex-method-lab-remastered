import { CardData } from "@/vite-env";

interface CardProps {
  item: CardData,
  onClick?: (...args: unknown[]) => unknown
}

function Card({item, onClick}: CardProps) {
  return (
    <div 
      className='centered w-max h-max flex-col gap-2 bordered rounded-md shadow-lg
      hover:scale-[1.02] duration-75 p-2 cursor-pointer'
      onClick={onClick}
    >
      <img 
        src={item.image} 
        alt="Card image"
        className="max-w-[4rem] max-h-[4rem]" 
      />
      <h3 className="font-semibold">{item.title}</h3>
      <span className='text-gray-400 font-light'>
        {item.description}
      </span>
    </div>
  );
}

export default Card;