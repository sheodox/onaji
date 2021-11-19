import assert from 'assert';
import { serialize, deserialize, isOnajiSerialized } from './index.js';

interface TestObject {
	testString: string;
	testDate: Date;
	testNumber: number;
	testNull: null;
	nested: {
		nestedDate: Date;
	};
}

const testDateTime = 1337,
	testObj: TestObject = {
		testString: 'test',
		testDate: new Date(testDateTime),
		testNumber: 5,
		testNull: null,
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
assert.equal(deserializedTestObj.testNull, null, 'null properties should be deserialized without error');
assert.equal(isOnajiSerialized(serializedTestObj), true, 'serialized strings should be identifiable');
assert.equal(isOnajiSerialized('test'), false, 'non-serialized strings should be identifiable');

const nullSerialized = serialize(null);
assert.equal(nullSerialized, 'null', 'null should serialize without using onaji');
assert.equal(deserialize(nullSerialized), null, 'null should deserialize without using onaji');

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

class User {
	name: string;
	id: number;

	constructor(name: string, id: number) {
		this.name = name;
		this.id = id;
	}
}

interface CustomObjectTest {
	test: boolean;
	user: User;
}

const dataWithUser = {
		test: true,
		user: new User('sheodox', 100),
	},
	customSerialized = serialize(dataWithUser, (value) => {
		if (value instanceof User) {
			return ['user', { name: value.name, id: value.id }];
		}
	}),
	customDeserialized = deserialize<CustomObjectTest>(customSerialized, (type, serialized) => {
		if (type === 'user') {
			return new User(serialized.name, serialized.id);
		}
	});

assert.equal(customDeserialized.user instanceof User, true, 'deserialized custom class should be that class');
assert.equal(customDeserialized.user.name, 'sheodox', 'deserialized custom class should use serialzed data');
assert.equal(customDeserialized.test, true, 'non-custom object is deserialized as-is');
