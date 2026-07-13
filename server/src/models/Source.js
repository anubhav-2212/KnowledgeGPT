export class Source {
  constructor({ id, kbId, name, type, content, createdAt }) {
    this.id = id;
    this.kbId = kbId;
    this.name = name;
    this.type = type; // e.g. 'pdf', 'website', 'text'
    this.content = content;
    this.createdAt = createdAt || new Date();
  }
}
