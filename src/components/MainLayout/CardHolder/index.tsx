import { CardData } from '@/vite-env';
import Card from '../Card';

interface CardHolderProps {
  cards: CardData[]
}

function CardHolder({ cards }: CardHolderProps) {
  return (
    <div className='centered flex-wrap flex-row gap-2 w-full h-max py-2'>
      {
        cards.map((card, index) => (
          <Card key={index} item={card} onClick={card.action}/>
        ))
      }
    </div>
  );
}

export default CardHolder;