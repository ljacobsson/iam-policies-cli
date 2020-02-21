const parser = require("../src/template-parser");
const fs = require("fs");
const path = require("path");
const doc = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/policies.json")).toString()
);
const template = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./input/template.json")).toString()
);

test("Get suggested services", async () => {
  const services = parser.suggestedServices(template, doc.serviceMap);
  expect(services.length).toBe(4);
  expect(services).toContain("AWS Lambda");
  expect(services).toContain("Amazon DynamoDB");
  expect(services).toContain("Amazon SNS");
  expect(services).toContain("Amazon SQS");
  console.log(services);
});

test("Get suggestions for CFN resource", async () => {
  const services = parser.getResources(template, "dynamodb");
  console.log(services);
  expect(services.matching.length).toBe(2);
  expect(services.all.length).toBe(3);
  expect(services.matching).toContain("[AWS::DynamoDB::Table] DynamoDBTable1");
  expect(services.matching).toContain("[AWS::DynamoDB::Table] DynamoDBTable2");
});

test("Get suggestions for CFN resource that doesn't extist", async () => {
  const services = parser.getResources(template, "balloon");
  console.log(services);
  expect(services.matching.length).toBe(0);
  expect(services.all.length).toBe(5);
});

test("Get ARN resolver for DynamoDB should be GetAtt", async () => {
  const response = parser.getRefResolver(
    "AWS::DynamoDB::Table",
    "ResourceName"
  );
  expect(response["Fn::GetAtt"]).not.toBeNull();
  expect(response["Fn::GetAtt"]).toEqual(["ResourceName", "Arn"]);
});

test("Get ARN resolver for SNS should be Ref", async () => {
  const response = parser.getRefResolver(
    "AWS::SNS::Topic",
    "ResourceName"
  );
  expect(response["Ref"]).not.toBeNull();
  expect(response["Ref"]).toEqual("ResourceName", "Arn");
});

test("Get ARN resolver for SAM resource should resolve to CFN type - AWS::Serverless::Function", async () => {
  const samResponse = parser.getRefResolver(
    "AWS::Serverless::Function",
    "ResourceName"
  );
  const cfnResponse = parser.getRefResolver(
    "AWS::Lambda::Function",
    "ResourceName"
  );
  
  expect(samResponse).toEqual(cfnResponse);
});

test("Get ARN resolver for SAM resource should resolve to CFN type - AWS::Serverless::SimpleTable", async () => {
  const samResponse = parser.getRefResolver(
    "AWS::Serverless::SimpleTable",
    "ResourceName"
  );
  const cfnResponse = parser.getRefResolver(
    "AWS::DynamoDB::Table",
    "ResourceName"
  );
  
  expect(samResponse).toEqual(cfnResponse);
});

test("Get ARN resolver for SAM resource that doesn't return ARN", async () => {
  const cfnResponse = parser.getRefResolver(
    "AWS::ApiGateway::GatewayResponse",
    "ResourceName"
  );
  console.log(cfnResponse);
  expect(cfnResponse).toBeNull();
});
