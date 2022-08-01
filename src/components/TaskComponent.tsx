import { FC, useState } from 'react';
import Checkbox from './Checkbox';
import TagComponent from './TagComponent';

interface TaskComponentProps {
  title: string;
  completed?: boolean;
  tags?: string[];
  date?: Date | null;
  id: number;
  selected?: boolean;
}

const TaskComponent: FC<TaskComponentProps> = ({
  title,
  completed = false,
  tags = [],
  date = null,
  id,
  selected = false,
}) => {
  const [checked, setChecked] = useState(completed);

  const onCheck = () => {
    setChecked((checked) => !checked);
  };

  const taskClass = `flex py-1 justify-between text-sm border-b border-slate-500 ${
    selected ? 'bg-slate-600' : 'hover:bg-slate-700'
  }`;

  return (
    <li className={taskClass}>
      <div className="flex gap-1 items-center">
        <Checkbox id={id} />
        <span>{title}</span>
      </div>
      <div className="flex gap-1 items-center">
        {tags.map((item) => (
          <TagComponent key={item} tagName={item} />
        ))}
        {date && <span>date</span>}
      </div>
    </li>
  );
};

export default TaskComponent;
