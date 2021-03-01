const mapping = {
    "dynamodb:TableName": ["Ref"],
    "sns:TopicName": ["Fn::GetAtt", "TopicName"],
    "sqs:QueueName": ["Fn::GetAtt", "QueueName"],
    "lambda:FunctionName": ["Ref"],
    "elasticsearch:DomainName": ["Ref"],
    "s3:BucketName": ["Ref"],
    "secretsmanager:FunctionName": ["Ref"],
    "secretsmanager:SecretArn": ["Ref"],
    "mobiletargeting:PinpointApplicationId": ["Ref"],
    "firehose:DeliveryStreamName": ["Ref"],
    "logs:LogGroupName": ["Ref"],
    "states:StateMachineName": ["Fn::GetAtt", "StateMachineName"],
    "codecommit:RepositoryName": ["Fn::GetAtt", "RepositoryName"],
    "events:EventBusName": ["Ref"]
};

const crossServiceMapping = {
  "lambda": ["AWSSecretsManagerRotationPolicy"],
}

function getRelatedServices(key) {
  return crossServiceMapping[key] || [];
}

function get(key) {
  if (!Object.keys(mapping).includes(key)) {
    return { func: "Ref", sure: false };
  }

  return { func: mapping[key], sure: true };
}


module.exports = {
    get,
    getRelatedServices
}