/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { ValidationError } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import 'dotenv/config';
import 'reflect-metadata';

export function Config(): ClassDecorator {
  return (target: any) => {
    const instance = plainToInstance(target, new target());

    const errors: ValidationError[] = validateSync(instance, {
      skipMissingProperties: false,
      forbidUnknownValues: false,
    });

    if (errors.length > 0) {
      const formatted = errors
        .map((err) => {
          const field = err.property;

          if (!err.constraints) return null;

          const messages = Object.values(err.constraints)
            .map((msg) => `  - ${msg}`)
            .join('\n');

          return `• ${field}\n${messages}`;
        })
        .filter(Boolean)
        .join('\n\n');

      const message = `
❌ Configuration validation failed for ${target.name}

${formatted}

💡 Check your environment variables (or .env file)
`.trim();

      const error = new Error(message);

      // Remoce stack trace noise
      error.stack = message;

      throw error;
    }

    // if (errors.length > 0) {
    //   const messages = errors
    //     .map((err) => {
    //       if (err.constraints) {
    //         return Object.values(err.constraints).join(', ');
    //       }
    //       return '';
    //     })
    //     .join('; ');
    //   throw new Error(
    //     `Configuration validation for ${target.name}: ${messages}`,
    //   );
    // }

    Object.defineProperty(target, 'instance', {
      value: instance,
      writable: false,
    });
  };
}
