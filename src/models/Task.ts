export interface ITask {
  id: string;
  date?: string;
  time?: boolean;
  title: string;
  description: string;
  completed: boolean;
  deleted?: boolean;
  tags: string[];
  timeMatches?: boolean;
}

export class Task implements ITask {
  readonly id: string;
  date: string;
  time: boolean;
  title: string;
  description: string;
  completed: boolean;
  deleted: boolean;
  tags: string[];
  timeMatches: boolean;

  constructor({
    title,
    id = undefined,
    tags = [],
    date,
    time = false,
    description = '',
    completed = false,
    deleted = false,
  }: {
    title: string;
    id?: string | undefined;
    tags?: string[];
    date?: Date | null;
    time?: boolean;
    description?: string;
    completed?: boolean;
    deleted?: boolean;
  }) {
    this.id = id ? id : new Date().getTime().toString();
    this.date = date ? (time ? date : this.adjustDate(date)).toISOString() : '';
    this.time = time;

    [this.title, this.tags] = this.parseTitle(title);
    this.tags.push(...tags);

    this.completed = completed;
    this.deleted = deleted;
    this.description = description;
    this.timeMatches = true;
  }

  // function splitting string into title and tags
  private parseTitle(str: string): [string, string[]] {
    const inputArr = str.split('#');
    let taskTitle = inputArr[0];

    const tagsArr = inputArr.slice(1);
    tagsArr.forEach((item, i) => {
      const spaceStart = item.indexOf(' ');
      if (spaceStart !== -1) {
        taskTitle += item.slice(spaceStart);
        tagsArr[i] = item.slice(0, spaceStart);
      }
    });

    return [taskTitle.trim().replace(/\s{2,}/gm, ` `), tagsArr];
  }

  private adjustDate(date: Date): Date {
    return new Date(
      new Date(new Date(new Date(date).setHours(23)).setMinutes(59)).setSeconds(
        59
      )
    );
  }
}
