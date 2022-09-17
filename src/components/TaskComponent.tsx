import { DetailedHTMLProps, FC, HTMLAttributes } from 'react';

import Checkbox from './Checkbox';
import TagComponent from './TagComponent';
import {
  // deleteTask,
  updateTask,
  switchCompletionTask,
  selectTaskById,
} from '../app/tasksSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { RootState } from '../app/store';
import { Task } from '../models/Task';

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

  const onRemoveTag = (tag: string): void => {
    if (task) {
      const updatedTask = {
        ...task,
        tags: [...task.tags.filter((item) => item !== tag)],
      };
      dispatch(updateTask(new Task(updatedTask)));
    }
  };

  const taskClass = `flex py-1 justify-between text-sm border-b border-slate-500 ${
    selected ? 'bg-slate-600' : 'hover:bg-slate-700'
  } ${task?.completed && ' opacity-30'}`;

  return (
    <li className={taskClass} {...props}>
      <div className="flex gap-1 items-center">
        <Checkbox
          isChecked={!!task?.completed}
          onClick={() => dispatch(switchCompletionTask(taskId))}
        />
        <span>{task?.title}</span>
      </div>
      <div className="flex gap-1 items-center">
        {task?.tags.map((tag) => (
          <TagComponent
            key={tag}
            tagName={tag}
            removeTag={() => onRemoveTag(tag)}
          />
        ))}
        {task?.date && (
          <span className="ml-4">{`${new Date(
            task.date
          ).toDateString()}`}</span>
        )}
      </div>
    </li>
  );
};

export default TaskComponent;
