export class Conversation {
  constructor({ id, kbId, messages, createdAt }) {
    this.id = id;
    this.kbId = kbId;
    this.messages = messages || []; // array of { role: 'user'|'model', content: string }
    this.createdAt = createdAt || new Date();
  }
}
