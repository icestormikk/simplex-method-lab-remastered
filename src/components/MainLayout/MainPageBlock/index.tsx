import React from 'react';
import ProgramLogo from '@/assets/logo.png'
import tsLogo from '@/assets/instruments/ts-logo-256.svg'
import viteLogo from '@/assets/instruments/vite.svg'
import nodeLogo from '@/assets/instruments/node.svg'
import electronLogo from '@/assets/instruments/electron.svg'
import reactLogo from '@/assets/instruments/react.svg'
import reduxLogo from '@/assets/instruments/redux.svg'
import tailwindLogo from '@/assets/instruments/tailwind.svg'
import { motion } from 'framer-motion';
import LinkWithIcon from '../LinkWithIcon';
import { AiFillGithub } from 'react-icons/ai';

function MainPageBlock() {
  const usedTechnologies = React.useMemo<{
    icon: JSX.Element,
    title: string,
    instrumentTitle: string,
    description?: string
  }[]>(
    () => [
      {
        icon: <img src={tsLogo} alt=""/>,
        title: "Язык программирования",
        instrumentTitle: "Typescript",
        description: 'TypeScript — это популярный статический типизатор (static type checker) или типизированное надмножество (typed superset) для JavaScript, инструмент, разработанный Microsoft и добавляющий систему типов к гибкости и динамическим возможностям JavaScript.'
      },
      {
        icon: <img src={viteLogo} alt=""/>,
        title: "Сборщик проекта",
        instrumentTitle: "Vite",
        description: 'Локальный сервер разработки, написанный Эваном Вами и используемый по умолчанию Vue и для шаблонов проектов React.'
      },
      {
        icon: <img src={nodeLogo} alt=""/>,
        title: "Программная платформа",
        instrumentTitle: "NodeJS",
        description: 'Программная платформа, основанная на движке V8, превращающая JavaScript из узкоспециализированного языка в язык общего назначения. Node.js добавляет возможность JavaScript взаимодействовать с устройствами ввода-вывода через свой API, написанный на C++, подключать другие внешние библиотеки, написанные на разных языках, обеспечивая вызовы к ним из JavaScript-кода.'
      },
      {
        icon: <img src={electronLogo} alt=""/>,
        title: "Фреймворк для разработки десктопных приложений",
        instrumentTitle: "Electron",
        description: 'Фреймворк для разработки настольных приложений с использованием HTML, CSS и JavaScript.'
      },
      {
        icon: <img src={reactLogo} alt=""/>,
        title: "Интерфейс написан с помощью",
        instrumentTitle: "React",
        description: 'React — это библиотека JavaScript с открытым кодом для создания внешних пользовательских интерфейсов.'
      },
      {
        icon: <img src={reduxLogo} alt=""/>,
        title: "Вспомогательные библиотеки",
        instrumentTitle: "Redux, ReactIcons, JSXGraph",
        description: 'Redux — это инструмент для управления состоянием данных и пользовательским интерфейсом в приложениях JavaScript с большим количеством сущностей. React Icons предоставляет наборы иконок для разработки интерфейсов. JSXGraph - это кроссбраузерная библиотека JavaScript для интерактивной геометрии, построения функций, графиков и визуализации данных в веб-браузере'
      },
      {
        icon: <img src={tailwindLogo} alt=""/>,
        title: "Стилизация приложения",
        instrumentTitle: "TailwindCSS",
        description: 'Фреймворк CSS с открытым исходным кодом. Главная особенность этой библиотеки заключается в том, что, в отличие от других фреймворков CSS, таких как Bootstrap, она не предоставляет набор предопределенных классов для таких элементов, как кнопки или таблицы.'
      }
    ],
    []
  )

  return (
    <section className='centered flex-col p-2 gap-4'>
      <div className='centered flex-col w-1/2 max-w-[800px]'>
        <img src={ProgramLogo} alt='Program Logo'/>
        <span className='text-gray-400'>v 2.0.1</span>
      </div>
      <div className='flex justify-start items-start w-full flex-col'>
        <b>Стек использованных инструментов</b>
        <div className='flex flex-wrap flex-col justify-start items-start gap-2 ml-2 w-full'>
          {
            usedTechnologies.map((tech, index) => (
              <motion.div layout key={index} className='tech-container'>
                <div className='flex flex-row gap-2 centered'>
                  <div className='w-10'>
                    {tech.icon}
                  </div>
                  <div className='flex flex-col'>
                    <b>{tech.title}</b>
                    <span>{tech.instrumentTitle}</span>
                  </div>
                </div>
                {
                  tech.description && (
                    <span className='description'>{tech.description}</span>
                  )
                }
              </motion.div>
            ))
          }
        </div>
        <div className='centered w-full'>
          <b className='flex gap-2 mt-4'>
            Исходный код приложения размещён в 
            <LinkWithIcon 
              title='репозитории на Github' 
              url='https://github.com/icestormikk/simplex-method-lab-remastered'
              icon={(<AiFillGithub className='text-xl'/>)}
              color='rgb(37, 150, 190)'
            />
          </b>
        </div>
      </div>
    </section>
  );
}

export default MainPageBlock;