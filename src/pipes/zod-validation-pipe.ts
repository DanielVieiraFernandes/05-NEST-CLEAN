
import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ZodError, ZodSchema  } from 'zod';
import {fromZodError} from "zod-validation-error";
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {

        if(error instanceof ZodError){
            throw new BadRequestException({error: fromZodError(error), message: 'validation failed', statusCode: 400});
        }

      throw new BadRequestException('Validation failed');
    }
  }
}
