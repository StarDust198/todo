import { DetailedHTMLProps, FC, HTMLAttributes } from 'react';

import Checkbox from './Checkbox';
import TagComponent from './TagComponent';
import {
  deleteTask,
  switchCompletionTask,
  selectTaskById,
} from '../app/tasksSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { RootState } from '../app/store';

interface TaskComponentProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLLIElement>, HTMLLIElement> {
  taskId: string;
  selected: boolean;
}

const TaskComponent: FC<TaskComponentProps> = ({
  taskId,
  selected,
  ...props
}) => {
  const dispatch = useAppDispatch();
  const task = useAppSelector((state: RootState) =>
    selectTaskById(state, taskId)
  );

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
  } ${task?.completed && ' opacity-30'}`;

  return (
    <li className={taskClass} {...props}>
      <div className="flex gap-1 items-center">
        <Checkbox
          // taskId={taskId}
          isChecked={!!task?.completed}
          onClick={onSwitchCompletion}
        />
        <span>{task?.title}</span>
      </div>
      <div className="flex gap-1 items-center">
        {task?.tags.map((tag) => (
          <TagComponent key={tag} tagName={tag} />
        ))}
        {task?.date && <span>date</span>}
      </div>
    </li>
  );
};

export default TaskComponent;
