import React from 'react';
import CardHolder from '../CardHolder';
import Modal from '@/components/update/Modal';
import FileBlock from './FileBlock';
import { CardData } from '@/vite-env';
import ManualInputBlock from './ManualInputBlock';

function DataInputBlock() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const cards = React.useMemo<(CardData & {content: React.JSX.Element})[]>(
    () => [
      {
        id: 1,
        title: 'Ввод из файла',
        description: 'Загрузка данных из заранее приготовленного файла',
        image: 'src\\assets\\upload.svg',
        action() {
          setSelectedVariant(cards[0])
          setIsModalOpen(true)
        },
        content: <FileBlock setIsModalOpen={setIsModalOpen}/>
      },
      {
        id: 2,
        title: 'Ручной ввод',
        description: 'Ввод данных с клавиатуры при помощи настройщика',
        image: 'src\\assets\\typing.svg',
        action() {
          setSelectedVariant(cards[1])
          setIsModalOpen(true)
        },
        content: <ManualInputBlock setIsModalOpen={setIsModalOpen}/>
      }
    ],
    []
  )
  const [selectedVariant, setSelectedVariant] = React.useState<CardData & {content: React.JSX.Element}>(cards[0])

  return (
    <section>
      <CardHolder cards={cards}/>
      <Modal 
        cancelText={'CANCEL'}
        okText={'OK'}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => {}}
        open={isModalOpen}
        title={selectedVariant.title}
      >
        {selectedVariant.content}
      </Modal>
    </section>
  );
}

export default DataInputBlock;