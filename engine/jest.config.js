// import {InitialOptionsTsJest} from 'ts-jest/dist/types';
// /** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */

/** @type {InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['./test/jest.setup.js'],
  collectCoverageFrom: [
    'src/**/*.{ts,js}'
  ]
};