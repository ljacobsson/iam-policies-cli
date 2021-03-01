const fs = require("fs");
const path = require("path");

const intrinsicMap = require("../data/cfn-return-values.json");
const cfnSchema = require("../data/us-east-1.json");

function translateSAMResourceType(resourceType) {
  switch (resourceType) {
    case "AWS::Serverless::Function":
      return "AWS::Lambda::Function";
    case "AWS::Serverless::Api":
      return "AWS::ApiGateway::RestApi";
    case "AWS::Serverless::SimpleTable":
      return "AWS::DynamoDB::Table";
    case "AWS::Serverless::StateMachine":
      return "AWS::StepFunctions::StateMachine";
    default:
      return resourceType;
  }
}

function getResources(template, resourceType) {
  const matching = [];
  const all = [];
  for (const key of Object.keys(template.Resources)) {
    if (template.Resources[key].Type.toLowerCase().includes(resourceType)) {
      matching.push(`[${template.Resources[key].Type}] ${key}`);
    } else {
      all.push(`[${template.Resources[key].Type}] ${key}`);
    }
  }
  return { matching, all };
}

function suggestedServices(template, allServices) {
  const list = [];
  if (!template) {
    return list;
  }
  for (const key of Object.keys(template.Resources)) {
    const resource = translateSAMResourceType(template.Resources[key].Type)
      .split("::")[1]
      .toLowerCase();
    const matches = allServices.filter(
      (p) => p.value.StringPrefix === resource
    );
    if (matches.length > 0) {
      list.push(...matches);
    }
  }
  return Array.from(new Set(list)).sort((a, b) => (a.name > b.name ? 1 : -1));
}

function getRefResolver2(resourceType, resourceName) {
  const type =
    intrinsicMap[
      translateSAMResourceType(resourceType.replace(/\[(.+)\]/, "$1"))
    ];

  if (type.Ref && type.Ref.includes("Arn")) {
    return { Ref: resourceName };
  }
  for (const getAtt of type.GetAtt) {
    if (getAtt.includes("Arn")) {
      return { "Fn::GetAtt": [resourceName, getAtt] };
    }
  }
  return null;
}

function getRefResolver(resourceType, resourceName) {
  const type =
    cfnSchema.ResourceTypes[
      translateSAMResourceType(resourceType.replace(/\[(.+)\]/, "$1"))
    ];

  if (type.Attributes) {
    for (const attribute of Object.keys(type.Attributes).sort(
      (a, b) => a.length - b.length
    )) {
      if (attribute.includes("Arn")) {
        return { "Fn::GetAtt": [resourceName, attribute] };
      }
    }
  }

  return { Ref: resourceName };
}

module.exports = {
  getResources,
  getRefResolver,
  getRefResolver2,
  suggestedServices,
};
