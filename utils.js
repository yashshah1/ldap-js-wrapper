const dataCheck = (username, password) => {
  // if nothing is provided
  if (!username || !password) {
    return false;
  }

  // if a int is accidentally passed
  if (typeof username !== "string" || typeof password !== "string") {
    return false;
  }

  // if empty strings or spaces are sent
  /**
   * We don't do password = password.trim()
   * because there is a chance a password could have a trailing space
   */
  if (username.trim().length === 0 || password.trim().length === 0) {
    return false;
  }

  // All MIS numbers are 9 characters long
  if (username.length !== 9) {
    return false;
  }

  // If a trailing space is sent, then we reject.
  if (username !== username.trim()) {
    return false;
  }

  try {
    parseInt(username);
  } catch (err) {
    return false;
  }

  return true;
};

module.exports = dataCheck;
