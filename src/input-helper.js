const inquirer = require("inquirer");
inquirer.registerPrompt(
  "autocomplete",
  require("inquirer-autocomplete-prompt")
);

const prompt = inquirer.createPromptModule();

async function text(message, def) {
  const response = await prompt({
    name: "id",
    type: "input",
    message: message,
    default: def,
  });
  return response.id;
}

async function confirm(message, def) {
  const response = await prompt({
    name: "id",
    type: "confirm",
    message: message,
    default: def,
  });
  return response.id;
}

async function list(message, list) {
  return await listType(message, list, "autocomplete");
}

async function checkbox(message, list) {
  return await listType(message, list, "checkbox");
}

async function listType(message, list, type) {
  const response = await inquirer.prompt({
    name: "id",
    type: type,
    message: message,
    choices: list,
    source: function (answersYet, input) {
      if (!input) {
        return list;
      }
      
      return list.filter((p) => !p.name || p.name.toLowerCase().includes(input.toLowerCase()));
    },
  });
  return response.id;
}

const NOT_TEMPLATED = "Not templated";
async function selectResource(resources) {
  return (
    await prompt({
      name: "id",
      type: "list",
      message: `Select resource to grant access to`,
      choices: [...resources, NOT_TEMPLATED],
    })
  ).id;
}

module.exports = {
  list,
  checkbox,
  text,
  confirm,
  selectResource,
  NOT_TEMPLATED,
};
