import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { IS_PUPLIC_KEY } from "src/decorators/public.decorator";
import { AuthService } from "./auth.service";

type Request = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  headers: {
    authorization: string;
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector
  ) { }

  async canActivate(context: ExecutionContext) {
    try {
      const isPublic = this.reflector.getAllAndOverride(IS_PUPLIC_KEY, [
        context.getHandler(),
        context.getClass()
      ])

      if (isPublic) return true;

      const request = context.switchToHttp().getRequest<Request>();
      const [type, token] = request.headers['authorization']?.split(" ") ?? [];

      if (type != 'Bearer' || !token)
        throw new UnauthorizedException();

      const payload = await this.authService.verifyJwt(token);
      if (new Date(payload.exp * 1000) < new Date())
        return false;

      return true;

    } catch (error) {
      console.error(error);
      throw new UnauthorizedException();
    }
  }

}