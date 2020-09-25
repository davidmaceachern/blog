# Publishing my First Crate

In my last post I demonstrated how to use functionality created by other people that is packaged in Crates. 

What if the exact functionality we want doesn't already exist on [crates.io](https://www.crates.io)?

We can being by thinking about the design of the component.

Breaking the design down will allow us to identify the functions that we can look for in other Crates that we might be able to depend on.

Otherwise any new functionality we can write ourselves and share back to the Rust community.

We can go to this [page](https://doc.rust-lang.org/cargo/reference/publishing.html) to understand how to publish a crate.

## Determining the scope

I already know what I want to try to look into, this is the great thing about your own projects is you can decide whatever you want.

We still need to define our scope though, this helps us to ensure we don't build something we don't finish, or add features we don't need to our deliverable. The definition of project scope is [definition here.](https://www.pmi.org/learning/library/top-five-causes-scope-creep-6675) 

I like to think of a project as any kind of size, though for communicating with other team members we might come up with better definitions such as "Epic", "Story", "Task", "Sub-task". Each size of project will have an effort associated with it, or how much work is required to consider the project complete.

This helps the organization the project is for understand how long the project might take and helps people to decide about whether we need to change the requirements or have more people working on it.

If my project is smaller than your project though then maybe it would be a mini-project 🤷‍♂️.

OK, so I know I want to create a project which is related to Site Reliability Engineering, but that's a pretty big scope (552 pages of scope to be exact!). So instead I will choose to implement something that might be more achievable as a mini-project, let's learn about `Error Budgets`!

## Creating the project locally

First we need Crate that might be useful to share, this is also known as a library. We are going to create a basic module which will calculate an error budget.

``` Bash
cargo new error-budget --lib
```

An error budget is a Site Reliability Engineering term. It's definition is:

> "The error budget provides a clear, objective metric that determines how unreliable the service is allowed to be within a single quarter" 
— [SRE Book](https://landing.google.com/sre/sre-book/chapters/embracing-risk/)

Google also helpfully includes a formula that we can use to calculate our objective metric. When we say that the metric will be objective, it means that all our product stakeholders can agree that the metric represents the same outcome of reliability.

Say for example we consider the end-user as a stakeholder, and the feature development team as the other. The end-user is interested in the continuing availability of the service that they are using, so they don't expect there to be more than a certain number of errors per day otherwise they might complaint that the service is not available. 

The feature team however, they are interested in delivering new features to enhance the existing experience the customer has. The problem with shipping new features is that there is an associated risk that existing service availability is affected if bugs are introduced or existing ones made worst.

If our metric was not objective from both perspectives: then what can end up happening is that features are released too quickly, causing the customer experience to worsen because our metric does not truly represent what a stable product is to the customer. 

The other scenario is that the features are not released quickly enough, because we prioritize making our product more stable than the customer actually cares for it to be. For example if the end-user was working 9-5 then they might not care if the product is offline at the weekend, so we could schedule activities that cause downtime at the weekend.

So now that we understand a bit more about an objective metric let's choose an example metric to use to write some tests for our library.

HTTP Server Logs are a good example of what we might want to monitor. Let's explain how this might affect the user. The user is attempting to add an item to their basket. When they perform this action a call is made to the backend to write the record to a table. The problem is that the table can only receive so many write requests to it at once, and multiple other users are also performing the action at the same time. The application has a bottleneck, and unfortunately the original design did not account for this corner case. We don't need to worry though because we are monitoring it with our objective metric! The metric was agreed and will take into account two things:
- How many times a customer will try before giving up and not purchasing the item. If this happens enough times we lose a certain amount of money.
- Being granular or real-time enough to enable our SRE team or product manager to make a decision about when and what we invest into fixing the issue within the given time frame.

The error budget is a number we can look at which will let us know how long we can ignore the problem before we lose an unacceptable amount of money and reputation. Maybe we won't breach the error budget for 2 weeks, in which case our team could spend one week finishing shipping a feature, a feature which maybe even would fix the problem, or at least have 1 week left to respond to problem. //This of course doesn't take into account other issues such as whether are expected to close issues by a certain time.

We respond by raising an incident and ensure the customers understand we know that there is a problem. We follow this up with a short-term fix that might actually address the root cause, for example we increase the write capacity to the database table. 

If we find that this type of incident occurs repeatedly we can decide if we want to spend resources rearchitecting to fix the root cause, or it might be that the solution is simply to increase write capacity each time by following a step by step guide in the form of a runbook.

So the description of an error-budget above explains that it might be in a quarter that we take a measurement. This might not apply to all different types of projects that have different time scales, so the SRE Book handily provides some example data that we could use to write our tests.

## Using our crate in an application

Normally functionality is worth writing a library for only once it has been used more than 3 times in different places. 

This is because writing a library takes additional work that we wouldn't otherwise need to undertake if only writing a function once to use in our application.

Let's think about the end-users (me for now!) of our Crate. I want to write an AWS Lambda which will make use of the function we have written in our crate.

### Test data

### Setting up parameterized tests.

### Setting up property tests