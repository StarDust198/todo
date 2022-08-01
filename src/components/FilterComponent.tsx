import { FC, ReactNode } from 'react';

interface FilterProps {
  title: string;
  children?: ReactNode | null;
  color?: string | null;
  total: number;
  selected?: boolean;
}

const FilterComponent: FC<FilterProps> = ({
  title,
  children = null,
  color = null,
  total = 123,
  selected = false,
}) => {
  const filterClass = `flex py-2 justify-between rounded ${
    selected ? 'bg-slate-600' : 'hover:bg-slate-700'
  }`;

  return (
    <li className={filterClass}>
      <div className="flex gap-1 align-middle">
        {children}
        {title}
      </div>
      <div className="flex gap-1 align-middle pr-1">
        {color && color}
        <span className="text-xs">{total}</span>
      </div>
    </li>
  );
};

export default FilterComponent;
