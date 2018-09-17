const execa = require("execa");

const options = ["diff", "--name-only", "HEAD^", "HEAD"];

module.exports = async () => {
  const { stdout } = await execa("git", options);
  return stdout.split("\n");
};

module.exports.sync = () => {
  const { stdout } = execa.sync("git", options);
  return stdout.split("\n");
};
