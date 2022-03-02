import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator((field: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (field) {
        return request.user[field] ?? null;
    }

    return request.user;
});
