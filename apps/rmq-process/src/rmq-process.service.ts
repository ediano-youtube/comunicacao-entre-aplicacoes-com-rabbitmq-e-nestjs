import { Injectable } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';

@Injectable()
export class RmqProcessService {
  async defaultNestJS(data: any, context: RmqContext) {
    return;
  }
}
