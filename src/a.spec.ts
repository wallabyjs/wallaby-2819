/** @jest-environment setup-polly-jest/jest-environment-node */

import path from "path";
import { setupPolly } from "setup-polly-jest";
import { MODES } from "@pollyjs/utils";

import { getNextPage } from "./getNextPage";

describe("nextPage test", () => {
  let context = setupPolly({
    /* default configuration options */
    mode: MODES.REPLAY,
    recordIfMissing: process.env.POLLY_RECORD || true,
    adapters: [require("@pollyjs/adapter-node-http")],

    persister: require("@pollyjs/persister-fs"),
    persisterOptions: {
      fs: {
        recordingsDir: path.resolve(__dirname, "./recordings"),
      },
    },
  });
  it("nextPage test", (done) => {
    context.polly.configure({ recordIfMissing: true });

    getNextPage(`https://www.google.com`).then((resp) => {      
      done();
    });
  });
});
