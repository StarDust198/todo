import { ChangeEvent, FC, useState } from 'react';
import { ReactComponent as Checked } from '../assets/checkbox.svg';
import { ReactComponent as Unchecked } from '../assets/unchecked.svg';

interface CheckboxProps {
  id: number;
  isChecked?: boolean;
}

const Checkbox: FC<CheckboxProps> = ({
  id,
  isChecked = false,
}): JSX.Element => {
  const [checked, setChecked] = useState(isChecked);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
  };

  const cbId = `task${id}`;

  return (
    <>
      <input id={cbId} className="hidden" type="checkbox" onChange={onChange} />
      <label className="inline-block" htmlFor={cbId}>
        {checked ? (
          <Checked className="h-6 w-6" />
        ) : (
          <Unchecked className="h-6 w-6" />
        )}
      </label>
    </>
  );
};

export default Checkbox;
