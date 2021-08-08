// import {InitialOptionsTsJest} from 'ts-jest/dist/types';
// /** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */

/** @type {InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.{ts,js}'
  ]
};