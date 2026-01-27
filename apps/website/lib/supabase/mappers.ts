/**
 * Type Mappers for Supabase Database Types
 * 
 * Converts snake_case database column names to camelCase frontend types.
 * This ensures UI components continue to work without modification.
 */

// ============================================================================
// Generic Utilities
// ============================================================================

/**
 * Convert snake_case string to camelCase
 */
export function snakeToCamel(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Convert camelCase string to snake_case
 */
export function camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Type helper: Convert snake_case keys to camelCase
 */
export type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}`
    ? `${T}${Capitalize<SnakeToCamelCase<U>>}`
    : S;

/**
 * Type helper: Convert camelCase keys to snake_case
 */
export type CamelToSnakeCase<S extends string> = S extends `${infer T}${infer U}`
    ? T extends Capitalize<T>
    ? `_${Lowercase<T>}${CamelToSnakeCase<U>}`
    : `${T}${CamelToSnakeCase<U>}`
    : S;

/**
 * Transform object keys from snake_case to camelCase (type-safe)
 */
export type SnakeToCamelCaseObject<T> = {
    [K in keyof T as SnakeToCamelCase<K & string>]: T[K] extends Record<string, unknown>
    ? SnakeToCamelCaseObject<T[K]>
    : T[K] extends Array<infer U>
    ? U extends Record<string, unknown>
    ? Array<SnakeToCamelCaseObject<U>>
    : T[K]
    : T[K];
};

/**
 * Transform object keys from camelCase to snake_case (type-safe)
 */
export type CamelToSnakeCaseObject<T> = {
    [K in keyof T as CamelToSnakeCase<K & string>]: T[K] extends Record<string, unknown>
    ? CamelToSnakeCaseObject<T[K]>
    : T[K] extends Array<infer U>
    ? U extends Record<string, unknown>
    ? Array<CamelToSnakeCaseObject<U>>
    : T[K]
    : T[K];
};

// ============================================================================
// Runtime Transformation Functions
// ============================================================================

/**
 * Transform object keys from snake_case to camelCase
 * Handles nested objects and arrays
 */
export function mapSnakeToCamel<T extends Record<string, unknown>>(
    obj: T
): SnakeToCamelCaseObject<T> {
    if (obj === null || obj === undefined) {
        return obj as unknown as SnakeToCamelCaseObject<T>;
    }

    if (Array.isArray(obj)) {
        return obj.map((item) =>
            typeof item === 'object' && item !== null
                ? mapSnakeToCamel(item as Record<string, unknown>)
                : item
        ) as unknown as SnakeToCamelCaseObject<T>;
    }

    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
        const camelKey = snakeToCamel(key);

        if (value !== null && typeof value === 'object') {
            if (Array.isArray(value)) {
                result[camelKey] = value.map((item) =>
                    typeof item === 'object' && item !== null
                        ? mapSnakeToCamel(item as Record<string, unknown>)
                        : item
                );
            } else {
                result[camelKey] = mapSnakeToCamel(value as Record<string, unknown>);
            }
        } else {
            result[camelKey] = value;
        }
    }

    return result as SnakeToCamelCaseObject<T>;
}

/**
 * Transform object keys from camelCase to snake_case
 * Handles nested objects and arrays
 */
export function mapCamelToSnake<T extends Record<string, unknown>>(
    obj: T
): CamelToSnakeCaseObject<T> {
    if (obj === null || obj === undefined) {
        return obj as unknown as CamelToSnakeCaseObject<T>;
    }

    if (Array.isArray(obj)) {
        return obj.map((item) =>
            typeof item === 'object' && item !== null
                ? mapCamelToSnake(item as Record<string, unknown>)
                : item
        ) as unknown as CamelToSnakeCaseObject<T>;
    }

    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
        const snakeKey = camelToSnake(key);

        if (value !== null && typeof value === 'object') {
            if (Array.isArray(value)) {
                result[snakeKey] = value.map((item) =>
                    typeof item === 'object' && item !== null
                        ? mapCamelToSnake(item as Record<string, unknown>)
                        : item
                );
            } else {
                result[snakeKey] = mapCamelToSnake(value as Record<string, unknown>);
            }
        } else {
            result[snakeKey] = value;
        }
    }

    return result as CamelToSnakeCaseObject<T>;
}

/**
 * Transform an array of objects from snake_case to camelCase
 */
export function mapArraySnakeToCamel<T extends Record<string, unknown>>(
    arr: T[]
): SnakeToCamelCaseObject<T>[] {
    return arr.map((item) => mapSnakeToCamel(item));
}

/**
 * Transform an array of objects from camelCase to snake_case
 */
export function mapArrayCamelToSnake<T extends Record<string, unknown>>(
    arr: T[]
): CamelToSnakeCaseObject<T>[] {
    return arr.map((item) => mapCamelToSnake(item));
}
