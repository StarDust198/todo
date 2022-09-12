import { FC, FocusEvent, KeyboardEvent, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';

import type { RootState } from '../app/store';
import { updateTask, selectTaskById } from '../app/tasksSlice';
import { addNewTag, selectTagNames } from '../app/filtersSlice';

import TagComponent from './TagComponent';
import Checkbox from './Checkbox';
import DateChooser from './DateChooser';
import { Tag } from '../models/Tag';

interface TaskDetailsProps {}

const TaskDetails: FC<TaskDetailsProps> = () => {
  const dispatch = useAppDispatch();

  const task = useAppSelector((state: RootState) =>
    selectTaskById(state, state.tasks.selectedTask)
  );
  const existingTags = useAppSelector((state: RootState) =>
    selectTagNames(state)
  );

  const [description, setDescription] = useState(task ? task.description : '');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (task) setDescription(task.description);
    setNewTag('');
  }, [task]);

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
        dispatch(updateTask({ ...task, tags: [...task.tags, tgt.value] }));
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
      <h2 className="px-4 py-4 bg-slate-800 text-center">
        Select task from the list
      </h2>
    );

  return (
    <div className="px-4 py-4 bg-slate-800">
      <div className="flex gap-4 border-b border-slate-500 py-2">
        <Checkbox
          isChecked={task.completed}
          // taskId={4342342}
        />
        <DateChooser />
      </div>
      <div>
        <h2 className="text-lg font-bold py-2">{task.title}</h2>
        <textarea
          className="bg-slate-700 w-full h-auto focus:outline-none resize-none"
          name="descr"
          placeholder="Description"
          onInput={onDescrInput}
          value={description}
          onBlur={() => dispatch(updateTask({ ...task, description }))}
        />
        <div className="py-2 flex flex-wrap gap-2">
          {task.tags.map((item) => (
            <TagComponent tagName={item} key={item} />
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
      </div>
    </div>
  );
};

export default TaskDetails;
