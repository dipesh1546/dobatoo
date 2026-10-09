import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthenticatedAdminPayload {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const CurrentAdmin = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthenticatedAdminPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
