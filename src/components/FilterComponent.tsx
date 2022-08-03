import { DetailedHTMLProps, FC, HTMLAttributes, ReactNode } from 'react';

interface FilterProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLLIElement>, HTMLLIElement> {
  title: string;
  children?: ReactNode | null;
  tagColor?: string | null;
  total: number;
  selected?: boolean;
}

const FilterComponent: FC<FilterProps> = ({
  title,
  children = null,
  tagColor = null,
  total = 123,
  selected = false,
  ...props
}) => {
  const filterClass = `flex py-2 justify-between rounded ${
    selected ? 'bg-slate-600' : 'hover:bg-slate-700'
  }`;

  return (
    <li className={filterClass} {...props}>
      <div className="flex gap-1">
        {children}
        {title}
      </div>
      <div className="flex w-10 justify-between items-center flex-row-reverse">
        <div className="text-xs">{total}</div>
        {tagColor && (
          <div className={`w-2.5 h-2.5 rounded-full ${tagColor}`}></div>
        )}
      </div>
    </li>
  );
};

export default FilterComponent;
