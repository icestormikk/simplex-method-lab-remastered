import React from 'react';
import Article from './Article';
import { MAX_MATRIX_SIZE } from '@/components/MatrixBuilder';
import { AiOutlineUpload } from 'react-icons/ai';
import { motion } from 'framer-motion';
import { example, requiredFieldsData, supportedFileExtensions } from '@/properties';
import { extractDataFromFile } from '@/fs_helpers';
import Progress from '@/components/update/Progress';
import { BiSolidErrorAlt } from 'react-icons/bi';
import { ImCheckmark } from 'react-icons/im'
import * as yaml from 'js-yaml'
import { TaskData } from '@/vite-env';
import { useAppDispatch } from '@/redux/hooks';
import { setConfiguration } from '@/redux/slices/TaskState';

interface FileBlockProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function FileBlock({ setIsModalOpen }: FileBlockProps) {
  const requieredFields = requiredFieldsData
  const dispatch = useAppDispatch()
  const [file, setFile] = React.useState<File>()
  const [result, setResult] = React.useState<TaskData>()
  const [uploadingData, setUploadingData] = React.useState<
    {status: "success"|"failed"|"inprocess"|undefined, percent: number, message?: string}
  >({
    status: undefined, percent: 0
  })
  const fileRequirements = React.useMemo<{
    parameter: string, 
    availableValues: string[]|React.JSX.Element[],
    isBroken?: boolean
  }[]>(
    () => [
      {
        parameter: 'Допустимые разрешения файлов',
        availableValues: supportedFileExtensions
      },
      {
        parameter: 'Размер матрицы коэффициентов',
        availableValues: [`не более ${MAX_MATRIX_SIZE}`],
      },
      {
        parameter: 'Необходимые поля',
        availableValues: [requieredFields.map((field) => field.title).join(', ')]
      },
      {
        parameter: 'Пример',
        availableValues: [(
          <div className='bordered rounded-md p-2 shadow-md'>
            <p className='whitespace-pre-wrap text-sm'>
              {yaml.dump(example)}
            </p>
          </div>
        )]
      },
      {
        parameter: 'Допустимые значения полей',
        availableValues: [(
          <ul className='ml-6 list-disc'>
            {
              requieredFields.map((field, index) => (
                <li key={index}>
                  <b>{field.title}: </b>
                  <span>{field.values.join(', ')}</span>
                </li>
              ))
            }
          </ul>
        )]
      },
      {
        parameter: 'Примечание',
        availableValues: [`
          Значения полей ${requieredFields.map((field) => field.title).join(', ')} могут быть
          расположены в любом порядке и в любом месте файла. Все остальное содержимое будет воспринято
          как матричные коэффициенты.
        `]
      }
    ],
    [requieredFields]
  )

  const onButtonClick = async () => {
    if (!(file && file.path)) {
      return
    }

    try {
      setUploadingData({
        status: "inprocess",
        percent: 10
      })
      const res = await extractDataFromFile(file)
      setResult(res)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setUploadingData({
        status: "failed",
        percent: 100,
        message: e.message
      })
      return
    }

    setUploadingData({
      status: "success",
      percent: 100,
      message: 'Данные успешно считаны'
    })
  }

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
      setUploadingData((prevState) => {
        prevState.status = undefined;
        return prevState;
      });
    }
  };

  const onSaveState = async () => {
    if (!result) {
      return
    }

    dispatch(setConfiguration(result))
    setIsModalOpen(false)
  }

  return (
    <div className='flex md:flex-row flex-col'>
      <div className='flex flex-col gap-4 w-fit md:border-r-[1px] border-b-[1px] py-2 px-4'>
        <Article 
          title='Инструкция' 
          content={(
            <p>
              Выберите на своём компьютере файл, содержащий информацию о задаче, 
              решение которой хотите получить. Учтите, что файл и его содержимое
              должны соответствовать требованиям, описанным ниже.
            </p>
          )} 
        />
        <Article
          title='Требования'
          content={(
            <ul className='max-w-fit'>
              {
                fileRequirements.map((requirement, index) => {
                  const isString = typeof requirement.availableValues[0] === 'string'
                  
                  return (
                    <li 
                      key={index} 
                      className={
                        (isString ? 'flex flex-row flex-nowrap gap-2 justify-between' : '') 
                      }
                    >
                      <b>{requirement.parameter}: </b>
                      {
                        isString ? (
                          <span>
                            {requirement.availableValues.join(', ')}
                          </span>
                        ) : (
                          <>
                            {
                              requirement.availableValues.map((obj, index) => (
                                <React.Fragment key={index}>
                                  {obj}
                                </React.Fragment>
                              ))
                            }
                          </>
                        )
                      }
                    </li>
                  )
                })
              }
            </ul>
          )}
        />
        <Article
          title='Загрузить данные'
          content={(
            <div className='flex flex-col gap-1 bordered p-2 rounded-md shadow-md'>
              <div className='flex flex-row justify-between'>
                <input 
                  type="file" 
                  name='file' 
                  id='file'
                  accept={supportedFileExtensions.map((ext) => `.${ext}`).join(',')}
                  onChange={onFileChange}
                />
                <motion.button 
                  whileHover={{scale: 1.02}}
                  whileTap={{scale: 0.95}}
                  className='accept-button'
                  onClick={onButtonClick}
                >
                  Загрузить
                  <AiOutlineUpload className='text-xl'/>
                </motion.button>
              </div>
              {
                uploadingData.status && (
                  <>
                    <Progress 
                      percent={uploadingData.percent}
                      color={
                        uploadingData.status === 'success' ? 'green' : (
                          uploadingData.status === 'failed' ? '#bf0c1c' : 'darkgreen'
                        )
                      }
                    />
                    {
                      uploadingData.message && (
                        <>
                          {
                            uploadingData.status === 'success' ? (
                              <div className='centered flex-row gap-2 text-[green]'>
                                <ImCheckmark className='text-2xl'/>
                                <b>{uploadingData.message}</b>
                              </div>
                            ) : (
                              uploadingData.status === 'failed' && (
                                <div className='centered flex-row gap-2 text-[#f04d5b]'>
                                  <BiSolidErrorAlt className='text-2xl'/>
                                  <b>{uploadingData.message}</b>
                                </div>
                              )
                            )
                          }
                        </>
                      )
                    }
                  </>
                )
              }
            </div>
          )}
        />
      </div>
      <div className='p-2 flex flex-col gap-1'>
        <b className='whitespace-nowrap'>Результат считывания: </b>
        <p>
          В прямоугольнике ниже отобразится проеобразования переданного вами текста в 
          математические выражения, определённые в задаче.
        </p>
        <p>
          В случае если результат содержит ошибки, исправьте файл и загрузите его снова.
          Результат обновится автоматически.
        </p>
        <p>
          Если результат вас удовлетворяет, нажмите на кнопку ниже.
        </p>
        <motion.button 
          whileHover={{scale: 1.02}}
          whileTap={{scale: 0.95}}
          onClick={() => onSaveState()}
          className='centered py-2 w-full text-white bg-green-500 gap-2'
        >
          <ImCheckmark/>
          Принять
        </motion.button>
        <div className='p-2 border-[1px] bordered rounded-md shadow-md w-[400px]'>
          {
            !result ? (
              <b className='text-gray-400'>Здесь отобразится результат</b>
            ) : (
              <div className='flex flex-col gap-2'>
                <Article 
                  title='Целевая функция' 
                  content={(<motion.p>{result.target.toString()}</motion.p>)}
                />
                <Article 
                  title='Ограничения' 
                  content={(
                    <ul>
                      {
                        result.constraints.map((constraint, index) => (
                          <motion.li 
                            key={index}
                            initial={{opacity: 0.0}}
                            animate={{opacity: 1.0}}
                            transition={{duration: 0.3, delay: index * 0.2}}
                          >
                            {constraint.toString()}
                          </motion.li>
                        ))
                      }
                    </ul>
                  )}
                />
                <Article title='Вид дробей в приложении' content={(<p>{result.fractionView}</p>)}/>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}

export default FileBlock;