const ldap = require("ldapjs");
const defaultDataCheck = require("./utils");

const authenticatePromise = (username, password, options = {}) => {
  return new Promise((resolve, reject) => {
    // set default options
    options = {
      url: "ldap://10.1.101.41",
      returnData: false,
      baseSearchString: "dc=coep,dc=org,dc=in",
      dataCheck: "coep",
      ...options,
    };

    if (options.dataCheck === "coep") {
      if (!defaultDataCheck(username, password)) return Promise.reject();
    } else if (
      options.dataCheck !== null &&
      typeof options.dataCheck === "function"
    ) {
      if (!options.dataCheck(username, password)) return Promise.reject();
    }

    const client = ldap.createClient({
      url: options.url,
    });

    const opts = {
      filter: `cn=${username}`,
      scope: "sub",
      ...(options.returnData ? {} : { attributes: ["dn"] }),
    };

    try {
      client.search(options.baseSearchString, opts, (err, ldapSearchRes) => {
        if (err) reject();

        ldapSearchRes.on("searchEntry", entry => {
          const { dn } = entry.object;
          client.bind(dn, password, err => {
            if (err) reject(err);
            if (options.returnData) resolve(entry.object);
            resolve();
          });
        });
        res.on("end", () => {
          client.unbind();
        });
      });
    } catch (err) {
      reject();
    }
  });
};

module.exports = { authenticatePromise };
