export class KnowledgeBase {
  constructor({ id, name, description, createdAt }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.createdAt = createdAt || new Date();
  }
}
