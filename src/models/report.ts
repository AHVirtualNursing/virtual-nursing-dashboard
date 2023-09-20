export class Report {
  _id: string;
  content: string;

  constructor(_id: string, content: string) {
    this._id = _id;
    this.content = content;
  }
}
