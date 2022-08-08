import { FC, useState, MouseEvent } from 'react';
import { ReactComponent as TagIcon } from '../assets/tag.svg';
import { ReactComponent as CalendarIcon } from '../assets/calendar.svg';
import { ReactComponent as IncomingIcon } from '../assets/incoming.svg';
import { ReactComponent as TodayIcon } from '../assets/today.svg';
import { ReactComponent as CompletedIcon } from '../assets/completed.svg';
import { ReactComponent as TrashIcon } from '../assets/trash.svg';
import FilterComponent from './FilterComponent';
import { useTodos } from '../hooks/useTodos';

const tags = ['importantTag', 'mainTag', 'notImportantTag'];
const filterBase = {};

interface TaskFiltersProps {}

const TaskFilters: FC<TaskFiltersProps> = () => {
  const [selectedFilter, setSelectedFilter] = useState('_today');
  const { loading, error, tags, addTag } = useTodos();

  const onChangeFilter = (e: MouseEvent<HTMLLIElement>) => {
    const liElement: HTMLLIElement = e.currentTarget;
    setSelectedFilter(liElement.id);
  };

  return (
    <div className="px-4 py-4 bg-slate-800 flex flex-col">
      <ul className="border-b border-slate-500 py-2">
        <FilterComponent
          id="_today"
          onClick={onChangeFilter}
          title="Today"
          total={123}
          selected={selectedFilter === '_today'}
        >
          <TodayIcon />
        </FilterComponent>
        <FilterComponent
          id="_week"
          onClick={onChangeFilter}
          title="Next 7 days"
          total={123}
          selected={selectedFilter === '_week'}
        >
          <CalendarIcon />
        </FilterComponent>
        <FilterComponent
          id="_incoming"
          onClick={onChangeFilter}
          title="Incoming"
          total={123}
          selected={selectedFilter === '_incoming'}
        >
          <IncomingIcon />
        </FilterComponent>
      </ul>
      {tags.length && (
        <ul className="border-b border-slate-500 py-2">
          {tags.map((tag) => (
            <FilterComponent
              tagColor={tag.color}
              title={tag.title}
              key={`${tag}-filter`}
              total={321}
              id={tag.title}
              onClick={onChangeFilter}
              selected={selectedFilter === tag.title}
            >
              <TagIcon className="w-4" />
            </FilterComponent>
          ))}
        </ul>
      )}
      <ul className="py-2">
        <FilterComponent
          id="_completed"
          onClick={onChangeFilter}
          title="Completed"
          total={111}
          selected={selectedFilter === '_completed'}
        >
          <CompletedIcon />
        </FilterComponent>
        <FilterComponent
          id="_deleted"
          onClick={onChangeFilter}
          title="Deleted"
          total={111}
          selected={selectedFilter === '_deleted'}
        >
          <TrashIcon />
        </FilterComponent>
      </ul>
    </div>
  );
};

export default TaskFilters;
