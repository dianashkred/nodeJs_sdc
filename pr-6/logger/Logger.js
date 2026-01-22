const os = require("os");

class Logger {
  #isVerboseModeEnabled = false;
  #isQuietModeEnabled = false;

  constructor(verbose = false, quiet = false) {
    this.#isVerboseModeEnabled = verbose;
    this.#isQuietModeEnabled = quiet;
  }

  log(...data) {
    if (this.#isQuietModeEnabled) return;

    const timestamp = new Date().toISOString();

    if (!this.#isVerboseModeEnabled) {
      console.log(`[${timestamp}]`, ...data);
      return;
    }

    console.log(
      `[${timestamp}]`,
      ...data,
      "\n--- System Info ---",
      "\nPlatform:", os.platform(),
      "\nCPU:", os.cpus()[0].model,
      "\nTotal memory:", os.totalmem(),
      "\nFree memory:", os.freemem(),
      "\n-------------------"
    );
  }
}

module.exports = Logger;
