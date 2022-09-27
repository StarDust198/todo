import { FC, FocusEvent, KeyboardEvent, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import DatePicker from 'react-datepicker';
import formatRelative from 'date-fns/formatRelative';

import type { RootState } from '../app/store';
import {
  updateTask,
  selectTaskById,
  switchCompletionTask,
} from '../app/tasksSlice';
import { addNewTag, selectTagNames } from '../app/filtersSlice';

import TagComponent from './TagComponent';
import Checkbox from './Checkbox';
import TimeCheckbox from './TimeCheckbox';

import { Tag } from '../models/Tag';

interface TaskDetailsProps {}

const TaskDetails: FC<TaskDetailsProps> = () => {
  const [taskDate, setTaskDate] = useState<null | Date>(null);
  const [time, setTime] = useState(false);
  const dispatch = useAppDispatch();

  const task = useAppSelector((state: RootState) =>
    selectTaskById(state, state.tasks.activeTask)
  );
  const existingTags = useAppSelector(selectTagNames);

  const [description, setDescription] = useState(task ? task.description : '');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (task) {
      setDescription(task.description);
      setTime(task.time);
      setTaskDate(task.date ? new Date(task.date) : null);
    }
    setNewTag('');
  }, [task]);

  const onDateChange = (date: Date) => {
    if (task) {
      dispatch(
        updateTask({ taskId: task.id, changes: { date: date.toISOString() } })
      );
      setTaskDate(date);
    }
  };

  const onSwitchTime = () => {
    if (task) {
      dispatch(updateTask({ taskId: task.id, changes: { time: !time } }));
      setTime((time) => !time);
    }
  };

  // Textarea element Auto-height
  const onDescrInput = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    const tgt = event.target;
    tgt.style.height = 'auto';
    tgt.style.height = tgt.scrollHeight + 'px';
    setDescription(tgt.value);
  };

  const onTagInput = (event: KeyboardEvent<HTMLInputElement>) => {
    const tgt = event.target;

    // New tag input auto-width
    const tempSpan = document.createElement('span');
    tempSpan.classList.add('text-sm', 'invisible');
    tempSpan.textContent = tgt.value;
    document.body.append(tempSpan);
    tgt.style.width = `${tempSpan.getBoundingClientRect().width}px`;
    tempSpan.remove();

    // Tag filtering
    setNewTag(tgt.value.replace(/[^(\d|\w)]/g, ''));
  };

  const checkTagInput = (tgt: HTMLInputElement) => {
    if (tgt.value === '') tgt.style.width = '';
    if (tgt.value && !existingTags.includes(tgt.value))
      dispatch(addNewTag(new Tag(tgt.value)));
    if (tgt.value && task)
      if (!task.tags.includes(tgt.value)) {
        dispatch(
          updateTask({
            taskId: task.id,
            changes: { tags: [...task.tags, tgt.value] },
          })
        );
      } else {
        setNewTag('');
        tgt.style.width = '';
      }
  };

  const onBlurTag = (event: FocusEvent<HTMLInputElement>) => {
    const tgt = event.target;
    checkTagInput(tgt);
  };

  const onKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    const key = event.key;
    const tgt = event.target;
    switch (key) {
      case 'Escape':
        setNewTag('');
        tgt.style.width = '';
        break;
      case 'Enter':
        checkTagInput(tgt);
        break;
      case 'Space':
        checkTagInput(tgt);
        break;
      default:
        break;
    }
  };

  if (!task)
    return (
      <h2 className="p-4 bg-slate-800 text-center">
        Select task from the list
      </h2>
    );

  return (
    <div className="px-4 py-4 bg-slate-800">
      <div className="flex gap-4 border-b border-slate-500 py-2">
        <Checkbox
          isChecked={!!task.completed}
          onClick={() => dispatch(switchCompletionTask(task.id))}
        />
        <DatePicker
          className={'bg-slate-700 focus:outline-none'}
          selected={taskDate}
          onChange={onDateChange}
          dateFormat={time ? 'MMMM d h:mm aa' : 'MMMM d'}
          highlightDates={[new Date()]}
          showTimeInput={time}
          placeholderText="Date?"
        >
          <TimeCheckbox time={time} switchTime={onSwitchTime} />
        </DatePicker>
      </div>
      <div>
        <h2 className="text-lg font-bold py-2">{task.title}</h2>
        <textarea
          className="bg-slate-700 w-full h-auto focus:outline-none resize-none"
          name="descr"
          placeholder="Description"
          onInput={onDescrInput}
          value={description}
          onBlur={(e) =>
            dispatch(updateTask({ taskId: task.id, changes: { description } }))
          }
        />
        <div className="py-2 flex flex-wrap gap-2">
          {task.tags.map((item) => (
            <TagComponent
              tagName={item}
              key={item}
              removeTag={() =>
                dispatch(
                  updateTask({
                    taskId: task.id,
                    changes: {
                      tags: [...task.tags.filter((tag) => tag !== item)],
                    },
                  })
                )
              }
            />
          ))}
          <span className="text-cyan-600 px-3 rounded-full border border-cyan-600 text-sm">
            <input
              className="bg-slate-800 w-2 text-white focus:outline-none"
              type="text"
              placeholder="+"
              value={newTag}
              onInput={onTagInput}
              onBlur={onBlurTag}
              onKeyDown={onKeyPress}
            />
          </span>
        </div>
        {task.completed && (
          <div className="text-xs opacity-50">
            Completed: {formatRelative(new Date(task.completed), new Date())}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetails;
