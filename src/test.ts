import assert from 'assert';
import { serialize, deserialize, isOnajiSerialized } from './index.js';

interface TestObject {
	testString: string;
	testDate: Date;
	testNumber: number;
	nested: {
		nestedDate: Date;
	};
}

const testDateTime = 1337,
	testObj: TestObject = {
		testString: 'test',
		testDate: new Date(testDateTime),
		testNumber: 5,
		nested: {
			nestedDate: new Date(testDateTime),
		},
	},
	serializedTestObj = serialize(testObj),
	deserializedTestObj = deserialize<TestObject>(serializedTestObj);

assert.equal(typeof serializedTestObj, 'string', 'objects should be serialized to a string');
assert.equal(deserializedTestObj.testDate instanceof Date, true, 'deserialized dates should be a Date');
assert.equal(deserializedTestObj.testDate.getTime(), testDateTime, 'deserialized dates should have the same time');
assert.equal(deserializedTestObj.testNumber, 5, 'deserialized numbers should be the same');
assert.equal(deserializedTestObj.testString, 'test', 'deserialized strings should be the same');
assert.equal(deserializedTestObj.nested.nestedDate instanceof Date, true, 'deserialized nested dates should be a Date');
assert.equal(
	deserializedTestObj.nested.nestedDate.getTime(),
	testDateTime,
	'deserialized nested dates should have the same time'
);
assert.equal(isOnajiSerialized(serializedTestObj), true, 'serialized strings should be identifiable');
assert.equal(isOnajiSerialized('test'), false, 'non-serialized strings should be identifiable');

interface TestItem {
	name: string;
	date: Date;
}
const arrayTestObj: TestItem[] = [
		{
			name: 'one',
			date: new Date(testDateTime),
		},
		{
			name: 'two',
			date: new Date(testDateTime),
		},
	],
	deserializedArrayTestObj = deserialize<TestItem[]>(serialize(arrayTestObj));

assert.equal(
	deserializedArrayTestObj[0].date.getTime(),
	testDateTime,
	'deserialized dates in an object within an array should be a Date'
);
assert.equal(
	deserializedArrayTestObj[0].name,
	'one',
	'deserialized strings in objects within an array should be the same'
);
