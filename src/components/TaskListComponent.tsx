import { FC, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';

import type { RootState } from '../app/store';
import {
  fetchTasks,
  setActiveTask,
  selectFilteredTasks,
} from '../app/tasksSlice';

import AddTaskInput from './AddTaskInput';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';
import TaskComponent from './TaskComponent';
import { ITask } from '../models/Task';
import { LoadingStates } from '../models/LoadingStates';

interface TaskListComponentProps {}

const TaskListComponent: FC<TaskListComponentProps> = () => {
  const dispatch = useAppDispatch();
  const activeTask = useAppSelector(
    (state: RootState) => state.tasks.activeTask
  );

  const tasksStatus = useAppSelector((state: RootState) => state.tasks.status);
  const tasksError = useAppSelector((state: RootState) => state.tasks.error);

  const tasks: ITask[] = useAppSelector(selectFilteredTasks);
  const completedIds: string[] = tasks
    .filter((task) => task.completed)
    .map((task) => task.id);
  const overdueIds: string[] = tasks
    .filter((task) => !task.timeMatches && !task.completed)
    .map((task) => task.id);
  const incomingIds: string[] = tasks
    .filter((task) => task.timeMatches && !task.completed)
    .map((task) => task.id);

  useEffect(() => {
    if (tasksStatus === LoadingStates.IDLE) {
      dispatch(fetchTasks());
    }
  }, [tasksStatus, dispatch]);

  const mapTasks = (taskArr: string[]) => {
    return taskArr.map((taskId) => (
      <TaskComponent
        key={taskId}
        taskId={taskId}
        onClick={() => dispatch(setActiveTask(taskId))}
        selected={activeTask === taskId}
      />
    ));
  };

  return (
    <div className="px-4 py-4 bg-slate-800">
      <h1 className="text-2xl font-extrabold">Today</h1>
      <AddTaskInput />
      {tasksStatus === LoadingStates.LOADING && <Loader />}
      {tasksError && <ErrorMessage error={tasksError} />}
      <>
        <h3 className="py-1">Overdue:</h3>
        <ul>{mapTasks(overdueIds)}</ul>
        <h3 className="py-1">Incoming:</h3>
        <ul>{mapTasks(incomingIds)}</ul>
        <h3 className="py-1">Completed:</h3>
        <ul>{mapTasks(completedIds)}</ul>
      </>
      {/* <h2>'No tasks available yet.. Add some!'</h2> */}
    </div>
  );
};

export default TaskListComponent;
