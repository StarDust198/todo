import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateChooser = () => {
  const [taskDate, setTaskDate] = useState<null | Date>(null);
  const [time, setTime] = useState<null | Date>(null);

  // fix any type here!
  // also doesnt change tme in the main date
  const TimeInput = ({ date, value, onChange }: any) => (
    <DatePicker
      selected={time}
      onChange={(date: Date) => setTime(date)}
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={30}
      timeCaption=""
      dateFormat="h:mm aa"
      placeholderText="Time?"
      className="focus:outline-none"
    />
  );

  return (
    <>
      <DatePicker
        className={'bg-slate-700 focus:outline-none'}
        selected={taskDate}
        onChange={(date: Date) => setTaskDate(date)}
        dateFormat={time ? 'MM/dd/yyy h:mm aa' : 'MM/dd/yyy'}
        showTimeInput
        placeholderText="Date?"
        customTimeInput={<TimeInput />}
      />
      {/* <div>
        <div>{`${taskDate}`}</div>
        <div>{`${time}`}</div>
      </div> */}
    </>
  );
};

export default DateChooser;
