const inquirer = require("inquirer");
const prompt = inquirer.createPromptModule();

async function text(message, def) {
    const response = await prompt({
        name: "id",
        type: "input",
        message: message,
        default: def
    });
    return response.id;
}

async function confirm(message, def) {
    const response = await prompt({
        name: "id",
        type: "confirm",
        message: message,
        default: def
    });
    return response.id;
}

async function list(message, list) {
    return await listType(message, list, "list");
}

async function checkbox(message, list) {
    return await listType(message, list, "checkbox");
}

async function listType(message, list, type) {
    const response = await prompt({
        name: "id",
        type: type,
        message: message,
        choices: list
    });
    return response.id;
}


module.exports = {
    list,
    checkbox,
    text,
    confirm
}
