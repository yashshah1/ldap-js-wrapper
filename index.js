const ldap = require("ldapjs");

const authenticate = (mis, password, options = {}) => {
  // if nothing is provided
  if (!mis || !password) return Promise.reject();

  // if a int is accidentally passed
  if (typeof mis !== "string" || typeof password !== "string")
    return Promise.reject();

  // if empty strings or spaces are sent
  /**
   * We don't do password = password.trim()
   * because there is a chance a password could have a trailing space
   */
  if (mis.trim().length === 0 || password.trim().length === 0)
    return Promise.reject();

  // All MIS numbers are 9 characters long
  if (mis.length !== 9) return Promise.reject();

  // If a trailing space is sent, then we reject.
  if (mis.length !== mis.trim()) return Promise.reject();

  // set default options
  options = {
    url: "ldap://10.1.101.41",
    returnData: false,
    ...options,
  };

  try {
    // Sanity check
    // All MIS numbers, ideally, should be parseble as ints
    parseInt(mis);
  } catch {
    return Promise.reject();
  }

  const client = ldap.createClient({
    url: options.url,
  });

  const opts = {
    filter: `cn=${mis}`,
    scope: "sub",
    ...(!options.returnData && { attributes: ["dn"] }),
  };

  return new Promise((resolve, reject) => {
    try {
      client.search("dc=coep,dc=org,dc=in", opts, (err, ldapSearchRes) => {
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

module.exports = { authenticate };
