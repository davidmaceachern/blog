---
slug: getting-started-with-s3-without-an-aws-account
draft: true
socialImage: ""
template: post
title: Getting started with S3 without an AWS account
date: 2020-08-10T16:40:32.169Z
description: Getting started with S3 without an AWS account
category: Rust
tags:
  - Development CNCF
---
A good place to begin when learning about developing Cloud Native solutions is with collecting some data and storing it in a filesystem. 

You might not have access to an AWS account, or you might be wanting a provider agnostic solution. AWS free tier is very generous and definitely enough for small organisations to get their business value out there to test ideas.

The cloud has a reputation of being complex, but it consists of components that have existed for decades. One of these components helps us to store data in a filesystem, and in the cloud this is known as an object store. 

We can draw parallels with object stores and the filesystem that we use on our desktop machines.

This is essentially what Amazon S3 is, an object store, and until we have more complex requirements then we can store our data as a file in an object store such as S3.

You might want to learn about how to develop an application that uses S3 without actually creating an AWS account. So let's have a look at how one might achieve this.

We can see what is currently on the market by visiting this cool [CNCF diagram](https://landscape.cncf.io/). Looking under the object stores there a few options. Two that I recognise are Ceph and Minio. This diagram helpfully shows us some details about each of these projects.

|Minio|Ceph|
|:----:|:---:|
|23,268||

```
docker run -p 8999:9000 \
  -e "MINIO_ACCESS_KEY=AKIAIOSFODNN6EXAMPLE" \
  -e "MINIO_SECRET_KEY=wJalrXUtnFEMI/K6MDENG/bPxRfiCYEXAMPLEKEY" \
  minio/minio server /data
```