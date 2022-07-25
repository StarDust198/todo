import { FC } from 'react';

interface TaskFiltersProps {}

const TaskFilters: FC<TaskFiltersProps> = () => {
  // const [selectedFilter, setSelectedFilter] = useState<Filter>();

  return (
    <div className="task-filters">
      <div className="dates">dates</div>
      <div className="tags">tags</div>
      <div className="folders">folders</div>
    </div>
  );
};

export default TaskFilters;
