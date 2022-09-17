import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

import { selectTagByName } from '../app/filtersSlice';

interface TagProps {
  tagName: string;
  removeTag: () => void;
}

const TagComponent: FC<TagProps> = ({ tagName, removeTag }) => {
  const tag = useSelector((state: RootState) =>
    selectTagByName(state, tagName)
  );

  const [showClose, setShowClose] = useState(false);

  return (
    <span
      className={`${tag?.color} py-1 px-2 rounded-full text-xs relative`}
      onMouseEnter={() => setShowClose(true)}
      onMouseLeave={() => setShowClose(false)}
    >
      {tag?.id}
      <span
        className={`absolute bg-slate-300 -top-1 -right-1 text-[0.75rem]
         text-red-500 rounded-full h-3 w-3 text-center leading-[0.625rem] 
         transition-opacity 
          ${
            showClose
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
          }`}
        onClick={removeTag}
      >
        x
      </span>
    </span>
  );
};

export default TagComponent;
