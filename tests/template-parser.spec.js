const parser = require("../src/template-parser");
const fs = require("fs");
const path = require("path");
const policies = require("../data/policies.json");
const template = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./input/template.json")).toString()
);

test("Get suggested services", async () => {
  const services = parser.suggestedServices(
    template,
    Object.keys(policies.serviceMap).map((p) => {
      const item = policies.serviceMap[p];
      const niceName = p.replace(/^AWS /, "").replace(/^Amazon /, "");
      return {
        name: niceName,
        value: { ...item, name: niceName },
      };
    })
  );
  expect(services.length).toBe(5);
  expect(services.map((p) => p.name)).toContain("Lambda");
  expect(services.map((p) => p.name)).toContain("DynamoDB");
  expect(services.map((p) => p.name)).toContain("SNS");
  expect(services.map((p) => p.name)).toContain("SQS");
});

test("Get suggestions for CFN resource", async () => {
  const services = parser.getResources(template, "dynamodb");
  console.log(services);
  expect(services.matching.length).toBe(2);
  expect(services.all.length).toBe(4);
  expect(services.matching).toContain("[AWS::DynamoDB::Table] DynamoDBTable1");
  expect(services.matching).toContain("[AWS::DynamoDB::Table] DynamoDBTable2");
});

test("Get suggestions for CFN resource that doesn't extist", async () => {
  const services = parser.getResources(template, "balloon");
  console.log(services);
  expect(services.matching.length).toBe(0);
  expect(services.all.length).toBe(6);
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
  const response = parser.getRefResolver("AWS::SNS::Topic", "ResourceName");
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

test("Default non-existing Arn attribute to Ref", async () => {
  const cfnResponse = parser.getRefResolver(
    "AWS::ApiGateway::GatewayResponse",
    "ResourceName"
  );
  console.log(cfnResponse);
  expect(cfnResponse).toEqual({ Ref: "ResourceName" });
});

test("Add policy document to no-existing array", async () => {
  const resource = {
    Type: "AWS::Serverless::Function",
    PoliciesPath: "$.Resources.#ResourceName#.Properties.Policies",
    Document: {
      Version: "2012-10-17",
      Statement: [
        {
          Sid: "Statement1",
          Effect: "Allow",
          Action: ["appconfig:CreateApplication"],
          Resource: [""],
        },
      ],
    },
  };
  const newTemplate = await parser.merge(template, {
    name: "Function",
    value: resource,
  });
  expect(newTemplate.Resources.Function.Properties.Policies[0]).toEqual(
    resource.Document
  );
});

test("Add policy document to existing AWS::IAM::Role", async () => {
  const resource = {
    Type: "AWS::IAM::Role",
    PoliciesPath: "$.Resources.#ResourceName#.Properties.Policies",
    Document: {
      PolicyName: "test",
      PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "Statement1",
            Effect: "Allow",
            Action: ["appconfig:CreateApplication"],
            Resource: ["*"],
          },
        ],
      },
    },
  };
  const newTemplate = await parser.merge(template, {
    name: "IAMRole",
    value: resource,
  });
  console.log(JSON.stringify(newTemplate, null, 2));
  expect(newTemplate.Resources.IAMRole.Properties.Policies[1]).toEqual(
    resource.Document
  );
});
