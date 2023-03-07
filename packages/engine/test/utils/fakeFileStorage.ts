import {FileStorage} from '../../src/storage/file';
import {clone} from 'ramda';

type FakeFileStorage<T> = FileStorage<T> & { data: T | null; };

export const fakeFileStorage = <T>(init: T | null): FakeFileStorage<T> => {
  return {
    data: init ? clone(init) : init,
    async read() {
      return clone(this.data);
    },
    async write(data: T) {
      this.data = clone(data);
    }
  };
};