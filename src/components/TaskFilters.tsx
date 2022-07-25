import { FC } from 'react';

interface TaskFiltersProps {}

const TaskFilters: FC<TaskFiltersProps> = () => {
  // const [selectedFilter, setSelectedFilter] = useState<Filter>();

  return (
    <div className="task-filters">
      <div className="task-filters--dates">
        <div className="task-filters--date">date1</div>
        <div className="task-filters--date">date2</div>
        <div className="task-filters--date">date3</div>
      </div>
      <div className="task-filters--tags">
        tags:
        <div className="task-filters--tag">tag1</div>
        <div className="task-filters--tag">tag2</div>
        <div className="task-filters--tag">tag3</div>
      </div>
      <div className="task-filters--folders">
        <div className="task-filters--folder">folder1</div>
        <div className="task-filters--folder">folder2</div>
        <div className="task-filters--folder">folder3</div>
      </div>
    </div>
  );
};

export default TaskFilters;
