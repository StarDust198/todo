import { FC } from 'react';

interface TaskFiltersProps {}

const TaskFilters: FC<TaskFiltersProps> = () => {
  // const [selectedFilter, setSelectedFilter] = useState<Filter>();

  return (
    <div className="px-1 py-2 bg-slate-800 flex flex-col">
      <div className="border-b border-slate-500">
        <div>date1</div>
        <div>date2</div>
        <div>date3</div>
      </div>
      <div className="border-b border-slate-500">
        <div>tag1</div>
        <div>tag2</div>
        <div>tag3</div>
      </div>
      <div>
        <div>folder1</div>
        <div>folder2</div>
        <div>folder3</div>
      </div>
    </div>
  );
};

export default TaskFilters;
