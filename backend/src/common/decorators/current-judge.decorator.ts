import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface CurrentJudgePayload {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

export const CurrentJudge = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CurrentJudgePayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
