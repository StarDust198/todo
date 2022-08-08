import { Colors, randomColor } from './Colors';

export interface ITag {
  title: string;
  color: Colors;
}

export class Tag implements ITag {
  // readonly id: string;
  readonly title: string;
  readonly color: Colors;

  constructor(title: string) {
    // this.id =
    //   new Date().getTime().toString(36) + Math.random().toString(36).slice(2);
    this.title = title;
    this.color = randomColor();
  }
}
