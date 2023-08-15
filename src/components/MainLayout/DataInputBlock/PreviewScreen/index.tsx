import { Equation } from '@/types/classes/Equation';
import { TargetFunction } from '@/types/classes/TargetFunction';
import { FractionView } from '@/types/enums/FractionVIew';
import Article from '../FileBlock/Article';
import { motion } from 'framer-motion';

interface PreviewScreenProps {
  target?: TargetFunction,
  constraints: Equation[],
  view: FractionView
}

function PreviewScreen({ target, constraints, view }: PreviewScreenProps) {
  return (
    <div className='flex flex-col gap-2'>
      <Article 
        title='Целевая функция' 
        content={(target ? (<p>{target.toString()}</p>) : (<b className='text-[#f04d5b]'>Не найдено</b>))}
      />
      <Article 
        title='Ограничения' 
        content={(
          <ul>
            {
              constraints.length === 0 ? (
                <b className='text-[#f04d5b]'>Не найдены</b>
              ) : (
                constraints.map((constraint, index) => (
                  <motion.li 
                    key={index}
                    initial={{opacity: 0.0}}
                    animate={{opacity: 1.0}}
                    transition={{duration: 0.3, delay: index * 0.2}}
                  >
                    {constraint.toString()}
                  </motion.li>
                ))
              )
            }
          </ul>
        )}
      />
      <Article title='Вид дробей в приложении' content={(<p>{view}</p>)}/>
    </div>
  );
}

export default PreviewScreen;