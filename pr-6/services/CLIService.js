const args = process.argv.slice(2);

module.exports = {
  verbose: args.includes("--verbose"),
  quiet: args.includes("--quiet"),
};
