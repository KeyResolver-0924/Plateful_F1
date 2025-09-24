import { formatPhoneNumber } from './phoneFormatter';

// Test cases for phone number formatting
const testCases = [
  {
    input: '+12322322222',
    expected: '+1 (232) 232-2222',
    description: 'US phone number'
  },
  {
    input: '+46727409696',
    expected: '+46 72 740 96 96',
    description: 'Sweden phone number'
  },
  {
    input: '+44123456789',
    expected: '+44 1234 56789',
    description: 'UK phone number'
  },
  {
    input: '+49123456789',
    expected: '+49 123 456789',
    description: 'Germany phone number'
  },
  {
    input: '+33123456789',
    expected: '+33 1 23 45 67 89',
    description: 'France phone number'
  },
  {
    input: '+911234567890',
    expected: '+91 12345 67890',
    description: 'India phone number'
  },
  {
    input: '+8612345678901',
    expected: '+86 123 4567 8901',
    description: 'China phone number'
  },
  {
    input: '+81123456789',
    expected: '+81 1 2345 6789',
    description: 'Japan phone number'
  },
  {
    input: '+5512345678901',
    expected: '+55 12 34567 8901',
    description: 'Brazil phone number'
  },
  {
    input: '+521234567890',
    expected: '+52 123 456 7890',
    description: 'Mexico phone number'
  }
];

console.log('Testing phone number formatting...\n');

testCases.forEach((testCase, index) => {
  const result = formatPhoneNumber(testCase.input);
  const passed = result === testCase.expected;
  
  console.log(`Test ${index + 1}: ${testCase.description}`);
  console.log(`  Input: ${testCase.input}`);
  console.log(`  Expected: ${testCase.expected}`);
  console.log(`  Result: ${result}`);
  console.log(`  Status: ${passed ? '✅ PASS' : '❌ FAIL'}`);
  console.log('');
});

// Test edge cases
console.log('Testing edge cases...\n');

const edgeCases = [
  { input: '', expected: '', description: 'Empty string' },
  { input: '+1', expected: '+1', description: 'Only country code' },
  { input: '+123', expected: '+1 23', description: 'Incomplete number' },
  { input: '1234567890', expected: '1234567890', description: 'No country code' }
];

edgeCases.forEach((testCase, index) => {
  const result = formatPhoneNumber(testCase.input);
  const passed = result === testCase.expected;
  
  console.log(`Edge Case ${index + 1}: ${testCase.description}`);
  console.log(`  Input: ${testCase.input}`);
  console.log(`  Expected: ${testCase.expected}`);
  console.log(`  Result: ${result}`);
  console.log(`  Status: ${passed ? '✅ PASS' : '❌ FAIL'}`);
  console.log('');
}); 