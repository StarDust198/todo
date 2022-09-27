import { Colors, randomColor } from './Colors';

export interface ITag {
  id: string;
  color: Colors;
}

export class Tag implements ITag {
  readonly id: string;
  readonly color: Colors;

  constructor(id: string) {
    this.id = id;
    this.color = randomColor();
  }
}
