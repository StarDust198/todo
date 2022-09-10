import { FC, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';

import type { RootState } from '../app/store';
import {
  fetchTasks,
  deleteTask,
  switchCompletionTask,
} from '../app/tasksSlice';

import AddTaskInput from './AddTaskInput';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';
import TaskComponent from './TaskComponent';
import { ITask } from '../models/Task';

interface TaskListComponentProps {}

const TaskListComponent: FC<TaskListComponentProps> = () => {
  const dispatch = useAppDispatch();
  const [selectedTask, setSelectedTask] = useState<null | number>(null);

  const tasksStatus = useAppSelector((state: RootState) => state.tasks.status);
  const tasksError = useAppSelector((state: RootState) => state.tasks.error);
  const completed: ITask[] = useAppSelector((state: RootState) =>
    state.tasks.tasks.filter((task) => task.completed)
  );
  const overdue: ITask[] = useAppSelector((state: RootState) =>
    state.tasks.tasks.filter((task) => !task.timeMatches && !task.completed)
  );
  const incoming: ITask[] = useAppSelector((state: RootState) =>
    state.tasks.tasks.filter((task) => task.timeMatches && !task.completed)
  );

  useEffect(() => {
    if (tasksStatus === 'idle') {
      dispatch(fetchTasks());
    }
  }, [tasksStatus, dispatch]);

  const onDeleteTask = async (taskId: number) => {
    try {
      // setAddRequestStatus('pending');
      await dispatch(deleteTask(taskId)).unwrap();
    } catch (err) {
      console.error('Failed to delete the task: ', err);
    } finally {
      // setAddRequestStatus('idle');
    }
  };

  const onCompleteTask = async (taskId: number) => {
    try {
      // setAddRequestStatus('pending');
      await dispatch(switchCompletionTask(taskId)).unwrap();
    } catch (err) {
      console.error('Failed to switch the task: ', err);
    } finally {
      // setAddRequestStatus('idle');
    }
  };

  const mapTasks = (taskArr: ITask[]) => {
    return taskArr.map(({ title, tags, id, completed }) => (
      <TaskComponent
        key={id}
        title={title}
        tags={tags}
        taskId={id}
        completed={completed}
        onClick={() => setSelectedTask(id)}
        // onClick={() => onCompleteTask(id)}
        selected={selectedTask === id}
      />
    ));
  };

  return (
    <div className="px-4 py-4 bg-slate-800">
      <h1 className="text-2xl font-extrabold">Today</h1>
      <AddTaskInput />
      {tasksStatus === 'loading' && <Loader />}
      {tasksError && <ErrorMessage error={tasksError} />}
      <>
        <h3 className="py-1">Overdue:</h3>
        <ul>{mapTasks(overdue)}</ul>
        <h3 className="py-1">Incoming:</h3>
        <ul>{mapTasks(incoming)}</ul>
        <h3 className="py-1">Completed:</h3>
        <ul>{mapTasks(completed)}</ul>
      </>
      {/* <h2>'No tasks available yet.. Add some!'</h2> */}
    </div>
  );
};

export default TaskListComponent;
