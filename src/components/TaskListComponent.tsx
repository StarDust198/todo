import {
  createRef,
  FC,
  useEffect,
  useState,
  MouseEvent,
  Fragment,
} from 'react';
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
import ContextMenu from './ContextMenu';

interface TaskListComponentProps {}

const TaskListComponent: FC<TaskListComponentProps> = () => {
  const dispatch = useAppDispatch();
  const contextMenuRef = createRef<HTMLUListElement>();

  const [menuOpen, setMenuOpen] = useState(false);
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

  // Context menu
  const onContextMenu = (event: MouseEvent<HTMLLIElement>) => {
    event.preventDefault();
    if (contextMenuRef.current) {
      contextMenuRef.current.style.top = `${event.clientY}px`;
      contextMenuRef.current.style.left = `${event.clientX}px`;
    }
    setMenuOpen((menuOpen) => !menuOpen);
  };

  const ulClass = `flex-col bg-slate-800 z-10 absolute 
    rounded-r-2xl rounded-b-2xl border border-slate-500 
     overflow-hidden ${menuOpen ? 'flex' : 'hidden'}`;
  const liClass = 'border-b border-slate-500 hover:bg-slate-700 p-1 text-sm';

  const mapTasks = (taskArr: string[]) => {
    return taskArr.map((taskId) => (
      <TaskComponent
        key={taskId}
        taskId={taskId}
        onClick={() => dispatch(setActiveTask(taskId))}
        onContextMenu={onContextMenu}
        selected={activeTask === taskId}
      />
    ));
  };

  return (
    <div
      className="bg-slate-800"
      onMouseLeave={() => setMenuOpen(false)}
      onClick={() => setMenuOpen(false)}
    >
      <div className="p-4">
        <h1 className="text-2xl font-extrabold">Today</h1>
        <AddTaskInput />
        {tasksStatus === LoadingStates.LOADING && <Loader />}
        {tasksStatus === LoadingStates.FAIL && (
          <ErrorMessage error={tasksError} />
        )}
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
      <ContextMenu open={menuOpen} className={ulClass} ref={contextMenuRef}>
        <li className={liClass}>Delete task</li>
      </ContextMenu>
    </div>
  );
};

export default TaskListComponent;
