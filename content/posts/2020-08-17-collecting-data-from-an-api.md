---
template: post
title: Collecting Data from an API
slug: collecting-data-from-an-api
draft: true
date: 2020-08-17T11:18:19.921Z
description: "\n"
category: Rust
tags:
  - Data API Filesystem Crates
---
Data is essential when building applications. Let's collect some data that we can use to write an application.

## Requirements
Before going further let's define how we can address the requirements of the application to avoid doing more than necessary.

We will write the application in Rust.
- 
- **Collecting data** can be done using HTTP.
- **Storing data** can be done using a filesystem. This can be done by serializing the data we collect and outputting it to a file.

## Finding an API

## Choosing some crates to query the API

## Persisting the data locally

We want the data to be used after our application has finished running. This is useful if the application crashes, or we have another application that will use the data elsewhere.

- We are writing a new file for each dataset that we collect. 
- We restrict the number of calls we are writing a single record at a time.

In future if we increased the collection frequency then we might want to consider a different storage layer that considers scalability.

## Future work
- Add a test that will mock calling the api.
- Create a data factory for generating random data.
- Use a storage layer such as Amazon S3 to enable scaling.