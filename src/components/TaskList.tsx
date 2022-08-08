import { FC, useState } from 'react';

import { useTodos } from '../hooks/useTodos';
import Loader from './Loader';
import DateChooser from './DateChooser';
import TaskComponent from './TaskComponent';

interface TaskListProps {}

interface Task {
  title: string;
  tags: string[];
  id: number;
  completed: boolean;
  timeMatches: boolean;
}

const TaskList: FC<TaskListProps> = () => {
  const [selectedTask, setSelectedTask] = useState<null | number>(null);
  const { loading, error, tasks, addTodo } = useTodos();

  const renderList = () => {
    const completed: Task[] = [];
    const overdue: Task[] = [];
    const incoming: Task[] = [];

    tasks.forEach((task) => {
      if (task.completed) {
        completed.push(task);
      } else if (task.timeMatches) {
        incoming.push(task);
      } else {
        overdue.push(task);
      }
    });

    //  onClick={() => setSelectedTask(id)}

    const mapTasks = (taskArr: any[]) => {
      return taskArr.map(({ title, tags, id, completed }) => (
        <TaskComponent
          key={id}
          title={title}
          tags={tags}
          taskId={id}
          completed={completed}
          onClick={() => setSelectedTask(id)}
          selected={selectedTask === id}
        />
      ));
    };

    return (
      <>
        <h3 className="py-1">Overdue:</h3>
        <ul>{mapTasks(overdue)}</ul>
        <h3 className="py-1">Incoming:</h3>
        <ul>{mapTasks(incoming)}</ul>
        <h3 className="py-1">Completed:</h3>
        <ul>{mapTasks(completed)}</ul>
      </>
    );
  };

  return (
    <div className="px-4 py-4 bg-slate-800">
      <h1 className="text-2xl font-extrabold">Today</h1>
      <div className="flex border-b border-slate-500 py-2">
        <input
          type="text"
          className="bg-slate-700 focus:outline-none w-2/3 mr-4"
          placeholder="Add new task"
        />
        <div className="w-1/3">
          <DateChooser />
        </div>
      </div>
      {loading && <Loader />}
      {tasks.length ? renderList() : null}
    </div>
  );
};

export default TaskList;
