import { ValidationError } from '@nestjs/common';
import { JsonNull } from '@prisma/client/runtime/client';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import 'dotenv/config';
import 'reflect-metadata';

export function Config(): ClassDecorator {
  return (target: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const instance = plainToInstance(target, new target());

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const errors: ValidationError[] = validateSync(instance, {
      skipMissingProperties: false,
      forbidUnknownValues: false,
    });

    if (errors.length > 0) {
      const messages = errors
        .map((err) => {
          if (err.constraints) {
            return Object.values(err.constraints).join(', ');
          }
          return '';
        })
        .join('; ');
      throw new Error(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Configuration validation for ${target.name}: ${messages}`,
      );
    }

    Object.defineProperty(target, 'instance', {
      value: instance,
      writable: false,
    });
  };
}
