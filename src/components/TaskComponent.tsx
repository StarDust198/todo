import { DetailedHTMLProps, FC, HTMLAttributes } from 'react';
import formatRelative from 'date-fns/formatRelative';

import Checkbox from './Checkbox';
import TagComponent from './TagComponent';
import {
  updateTask,
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

  const onRemoveTag = (tag: string): void => {
    if (task) {
      dispatch(
        updateTask({
          taskId: task.id,
          changes: { tags: [...task.tags.filter((item) => item !== tag)] },
        })
      );
    }
  };

  const taskClass = `flex py-1 justify-between text-sm border-b border-slate-500 ${
    selected ? 'bg-slate-600' : 'hover:bg-slate-700'
  } ${(task?.completed || task?.deleted) && ' opacity-30'}`;

  const formatDate = () => {
    if (task) {
      const formattedDate = formatRelative(new Date(task.date), new Date());

      if (!task.time) {
        const atIndex = formattedDate.search(/at\s\d+:\d{2}/);
        return atIndex !== -1 ? formattedDate.slice(0, atIndex) : formattedDate;
      }
      return formattedDate;
    }
  };

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
        {task?.date && <span className="ml-4">{formatDate()}</span>}
      </div>
    </li>
  );
};

export default TaskComponent;
