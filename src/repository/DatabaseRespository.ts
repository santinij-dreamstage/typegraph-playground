
export function throwIfNotFound<T>(value: T | null | undefined): T {
    if (!value) {
        throw new Error("This must be something!");
    }
    return value;
}
