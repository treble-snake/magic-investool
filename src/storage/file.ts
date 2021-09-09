import {readFile, writeFile} from 'fs/promises';
import {logger} from '../common/logging/logger';

export class FileStorage<T> {
  constructor(
    readonly file: string
  ) {}

  async read() {
    try {
      const fd = await readFile(this.file);
      return JSON.parse(fd.toString()) as T;
    } catch (e) {
      logger.warn(`Failed to read file ${this.file}:`, e);
      return null;
    }
  }
  async write(data: T) {
    console.warn(`writing to ${this.file}`);
    return writeFile(this.file, JSON.stringify(data));
  }
}