import { FC, useState } from 'react';

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

const tasks: Task[] = [
  {
    title: 'main task',
    tags: ['main'],
    id: 123214124124,
    completed: false,
    timeMatches: false,
  },
  {
    title: 'main task2',
    tags: ['main'],
    id: 123446214124124,
    completed: false,
    timeMatches: false,
  },
  {
    title: 'main task3',
    tags: ['best'],
    id: 1235464214124124,
    completed: false,
    timeMatches: true,
  },
  {
    title: 'main task4',
    tags: ['important'],
    id: 12321412465124,
    completed: false,
    timeMatches: true,
  },
  {
    title: 'main task5',
    tags: ['main', 'important'],
    id: 122433214124124,
    completed: false,
    timeMatches: true,
  },
  {
    title: 'main task6',
    tags: ['important'],
    id: 12321412442124,
    completed: true,
    timeMatches: true,
  },
  {
    title: 'main task7',
    tags: [],
    id: 12321544124124,
    completed: true,
    timeMatches: false,
  },
];

const TaskList: FC<TaskListProps> = () => {
  const [selectedTask, setSelectedTask] = useState<null | number>(null);

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
        {/* <input className="bg-slate-700 w-1/4" type="date" /> */}
        <div className="w-1/3">
          <DateChooser />
        </div>
      </div>

      {renderList()}
    </div>
  );
};

export default TaskList;
