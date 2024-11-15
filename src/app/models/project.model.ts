import { UserModel } from './user.model';
import { TaskModel } from './task.model';

export interface ProjectModel {
  _id_project: string;
  name_project: string;
  description_project: string;
  createdAt?: Date;
  updatedAt?: Date;
  status: string;
  deadline: Date;
  _user_id: string;
  user?: Pick<UserModel, '_id_user' | 'name_user'>;
  tasks?: Pick<TaskModel, '_id_task' | 'name_task'>[];
}
