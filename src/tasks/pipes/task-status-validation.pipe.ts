/* eslint-disable prettier/prettier */
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';

@Injectable()
export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatus = [
    TaskStatus.DONE,
    TaskStatus.IN_PROGRESS,
    TaskStatus.OPEN,
  ];

  transform(value: any) {
    value = value.toUpperCase(value);
    if (!this.isStatusValid(value))
      throw new BadRequestException(
        'Invalid Status , Choose between DONE,OPEN OR IN_PROGRESS',
      );
    return value;
  }

  private isStatusValid(status: any) {
    const idx = this.allowedStatus.indexOf(status); // return -1 if not found
    return idx !== -1;
  }
}
