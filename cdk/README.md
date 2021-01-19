# Deploying it all

## Initial steps

```bash
cd cdk
npm ci
npm run watch
```

## Deploying VPCs and ECS Clusters

The CICD pipelines expect that the Dev and Prod ECS Clusters / VPCs have already been deployed. Open an new terminal, change dir into the cdk directory, list all the stacks and then deploy both the DevCluster and ProdCluster stacks

```bash
cd cdk
cdk list
cdk deploy DevMicroServiceStack

```

Wait for the stacks to finish their deployment. You can verify that you have a dev and prod ECS Cluster here:

https://console.aws.amazon.com/ecs/home#/clusters

## Deploying the Dev Pipeline

Now deploy the dev pipeline

```bash
cdk deploy DevPipelineStack
```

Once deployed it will immediately start running, create ECR repos, build docker images and push them into those ECR repos, use CDK synth to create a CloudFormation template for the **DevAppStack** and deploy that CloudFormation stack.

You can check out the following AWS created resources:

- Pipeline: https://console.aws.amazon.com/codesuite/codepipeline/pipelines

- ECR repos: https://console.aws.amazon.com/ecr/repositories

- CloudFormation stacks: https://console.aws.amazon.com/cloudformation/home#/stacks

  
## Cleaning up

The resources created does incur cost so remember to clean up by running cdk destroy on the stacks. Cost is mainly for the ECS Fargate tasks, the load balancers and the VPC NAT gateways. To delete everything run the following

```
cdk destroy DevPipelineStack
cdk destroy DevMicroServiceStack
```



# Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template