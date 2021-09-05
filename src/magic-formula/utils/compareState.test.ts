import {compareState} from './compareState';
import {CoreCompany} from '../../common/companies';

const OLD_STATE: CoreCompany[] = [{
  name: 'Old 1',
  ticker: 'OLD1',
}, {
  name: 'Old 2',
  ticker: 'OLD2',
}];

const NEW_STATE: CoreCompany[] = [{
  name: 'New 1',
  ticker: 'NEW1',
}, {
  name: 'New 2',
  ticker: 'NEW2',
}];

describe('compareState', () => {
  const makeResult = (added: any, removed: any, combined?: any) =>
    ({added, removed, combined});

  it('should do nothing for empty inputs', () => {
    expect(compareState([], [])).toEqual(makeResult([], [], []));
  });

  it('should say all removed if new is empty', () => {
    expect(compareState(OLD_STATE, [])).toEqual(makeResult([], OLD_STATE, []));
  });

  it('should say all added if old is empty', () => {
    expect(compareState([], NEW_STATE)).toEqual(makeResult(NEW_STATE, [], NEW_STATE));
  });

  it('should return all if states are completely different', () => {
    expect(compareState(OLD_STATE, NEW_STATE)).toEqual(makeResult(NEW_STATE, OLD_STATE, NEW_STATE));
  });

  it('should return nothing if states are completely the same', () => {
    expect(compareState(OLD_STATE, OLD_STATE)).toEqual(makeResult([], [], OLD_STATE));
  });

  it('should ignore identical elements', () => {
    expect(compareState(
      OLD_STATE.concat({name: 'Same 1', ticker: 'ASAME'}),
      NEW_STATE.concat({name: 'Same 1', ticker: 'ASAME'})
    )).toEqual(makeResult(NEW_STATE, OLD_STATE, [
      {name: 'Same 1', ticker: 'ASAME'},
      {name: 'New 1', ticker: 'NEW1'},
      {name: 'New 2', ticker: 'NEW2'},
    ]));
  });
});
