import { FC } from 'react';
import { Colors, randomColor } from '../models/Colors';

interface TagProps {
  tagName: string;
  tagColor?: Colors;
}

const TagComponent: FC<TagProps> = ({ tagName, tagColor = randomColor() }) => {
  return (
    <span className={`${tagColor} py-1 px-2 rounded-full text-xs`}>
      {tagName}
    </span>
  );
};

export default TagComponent;
