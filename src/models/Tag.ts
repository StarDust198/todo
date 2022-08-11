import { Colors, randomColor } from './Colors';

export interface ITag {
  id: string;
  color: Colors;
}

export class Tag implements ITag {
  // readonly id: string;
  readonly id: string;
  readonly color: Colors;

  constructor(id: string) {
    // this.id =
    //   new Date().getTime().toString(36) + Math.random().toString(36).slice(2);
    this.id = id;
    this.color = randomColor();
  }
}
