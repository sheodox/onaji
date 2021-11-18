const typeKey = '__onaji_type';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serialize(obj: any) {
	return JSON.stringify(obj, function (key, value) {
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
	});
}

export function deserialize<T>(str: string) {
	return JSON.parse(str, (_, value) => {
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
