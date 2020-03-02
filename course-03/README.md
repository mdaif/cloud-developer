# General notes
My approach to deploy from Travis is to assume that the infrastructure has been set up and the Kubernetes cluster was successfully built. Effectively, that means that I followed the [Kubeone tutorial](https://github.com/kubermatic/kubeone/blob/master/docs/quickstart-aws.md) until I generated the kubeconfig file and tracked it with my github. I then configured Travis to use the file to interact with the cluster using Kubectl. 
I stored most of the credentials in Travis env variable and used travis cli to encrypt a dedicated ssh keys file.
