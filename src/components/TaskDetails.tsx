import { FC, KeyboardEvent } from 'react';
import TagComponent from './TagComponent';
import Checkbox from './Checkbox';
import DateChooser from './DateChooser';

const tags: string[] = 'main important best'.split(' ');

interface TaskDetailsProps {}

const TaskDetails: FC<TaskDetailsProps> = () => {
  // Textarea element Auto-height
  const onInput = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    const tgt = event.target;
    tgt.style.height = 'auto';
    tgt.style.height = tgt.scrollHeight + 'px';
  };

  const addTag = () => {};

  return (
    <div className="px-4 py-4 bg-slate-800">
      <div className="flex gap-4 border-b border-slate-500 py-2">
        <Checkbox
          isChecked={false}
          // taskId={4342342}
        />
        <DateChooser />
      </div>
      <div>
        <h2 className="text-lg font-bold py-2">Main task of the week</h2>
        <textarea
          className="bg-slate-700 w-full h-auto focus:outline-none resize-none"
          name="descr"
          placeholder="Description"
          onInput={onInput}
        ></textarea>
        <div className="py-2 flex gap-2">
          {tags.map((item) => (
            <TagComponent tagName={item} key={item} />
          ))}
          <span
            onClick={addTag}
            className="text-cyan-600 px-3 rounded-full border border-cyan-600 text-sm"
          >
            +
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
