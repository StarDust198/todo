import { FC } from 'react';
import { ReactComponent as TagIcon } from '../assets/tag.svg';
import { ReactComponent as CalendarIcon } from '../assets/calendar.svg';
import { ReactComponent as IncomingIcon } from '../assets/incoming.svg';
import { ReactComponent as TodayIcon } from '../assets/today.svg';
import { ReactComponent as CompletedIcon } from '../assets/completed.svg';
import { ReactComponent as TrashIcon } from '../assets/trash.svg';
import FilterComponent from './FilterComponent';

const tags = ['importantTag', 'mainTag', 'notImportantTag'];

interface TaskFiltersProps {}

const TaskFilters: FC<TaskFiltersProps> = () => {
  // const [selectedFilter, setSelectedFilter] = useState<Filter>();

  return (
    <div className="px-4 py-4 bg-slate-800 flex flex-col">
      <ul className="border-b border-slate-500 py-2">
        <FilterComponent title="Today" total={123} selected>
          <TodayIcon />
        </FilterComponent>
        <FilterComponent title="Next 7 days" total={123}>
          <CalendarIcon />
        </FilterComponent>
        <FilterComponent title="Incoming" total={123}>
          <IncomingIcon />
        </FilterComponent>
      </ul>
      {tags.length && (
        <ul className="border-b border-slate-500 py-2">
          {tags.map((tag) => (
            <FilterComponent title={tag} key={`${tag}-filter`} total={321}>
              <TagIcon />
            </FilterComponent>
          ))}
        </ul>
      )}
      <ul className="py-2">
        <FilterComponent title="Completed" total={111}>
          <CompletedIcon />
        </FilterComponent>
        <FilterComponent title="Deleted" total={111}>
          <TrashIcon />
        </FilterComponent>
      </ul>
    </div>
  );
};

export default TaskFilters;
