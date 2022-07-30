import { FC } from 'react';
import TaskComponent from './TaskComponent';

interface TaskListProps {}

const TaskList: FC<TaskListProps> = () => {
  return (
    <div className="px-4 py-4 bg-slate-800">
      <h1 className="text-2xl font-extrabold">Today</h1>
      <div className="flex gap-4 border-b border-slate-500 py-2">
        <input
          type="text"
          className="bg-slate-700 focus:outline-none w-3/4"
          placeholder="Add new task"
        />
        <input className="bg-slate-700 w-1/4" type="date" />
      </div>
      <h3>Overdue:</h3>
      <ul>
        <TaskComponent title="main task" tags={['main']} />
        <TaskComponent title="very main task" tags={['main']} />
      </ul>
      <h3>Incoming:</h3>
      <ul>
        <TaskComponent title="important task" tags={['important']} />
        <TaskComponent title="not so important task" tags={[]} />
      </ul>
      <h3>Completed:</h3>
      <ul>
        <TaskComponent title="completed task" completed tags={['important']} />
        <TaskComponent title="just a task" completed tags={[]} />
      </ul>
    </div>
  );
};

export default TaskList;
