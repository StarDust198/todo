import { FC, KeyboardEvent, useState } from 'react';

import { useTodos } from '../hooks/useTodos';
import Loader from './Loader';
import DateChooser from './DateChooser';
import TaskComponent from './TaskComponent';
import { ITask, Task } from '../models/Task';

interface TaskListProps {}

const TaskList: FC<TaskListProps> = () => {
  const [selectedTask, setSelectedTask] = useState<null | number>(null);
  const {
    loading,
    // error,
    items: tasks = [],
    addItem: addTask,
  } = useTodos<ITask>('tasks');

  const onTaskAdd = (newTask: string) => {
    addTask(new Task(newTask));
  };

  const renderList = (taskArr: ITask[]) => {
    const completed: ITask[] = [];
    const overdue: ITask[] = [];
    const incoming: ITask[] = [];

    taskArr.forEach((task) => {
      if (task.completed) {
        completed.push(task);
      } else if (task.timeMatches) {
        incoming.push(task);
      } else {
        overdue.push(task);
      }
    });

    const mapTasks = (taskArr: ITask[]) => {
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
          onKeyPress={(e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              onTaskAdd(e.currentTarget.value);
              e.currentTarget.value = '';
            }
          }}
        />
        <div className="w-1/3">
          <DateChooser />
        </div>
      </div>
      {loading && <Loader />}
      {tasks.length ? renderList(tasks) : null}
      {/* <h2>'No tasks available yet.. Add some!'</h2> */}
    </div>
  );
};

export default TaskList;
