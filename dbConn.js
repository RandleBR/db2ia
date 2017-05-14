/**
 * Set connection attributes.  Valid Scope: Before connecting to a database. (or in the callback function of the connection)
 * The Auto Commit feature is automatically enabled.
 * @param {number} Attribute is the connection attribute to set. Refer to [this table](http://www-01.ibm.com/support/knowledgecenter/ssw_ibm_i_71/cli/rzadpfnsconx.htm%23rzadpfnsconx__tbcono) for more details. 
 * @param {(number|string)} Value The value to set the attribute.
 */
function setConnAttr(Attribute, Value) {
    return
};

/**
 * Get connection attributes.  Valid Scope: After connecting to a database. (or in the callback function of the connection)
 * The Auto Commit feature is automatically enabled.
 * @param {number} Attribute is the connection attribute to set. Refer to [this table](http://www-01.ibm.com/support/knowledgecenter/ssw_ibm_i_71/cli/rzadpfnsconx.htm%23rzadpfnsconx__tbcono) for more details. 
 * @returns {(number|string)} Value The value to set the attribute.
 */
function setConnAttr(Attribute) {
    return Value
};

/**
 * Establishes a connection to the target database. The application can optionally supply 
 * a target SQL database, an authorization name, and an authentication string.
 * @example <caption>Example calling syntax</caption>
 * // Syntax 1: conn(string Database)
 * // Syntax 2: conn(string Database, function Callback)
 * // Syntax 3: conn(string Database, string User, string Password)
 * // Syntax 4: conn(string Database, string User, string Password, function Callback)
 * @param {string} Database the name or alias name of the database
 * @param {[string]} User the authorization name (user identifier)
 * @param {[string]} Password the authentication string (password)
 * @param {[function]} Callback function running after the connection established.
 */
function conn(Database, User, Password, Callback) {
    return
};
