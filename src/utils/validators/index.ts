import type { ValidationError } from 'class-validator';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import type { ValidatorOptions } from 'class-validator';
import type { ClassConstructor, ClassTransformOptions } from 'class-transformer';
type ValidatorResult<T> = {
    data: T | null; // Transformed object or null if validation fails
    success: boolean; // Validation success status
    errors: string[] | null; // List of error messages or null if no errors
};


export class usePipes {

    /**
     * Formats nested validation errors into a flat array of error messages.
     *
     * @param {ValidationError[]} errors - Array of validation errors to process.
     * @returns {string[]} - Flattened array of error messages.
     *
     * @example
     * const result = arrayFormat(errors);
     * console.log(result);
     *  Output: [
     *   "email must be a valid email",
     *   "password must be at least 8 characters"
     * ]
     */
    private static arrayFormat = (errors: ValidationError[]): string[] => {
        /**
         * Recursively maps nested errors to include the full path of each error.
         *
         * @param {ValidationError} err - The current error object.
         * @param {string} path - Accumulated path to the property.
         * @returns {ValidationError[]} - Flattened array of errors with full paths.
         */
        const mapErrors = (
            err: ValidationError,
            path: string = '',
        ): ValidationError[] => {
            // Return if no nested errors
            if (!err.children?.length) return [err];
            const nestedErrors = [];
            // Update path
            const newPath = path ? `${path}.${err.property}` : err.property;
            for (const child of err.children) {
                // Recursively handle deeper errors
                if (child.children?.length)
                    nestedErrors.push(...mapErrors(child, newPath));
                // Add path to constraints
                nestedErrors.push(appendPathToConstraints(newPath, child));
            }
            return nestedErrors;
        };

        /**
         * Prepends path to each error message for context.
         *
         * @param {string} path - Path of the error property.
         * @param {ValidationError} err - Error with constraints to update.
         * @returns {ValidationError} - Updated error with full paths in constraints.
         */
        const appendPathToConstraints = (
            path: string,
            err: ValidationError,
        ): ValidationError => {
            const updatedConstraints: Record<string, string> = {};
            // Prepend path to each message
            for (const key in err.constraints)
                updatedConstraints[key] = `${path}.${err.constraints[key]}`;
            return { ...err, constraints: updatedConstraints };
        };

        // Flatten errors, filter those with constraints, then extract all messages
        return errors
            .flatMap(err => mapErrors(err)) // Flatten all nested errors
            .filter(err => !!err.constraints) // Keep only errors with messages
            .map(err => Object.values(err.constraints)) // Extract messages
            .flat(); // Flatten to a single array of messages
    };

    /**
     * Validates and transforms an input object into a class instance of type T, returning validation results.
     *
     * @template T - The class type to validate against.
     * @param {ClassConstructor<T>} cls - The class constructor to validate against.
     * @param {unknown} obj - The raw input data to validate and transform.
     * @param {ValidatorOptions} [validateOptions] - Optional validation settings.
     * @param {ClassTransformOptions} [transformOptions] - Optional transformation settings for converting plain objects to class instances.
     * @returns {Promise<ValidatorResult<T>>} - A promise that resolves to an object containing the transformed instance, validation success status, and error messages if any.
     *
     * @example
     * class User {
     *   //@IsString()
     *   name: string;
     * }
     *
     * const { data, success, errors } = await validator(User, { name: 123 });
     * console.log(success); // false
     * console.log(errors); // ["name must be a string"]
     */
    static Transform = async <T>(
        cls: ClassConstructor<T>, // Class constructor to validate against
        obj: unknown, // Input data to validate and transform
        validateOptions?: ValidatorOptions, // Optional validation settings
        transformOptions?: ClassTransformOptions, // Optional transformation settings
    ): Promise<ValidatorResult<T>> => {
        // Merge custom options with defaults for validation
        validateOptions = {
            always: true, // Always run validation
            whitelist: true, // Strip properties not in the class
            forbidUnknownValues: false, // Allow unknown values by default
            ...validateOptions, // Override with user-defined options
        };

        // Merge custom options with defaults for transformation
        transformOptions = {
            enableImplicitConversion: true, // Allow implicit type conversion
            ...transformOptions, // Override with user-defined options
        };

        // Convert plain object to class instance
        const instance: T = plainToInstance(cls, obj, transformOptions);

        // Validate the instance using class-validator rules
        const validationErrors = await validate(
            instance as object, // Cast instance to object for validation
            validateOptions, // Pass validation options
        );

        // Determine if validation passed
        const isValid = validationErrors.length === 0;

        // Return validation result
        return {
            data: isValid ? instance : null, // Return instance if valid, otherwise null
            success: isValid, // Validation success status
            errors: isValid ? null : usePipes.arrayFormat(validationErrors), // Format errors if validation failed
        };
    };
}

