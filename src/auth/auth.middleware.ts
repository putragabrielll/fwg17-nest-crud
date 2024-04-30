import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request as RequestExpress, Response } from 'express';

interface Request extends RequestExpress {
  user: object;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}
  use(req: Request, res: Response, next: () => void) {
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith('Bearer')) {
      throw new UnauthorizedException({
        success: false,
        message: 'Unauthorized',
      });
    }
    const token = auth.slice(7);
    if (!token) {
      throw new UnauthorizedException({
        success: false,
        message: 'Unauthorized',
      });
    }
    req.user = this.jwtService.verify(token);
    next();
  }
}
