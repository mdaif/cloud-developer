# Submission Notes
1. The API endpoint http://image-filter-starter-code-dev222.us-east-1.elasticbeanstalk.com/
2. The API endpoint can be also accessed via http://image-filter.daif.me , but I used my existing domain on name.com and not Route 53 (I know there's a way of letting Route53 handles a subdomain and I can leave the domain under name.com) but this documnted as "uncommon" [here](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/CreatingNewSubdomain.html#decide-procedure-create-subdomain) and I personally find no need for that now. 
3. The exported Postman collection has requests and tests for every case.
4. The provided image is protected (returns 403 access denied for normal GET requests). This is handled as a 400 bad request.
5. I used JWT authentication and the exported Postman collection has the right token.If not provided it returns 401 unauthorized error.
6. Development is merged to master and tag v0.1, v0.2 are added. (v0.2 refactors the filterImageFromURL code to handle unaccessible images)
7. README updates are added directly on Github. That might cause some annoying commits but they could be squashed.

# Udagram Image Filtering Microservice

Udagram is a simple cloud application developed alongside the Udacity Cloud Engineering Nanodegree. It allows users to register and log into a web client, post photos to the feed, and process photos using an image filtering microservice.

The project is split into three parts:
1. [The Simple Frontend](https://github.com/udacity/cloud-developer/tree/master/course-02/exercises/udacity-c2-frontend)
A basic Ionic client web application which consumes the RestAPI Backend. [Covered in the course]
2. [The RestAPI Backend](https://github.com/udacity/cloud-developer/tree/master/course-02/exercises/udacity-c2-restapi), a Node-Express server which can be deployed to a cloud service. [Covered in the course]
3. [The Image Filtering Microservice](https://github.com/udacity/cloud-developer/tree/master/course-02/project/image-filter-starter-code), the final project for the course. It is a Node-Express application which runs a simple script to process images. [Your assignment]

## Tasks

### Setup Node Environment

You'll need to create a new node server. Open a new terminal within the project directory and run:

1. Initialize a new project: `npm i`
2. run the development server with `npm run dev`

### Create a new endpoint in the server.ts file

The starter code has a task for you to complete an endpoint in `./src/server.ts` which uses query parameter to download an image from a public URL, filter the image, and return the result.

We've included a few helper functions to handle some of these concepts and we're importing it for you at the top of the `./src/server.ts`  file.

```typescript
import {filterImageFromURL, deleteLocalFiles} from './util/util';
```

### Deploying your system

Follow the process described in the course to `eb init` a new application and `eb create` a new environment to deploy your image-filter service! Don't forget you can use `eb deploy` to push changes.

## Stand Out (Optional)

### Refactor the course RESTapi

If you're feeling up to it, refactor the course RESTapi to make a request to your newly provisioned image server.

### Authentication

Prevent requests without valid authentication headers.
> !!NOTE if you choose to submit this, make sure to add the token to the postman collection and export the postman collection file to your submission so we can review!

### Custom Domain Name

Add your own domain name and have it point to the running services (try adding a subdomain name to point to the processing server)
> !NOTE: Domain names are not included in AWS’ free tier and will incur a cost.
