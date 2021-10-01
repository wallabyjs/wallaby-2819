import { assign } from 'lodash';
import ow from 'ow';
import { createMachine } from 'xstate';

const fetch = require('node-fetch');

export async function getNextPage(nextPageUrl) {
  const headers = {
    Authorization: process.env.BEARER_TOKEN || '',
  };
  if (!nextPageUrl) {
    throw new Error('Missing page Url');
  }

	//Start wallaby
	//THEN: Delete this line

  let resp;
  try {
    resp = await fetch(nextPageUrl, {
      headers: headers,
    });
  } catch (err) {
    console.log('🚀 err', err);
    throw err;
  }
  if (resp) {
    const body = await resp.text();

    return body;
  }

  return resp;
}

export const basicMachine = createMachine(
  {
    id: 'basicMachine',
    initial: 'idle',
    context: { data: null },
    states: {
      idle: {
        on: {
          START: 'first',
        },
      },
      first: {
        invoke: {
          src: 'getGoogle',
          onDone: {
            target: 'middle',
            actions: assign({ data: (ctx, ev) => ev.data }),
          },
          onError: {
            target: 'end_error',
          },
        },
      },
      middle: {
        always: {
          target: 'end',
        },
      },
      end: {
        type: 'final',
      },
      end_error: {
        type: 'final',
      },
    },
  },
  {
    services: {
      getGoogle: async (ctx, ev) => {
        return getNextPage('google.com');
      },
      processGoogle: async (ctx, ev) => {
        ow(ctx.data, ow.object.exactShape({ id: ow.string }));
      },
    },
  },
);
