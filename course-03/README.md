# General notes
My approach to deploy from Travis is to assume that the infrastructure has been set up and the Kubernetes cluster was successfully built. Effectively, that means that I followed the [Kubeone tutorial](https://github.com/kubermatic/kubeone/blob/master/docs/quickstart-aws.md) until I generated the kubeconfig file and tracked it with my github. I then configured Travis to use the file to interact with the cluster using Kubectl. 
I stored most of the credentials in Travis env variable and used travis cli to encrypt a dedicated ssh keys file.

# How to run

## You'll need to install Travis CLI
Travis CLI is used to provide some functionality and ease the interaction with Travis.
You can install it by following the instructions [here](https://github.com/travis-ci/travis.rb)
## Deployment SSH keys
You need to create dedicated SSH keys for Kubernetes deployments that would be shared between your local machine and Travis.
1. Cd to your project root where your .travis file is located.
2. Run the command 
    `ssh-keygen -t rsa -b 4096 -C 'build@travis-ci.org' -f ~/.ssh/deploy_rsa`
3. Run the command
    `travis encrypt-file ~/.ssh/deploy_rsa --add`
    which will encrypt your private key and add it to .travis file. (Note that for some reason, the tool adds an unnecessary escape character "\\" which you'll have to remove)
4. For more information, consult [this](https://oncletom.io/2016/travis-ssh-deploy/) website

## Install Kubectl locally
1. You can install kubectl by following https://kubernetes.io/docs/tasks/tools/install-kubectl/
2. Make sure you are using a specific version (I'm using the latest version "1.17.3" at the point of writing this README) since it's important that kubectl and Kubernetes cluster have the same version.

## Create the infrastructure using Terraform
Using the steps described in more details [here](https://github.com/kubermatic/kubeone/blob/master/docs/quickstart-aws.md) on your local machine:
1. Install Terraform and Kubeone.
2. Export AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY env variables.
3. Clone Kubeone repo and cd to ./examples/terraform/aws
4. Run the command `terraform init` 
5. Edit file `variables.tf` and change
    ```
     variable "ssh_public_key_file" {
        description = "SSH public key file"
        default     = "~/.ssh/id_rsa.pub"
    }
    ```
    To
    ```
     variable "ssh_public_key_file" {
        description = "SSH public key file"
        default     = "~/.ssh/deploy_rsa.pub"
    }
    ```
    This is to copy the public deployment keys to the machines created by Terraform.
6. Edit terraform.tfvars according to your needs. In my case
    ```
        cluster_name = "udacitycluster"
        aws_region = "us-east-1"
    ```
7. Run `terraform apply` to create the infrastructure.

## Create Kubernetes cluster
1. Create a file named config.yaml with the following content
    ```
    apiVersion: kubeone.io/v1alpha1
    kind: KubeOneCluster
    versions:
      kubernetes: '1.17.3'
    cloudProvider:
      name: 'aws'
    ```
2. Create a Terraform state file
    `terraform output -json > tf.json`
3. Run `kubeone install config.yaml --tfjson .`
4. Wait until cluster creation is finished. This will result in creating a file called udacitycluster-kubeconfig. Note that the first name is {cluster name}-kubeconfig
5. Run the command `export KUBECONFIG=$PWD/udacitycluster-kubeconfig` This tells your kubectl the necessary info about your cluster.
6. Track udacitycluster-kubeconfig in your codebase, it should be located next to .travis file in the project root directory.
7. Now you have an up and running empty cluster. If you run `kubectl get pod` The command would succeed without retrieving any pods (because we got none so far)
    `No resources found in default namespace.`
# Continuous Delivery using Travis.
- .travis file uses the same ssh keys to access the cluster machines, the same kubeconfig file to reach the cluster.
- Make sure you set the following env variables in Travis web console AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY and DOCKER_COMPOSE_VERSION.
- Travis is now able to 
    -- Install docker-compose (to build the docker images)
    -- Install kubectl (to manage the cluster)
    -- Login to docker.
    -- Build the images and push the resulting images to docker repo.
    -- Deploy all files under `course-03/exercises/udacity-c3-deployment/k8s/`

# Zero down time and two versions of the service
- Kubernetes does that out of the box using ReplicaSets. You can find a screenshot entitled "scaled down Replica sets" which shows the graceful termination of the old pods.
- The default strategy for Deployments is RollingUpdate with maxSurge = 25% which means the strategy is to replace old pods with new ones gradually, while continuing to serve clients without incurring downtime. The maxSurge is the maximum number of pods that can be created over the desired number of pods.
