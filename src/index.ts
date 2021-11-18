const typeKey = '__onaji_type',
	// a string prepended to serialized strings to identify them
	// as having been serialized by onaji
	onajiSerializationIdentifier = '__ONAJI__';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serialize(obj: any) {
	// 'null' is typeof 'object' in JS, but it won't deserialize cleanly
	// allow null to skip onaji serialization/deserialization
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

export function deserialize<T>(str: string) {
	if (!isOnajiSerialized(str)) {
		return JSON.parse(str);
	}
	return JSON.parse(str.substring(onajiSerializationIdentifier.length), (_, value) => {
		if (typeof value === 'object' && value[typeKey]) {
			const { serialized } = value;

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
