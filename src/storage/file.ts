import {readFile, writeFile} from 'fs/promises';
import {logger} from '../common/logging/logger';
import path from 'path';
import {STORAGE_DIR} from '../common/config';

export const makeFileStorage = <T> (filename: string, directory = STORAGE_DIR) => {
  return new FileStorage<T>(path.join(directory, filename));
}

export class FileStorage<T> {
  constructor(
    readonly file: string
  ) {
  }

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
    return writeFile(this.file, JSON.stringify(data));
  }
}