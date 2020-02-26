## iam-policies-cli

CLI for generating AWS IAM policy documents based on the [JSON definition](https://awspolicygen.s3.amazonaws.com/js/policies.js) used in the [AWS Policy Generator](https://awspolicygen.s3.amazonaws.com/policygen.html).  

Provide an optional SAM or CloudFormation template and it will let you reference resource ARNs using intrinsic functions for defined resources. 

The mapping of CloudFormation resource type -> the intrinsic function that returns the ARN is taken from a JSON representation of [this table](https://theburningmonk.com/cloudformation-ref-and-getatt-cheatsheet/) and might not be up-to-date with the latest releases.

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
