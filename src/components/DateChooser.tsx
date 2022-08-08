import { ChangeEvent, useState } from 'react';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import { ReactComponent as Clock } from '../assets/clock.svg';
import { ReactComponent as TimeNo } from '../assets/timeno.svg';
import { ReactComponent as TimeYes } from '../assets/timeyes.svg';

const DateChooser = () => {
  const [taskDate, setTaskDate] = useState<null | Date>(null);
  const [time, setTime] = useState(false);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.checked);
  };

  return (
    <DatePicker
      className={'bg-slate-700 focus:outline-none'}
      selected={taskDate}
      onChange={(date: Date) => setTaskDate(date)}
      dateFormat={time ? 'MMMM d h:mm aa' : 'MMMM d'}
      highlightDates={[new Date()]}
      showTimeInput={time}
      placeholderText="Date?"
    >
      <div className="py-2 px-2">
        <Clock className="h-6 w-6 inline-block" />
        <input
          id="newTaskTime"
          className="hidden"
          type="checkbox"
          onChange={onChange}
        />
        <label className="inline-block align-middle ml-1" htmlFor="newTaskTime">
          {time ? (
            <TimeYes className="h-4 w-4" />
          ) : (
            <TimeNo className="h-4 w-4" />
          )}
        </label>
      </div>
    </DatePicker>
  );
};

export default DateChooser;
