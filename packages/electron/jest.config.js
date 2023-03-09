// import {InitialOptionsTsJest} from 'ts-jest/dist/types';
// /** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */

/** @type {InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['./test/jest.setup.js'],
  coverageReporters: ['text'],
  collectCoverageFrom: [
    // TODO: CI fails on more coverage; figure this out
    //      https://github.com/facebook/jest/issues/9324
    'src/*.ts',
    '!src/libs/**',
    '!src/routes/**'
  ]
};