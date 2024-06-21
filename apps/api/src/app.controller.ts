import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('default-nest')
  async defaultNestJS() {
    return this.appService.defaultNestJS();
  }

  @Get('queue')
  async queue() {
    return this.appService.queue();
  }

  @Get('exchange')
  async exchange() {
    return this.appService.exchange();
  }
}
