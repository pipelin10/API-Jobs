const aws = require('aws-sdk')

aws.config.update({
  region: 'us-west-2',
  endpoint: "http://localhost:8000"
})

const dynamodb = new aws.DynamoDB()

const params = {
  TableName : "People",
  KeySchema: [
    {AttributeName: "email", KeyType: "HASH"},
    {AttributeName: "phone", KeyType: "RANGE"},
  ],
  AttributeDefinitions: [
    {AttributeName: "email", AttributeType: "S" },
    {AttributeName: "phone", AttributeType: "S" }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  }
};

dynamodb.createTable(params, function(err, data) {
  if (err) {
      console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
  } else {
      console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
  }
});
