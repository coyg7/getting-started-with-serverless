import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';

import createError from 'http-errors';
import commonMiddleware from '../lib/commonMiddleware';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createItem(event, context) {

  const { title } = event.body;   

  const now = new Date();

  const item = {
    id: uuid(),
    title,
    status: 'TODO',
    createdAt: now.toISOString()
   };


  try{
    await dynamodb.put({
      TableName: process.env.ITEMS_TABLE_NAME,
         Item: item
       }).promise();
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }


  return {
    statusCode: 201,
    body: JSON.stringify(item),
  };
}

export const handler = commonMiddleware(createItem);


