import { FC, useState } from 'react';

interface TaskComponentProps {
  title: string;
  completed?: boolean;
  tags?: string[];
  date?: Date | null;
}

const TaskComponent: FC<TaskComponentProps> = ({
  title,
  completed = false,
  tags = [],
  date = null,
}) => {
  const [checked, setChecked] = useState(completed);

  const onCheck = () => {
    setChecked((checked) => !checked);
  };

  return (
    <li className="task">
      <div>
        <input
          className="task-checkbox"
          type="checkbox"
          checked={checked}
          onChange={onCheck}
        />
        <span className="task-title">{title}</span>
      </div>
      <div>
        {tags.map((item) => (
          <span className="task-tag">{item}</span>
        ))}
        {date && <span className="task-date">date</span>}
      </div>
    </li>
  );
};

export default TaskComponent;
