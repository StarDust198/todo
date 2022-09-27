export interface ITask {
  id: string;
  date: string;
  time: boolean;
  title: string;
  description: string;
  completed: string;
  deleted: boolean;
  tags: string[];
}

export class Task implements ITask {
  readonly id: string;
  date: string;
  time: boolean;
  title: string;
  description: string;
  completed: string;
  deleted: boolean;
  tags: string[];

  constructor({
    title,
    id = '',
    tags = [],
    date = '',
    time = false,
    description = '',
    completed = '',
    deleted = false,
  }: {
    title: string;
    id?: string;
    tags?: string[];
    date?: string;
    time?: boolean;
    description?: string;
    completed?: string;
    deleted?: boolean;
  }) {
    this.id = id ? id : new Date().getTime().toString();
    this.date = time || !date ? date : this.adjustDate(date);
    this.time = time;

    [this.title, this.tags] = this.parseTitle(title);
    this.tags.push(...tags);

    this.completed = completed;
    this.deleted = deleted;
    this.description = description;
    this.completed = completed;
  }

  // function splitting string into title and tags
  private parseTitle(str: string): [string, string[]] {
    const tagsArr = Array.from(str.matchAll(/#(\d|\w)*/g)).map((item) =>
      item[0].slice(1)
    );
    return [str.replace(/#(\d|\w)*/g, ''), tagsArr];
  }

  private adjustDate(date: string): string {
    return new Date(
      new Date(new Date(date).setHours(23)).setMinutes(59)
    ).toISOString();
  }
}
