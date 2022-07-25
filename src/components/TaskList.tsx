import { FC } from 'react';
import TaskComponent from './TaskComponent';

interface TaskListProps {}

const TaskList: FC<TaskListProps> = () => {
  return (
    <div className="task-list">
      <h1 className="task-list--title">Today</h1>
      <h3 className="task-list--category">Overdue:</h3>
      <ul className="task-list--overdue">
        <TaskComponent title="main task" tags={['main']} />
        <TaskComponent title="very main task" tags={['main']} />
      </ul>
      <h3 className="task-list--category">Incoming:</h3>
      <ul className="task-list--incoming">
        <TaskComponent title="important task" tags={['important']} />
        <TaskComponent title="not so important task" tags={[]} />
      </ul>
      <h3 className="task-list--category">Completed:</h3>
      <ul className="task-list--completed">
        <TaskComponent title="completed task" completed tags={['important']} />
        <TaskComponent title="just a task" completed tags={[]} />
      </ul>
    </div>
  );
};

export default TaskList;
