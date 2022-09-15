import { KeyboardEvent, useState } from 'react';
import { useAppDispatch } from '../app/hooks';
import { addNewTask } from '../app/tasksSlice';
import { Task } from '../models/Task';

import DatePicker from 'react-datepicker';
import TimeCheckbox from './TimeCheckbox';

const AddTaskInput = () => {
  const [title, setTitle] = useState('');
  const [addRequestStatus, setAddRequestStatus] = useState('idle');
  const [taskDate, setTaskDate] = useState<null | Date>(null);
  const [time, setTime] = useState(false);

  const dispatch = useAppDispatch();

  const onTitleChanged = (e: KeyboardEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const onSwitchTime = () => {
    setTime((time) => !time);
  };

  const canSave = Boolean(title) && addRequestStatus === 'idle';

  const onTaskAdd = async () => {
    // console.log(
    //   taskDate &&
    //     new Date(
    //       new Date(
    //         new Date(new Date(taskDate))
    //         // .setHours(23)).setMinutes(59)).setSeconds(59)
    //       ).toISOString()
    //     ).getDate()
    // );
    if (canSave) {
      const newTask = new Task({
        title,
        date: taskDate,
        time,
      });
      try {
        setAddRequestStatus('pending');
        await dispatch(addNewTask(newTask)).unwrap();
        setTitle('');
      } catch (err) {
        console.error('Failed to add new task: ', err);
      } finally {
        setAddRequestStatus('idle');
      }
    }
  };

  return (
    <div className="flex border-b border-slate-500 py-2">
      <input
        type="text"
        className="bg-slate-700 focus:outline-none w-2/3 mr-4"
        placeholder="Add new task"
        onKeyPress={(e: KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            onTaskAdd();
          }
        }}
        value={title}
        onChange={onTitleChanged}
      />
      <div className="w-1/3">
        <DatePicker
          className={'bg-slate-700 focus:outline-none'}
          selected={taskDate}
          onChange={(date: Date) => setTaskDate(date)}
          dateFormat={time ? 'MMMM d h:mm aa' : 'MMMM d'}
          highlightDates={[new Date()]}
          showTimeInput={time}
          placeholderText="Date?"
        >
          <TimeCheckbox time={time} switchTime={onSwitchTime} />
        </DatePicker>
      </div>
    </div>
  );
};

export default AddTaskInput;
