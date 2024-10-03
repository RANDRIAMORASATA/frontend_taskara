import { ProjectModel } from './project.model';
import { TaskModel } from './task.model';

export interface UserModel {
  idUser: string;
  nameUser: string;
  email: string;
  mdp: string;
  confirmMdp: string;
  infosUser: string;
}
