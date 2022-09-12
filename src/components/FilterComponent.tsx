import { DetailedHTMLProps, FC, HTMLAttributes, ReactNode } from 'react';
import { useAppSelector } from '../app/hooks';
import { RootState } from '../app/store';
import { countTasksByFilter } from '../app/tasksSlice';
import { Filters } from '../models/Filters';
import { ITag } from '../models/Tag';

interface FilterProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLLIElement>, HTMLLIElement> {
  title: string;
  children?: ReactNode | null;
  tag?: ITag;
  filter?: Filters;
  selected?: boolean;
}

const FilterComponent: FC<FilterProps> = ({
  title,
  children = null,
  tag,
  filter,
  selected = false,
  ...props
}) => {
  const filterClass = `flex py-2 px-2 justify-between rounded ${
    selected ? 'bg-slate-600' : 'hover:bg-slate-700'
  }`;

  const counter = useAppSelector((state: RootState) =>
    countTasksByFilter(state, tag ? tag.id : filter)
  );

  return (
    <li className={filterClass} {...props}>
      <div className="flex gap-1">
        {children}
        {title}
      </div>
      <div className="flex w-10 justify-between items-center flex-row-reverse">
        <div className="text-xs">{counter}</div>
        {tag && <div className={`w-2.5 h-2.5 rounded-full ${tag.color}`}></div>}
      </div>
    </li>
  );
};

export default FilterComponent;
