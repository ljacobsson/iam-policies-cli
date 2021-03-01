const intrinsicFunctionsMap = require("./intrinsicFunctionMap");

const axios = require("axios").default;
const PolicyTemplatesSchemaUrl =
  "https://raw.githubusercontent.com/awslabs/serverless-application-model/master/samtranslator/policy_templates_data/policy_templates.json";

async function getSAMResources(resource) {
  const servicePrefix = resource.StringPrefix;
  const policies = (await axios.get(PolicyTemplatesSchemaUrl)).data;
  const suggestions = [];
  for (const templateName of Object.keys(policies.Templates)) {
    const template = policies.Templates[templateName];
    let actions = template.Definition.Statement[0].Action;
    if (!Array.isArray(actions)) {
      actions = [actions];
    }
    if (actions.filter((p) => p.startsWith(servicePrefix)).length) {
      suggestions.push({ name: templateName, value: {name: templateName, ...template }});
    }
  }
  return suggestions;
}

async function buildParameters(parameterKeys, resourceType, resourceName) {
  let parameters = {};
  for (const parameterKey of parameterKeys) {
    const intrinsicFunctionKey = `${resourceType}:${parameterKey}`;
    const funcResponse = intrinsicFunctionsMap.get(intrinsicFunctionKey);
    parameters[parameterKey] = {};
      funcResponse.func.splice(1, 0, resourceName);
      const func = funcResponse.func.shift();
      parameters[parameterKey][func] =
        funcResponse.func.length === 1
          ? funcResponse.func[0]
          : funcResponse.func;
  }
  return parameters;
}

function getLambdaFunctions(template) {
  return Object.keys(template.Resources)
    .filter(p => template.Resources[p].Type === "AWS::Serverless::Function")
    .sort();
}

module.exports = {
  getSAMResources,
  buildParameters,
  getLambdaFunctions
};
