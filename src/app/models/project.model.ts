import { UserModel } from './user.model';
import { TaskModel } from './task.model';

export interface ProjectModel {
  _id_project: string;
  name_project: string;
  description_project: string;
  createdAt: Date;
  updatedAt?: Date;
  status: string;
  deadline: Date;
  user?: Pick<UserModel, 'idUser' | 'nameUser'>;
  tasks?: Pick<TaskModel, '_id_task' | 'name_task'>[];
}
