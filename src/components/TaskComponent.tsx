import { DetailedHTMLProps, FC, HTMLAttributes } from 'react';

import Checkbox from './Checkbox';
import TagComponent from './TagComponent';
import { deleteTask, switchCompletionTask } from '../app/tasksSlice';
import { useAppDispatch } from '../app/hooks';

interface TaskComponentProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLLIElement>, HTMLLIElement> {
  title: string;
  completed?: boolean;
  tags: string[];
  date?: Date | null;
  taskId: number;
  selected?: boolean;
}

const TaskComponent: FC<TaskComponentProps> = ({
  title,
  completed = false,
  tags,
  date = null,
  taskId,
  selected = false,
  ...props
}) => {
  const dispatch = useAppDispatch();

  const onSwitchCompletion = async () => {
    try {
      // setAddRequestStatus('pending');
      await dispatch(switchCompletionTask(taskId)).unwrap();
    } catch (err) {
      console.error('Failed to switch the task: ', err);
    } finally {
      // setAddRequestStatus('idle');
    }
  };

  const taskClass = `flex py-1 justify-between text-sm border-b border-slate-500 ${
    selected ? 'bg-slate-600' : 'hover:bg-slate-700'
  } ${completed && ' opacity-30'}`;

  return (
    <li className={taskClass} {...props}>
      <div className="flex gap-1 items-center">
        <Checkbox
          // taskId={taskId}
          isChecked={completed}
          onClick={onSwitchCompletion}
        />
        <span>{title}</span>
      </div>
      <div className="flex gap-1 items-center">
        {tags.map((tag) => (
          <TagComponent key={tag} tagName={tag} />
        ))}
        {date && <span>date</span>}
      </div>
    </li>
  );
};

export default TaskComponent;
