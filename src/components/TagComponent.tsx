import { FC } from 'react';

interface TagProps {
  tagName: string;
}

const TagComponent: FC<TagProps> = ({ tagName }) => {
  return (
    <span className="bg-yellow-800 py-1 px-2 rounded-full text-xs">
      {tagName}
    </span>
  );
};

export default TagComponent;
