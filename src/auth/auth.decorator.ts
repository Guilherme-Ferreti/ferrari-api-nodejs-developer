import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Auth = createParamDecorator((field: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (field) {
        return request.auth[field] ?? null;
    }

    return request.auth;
});
