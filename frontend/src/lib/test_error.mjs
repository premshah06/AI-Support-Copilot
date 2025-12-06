import { getUserFriendlyErrorMessage } from './errorHandling.ts';

const err = new Error('Network error occurred');
const result = getUserFriendlyErrorMessage(err);
console.log('Result:', JSON.stringify(result, null, 2));
