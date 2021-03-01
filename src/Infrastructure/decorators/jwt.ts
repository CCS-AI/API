import { ClassMiddleware, Middleware } from '@overnightjs/core';
import { jwtManager } from '../middlewares/jwtMiddleware';

export function MustAuth() {
    return ClassMiddleware(jwtManager.middleware);
}

export function RouteMustAuth() {
    return Middleware(jwtManager.middleware);
}
