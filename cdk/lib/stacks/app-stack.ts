import cdk = require('@aws-cdk/core');
import { WebApp } from '../../lib/webapp';
import { Cluster } from '../../lib/cluster';

export class AppStack extends cdk.Stack {
    public readonly webapp: WebApp;
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        const devCluster = new Cluster(this, 'ClusterForNestApp');
        this.webapp = new WebApp(this, 'NestApp', {
            cluster: devCluster
        });
    }
}
