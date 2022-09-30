import { FC, useEffect, MouseEvent, useState, createRef } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';

import { ITag } from '../models/Tag';
import {
  deleteTag,
  fetchTags,
  selectAllTags,
  setActiveFilter,
  switchActiveTag,
} from '../app/filtersSlice';
import { RootState } from '../app/store';
import { LoadingStates } from '../models/LoadingStates';
import { Filters } from '../models/Filters';

import { ReactComponent as TagIcon } from '../assets/tag.svg';
import { ReactComponent as CalendarIcon } from '../assets/calendar.svg';
import { ReactComponent as IncomingIcon } from '../assets/incoming.svg';
import { ReactComponent as TodayIcon } from '../assets/today.svg';
import { ReactComponent as CompletedIcon } from '../assets/completed.svg';
import { ReactComponent as TrashIcon } from '../assets/trash.svg';
import FilterComponent from './FilterComponent';
import ContextMenu from './ContextMenu';
import { ITask } from '../models/Task';
import { selectAllTasks, updateTask } from '../app/tasksSlice';
import { deactivateTag } from '../app/filtersSlice';

interface TaskFiltersProps {}

const TaskFilters: FC<TaskFiltersProps> = () => {
  const dispatch = useAppDispatch();

  const [menuOpen, setMenuOpen] = useState('');
  const contextMenuRef = createRef<HTMLUListElement>();

  const activeFilter = useAppSelector(
    (state: RootState) => state.filters.activeFilter
  );
  const activeTags = useAppSelector(
    (state: RootState) => state.filters.activeTags
  );
  const tagsStatus = useAppSelector((state: RootState) => state.filters.status);
  // const tagsError = useAppSelector((state: RootState) => state.filters.error);
  const tagsArr: ITag[] = useAppSelector(selectAllTags);
  const tasks: ITask[] = useAppSelector(selectAllTasks);

  useEffect(() => {
    if (tagsStatus === LoadingStates.IDLE) {
      dispatch(fetchTags());
    }
  }, [tagsStatus, dispatch]);

  const onContextMenu = (event: MouseEvent<HTMLLIElement>, tagId: string) => {
    event.preventDefault();
    if (contextMenuRef.current) {
      contextMenuRef.current.style.top = `${event.pageY}px`;
      contextMenuRef.current.style.left = `${event.pageX}px`;
    }
    setMenuOpen(tagId);
  };

  const ulClass = `flex-col bg-slate-800 z-10 absolute 
    rounded-r-2xl rounded-b-2xl border border-slate-500 
     overflow-hidden ${menuOpen ? 'flex' : 'hidden'}`;
  const liClass = 'border-b border-slate-500 hover:bg-slate-700 p-1 text-sm';

  const onDeleteTag = async () => {
    try {
      dispatch(deactivateTag(menuOpen));
      await dispatch(deleteTag(menuOpen));
      tasks.forEach((task) => {
        if (task.tags?.includes(menuOpen))
          dispatch(
            updateTask({
              taskId: task.id,
              changes: { tags: task.tags.filter((tag) => tag !== menuOpen) },
            })
          );
      });
      setMenuOpen('');
    } catch (err) {
      console.error(`Failed to delete tag id: ${menuOpen}, error: `, err);
    }
  };

  return (
    <div
      className="bg-slate-800"
      onMouseLeave={() => setMenuOpen('')}
      onClick={() => setMenuOpen('')}
    >
      <div className="p-4 flex flex-col">
        <ul className="border-b border-slate-500 py-2">
          <FilterComponent
            onClick={() => dispatch(setActiveFilter(Filters.INCOMING))}
            selected={activeFilter === Filters.INCOMING}
            filter={Filters.INCOMING}
          >
            <IncomingIcon />
          </FilterComponent>
          <FilterComponent
            onClick={() => dispatch(setActiveFilter(Filters.TODAY))}
            selected={activeFilter === Filters.TODAY}
            filter={Filters.TODAY}
          >
            <TodayIcon />
          </FilterComponent>
          <FilterComponent
            onClick={() => dispatch(setActiveFilter(Filters.WEEK))}
            selected={activeFilter === Filters.WEEK}
            filter={Filters.WEEK}
          >
            <CalendarIcon />
          </FilterComponent>
        </ul>
        {!!tagsArr.length && (
          <ul className="border-b border-slate-500 py-2">
            {tagsArr.map((tag) => (
              <FilterComponent
                tag={tag}
                key={tag.id}
                onClick={() => dispatch(switchActiveTag(tag.id))}
                onContextMenu={(e) => onContextMenu(e, tag.id)}
                selected={activeTags.includes(tag.id)}
              >
                <TagIcon className="w-4" />
              </FilterComponent>
            ))}
          </ul>
        )}
        <ul className="py-2">
          <FilterComponent
            onClick={() => dispatch(setActiveFilter(Filters.COMPLETED))}
            selected={activeFilter === Filters.COMPLETED}
            filter={Filters.COMPLETED}
          >
            <CompletedIcon />
          </FilterComponent>
          <FilterComponent
            onClick={() => dispatch(setActiveFilter(Filters.DELETED))}
            selected={activeFilter === Filters.DELETED}
            filter={Filters.DELETED}
          >
            <TrashIcon />
          </FilterComponent>
        </ul>
      </div>
      <ContextMenu open={!!menuOpen} className={ulClass} ref={contextMenuRef}>
        {/* <li className={liClass}>Rename tag</li> */}
        {/* <li className={liClass}>Change tag color</li> */}
        <li className={liClass} onClick={onDeleteTag}>
          Delete tag
        </li>
      </ContextMenu>
    </div>
  );
};

export default TaskFilters;
