import React from 'react';

interface ArticleProps {
  title: string;
  content: React.JSX.Element;
}

function Article({ title, content }: ArticleProps) {
  return (
    <div className='w-full'>
      <b>{title}</b>
      <div className='ml-3'>
        {content}
      </div>
    </div>
  );
}

export default Article;