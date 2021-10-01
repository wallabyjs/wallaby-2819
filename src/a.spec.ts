/** @jest-environment setup-polly-jest/jest-environment-node */

import path from 'path';
import { setupPolly } from 'setup-polly-jest';
import { MODES } from '@pollyjs/utils';

import { basicMachine, getNextPage } from './getNextPage';
import { interpret } from 'xstate';

describe('nextPage test', () => {
  let context = setupPolly({
    /* default configuration options */
    mode: MODES.REPLAY,
    recordIfMissing: process.env.POLLY_RECORD || true,
    adapters: [require('@pollyjs/adapter-node-http')],

    persister: require('@pollyjs/persister-fs'),
    persisterOptions: {
      fs: {
        recordingsDir: path.resolve(__dirname, './recordings'),
      },
    },
  });
  it('nextPage test', (done) => {
    context.polly.configure({ recordIfMissing: true });

    getNextPage(`https://www.google.com`).then((resp) => {
      done();
    });
  });
});

describe('nextPage test 2', () => {
  let context = setupPolly({
    /* default configuration options */
    mode: MODES.REPLAY,
    recordIfMissing: process.env.POLLY_RECORD || true,
    adapters: [require('@pollyjs/adapter-node-http')],

    persister: require('@pollyjs/persister-fs'),
    persisterOptions: {
      fs: {
        recordingsDir: path.resolve(__dirname, './recordings'),
      },
    },
  });
  it('nextPage test', (done) => {
    context.polly.configure({ recordIfMissing: true });

    const service = interpret(basicMachine).onTransition((state) => {
      if (state.matches('end')) {
        done();
      }
      if (state.matches('end_error')) {
        //This should not be throwing a timeout
        expect(state.value).toEqual('end');
        done();
      }
    });
    service.start();

    service.send({ type: 'START' });
  });
});
