---
title: Javascript heap out of memory, so what? 
date: "2020-08-10T16:40:32.169Z"
template: "post"
draft: false
slug: "javascript-heap-out-of-memory"
category: "nodejs"
tags:
  - "Web Development"
  - "Starting out"
  - "Errors"
  - "Meta"
  - "Issue tracking"
  - "Reproducibility"
description: "When development environment problems turn into a blogging opportunity..."
socialImage: ""
---

In all seriousness, if you are here to solve your problem then you might be better going to [Stackoverflow](https://stackoverflow.com/questions/38558989/node-js-heap-out-of-memory) and trying what is described there.

If you tried that but with no luck... continue reading...

## Recreating an issue

When we want someone to help us fix a problem we have never seen before it's good practice to explain what led to the problem in the first place.

This is one of the reasons Stackoverflow and other Issue tracking systems such as Jira exist, and you can learn more about how to ask questions [here](https://stackoverflow.com/help/how-to-ask). Simply put, the context of the problem is important!
1. I cloned this lovely [Gatsby Blog Starter Template](https://www.gatsbyjs.org/starters/alxshelepenok/gatsby-starter-lumen/) to mess around and see if it met my needs.
2. After adding a few changes I decided to replace the existing landing page I had hosted with Github pages with this template, there are a few different ways I could have done this but I chose to recursively copy my changes into the other directory where the landing page was. 
```
rm -rf ./github/blog/*
cp -R ./github/gatsby-starter-lumen/ ./github/blog
cd ./github/blog
npm install
```
3. This didn't work out, we don't want to copy of the `.git` files from one repository to the other as that would stop our local from working with the remote. Upon running the development server using `gatsby develop`, halfway through I encountered the following error:

``` Bash
<--- JS stacktrace --->

==== JS stack trace =========================================

    0: ExitFrame [pc: 0xa4e00e5be1d]
Security context: 0x38520199e6e9 <JSObject>
    1: toActionObject(aka toActionObject) [0x3863fd05cb9] [/home/davidmaceachern/github/blog/node_modules/xstate/lib/actions.js:~54] [pc=0xa4e013b107a](this=0x329f1d7026f1 <undefined>,action=0x3581c61a2f11 <Object map = 0x372833382d59>,actionFunctionMap=0x03863fd1f439 <Object map = 0x7ef0b47f351>)
    2: /* anonymous */(aka /* anonymous */) [0x1f9306f79ae1] [...

FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
```

I had seen this error once before when writing an inefficient looping algorithm . It seems that the v8 engine has a memory limit in place by default, and a quick search confirms this is a well documented [issue](https://stackoverflow.com/questions/38558989/node-js-heap-out-of-memory). So I tried what was recommended...

4. `NODE_OPTIONS="--max-old-space-size=4096" gatsby develop`. The results were the same, the heap ran out of memory.
5. Googling further into this problem, I checked for if others had issues with `mark-compacts`. Hurray that turned up answers as well, and even an in [depth guide](https://www.toptal.com/nodejs/debugging-memory-leaks-node-js-applications) on debugging memory leaks... Essentially the article explains how to find objects in your application run time that are not being correctly cleaned up, and at this stage I begin to ask myself if this is a rabbit hole I want to continue with...

## Starting from a clean slate

When in doubt, it is often cost-effective to start again. Since I knew I wanted to use this blog template I forked the original (thanks @alxshelepenok) and quickly made all the changes I had made before.

The original goal I set out to achieve was to get a blog ready to start sharing some knowledge around topics I have been working on. It's always important to keep in mind the underlying motivations behind doing something, and to check in with yourself to see if the problem you are solving will help you reach your objective.
