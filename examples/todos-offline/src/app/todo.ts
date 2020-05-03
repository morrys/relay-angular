export class Todo {
  id: number;
  text = '';
  complete = false;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
