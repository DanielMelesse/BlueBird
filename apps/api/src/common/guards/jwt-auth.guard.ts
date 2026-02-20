import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";

type AuthenticatedRequest = Request & {
  user?: {
    id: string;
    roles: string[];
  };
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing bearer token");
    }

    // Placeholder for JWT verification strategy.
    request.user = {
      id: "placeholder-user-id",
      roles: ["customer"]
    };
    return true;
  }
}
