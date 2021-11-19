const typeKey = '__onaji_type',
	// a string prepended to serialized strings to identify them
	// as having been serialized by onaji
	onajiSerializationIdentifier = '__ONAJI__';

type CustomSerializer = (value: any, key: string) => [string, any] | undefined;
type CustomDeserializer = (type: string, serialized: any) => any;

export function serialize(obj: any, customSerializer?: CustomSerializer) {
	if (obj === null) {
		return JSON.stringify(obj);
	}
	return (
		onajiSerializationIdentifier +
		JSON.stringify(obj, function (key, value) {
			// skip already serialized objects, this gets called even
			// when serializing an object once
			if (key === typeKey) {
				return value;
			}

			const originalValue = this[key];

			if (typeof customSerializer === 'function') {
				const custom = customSerializer(value, key);

				if (custom && Array.isArray(custom) && custom.length === 2) {
					return {
						[typeKey]: custom[0],
						serialized: custom[1],
					};
				}
			}

			if (originalValue instanceof Date) {
				return {
					[typeKey]: 'date',
					serialized: originalValue.getTime(),
				};
			}
			return value;
		})
	);
}

export function isOnajiSerialized(str: string) {
	return typeof str === 'string' && str.startsWith(onajiSerializationIdentifier);
}

export function deserialize<T>(str: string, customDeserializer?: CustomDeserializer) {
	if (!isOnajiSerialized(str)) {
		return JSON.parse(str);
	}
	return JSON.parse(str.substring(onajiSerializationIdentifier.length), (_, value) => {
		// 'null' is typeof 'object' in JS, but it won't deserialize cleanly
		// allow null to skip onaji serialization/deserialization
		if (value !== null && typeof value === 'object' && value[typeKey]) {
			const serialized = value.serialized,
				type = value[typeKey];

			// allow a function to take the type and serialized data and return an object
			// that's recreated using the original class
			if (typeof customDeserializer === 'function') {
				const custom = customDeserializer(type, serialized);
				if (custom) {
					return custom;
				}
			}

			switch (value[typeKey]) {
				case 'date':
					return new Date(serialized);
				default:
					return serialized;
			}
		}
		return value;
	}) as T;
}
