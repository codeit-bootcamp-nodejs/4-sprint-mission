import { Request, Response } from 'express';
import { create } from 'superstruct';
import { IdParamsStruct } from '../structs/commonStructs';
import * as notificationsService from '../services/notificationsService';

export async function readNotification(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  await notificationsService.readNotificationById(id, req.user?.id);
  res.status(200).send();
}
