import { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

import { selectTagByName } from '../app/tagsSlice';

import { Colors, randomColor } from '../models/Colors';

interface TagProps {
  tagName: string;
}

const TagComponent: FC<TagProps> = ({ tagName }) => {
  const tag = useSelector((state: RootState) =>
    selectTagByName(state, tagName)
  );

  return (
    <span className={`${tag?.color} py-1 px-2 rounded-full text-xs`}>
      {tagName}
    </span>
  );
};

export default TagComponent;
