import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { AppStack } from "../lib/stacks/app-stack";
import { DevPipelineStack } from "../lib/stacks/dev-pipline-stack";

const app = new cdk.App();

/************************** Dev Stacks resources start ******************************/

const devDevAppStack = new AppStack(app, 'DevMicroServiceStack');
cdk.Tags.of(devDevAppStack).add('environment', 'dev');

const devPipelineStack = new DevPipelineStack(app, 'DevPipelineStack', {
    webapp: devDevAppStack.webapp
});
cdk.Tags.of(devPipelineStack).add('environment', 'dev');

/************************** Dev Stacks resources end ******************************/

app.synth();
