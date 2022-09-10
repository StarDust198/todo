import { KeyboardEvent, useState } from 'react';
import { useAppDispatch } from '../app/hooks';
import { addNewTask } from '../app/tasksSlice';
import { Task } from '../models/Task';

import DateChooser from './DateChooser';

const AddTaskInput = () => {
  const [title, setTitle] = useState('');
  const [addRequestStatus, setAddRequestStatus] = useState('idle');

  const dispatch = useAppDispatch();

  const onTitleChanged = (e: KeyboardEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const canSave = Boolean(title) && addRequestStatus === 'idle';

  const onTaskAdd = async () => {
    if (canSave) {
      try {
        setAddRequestStatus('pending');
        await dispatch(addNewTask(new Task(title))).unwrap();
        setTitle('');
      } catch (err) {
        console.error('Failed to save the task: ', err);
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
        <DateChooser />
      </div>
    </div>
  );
};

export default AddTaskInput;
