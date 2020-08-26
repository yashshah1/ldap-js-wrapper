# Authenticate LDAP using JS

Wrapper on ldapJS to abstract a lot of things away, built specifically for COEP.

## Usage

- Download this entire folder into your project as is, yes including the node_modules
- Import and use as:

```js
const { authenticate } = require("./ldap_auth_js"); // Or whatever you name it

// Promise API
authenticate(mis, password)
  .then(() => console.log("Correct"))
  .catch(() => console.log("Incorrect"));

// async/await
async function foo() {
  try {
    await authenticate(mis, password);
    console.log("Correct");
  } catch {
    console.log("Inorrect");
  }
}

// with returnData
authenticate(mis, password, { returnData: true })
  .then(ldapData => console.log("Correct", ldapData))
  .catch(() => console.log("Incorrect"));

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

## Requirements

- For COEP, this code needs to be run from inside the college network.
