import { addNewTag, selectTagNames } from '../app/tagsSlice';
import { Tag } from './Tag';
import store from '../app/store';

const { getState, dispatch } = store;

export interface ITask {
  id: number;
  date?: Date | null;
  time?: boolean;
  title: string;
  description?: string;
  completed?: boolean;
  deleted?: boolean;
  tags: string[];
  timeMatches?: boolean;
}

export class Task implements ITask {
  readonly id: number;
  date: Date | null;
  time: boolean;
  title: string;
  description: string;
  completed: boolean;
  deleted: boolean;
  tags: string[];
  timeMatches: boolean;

  constructor(
    title: string,
    date: string | undefined = undefined,
    time: boolean = false
  ) {
    this.id = new Date().getTime();
    this.date = date ? new Date(date) : null;
    this.time = time;
    [this.title, this.tags] = this.splitTitle(title);
    this.completed = false;
    this.deleted = false;
    this.description = '';
    this.timeMatches = true;
  }

  // function splitting string into title and tags
  private splitTitle(str: string): [string, string[]] {
    const existingTags = selectTagNames(getState());
    const inputArr = str.split('#');
    let taskTitle = inputArr[0];

    const tagsArr = inputArr.slice(1);
    tagsArr.forEach((item, i) => {
      const spaceStart = item.indexOf(' ');
      if (spaceStart !== -1) {
        taskTitle += item.slice(spaceStart);
        tagsArr[i] = item.slice(0, spaceStart);
      }
      if (!existingTags.includes(tagsArr[i])) {
        const newTag = new Tag(tagsArr[i]);
        dispatch(addNewTag(newTag));
      }
    });

    return [taskTitle.trim().replace(/\s{2,}/gm, ` `), tagsArr];
  }
}
