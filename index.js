const ldap = require("ldapjs");
const defaultDataCheck = require("./utils");
const {
  INCONSISTENT_INPUT,
  TIMEOUT_ERROR,
  CONNECT_TIMEOUT_ERROR,
  SEARCH_ERROR,
  INVALID_CREDENTIALS,
  UNEXPECTED_ERROR,
} = require("./constants");

const authenticatePromise = (username, password, options = {}) => {
  return new Promise((resolve, reject) => {
    // set default options
    options = {
      url: "ldap://10.1.101.41",
      returnData: false,
      baseSearchString: "dc=coep,dc=org,dc=in",
      dataCheck: "coep",
      timeout: 1000,
      connectTimeout: 1000,
      ...options,
    };

    if (options.dataCheck === "coep") {
      if (!defaultDataCheck(username, password)) {
        return Promise.reject(INCONSISTENT_INPUT);
      }
    } else if (
      options.dataCheck !== null &&
      typeof options.dataCheck === "function"
    ) {
      if (!options.dataCheck(username, password)) {
        return Promise.reject(INCONSISTENT_INPUT);
      }
    }

    const client = ldap.createClient({
      url: options.url,
      timeout: options.timeout,
      connectTimeout: options.connectTimeout,
    });
    const opts = {
      filter: `cn=${username}`,
      scope: "sub",
      ...(options.returnData ? {} : { attributes: ["dn"] }),
    };
    client
      .on("timeout", () => {
        reject(TIMEOUT_ERROR);
      })
      .on("connectTimeout", () => {
        reject(CONNECT_TIMEOUT_ERROR);
      });

    try {
      client.search(options.baseSearchString, opts, (err, ldapSearchRes) => {
        if (err) reject(SEARCH_ERROR);

        ldapSearchRes.on("searchEntry", entry => {
          const { dn } = entry.object;
          client.bind(dn, password, err => {
            if (err) reject(INVALID_CREDENTIALS);
            if (options.returnData) resolve(entry.object);
            resolve();
          });
        });
        ldapSearchRes.on("end", () => {
          client.unbind();
        });
      });
    } catch (err) {
      reject(UNEXPECTED_ERROR);
    }
  });
};

module.exports = { authenticatePromise };
