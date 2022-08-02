export class Tag {
  readonly id: string;
  readonly title: string;
  color: string;

  constructor(title: string) {
    this.id =
      new Date().getTime().toString(36) + Math.random().toString(36).slice(2);
    this.title = title;
    this.color = 'green';
  }
}
