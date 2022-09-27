import { createRef, FC, useEffect, useState, MouseEvent } from 'react';

import { useAppSelector, useAppDispatch } from '../app/hooks';
import type { RootState } from '../app/store';
import {
  fetchTasks,
  setActiveTask,
  selectFilteredTaskIds,
  updateTask,
  deleteTask,
} from '../app/tasksSlice';
import { LoadingStates } from '../models/LoadingStates';

import AddTaskInput from './AddTaskInput';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';
import TaskComponent from './TaskComponent';
import ContextMenu from './ContextMenu';
import { Filters } from '../models/Filters';

interface TaskListComponentProps {}

const TaskListComponent: FC<TaskListComponentProps> = () => {
  const dispatch = useAppDispatch();
  const contextMenuRef = createRef<HTMLUListElement>();

  const [menuOpen, setMenuOpen] = useState('');
  const activeTask = useAppSelector(
    (state: RootState) => state.tasks.activeTask
  );

  const activeFilter = useAppSelector(
    (state: RootState) => state.filters.activeFilter
  );
  const tasksStatus = useAppSelector((state: RootState) => state.tasks.status);
  const tasksError = useAppSelector((state: RootState) => state.tasks.error);

  const { completed, incoming, overdue, deleted, all } = useAppSelector(
    selectFilteredTaskIds
  );

  useEffect(() => {
    if (tasksStatus === LoadingStates.IDLE) {
      dispatch(fetchTasks());
    }
  }, [tasksStatus, dispatch]);

  useEffect(() => {
    if (!all.includes(activeTask)) {
      dispatch(setActiveTask(''));
    }
  }, [all, activeTask, dispatch]);

  // Context menu
  const onContextMenu = (event: MouseEvent<HTMLLIElement>, taskId: string) => {
    event.preventDefault();
    if (contextMenuRef.current) {
      contextMenuRef.current.style.top = `${event.pageY}px`;
      contextMenuRef.current.style.left = `${event.pageX}px`;
    }
    setMenuOpen(taskId);
  };

  const onDeleteTask = () => {
    try {
      if (activeFilter === Filters.DELETED) {
        dispatch(deleteTask(menuOpen)).unwrap();
      } else {
        dispatch(
          updateTask({ taskId: menuOpen, changes: { deleted: true } })
        ).unwrap();
      }
      setMenuOpen('');
    } catch (err) {
      console.error(`Failed to delete task id: ${menuOpen}, error: `, err);
    }
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
        onContextMenu={(e) => onContextMenu(e, taskId)}
        selected={activeTask === taskId}
      />
    ));
  };

  return (
    <div
      className="bg-slate-800"
      onMouseLeave={() => setMenuOpen('')}
      onClick={() => setMenuOpen('')}
    >
      <div className="p-4">
        <h1 className="text-2xl font-extrabold">{activeFilter}</h1>
        <AddTaskInput />
        {tasksStatus === LoadingStates.LOADING && <Loader />}
        {tasksStatus === LoadingStates.FAIL && (
          <ErrorMessage error={tasksError} />
        )}
        {!!overdue.length && (
          <>
            <h3 className="py-1">Overdue:</h3>
            <ul>{mapTasks(overdue)}</ul>
          </>
        )}
        {!!incoming.length && (
          <>
            <h3 className="py-1">{activeFilter}:</h3>
            <ul>{mapTasks(incoming)}</ul>
          </>
        )}
        {!!completed.length && (
          <>
            <h3 className="py-1">Completed:</h3>
            <ul>{mapTasks(completed)}</ul>
          </>
        )}
        {!!deleted.length && (
          <>
            <h3 className="py-1">Deleted:</h3>
            <ul>{mapTasks(deleted)}</ul>
          </>
        )}
        {/* <h2>'No tasks available yet.. Add some!'</h2> */}
      </div>
      <ContextMenu open={!!menuOpen} className={ulClass} ref={contextMenuRef}>
        <li className={liClass} onClick={onDeleteTask}>
          {activeFilter === Filters.DELETED ? 'Delete forever' : 'Delete task'}
        </li>
      </ContextMenu>
    </div>
  );
};

export default TaskListComponent;
