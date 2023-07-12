import { Injectable, Inject } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(@Inject(TaskRepository) private taskRepository: TaskRepository) {}

  getTaskById(id: number, user: User): Promise<Task> {
    return this.taskRepository.getById(id, user);
  }

  getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    // check du[licstes]

    // create model

    // call repo
    return this.taskRepository.createTask(createTaskDto, user);
  }

  deleteTask(id: number,user: User): Promise<void> {
    return this.taskRepository.deleteTask(id,user);
  }

  updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<Task> {
    return this.taskRepository.updateTaskStatus(id, status, user);
  }
}
