import { FC, KeyboardEvent, useEffect, useMemo, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';

import type { RootState } from '../app/store';
import { fetchTasks, selectAllTasks } from '../app/tasksSlice';

import Loader from './Loader';
import ErrorMessage from './ErrorMessage';
import DateChooser from './DateChooser';
import TaskComponent from './TaskComponent';
import { ITask } from '../models/Task';

interface TaskListComponentProps {}

const TaskListComponent: FC<TaskListComponentProps> = () => {
  const dispatch = useAppDispatch();
  const [selectedTask, setSelectedTask] = useState<null | number>(null);

  const tasksStatus = useAppSelector((state: RootState) => state.tasks.status);
  const tasksError = useAppSelector((state: RootState) => state.tasks.error);
  const tasksArr: ITask[] = useAppSelector(selectAllTasks);

  useEffect(() => {
    if (tasksStatus === 'idle') {
      console.log('effect');

      dispatch(fetchTasks());
    }
  }, []);

  const onTaskAdd = (newTask: string) => {};

  const renderList = (taskArr: ITask[]) => {
    console.log('render list');

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

  const content = useMemo(() => {
    if (tasksStatus === 'loading') return <Loader />;
    if (tasksError) return <ErrorMessage error={tasksError} />;
    return renderList(tasksArr);
    // eslint-disable-next-line
  }, [tasksArr, selectedTask, tasksStatus, tasksError]);

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
      {content}
      {/* {taskList.taskArr.length ? renderList(taskList.taskArr) : null} */}
      {/* <h2>'No tasks available yet.. Add some!'</h2> */}
    </div>
  );
};

export default TaskListComponent;
