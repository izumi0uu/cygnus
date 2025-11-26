import { Request } from 'express';
import { User } from '@cygnus/database';

export interface AuthRequest extends Request {
  user?: User;
}
