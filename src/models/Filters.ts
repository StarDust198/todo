export enum Filters {
  TODAY = 'Today ',
  WEEK = 'This week',
  INCOMING = 'Incoming ',
  COMPLETED = 'Completed ',
  DELETED = 'Deleted ',
}

export class FilterGroup {
  public incoming: string[];
  public completed: string[];
  public overdue: string[];
  public deleted: string[];

  constructor() {
    this.incoming = [];
    this.completed = [];
    this.overdue = [];
    this.deleted = [];
  }
}
