# Rust Testing Mocks

Test mocks in Rust are confusing.

There has to be a trait related implementation, maybe look at how other crates have done the same thing.

- `cargo-watch` for running your tests whenever you save your progress `Mocha --watch`.

`cargo install cargo-edit cargo-watch`

`cargo add reqwest-mock`

## Writing a test

Now we have our data from before we can write a test, this will save us from calling the API every time we run the code to test it. We can do this by setting up a test mock.

```
#[cfg(test)]
mod tests {
    use super::*;

    use mockito::mock;

    #[test]
    fn test_collect_data() {
        let body = r#"
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
            "#;
        let _m = mock("GET", "/facts/random")
            .with_status(200)
            .with_body(body)
            .create();

        assert_eq!(collect_data(), body);
    }
}
```