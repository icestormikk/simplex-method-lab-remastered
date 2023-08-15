import React from 'react';
import { AiFillGithub, AiFillYoutube } from 'react-icons/ai';
import { BsSteam, BsYoutube } from 'react-icons/bs';
import { PiGithubLogoDuotone } from 'react-icons/pi';
import LinkWithIcon from '../LinkWithIcon';
import Progress from '@/components/update/Progress';
import { motion } from 'framer-motion';
import Modal from '@/components/update/Modal';
import CatKiss from '@/assets/videos/cat_kiss_camera.mp4'
import CatStaring from '@/assets/videos/staring_at_camera.mp4'

function AuthorInfoPage() {
  const CLICKS_LIMIT = 500
  const [clicksCount, setClicksCount] = React.useState(0)
  const [stage, setStage] = React.useState(0)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const links = React.useMemo<{
    icon: JSX.Element, 
    title: string, 
    url: string,
    backgroundColor: string
  }[]>(
    () => [
      {
        icon: <AiFillGithub/>,
        title: 'GitHub',
        url: 'https://github.com/icestormikk',
        backgroundColor: 'black'
      },
      {
        icon: <BsSteam/>,
        title: 'Steam',
        url: 'https://steamcommunity.com/profiles/76561198185418769/',
        backgroundColor: 'linear-gradient(120deg, #00adee, #000000)'
      },
      {
        icon: <BsYoutube/>,
        title: 'YouTube',
        url: 'https://www.youtube.com/channel/UCarrg-SMxX7R9i8WinTQDBA',
        backgroundColor: 'linear-gradient(120deg, #ff0000, #902f2f)'
      }
    ],
    []
  )
  const messages = React.useMemo<{value: number, message: string}[]>(
    () => {
      switch (stage) {
        case 0: {
          const stageOneMessages =  [
            {value: 1, message: 'Зачем вы нажали на эту кнопку?'},
            {value: 50, message: 'Возможно, это затянется надолго...'},
            {value: 110, message: 'Интересно, что нас ждёт в конце?..'},
            {value: 160, message: 'А если эта полоска просто шутка, и когда она полностью заполнится, то ничего не произойдёт?'},
            {value: 200, message: 'Да нее, бред какой-то'},
            {value: 250, message: 'Половина пути пройдена!... А может и не половина?'},
            {value: 320, message: 'Хотите я расскажу вам способ, как можно быстро заполнить эту полоску?'},
            {value: 360, message: 'Перейдите на другую вкладку и вернитесь обратно, полоска будет заполнена'},
            {value: 400, message: 'Давайте, осталось ещё немного!'},
            {value: 450, message: 'Надеюсь, вы готовы к тому, что будет в конце...'},
            {value: 480, message: 'Давайте я буду считать'}
          ]
          for (let i = 485; i < CLICKS_LIMIT; i++) {
            stageOneMessages.push({value: i, message: `${CLICKS_LIMIT - i}..`})
          }
          return stageOneMessages
        }
        case 1: {
          return [
            {value: 1, message: 'Вы снова нажали на эту кнопку?'},
            {value: 30, message: 'А вы настойчивее, чем я думал..'},
            {value: 100, message: 'Знаете, когда я делал эту пасхалку, мне стало так лень, что я не стал делать её второй этап'},
            {value: 150, message: 'Но вас это не останавливает..'},
            {value: 250, message: 'Хорошо, нажимайте'},
            {value: 300, message: 'Я то ведь знаю, что там ничего нет'},
            {value: 350, message: 'Будет неловко, если кто-то сбросит счётчик до нуля..'},
            {value: 400, message: 'Делать этого я конечно же не буду'},
            {value: 420, message: 'А мог бы...'},
            {value: 450, message: 'Ладно, возможно, там что-то и есть'},
          ]
        }
        case 2: {
          return [
            {value: 1, message: 'Ну теперь тут точно ничего нет.'}
          ]
        }
        default: {
          return []
        }
      }
    },
    [stage]
  )

  React.useEffect(
    () => {
      if (clicksCount >= CLICKS_LIMIT) {
        setIsModalOpen(true)
      }
    },
    [clicksCount]
  )

  return (
    <section className='flex flex-col p-2 gap-4'>
      <div className='flex flex-row gap-2 font-bold'>
        <motion.button
          whileTap={{scale: 0.98}} 
          className='bordered w-fit p-2 rounded-md bg-gray-100 shadow-md gap-2 flex flex-row justify-start items-start'
          onClick={() => setClicksCount((prevState) => prevState + 1)}
          disabled={stage > 2}
        >
          <PiGithubLogoDuotone className='text-[6rem]'/>
        </motion.button>
        <div className='flex flex-col pt-2 text-gray-500'>
          <p>Программа была написана пользователем icestormikk.</p>
          <p>Ссылку на исходный код приложения можно найти во вкладке "Главная страница"</p>
        </div>
      </div>
      <div className='flex flex-row gap-2'>
        {
          links.map((link, index) => (
            <button 
              key={index} 
              className='bordered w-min px-4 py-1 shadow-md hover:scale-[1.02]'
              style={{background: link.backgroundColor}}
            >
              <LinkWithIcon 
                title={link.title} 
                url={link.url}
                icon={link.icon}
                color='white'              
              />
            </button>
          ))
        }
      </div>
      {clicksCount > 0 && (
        <div>
          <Progress color='green' percent={clicksCount * (100 / CLICKS_LIMIT)}/>
          <b className='font-bold text-gray-400'>
            {messages.findLast((message) => message.value <= clicksCount)?.message}
          </b>
        </div>
      )}
      {
        isModalOpen && (
          <Modal
            open={isModalOpen}
            title={stage === 0 ? '<3' : (stage === 1 ? 'Это Саша, знакомьтесь' : 'Приз самому настойчивому человеку')}
            onCancel={() => {
              setIsModalOpen(false)
              setStage((prevState) => prevState + 1)
              setClicksCount(0)
            }}
          >
            <div className='p-2 flex flex-col justify-start items-center'>
            {
              stage === 0 ? (
                <>
                  <b>Вас поцеловали!</b>
                  <video 
                    src={CatKiss} 
                    controls={false} 
                    autoPlay 
                    autoFocus 
                    onEnded={() => {
                      setIsModalOpen(false)
                      setClicksCount(0)
                      setStage(1)
                    }}
                  />
                </>
              ) : (
                stage === 1 ? (
                  <>
                    <b className='max-w-[600px]'>Посидите с Сашей, составьте ему компанию. Говорят, он отличный собеседник. Дальше действительно ничего нет, можете даже не пытаться.</b>
                    <video 
                      src={CatStaring} 
                      controls={false}
                      autoPlay 
                      autoFocus
                      loop
                    />
                  </>
                ) : (
                  <>
                    <b>Не думал, что вы дойдёте до сюда. Но тем не менее, я вас поздравляю!</b>
                    <LinkWithIcon 
                      title={'Ваш приз'} 
                      url={'https://youtu.be/dQw4w9WgXcQ'}
                      color='red'
                      icon={<AiFillYoutube/>}
                    />
                  </>
                )
              )
            }
            </div>
          </Modal>
        )
      }
    </section>
  );
}

export default AuthorInfoPage;