import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '<h1>Hello World!!!! From Nest.js</h1><p>This is nest.js app running on ecs-fargate and deployed via aws codePipeline. IaC is fully done by CDK</p>';
  }
}
