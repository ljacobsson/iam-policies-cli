## iam-policies-cli

CLI for generating AWS IAM policy documents, SAM policy templates or [SAM Connectors](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/managing-permissions-connectors.html) based on the [JSON definition](https://awspolicygen.s3.amazonaws.com/js/policies.js) used in the [AWS Policy Generator](https://awspolicygen.s3.amazonaws.com/policygen.html).  

Provide an optional SAM or CloudFormation template and it will let you reference resource ARNs using intrinsic functions for defined resources. 

The mapping of CloudFormation resource type -> the intrinsic function that returns the ARN is based on the [cfn-lint schema for us-east-1](https://github.com/aws-cloudformation/cfn-python-lint/blob/master/src/cfnlint/data/CloudSpecs/us-east-1.json)

### :tada: New in v1.0.5 - support for AWS::Serverless::Connectors
If you point a SAM template to this tool it will suggest connectable resources and let you generate the `AWS::Serverless::Connector` resource
![Demo](https://github.com/mhlabs/iam-policies-cli/blob/master/images/demo-connectors.gif?raw=true)

## Installation
`npm install -g @mhlabs/iam-policies-cli`

## Usage
Example: `iam-pol -t template.yaml -f yaml`

```
Options:
  -v, --vers                        output the current version
  -t, --template <filename>         Template file name (default: "serverless.template")
  -f, --format <JSON|YAML>          Output format (default: "JSON")
  -o, --output <console|clipboard>  Template file namePolicy output (default: "console")
  -h, --help                        output usage information
```

## Example
![Demo](https://github.com/mhlabs/iam-policies-cli/blob/master/demo.gif?raw=true)
