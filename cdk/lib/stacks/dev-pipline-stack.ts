import cdk = require('@aws-cdk/core');
import {Pipeline} from "../pipeline";
import {WebApp} from "../webapp";

interface DevPipelineStackProps extends cdk.StackProps{
    readonly webapp: WebApp;
}

export class DevPipelineStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props: DevPipelineStackProps) {
        super(scope, id, props);
        new Pipeline(this, 'PipelineForNestApp', {
            webapp: props.webapp
        })
    }
}