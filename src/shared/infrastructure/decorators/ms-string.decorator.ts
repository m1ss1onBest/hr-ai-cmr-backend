import { ValidateBy, ValidationOptions } from 'class-validator';
import ms, { StringValue } from 'ms';

export function IsMsString(validationOptions?: ValidationOptions) {
  return ValidateBy(
    {
      name: 'isMsString',
      validator: {
        validate: (value: unknown) => {
          if (typeof value !== 'string' || value.trim() === '') return false;

          try {
            const result = ms(value as StringValue);
            return typeof result === 'number' && !isNaN(result);
          } catch {
            return false;
          }
        },
        defaultMessage: () =>
          'ACCESS_TOKEN_EXPIRATION must be a valid ms string (e.g., "1h", "30m")',
      },
    },
    validationOptions,
  );
}
