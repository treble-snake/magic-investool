import {compareState} from '../../src/magic-formula/utils/compareState';
import {completeCompanyData} from '../../src/enrichment/completeCompanyData';
import {omit} from 'ramda';

const OLD_STATE = [
  completeCompanyData({
    name: 'Old 1',
    ticker: 'OLD1',
  }),
  completeCompanyData({
    name: 'Old 2',
    ticker: 'OLD2',
  })
];

const NEW_STATE = [{
  name: 'New 1',
  ticker: 'NEW1',
}, {
  name: 'New 2',
  ticker: 'NEW2',
}];

describe('compareState', () => {
  it('should do nothing for empty inputs', () => {
    expect(compareState([], [])).toEqual(({
      added: [],
      removed: [],
      combined: []
    }));
  });

  it('should say all removed if new is empty', () => {
    expect(compareState(OLD_STATE, [])).toEqual(({
      added: [],
      removed: OLD_STATE,
      combined: []
    }));
  });

  it('should say all added if old is empty', () => {
    expect(compareState([], NEW_STATE)).toEqual(({
      added: NEW_STATE,
      removed: [],
      combined: NEW_STATE
    }));
  });

  it('should return all if states are completely different', () => {
    expect(compareState(OLD_STATE, NEW_STATE)).toEqual(({
      added: NEW_STATE,
      removed: OLD_STATE,
      combined: NEW_STATE
    }));
  });

  it('should return nothing if states are completely the same', () => {
    expect(compareState(OLD_STATE, OLD_STATE)).toEqual(({
      added: [],
      removed: [],
      combined: OLD_STATE
    }));
  });

  it('should ignore identical elements', () => {
    expect(compareState(
      OLD_STATE.concat(completeCompanyData({name: 'Same 1', ticker: 'ASAME'})),
      NEW_STATE.concat({name: 'Same 1', ticker: 'ASAME'})
    )).toEqual(({
      added: NEW_STATE, removed: OLD_STATE, combined: [
        expect.objectContaining(
          omit(['lastUpdated'], completeCompanyData({
            name: 'Same 1',
            ticker: 'ASAME'
          }))
        ),
        {name: 'New 1', ticker: 'NEW1'},
        {name: 'New 2', ticker: 'NEW2'},
      ]
    }));
  });
});
