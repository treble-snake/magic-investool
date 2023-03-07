import {readFile, writeFile} from 'fs/promises';
import {logger} from '../common/logging/logger';
import path from 'path';
import {STORAGE_DIR} from '../common/config';

export const makeFileStorage =
  <T>(filename: string, directory = STORAGE_DIR): FileStorage<T> => {
    return new JsonFileStorage<T>(path.join(directory, filename));
  };

export interface FileStorage<T> {
  read(): Promise<T | null>;

  write(data: T): Promise<void>;
}

// Maybe add cache?
export class JsonFileStorage<T> implements FileStorage<T> {
  constructor(
    private readonly file: string
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