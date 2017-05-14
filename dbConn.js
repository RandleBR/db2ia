/**
 * Set connection attributes.  
 * The Auto Commit feature is automatically enabled.
 * 
 * DB2CLI_API: SQLSetConnectAttr
 * 
 * Valid_Scope: Before connecting to a database (or in the callback function of the connection)
 * @param {number} Attribute is the connection attribute to set. Refer to [this table](http://www-01.ibm.com/support/knowledgecenter/ssw_ibm_i_71/cli/rzadpfnsconx.htm%23rzadpfnsconx__tbcono) for more details. 
 * @param {(number|string)} Value The value to set the attribute.
 */
function setConnAttr(Attribute, Value) {
    return
};

/**
 * Returns the current settings for the specified connection option 
 * 
 * DB2CLI_API: SQLSetConnectAttr
 * 
 * Valid_Scope: After instantiated the connection object (or in the callback function of the connection)
 * @param {number} Attribute is the connection attribute to set. Refer to [this table](http://www-01.ibm.com/support/knowledgecenter/ssw_ibm_i_71/cli/rzadpfnsconx.htm%23rzadpfnsconx__tbcono) for more details. 
 * @returns {(string|number)} Value The value to set the attribute.
 */
function getConnAttr(Attribute) {
    return Value
};

/**
 * Establishes a connection to the target database. The application can optionally supply 
 * a target SQL database, an authorization name, and an authentication string.
 * 
 * Syntax_1: conn(string Database)
 * 
 * Syntax_2: conn(string Database, function Callback)
 * 
 * Syntax_3: conn(string Database, string User, string Password)
 * 
 * Syntax_4: conn(string Database, string User, string Password, function Callback)
 * 
 * DB2CLI_API: SQLConnect
 * 
 * Valid Scope: Before calling the exec() or prepare() function
 * @param {string} Database the name or alias name of the database
 * @param {[string]} [User] the authorization name (user identifier)
 * @param {[string]} [Password] the authentication string (password)
 * @param {[function]} [Callback] function running after the connection established.
 */
function conn(Database, User, Password, Callback) {
    return
};

/**
 * Ends the connection associated with the database connection handle. After calling this 
 * function, either call conn() to connect to another database, or delete the connection object.
 * 
 * DB2CLI_API: SQLDisconnect
 * 
 * Valid_Scope: After calling the conn() function.
 */
function disconn() {
    return
};

/**
 * Frees the connection object. All DB2 for i resources associated with the connection 
 * object are freed. disconn() must be called before calling this function.
 * 
 * DB2CLI_API: SQLFreeConnect
 * 
 * Valid_Scope: After calling the dis****conn() function
 */
function close() {
    return
};

/**
 * Print more detailed debugging information during execution.
 * 
 * Valid_Scope: All the life cycle
 * @param {[boolean]} [OnOff = false] the name or alias name of the database
 */
function debug(OnOff) {
    return
};

/**
 * Checks if the SQL string is valid and interprets vendor escape clauses. If the 
 * original SQL string that is passed by the application contains vendor escape 
 * clause sequences, DB2 for i CLI returns the transformed SQL string that is seen 
 * by the data source (with vendor escape clauses either converted or discarded 
 * as appropriate).
 * 
 * Valid_Scope: After calling conn() function
 * @example 
 * var db = require('/QOpenSys/QIBM/ProdData/OPS/Node6/os400/db2i/lib/db2a');
 * var dbconn = new db.dbconn();
 * dbconn.conn("*LOCAL")
 * try {
 *  // note invalid statement with 2 commas after aConst will throw error
 *  var escapedStmt = dbconn.validStmt("SELECT 'ConstantData' as aConst ,, cust.* FROM CUSTOMERS cust")
 *  console.log("Escaped string is : %s\n", escapedStmt);
 * } catch(err) {
 *  console.log(err.message)
 * }
 * dbconn.close();
 * @param {string} Statement a SQL string that needs to be checked and escaped
 * @returns {string} a string with the escaped clauses
 */
function validStmt(Statement) {
    return escapedStatement
};
