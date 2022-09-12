import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';

import { ITag } from '../models/Tag';
import {
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

interface TaskFiltersProps {}

const TaskFilters: FC<TaskFiltersProps> = () => {
  const dispatch = useAppDispatch();

  const activeFilter = useAppSelector(
    (state: RootState) => state.filters.activeFilter
  );
  const activeTags = useAppSelector(
    (state: RootState) => state.filters.activeTags
  );
  const tagsStatus = useAppSelector((state: RootState) => state.filters.status);
  const tagsError = useAppSelector((state: RootState) => state.filters.error);
  const tagsArr: ITag[] = useAppSelector(selectAllTags);

  useEffect(() => {
    if (tagsStatus === LoadingStates.IDLE) {
      dispatch(fetchTags());
    }
  }, [tagsStatus, dispatch]);

  return (
    <div className="px-4 py-4 bg-slate-800 flex flex-col">
      <ul className="border-b border-slate-500 py-2">
        <FilterComponent
          onClick={() => dispatch(setActiveFilter(Filters.TODAY))}
          title="Today"
          selected={activeFilter === Filters.TODAY}
          filter={Filters.TODAY}
        >
          <TodayIcon />
        </FilterComponent>
        <FilterComponent
          onClick={() => dispatch(setActiveFilter(Filters.WEEK))}
          title="Next 7 days"
          selected={activeFilter === Filters.WEEK}
          filter={Filters.WEEK}
        >
          <CalendarIcon />
        </FilterComponent>
        <FilterComponent
          onClick={() => dispatch(setActiveFilter(Filters.INCOMING))}
          title="Incoming"
          selected={activeFilter === Filters.INCOMING}
          filter={Filters.INCOMING}
        >
          <IncomingIcon />
        </FilterComponent>
      </ul>
      {tagsArr.length && (
        <ul className="border-b border-slate-500 py-2">
          {tagsArr.map((tag) => (
            <FilterComponent
              tag={tag}
              title={tag.id}
              key={tag.id}
              onClick={() => dispatch(switchActiveTag(tag.id))}
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
          title="Completed"
          selected={activeFilter === Filters.COMPLETED}
          filter={Filters.COMPLETED}
        >
          <CompletedIcon />
        </FilterComponent>
        <FilterComponent
          onClick={() => dispatch(setActiveFilter(Filters.DELETED))}
          title="Deleted"
          selected={activeFilter === Filters.DELETED}
          filter={Filters.DELETED}
        >
          <TrashIcon />
        </FilterComponent>
      </ul>
    </div>
  );
};

export default TaskFilters;
