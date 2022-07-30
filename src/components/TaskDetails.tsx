import { FC, KeyboardEvent } from 'react';
import Checkbox from './Checkbox';

// const checkbox = require('../assets/checkbox.svg') as string;
// const unchecked = require('../assets/unchecked.svg') as string;

const tags: string[] = 'tag1 tag2 tag3'.split(' ');

interface TaskDetailsProps {}

const TaskDetails: FC<TaskDetailsProps> = () => {
  const onInput = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    const tgt = event.target;
    tgt.style.height = 'auto';
    tgt.style.height = tgt.scrollHeight + 'px';
  };

  return (
    <div className="px-4 py-4 bg-slate-800">
      <div className="flex gap-4 border-b border-slate-500 py-2">
        <Checkbox />

        <input className="bg-slate-700" type="date" />
      </div>
      <div>
        <h2 className="text-lg font-bold py-2">Main task of the week</h2>
        <textarea
          className="bg-slate-700 w-full h-auto focus:outline-none"
          name="descr"
          placeholder="Description"
          onInput={onInput}
        ></textarea>
        <div className="py-2">
          {tags.map((item) => (
            <span
              key={item}
              className="bg-yellow-800 p-1 rounded-full text-sm mr-2"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
