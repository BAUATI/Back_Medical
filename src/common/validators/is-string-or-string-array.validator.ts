import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsStringOrStringArray(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isStringOrStringArray',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          if (typeof value === 'string') return true;
          if (Array.isArray(value)) return value.every(v => typeof v === 'string');
          return false;
        },
        defaultMessage(_args: ValidationArguments) {
          return '$property must be a string or an array of strings';
        },
      },
    });
  };
}