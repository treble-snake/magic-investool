import {parseHtml} from './parseHtml';
import {readFileSync} from 'fs';

describe('parseHtml', function () {
  it('should return nothing on empty input', () => {
    expect(parseHtml('')).toEqual([]);
  });

  it('should extract company name and ticker', () => {
    expect(parseHtml(readFileSync('test/fixtures/example.html').toString()))
      .toEqual([
        {
          name: 'Test 1',
          ticker: 'TSO'
        },
        {
          name: 'Test 2&2',
          ticker: 'TST'
        }
      ]);
  });
});