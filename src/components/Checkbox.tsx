import { ChangeEvent, useState } from 'react';
import { ReactComponent as Checked } from '../assets/checkbox.svg';
import { ReactComponent as Unchecked } from '../assets/unchecked.svg';

const Checkbox = () => {
  const [checked, setChecked] = useState(false);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
  };

  return (
    <>
      <input id="task" className="hidden" type="checkbox" onChange={onChange} />
      <label htmlFor="task">
        {/*  */}
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
