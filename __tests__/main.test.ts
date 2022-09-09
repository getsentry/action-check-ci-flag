import * as process from 'process';
import * as cp from 'child_process';
import * as path from 'path';
import {parseFlagList, checkTextForFlag} from '../src/main';

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  const ip = path.join(__dirname, '..', 'lib', 'main.js');
  const options: cp.ExecSyncOptions = {env: process.env};
  cp.execSync(`node ${ip}`, options).toString();
});

test('parses lists of flags', () => {
  expect(parseFlagList('')).toEqual([]);
  expect(parseFlagList(' ')).toEqual([]);
  expect(parseFlagList('foo')).toEqual(['foo']);
  expect(parseFlagList(' foo')).toEqual(['foo']);
  expect(parseFlagList('foo ')).toEqual(['foo']);
  expect(parseFlagList(' foo ')).toEqual(['foo']);
  expect(parseFlagList('foo,bar,baz')).toEqual(['foo', 'bar', 'baz']);
  expect(parseFlagList('foo, bar , baz')).toEqual(['foo', 'bar', 'baz']);
  expect(parseFlagList('foo bar  baz')).toEqual(['foo', 'bar', 'baz']);
});

test('finds flags from text', () => {
  function placeBetweenParagraphs(t: string) {
    return `Some text\n\n${t}\n\nSome other text`;
  }

  expect(checkTextForFlag('', '', '')).toBe(false);
  expect(checkTextForFlag('foo', 'My flag', 'My flag foo')).toBe(true);
  expect(checkTextForFlag('foo', 'My flag', 'My flag: foo')).toBe(true);
  expect(checkTextForFlag('foo', 'My flag', 'My flag')).toBe(false);
  expect(checkTextForFlag('foo', 'My flag', 'My flag: ')).toBe(false);
  expect(checkTextForFlag('foo', 'My flag', 'mY fLaG: foo')).toBe(true);
  expect(checkTextForFlag('foo', 'My flag', '  My flag:  foo ')).toBe(true);
  expect(checkTextForFlag('foo', 'My flag', 'My flag: baz,foo')).toBe(true);
  expect(checkTextForFlag('foo,bar', 'My flag', 'My flag: foo,qux')).toBe(true);
  expect(checkTextForFlag('foo', 'My flag', 'My flag: bar,baz')).toBe(false);

  expect(
    checkTextForFlag('foo', 'My flag', placeBetweenParagraphs('My flag: foo'))
  ).toBe(true);
  expect(
    checkTextForFlag(
      'foo',
      'My flag',
      placeBetweenParagraphs('My flag: bar,baz')
    )
  ).toBe(false);
});
