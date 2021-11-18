import assert from 'assert';
import { serialize, deserialize } from './index.js';

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
