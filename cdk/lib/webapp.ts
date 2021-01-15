import cdk = require('@aws-cdk/core');
import ecs = require('@aws-cdk/aws-ecs');
import ecsPatterns = require('@aws-cdk/aws-ecs-patterns');
import ecr = require('@aws-cdk/aws-ecr');
import { Cluster } from './cluster';

interface WebAppProps {
    readonly cluster: Cluster;
}

class WebApp extends cdk.Construct {
    private fargateService: ecsPatterns.ApplicationLoadBalancedFargateService;

    public readonly service: ecs.IBaseService;
    public readonly containerName: string;
    public readonly ecrRepo: ecr.Repository;

    constructor(scope: cdk.Construct, id: string, props: WebAppProps) {
        super(scope, id);
        this.ecrRepo = new ecr.Repository(this, 'ECRRepoNest');

        this.fargateService = this.createService(props.cluster.ecsCluster);
        this.service = this.fargateService.service;
        this.containerName = this.fargateService.taskDefinition.defaultContainer!.containerName;

        this.grantPermissions();
        this.addAutoScaling();
        this.output();
    }

    private createService(cluster: ecs.Cluster) {
        const region = cdk.Stack.of(this).region;
        const loadBalancedFargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'ServiceForNest', {
            cluster: cluster,
            memoryLimitMiB: 512,
            desiredCount: 2,
            cpu: 256,
            taskImageOptions: {
                image: ecs.ContainerImage.fromAsset('../'),
                containerPort: 3000,
                environment: {
                    AWS_REGION: region,
                }
            }
        });

        loadBalancedFargateService.targetGroup.configureHealthCheck({
            path: "/",
            interval: cdk.Duration.seconds(120),
            unhealthyThresholdCount: 5
        });

        return loadBalancedFargateService;
    }

    private addAutoScaling() {
        const autoScalingGroup = this.fargateService.service.autoScaleTaskCount({
            minCapacity: 2,
            maxCapacity: 10
        });
        autoScalingGroup.scaleOnCpuUtilization('CpuScalingForNestApp', {
            targetUtilizationPercent: 60,
            scaleInCooldown: cdk.Duration.seconds(60),
            scaleOutCooldown: cdk.Duration.seconds(60),
        });
    }

    private grantPermissions() {
        const taskDefinition = this.fargateService.taskDefinition;
        this.ecrRepo.grantPull(taskDefinition.executionRole!);
    }

    private output() {
        new cdk.CfnOutput(this, 'ECRRepoURI', {value: this.ecrRepo.repositoryUri});
        new cdk.CfnOutput(this, 'ServiceName', {value: this.service.serviceName});
        new cdk.CfnOutput(this, 'ContainerName', {value: this.containerName});
    }
}

export {WebApp, WebAppProps};