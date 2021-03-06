---
template: post
title: Collecting Data from an API
slug: collecting-data-from-an-api
draft: false 
date: 2020-09-09T18:18:19.921Z
description: "Step by step guide to retrieving data from an API over HTTP and storing it in a Filestore as JSON."
category: Rust
tags:
  - Data 
  - API
  - Filestore
  - Crates
  - Logging
  - CLI
socialImage: "/media/collecting-data-2020-08-11-1827.svg"
---
![Data](/media/data.webp)
*— Photo by [Taylor Vick](https://unsplash.com/photos/M5tzZtFCOfs) on [Unsplash](https://unsplash.com/)*

Data is essential when building applications. We can collect data by calling an API and storing it locally in a database or filestore.

Continue reading if you want to do the following in Rust:

- [Find some data to use](#finding-data.)
- [Query an API and handle some HTTP errors](#setting-up-the-project.)
- [Collect some data saving it locally as JSON](#persisting-the-data-locally.)

If you are looking for the complete code you can find it [here](https://www.github.com/davidmaceachern/playground-data-collection-rust).

## Requirements

Let's consider how we can achieve our goal:
- **Finding data** we need to have some open data we can collect from an API somewhere. It needs to be open because like Music and Films we need to have permission to use it.
- **Collecting data** we can do this using an HTTP client, it's worth noting that a data structure that is transmitted via HTTP is serialized as a string.
- **Storing data** can be achieved by using a filestore. This can be done by converting the strings we collect to a suitable data structure and outputting it to a file. The format we choose will depend on what we want to do with the data later on.

![collecting-data-2020-08-11-1827.svg](/media/collecting-data-2020-08-11-1827.svg)
*The flow of data from the internet to our machine.*

## Finding Data 

Firstly we need an API we can query for some data, a good place to start is this [repository](https://github.com/public-apis/public-apis).

For this exercise, we are going to get some [cat facts](https://alexwohlbruck.github.io/cat-facts/docs/). Taking a look through the repository we can see a [repository licence](https://github.com/alexwohlbruck/cat-facts/blob/master/LICENSE), which looks permissive enough to use this data.

We can use a web browser to call a `GET` endpoint, pasting this endpoint `https://cat-fact.herokuapp.com/facts/random` into the address bar returns the following response.

``` Json
{
  "used": false,
  "source": "api",
  "type": "cat",
  "deleted": false,
  "_id": "591f98703b90f7150a19c151",
  "__v": 0,
  "text": "Cat families usually play best in even numbers. Cats and kittens should be aquired in pairs whenever possible.",
  "updatedAt": "2020-06-30T20:20:33.478Z",
  "createdAt": "2018-01-04T01:10:54.673Z",
  "status": {
    "verified": true,
    "sentCount": 1
  },
  "user": "5a9ac18c7478810ea6c06381"
}
```
Ok this is great but we want our application to do this for us.


## Writing an Application in Rust

### Setting up the project

We are going to write our application in Rust, if you haven't already you can install Rust using the instructions [here](https://www.rust-lang.org/learn/get-started).

To install code packages created by other people we will need to check if we have the `Cargo` package manager, we can do this by running: 

``` Bash
$ cargo --version
```
If that returned the version we have, we can then initialize a new project that uses the current folder as the name of the project by running:

``` Bash
$ cargo init --bin
```

One thing I like about Rust is the ecosystem. If another language has a feature that is useful it can be recreated as a crate and used. Maybe in a future Rust Edition this feature might be built in!

One such crate I would recommend is `cargo-edit` which let's us add packages the same way we might do in Javascript by using `$ npm install --save`.

We can install this package by running:

``` Rust
$ cargo install cargo-edit
```

### Breaking down the problem

To address the problem our application will solve, we can use the following crates together:
- The HTTP client we can use to send the request for our data is very helpfully called [reqwest](https://crates.io/crates/reqwest)
- Filesystem interactions will be provided by a JSON file store called [jfs](https://crates.io/crates/jfs)
- To convert our strings to data structures and data structures to strings we can use [serde](https://crates.io/crates/serde)
- For dealing with JSON data structures we can use [serde_json](https://crates.io/crates/serde_json)
- To avoid worrying about how we implement errors for now we can use [anyhow](https://crates.io/crates/anyhow)


``` Bash
$ cargo add reqwest serde serde_json jfs anyhow 
```

The output will look like:

``` Bash
      Adding reqwest v0.10.7 to dependencies
      Adding serde v1.0.115 to dependencies
      Adding serde_json v1.0.57 to dependencies
      Adding jfs v0.6.2 to dependencies
      Adding anyhow v1.0.32 to dependencies
```

Without specifying a version number for these libraries, we will want to check the versions we are telling Cargo to use because that will determine which version of the documentation we need to look at.

Inside the `Cargo.toml` we can see:

``` Toml
[dependencies]
reqwest =  "0.10",
serde = "1.0.115",
serde_json = "1.0.57"
jfs = "0.6.2"
anyhow = "1.0.32"
```

So next we can build the application to install the dependencies, we can do this by running:

``` Rust
$ cargo build
```
What I am going to do from here onwards however:

``` Rust
$ cargo run
```
Which will build and execute the code for us so we can have some feedback.
``` Bash 
    Finished dev [unoptimized + debuginfo] target(s) in 0.06s
     Running `target/debug/data-collection-rust`
Hello, world!!
```
Normally if we had tests written then we could have them watch for new  file changes but that is out of scope for the article today.

### Calling the API

We will start by replicating calling the API in our application.

In a similar way to how the Web Browser was our client before, we must have a client that will interact with the API.

``` diff
 fn main() {
-    println!("Hello, world!");
+    let client = reqwest::blocking::Client::new();
 }
```
Running this code, we encounter an error.
``` Bash
error[E0433]: failed to resolve: could not find `blocking` in `reqwest`
 --> src/main.rs:2:27
  |
2 |     let client = reqwest::blocking::Client::new();
  |                           ^^^^^^^^ could not find `blocking` in `reqwest`
```

When using some crates we must specify the features that our application will use in the `Cargo.toml`.

``` diff 
 [dependencies]
-reqwest = "0.10"
+reqwest = { version = "0.10", features = ["blocking"] }
```
Ok so let's add another line to call out endpoint
``` diff
     let client = reqwest::blocking::Client::new();
+    let uri = "https://cat-fact.herokuapp.com/fact/random";
+    let response = client.get(uri).send()?;
```

Upon running our application again we see another error:

``` Bash
error[E0277]: the `?` operator can only be used in a function that returns `Result` or `Option` (or another type that implements...
```

We're using the `?` operator here to handle calling a function that could throw an error. Let's do as the compiler suggests:

``` diff
-fn main() {
+fn main() -> Result {
```
It seems that isn't exactly what the compiler wants:
``` Bash
error[E0107]: wrong number of type arguments: expected 2, found 0
 --> src/main.rs:1:14
  |
1 | fn main() -> Result {
  |              ^^^^^^ expected 2 type arguments
```
The Result will only be the return type if our code is successful, if not then this function will return an error. This is where we can use `anyhow`:
``` diff
-fn main() {
+fn main() -> Result<(),  anyhow::Error> {
```
Ok, so we have another compiler error...
``` Bash
error[E0308]: mismatched types
 --> src/main.rs:1:14
  |
1 | fn main() -> Result<(), anyhow::Error> {
  |    ----      ^^^^^^^^^^^^^^^^^^^^^^^^^ expected enum `std::result::Result`, found `()`
  |    |
  |    implicitly returns `()` as its body has no tail or `return` expression
```
We need to add the following it seems, for any successful outcome that doesn't throw an error.
``` diff
     let response = client.get(uri).send()?;
+    Ok(())
 })
```

So we probably want to know what the response looks like. We can take a quick look using the following macro:

``` diff
+    dbg!(response);
     Ok(())
```
And it appears that I might have mistyped the url, as we receive a `not found` error.

``` Bash
[src/main.rs:5] response = Response {
    url: "https://cat-fact.herokuapp.com/fact/random",
    status: 404,
    headers: {
        "server": "Cowboy",
        "connection": "keep-alive",
        "x-powered-by": "Express",
        "access-control-allow-origin": "*",
        "content-security-policy": "default-src 'none'",
        "x-content-type-options": "nosniff",
        "content-type": "text/html; charset=utf-8",
        "content-length": "150",
        "set-cookie": "connect.sid=s%3A5IS9zYZqbamwJECS6C5JrdcDfIBJ8epX.Lbh4Zl5C21jdFOyih1RgS1%2FiZr2c8jxbEc1l1XiwTvo; Path=/; HttpOnly",
        "date": "Tue, 25 Aug 2020 17:46:27 GMT",
        "via": "1.1 vegur",
    },
}
```

I checked the API documentation and indeed I had mistyped the url. 

``` diff
-    let uri = "https://cat-fact.herokuapp.com/fact/random";
+    let uri = "https://cat-fact.herokuapp.com/facts/random";
```
After correction, we get the correct status code.

``` diff
    url: "https://cat-fact.herokuapp.com/facts/random",
    status: 200,
    headers: {
```

It would probably be a good idea to handle errors when we don't get a `200` response. Let's check the response value so we can add a condition.

``` diff
-    dbg!(response);
+    dbg!(response.status());
```
Ok.
``` Bash
[src/main.rs:5] response.status() = 200
```
Now let's add a conditional.

``` diff
-    dbg!(response.status());
+    if(response.status() == 200) {
+        println!("{}", response.status());
+    }
```
Cool.

``` Bash
200 OK
```
However we want it to throw an error right, seems `reqwest` might let us do this, let's force it to fail again by adding the typo back in.

``` diff
-    let uri = "https://cat-fact.herokuapp.com/facts/random";
+    let uri = "https://cat-fact.herokuapp.com/fact/random";
     let response = client.get(uri).send()?;
-    if(response.status() == 200) {
+    if response.status().is_client_error() || response.status().is_server_error() {
         println!("{}", response.status());
     } 
```
And let's have the application return the error it encounters to avoid running any other code. We can do this by using a macro bundled with anyhow.

``` diff
+use anyhow::anyhow;
+
 fn main() -> Result<(), anyhow::Error> {
     let client = reqwest::blocking::Client::new();
     let uri = "https://cat-fact.herokuapp.com/facts/random";
     let response = client.get(uri).send()?;
     if(response.status().is_client_error() || response.status().is_server_error()) {
-        println!("{}", response.status());
+        return Err(anyhow!("Server responded with: {}", response.status()));
     } 
     Ok(())
```
Seems the compiler is warning us about something:
``` Bash
warning: unnecessary parentheses around `if` condition
```
Remove the parentheses and now upon receiving a status code that isn't `200` it should return an error.
``` Bash
Error: Server responded with: 404 Not Found
```
Great. Next, let's look at getting our facts out of the response.

### Deserializing Data

Let's start by trying to deserialize the response string into our applications memory.

``` diff
+    let deserialized = serde_json::from_str(response.text());
     Ok(())
```

The compiler complains...

``` Bash
error[E0308]: mismatched types
  --> src/main.rs:10:39
   |
10 |     let deserialized = serde_json::from_str(response.text());
   |                                       ^^^^^^^^^^^^^^^ expected `&str`, found enum `std::result::Result`
```
We can try to get the result by telling Rust that we might expect an error on both function calls, allowing us to access the result which hopefully is of type `&str`.

``` diff
-    let deserialized = serde_json::from_str(response.text());
+    let deserialized = serde_json::from_str(response.text()?)?;
```

``` Bash
error[E0308]: try expression alternatives have incompatible types
  --> src/main.rs:10:39
   |
10 |     let deserialized = serde_json::from_str(response.text()?);
   |                                       ^^^^^^^^^^^^^^^^
   |                                       |
   |                                       expected `&str`, found struct `std::string::String`
   |                                       help: consider borrowing here: `&response.text()?`
```

Wow, the compiler tells us what we might be able to do to fix the problem. Then if we reference using the borrow operator on the response instead...

``` Bash
warning: unused variable: `deserialized`
  --> src/main.rs:10:9
   |
10 |     let deserialized = serde_json::from_str(&response.text()?)?;
   |         ^^^^^^ help: if this is intentional, prefix it with an underscore: `_deserialized`
   |
   = note: `#[warn(unused_variables)]` on by default

warning: 1 warning emitted

    Finished dev [unoptimized + debuginfo] target(s) in 3.20s
     Running `target/debug/data-collection-rust`
Error: invalid type: map, expected unit at line 1 column 0
```

Ok, nice so we only have one warning which we can ignore because we plan to use the variable later. The error however might take some figuring out.

![spongebob.jpg](/media/spongebob.jpg)

So it turns out we can coerce Rust to try to parse using a specific type provided by serde_json. This will only work if the item is valid JSON.

``` diff
-    let deserialized = serde_json::from_str(&response.text()?)?;
+    let value: Value = serde_json::from_str(&response.text()?)?;
```
So the code compiles, we can print out what string now holds to check what the response body looks like.

``` diff
+    dbg!(string);
```

``` bash
[src/main.rs:12] value = Object({
    "__v": Number(
        0,
    ),
    "_id": String(
        "591f97d48dec2e14e3c20aff",
    ),
    "createdAt": String(
        "2018-01-04T01:10:54.673Z",
    ),
    "deleted": Bool(
        false,
    ),
    "source": String(
        "api",
    ),
    "status": Object({
        "sentCount": Number(
            1,
        ),
        "verified": Bool(
            true,
        ),
    }),
    "text": String(
        "Cats have the largest eyes of any mammal.",
    ),
    "type": String(
        "cat",
    ),
    "updatedAt": String(
        "2020-08-23T20:20:01.611Z",
    ),
    "used": Bool(
        false,
    ),
    "user": String(
        "5a9ac18c7478810ea6c06381",
    ),
})
```

Awesome, so this looks more like the kind of data we might want to use later. Rust even provides us with what types it thinks the fields are.

### Determining the types

Rust is a strongly typed language so this means we define the types that our application needs to know about, and where possible we should do so when we can because the compiler is not always able to infer. 

It's useful to define the structure of our data for future reference so that when it comes to expanding our application we might need to understand the shape of our data.

Having checked the `serde_json` documentation we will need to make the following changes:
1. At the top of the `main.rs`
    ``` diff
    -use serde_json::Value;
    +use serde::{Deserialize, Serialize};
    ```
2. Further down the `main.rs`
    ``` diff
    -    let string: Value = serde_json::from_str(&response.text()?)?;
    +    let string: CatFact = serde_json::from_str(&response.text()?)?;
        Ok(())
    }
    +
    +#[derive(Debug, Serialize, Deserialize)]
    +struct CatFact {
    +    used: bool,
    +    source: String,
    +    r#type: String,
    +    deleted: bool,
    +    _id: String,
    +    __v: i32,
    +    text: String,
    +    updatedAt: String,
    +    createdAt: String,
    +    status: Status,
    +    user: String
    +}
    +
    +#[derive(Debug, Serialize, Deserialize)]
    +struct Status {
    +    verified: bool,
    +    sentCount: i32
    +}
    ```
3. In the `Cargo.toml`:
    ``` diff
    -serde = "1.0.115"
    +serde = { version = "1.0.115", features = ["derive"] }
    ```

Notice that when attempting to define the types for a JSON record, if the field name (also known as a key) happens to be a reserved keyword then the compiler handily points this out. 

``` Rust
error: expected identifier, found keyword `type`
  --> src/main.rs:34:5
   |
34 |     type: String,
   |     ^^^^ expected identifier, found keyword
   |
help: you can escape reserved keywords to use them as identifiers
   |
34 |     r#type: String,
   |     ^^^^^^

error: aborting due to previous error

error: could not compile `playground-data-collection-rust`.
```

So when we run the application and `dbg!(string)` we see we have a cat fact.

``` Bash
[src/main.rs:12] string = CatFact {
    used: false,
    source: "api",
    type: "cat",
    deleted: false,
    etc...
```
Then if we want to access a specific field we use dot notation.

``` diff
+    dbg!(string.text);
     Ok(())
```

Now we have the data we can store it somewhere.

### Persisting the data locally

If we want the data to be used after our application has finished running, we need to consider using a persistence layer. This is useful if the application crashes, or we have another application that will use the data elsewhere. For this exercise let's consider the scope of how we can store data.

- We can write a new file for each dataset that we collect. 
- We restrict the number of calls we are writing a single record at a time, so our program is synchronous.
- We can use a loop to run our program for the prescribed number of times, and we pause the thread's execution so that we don't flood the API with requests. This can be based on whether the API we are calling has a throttling limit.

In the future we can increase the collection frequency then we might want to consider a different storage layer that considers scalability.

We have chosen to use `jfs` which will use our filesystem to store the data. If we wanted to analyze our data straight away we could have considered `sqlite`.

Ok so let's add the ability to save our data structure.

Start by importing:

``` diff
 use anyhow::anyhow;
+use jfs::Store;
```
And we can print out the key that it uses as the file name.
``` diff
+    let d: Store = Store::new("data")?;
+    let key = db.save(&string)?;
+    dbg!(key);
     Ok(())
```
Let's add some logging capability so that we can let our application log the result of what it's doing.
``` Bash
$ cargo add env_log
```
And adding the following in the `main.rs`.

``` diff
 use jfs::Store;
+#[macro_use]
+extern crate log;
...
+    env_logger::init();
+    info!("Starting up");
....
-    dbg!(key);
+    info!("Written one file with key: {}", key);
```
When we run our application with an environment variable.
``` Bash
RUST_LOG=info cargo run
```
It will now print out some details for us.
``` Log
[2020-08-27T17:54:41Z INFO  data_collection_rust] Starting up
[2020-08-27T17:54:42Z INFO  data_collection_rust] Written one file with key: 032bfc7b-f1c8-4cdd-bb9a-f29b3f1fa9c4
```

Great, but what if we want to keep collecting items, can we make the application do this?

### Collecting more than one item

Collecting more than one item can be achieved by adding a loop that will run infinitely. You will notice that I have moved items out of the loop as it should be more efficient to only run them once at start-up.

``` diff
fn main() -> Result<(), anyhow::Error> {
     info!("Starting up");
     let client = reqwest::blocking::Client::new();
     let uri = "https://cat-fact.herokuapp.com/facts/random";
-    let response = client.get(uri).send()?;
-    if response.status().is_client_error() || response.status().is_server_error() {
-        return Err(anyhow!("Server responded with: {}", response.status()));
-    }
-    let string: CatFact = serde_json::from_str(&response.text()?)?;
     let db: Store = Store::new("data")?;
-    let key = db.save(&string)?;
-    info!("Written one file with key: {}", key);
+    loop {
+        let response = client.get(uri).send()?;
+        if response.status().is_client_error() || response.status().is_server_error() {
+            return Err(anyhow!("Server responded with: {}", response.status()));
+        }
+        let string: CatFact = serde_json::from_str(&response.text()?)?;
+        let key = db.save(&string)?;
+        info!("Written one file with key: {}", key);
+    }
     Ok(())
 }
```

Great but we can probably slow down our requests so we don't DDOS or throttle the service we're using.

``` log
[2020-08-28T13:17:57Z INFO  data_collection_rust] Starting up
[2020-08-28T13:18:04Z INFO  data_collection_rust] Written one file with key: 6ec26b1e-51e9-46d7-92fc-5b5d848f3b85
[2020-08-28T13:18:04Z INFO  data_collection_rust] Written one file with key: e731bec5-ef6e-4f64-93c9-abd2df4d837b
[2020-08-28T13:18:05Z INFO  data_collection_rust] Written one file with key: fecd2a8b-2f3c-4f3b-a15e-f87f577a1116
[2020-08-28T13:18:05Z INFO  data_collection_rust] Written one file with key: b2220b56-ed18-4a60-a79a-b096f308cfae
[2020-08-28T13:18:05Z INFO  data_collection_rust] Written one file with key: c38acf34-edee-4e24-938f-2bf3f6b08e7d
[2020-08-28T13:18:05Z INFO  data_collection_rust] Written one file with key: 1e0f9ca5-d2fe-44a0-801b-869bee21233c
```

We can do this be making the thread this process runs in sleep for some time. 

So let's import this functionality.

``` diff
 use serde::{Deserialize, Serialize};
+use std::thread;
+use std::time::Duration;
```
And add this to call the method.

``` diff
         info!("Written one file with key: {}", key);
+        thread::sleep(Duration::from_millis(5000));
```
Then when we run our application.

``` bash
[2020-08-28T13:24:08Z INFO  data_collection_rust] Starting up
[2020-08-28T13:24:08Z INFO  data_collection_rust] Written one file with key: 30183e77-c25c-453c-922b-e027ba9a0e54
[2020-08-28T13:24:14Z INFO  data_collection_rust] Written one file with key: f1b63d41-8452-442f-8e3d-c4fea7bf80d0
```
Great, you can see the time difference between the two requests is greater now

The duration is a variable we could set as an environment variable later on if we wanted to configure it more often. 

``` bash
warning: unreachable expression
  --> src/main.rs:26:5
   |
16 | /     loop {
17 | |         let response = client.get(uri).send()?;
18 | |         if response.status().is_client_error() || response.status().is_server_error() {
19 | |             return Err(anyhow!("Server responded with: {}", response.status()));
...  |
24 | |         thread::sleep(Duration::from_millis(5000));
25 | |     }
   | |_____- any code following this expression is unreachable
26 |       Ok(())
   |       ^^^^^^ unreachable expression
   |
   = note: `#[warn(unreachable_code)]` on by default
```

The compiler is warning us that our function is never going to return `OK` because it never leaves the loop. We can add a counter and break condition to resolve this.

For our use case, we can use an unsigned integer since we know we will never have a negative number when incrementing our counter. We also make it mutable because we want to change it.

``` diff
     info!("Starting up");
+    let mut count = 0u32;
```
``` diff
loop {
+    count += 1;
```
And add the break condition.

``` diff
         thread::sleep(Duration::from_millis(5000));
+        if count == 5 {
+            break;
+        } else {
+            continue;
+        }
```

### Closing

So that's it, until the next time. Many thanks to all the great individuals who worked on the Crates used in this article, and the `Doc.rs` team's work that really makes it a breeze getting moving with Rust.

Some things that we could do next:
- Add a test that will mock calling the API and create a data factory for generating random test data.
- Package this code with a compute solution such as AWS Lambda so it's not just run on our machine.
- Use a storage layer such as AWS S3 to enable scaling.

If you have any suggested improvements, want to discuss this article
[Hackernews](https://news.ycombinator.com/item?id=24435139s), 
[/r/rust](https://www.reddit.com/r/rust/comments/iq98xw/learning_rust_collecting_data_from_an_api/),
[dev.to](https://dev.to/),
or if you just want to say hello 👋🏻
[Linkedin](https://www.linkedin.com/in/david-maceachern-35943440//) & [Twitter](https://mobile.twitter.com/maceacherndjh).