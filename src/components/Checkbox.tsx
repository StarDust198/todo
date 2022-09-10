import { DetailedHTMLProps, FC, HTMLAttributes } from 'react';
import { ReactComponent as Checked } from '../assets/checkbox.svg';
import { ReactComponent as Unchecked } from '../assets/unchecked.svg';

interface CheckboxProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
  isChecked: boolean;
}

const Checkbox: FC<CheckboxProps> = ({ isChecked, ...props }): JSX.Element => {
  return (
    <span {...props}>
      {isChecked ? (
        <Checked className="h-6 w-6" />
      ) : (
        <Unchecked className="h-6 w-6" />
      )}
    </span>
  );
};

export default Checkbox;
