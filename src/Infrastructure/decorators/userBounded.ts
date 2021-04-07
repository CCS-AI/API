import { container } from 'tsyringe';
import { ISecureRequest } from '@overnightjs/jwt';
import { Middleware, ClassMiddleware } from '@overnightjs/core';
import { NextFunction, Response } from 'express';
import UserBoundedModel from '../../domains/identity/models/user/userBounded';

export function UserBounded(): ClassDecorator & PropertyDecorator {
    return ClassMiddleware(setBounded);
}

export function RouteUserBounded(): MethodDecorator & PropertyDecorator {
    return Middleware(setBounded);
}
function setBounded(req: ISecureRequest, res: Response, next: NextFunction) {
    const userBounded = container.resolve<UserBoundedModel>('UserBounded');
    const { organizationId } = req.payload;
    userBounded.orgId = organizationId;
    next();
}
