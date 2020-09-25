# Using Rust, Localstack, and Terraform

It's hard to know where to begin sometimes, so much information out there on blogs and different opinions.

One thing is for sure it's good to know that using the Cloud can end up being expensive.

    "Is the AWS Free Tier really free?
    
    No. No! Oh my god no. It absolutely is not.

    The AWS Free Tier is free in the same way that a table saw is childproof. If you blindly rush in to use an 
    AWS service with the expectation that you won't be charged, you're likely to lose a hand in the process."

    — 'Cloud Economist' Corey Quinn


So here you go, here's mine. Let's have a look today at `localstack` and see if we can use it to write some Rust in the Cloud, on our laptop..

If you want the code 

## Running a localstack

[John Ruble](https://spin.atomicobject.com/2020/02/03/localstack-terraform-circleci/) did something similar to what I need today so thanks to 
his work we have a headstart today. If you want to have a better understanding go check out his article!

c

``` yaml
version: "2.1"

services:
  localstack:
    image: localstack/localstack:0.11.4
    ports:
      - "4567-4597:4567-4597"
      - "${PORT_WEB_UI-8080}:${PORT_WEB_UI-8080}"
    environment:
      - SERVICES=s3,iam,lambda
      - DEBUG=${DEBUG- }
      - DATA_DIR=${DATA_DIR- }
      - PORT_WEB_UI=${PORT_WEB_UI- }
      - LAMBDA_EXECUTOR=docker-reuse
      - KINESIS_ERROR_PROBABILITY=${KINESIS_ERROR_PROBABILITY- }
      - DOCKER_HOST=unix:///var/run/docker.sock
    volumes:
      - "${TMPDIR:-/tmp/localstack}:/tmp/localstack"
      - "/var/run/docker.sock:/var/run/docker.sock"
```

I'm running linux so I will just run.

``` bash
docker-compose up
```

Ok so I'm going to take the code I used in my [previous article](https://davidmaceachern.com/posts/collecting-data-from-an-api) and 
we can run this as lambda to see if we can do this with Rust!

Ok so we use the aws cli to access our services as follows

```
aws --endpoint-url=http://localhost:4574 lambda list-functions
aws --endpoint-url=http://localhost:4572 s3 ls
```

## Creating a Lambda placeholder

For now, we want to set up the skeleton for our Lambda. This requires a few steps which 
[can be found here](https://aws.amazon.com/blogs/opensource/rust-runtime-for-aws-lambda/).




## Setting up an integration test for AWS Lambda

Integration tests, component tests will provide a better guarantee that our code does what we expect. Where a unit test tells us
what code and functionality we should expect to have, an integration test checks if the code works when it is packaged in a similar context
to what our production environment is.

Following work that was done by [Ciaran Evans](https://medium.com/uk-hydrographic-office/developing-and-testing-lambdas-with-pytest-and-localstack-21a111b7f6e8)

We will set out to achieve the same but using the Rust SDK, Rusoto.


###

###
