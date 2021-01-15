#!/usr/bin/env node
/**
 * AWS CDK script to provision the resources.
 */

import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { WebApp } from '../lib/webapp';
import { Pipeline } from '../lib/pipeline';
import { Cluster } from '../lib/cluster';

class WebStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const cluster = new Cluster(this, 'ClusterForNestApp');
        const webapp = new WebApp(this, 'NestApp', {
            cluster: cluster
        });
        const pipeline = new Pipeline(this, 'PipelineForNestApp', {
            webapp: webapp
        })
    }
}

const app = new cdk.App();
new WebStack(app, 'MyMicroServiceStack');
app.synth();