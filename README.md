# Authenticate LDAP using JS

Wrapper on ldapJS to abstract a lot of things away, built specifically for COEP.

## Usage

- Download this entire folder into your project as is, yes including the node_modules
- Import and use as:

```js
const { authenticatePromise: authenticate } = require("./ldap_auth_js"); // Or whatever you name it

// Promise API
authenticate(mis, password)
  .then(() => console.log("Correct"))
  .catch(err => console.log("Inorrect, Error", err));

// async/await
async function foo() {
  try {
    await authenticate(mis, password);
    console.log("Correct");
  } catch (err) {
    console.log("Inorrect, Error", err);
  }
}

// with returnData
authenticate(mis, password, { returnData: true })
  .then(ldapData => console.log("Correct", ldapData))
  .catch(err => console.log("Inorrect, Error", err));

// and so on for async / await
```

## API

- authenticate(mis, password, options)

|   Name   |  Type  |       Description        |
| :------: | :----: | :----------------------: |
| username | String |      LDAP Username       |
| password | String |      LDAP Password       |
| options  | Object | Object for configuration |

- options

|       Name       |        Type        |    Default Value     |                                                                       Description                                                                       |
| :--------------: | :----------------: | :------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------: |
|       url        |       String       | "ldap://10.1.101.41" |                                                                  LDAP URL (don't edit)                                                                  |
|    returnData    |      Boolean       |        false         |                   Return data that is fetched by LDAP. If True, promise is resolved with the data, else an empty promise is resolved                    |
| baseSearchString |       String       | dc=coep,dc=org,dc=in |                                                                  Base String to search                                                                  |
|    dataCheck     | String \| Function |        "coep"        | Default behaviour is to enable COEP level checks, for custom checks, pass a callback `(username, password) => boolean`, to skip this step, pass `null`. |
|     timeout      |       number       |         1000         |                                                       Default value to wait for a query to return                                                       |
|  connectTimeout  |       number       |         1000         |                                             Default value to wait for client to connect to the LDAP Server                                              |

- Errors thrown (all of them are strings) (defined in`constants.js`)
  | Error String | What it implies |
  |:-----------:|:-----------------:|
  |INCONSISTENT_INPUT| Failed the input checks passed by `dataCheck`, default implementation in `utils.js |
  |TIMEOUT_ERROR|Time Out Error for a query |
  |CONNECT_TIMEOUT_ERROR|Time Out for connecting to ldap server|
  |SEARCH_ERROR| Search API failed|
  |INVALID_CREDENTIALS| Bind API failed|
  |UNEXPECTED_ERROR| Self explanatory|

## Requirements

- For COEP, this code needs to be run from inside the college network.
