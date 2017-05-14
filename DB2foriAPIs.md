<div>

<a id="top" name="top"></a>

# <span style="font-size:28px;"><a id="Introduction" name="Introduction">Introduction</a></span>

DB2i add-on for Node.js is a JavaScript API set for DB2 database manipulation on IBM i. The add-on is shipped with Node.js and located in **/QOpenSys/QIBM/ProdData/Node/os400/db2i/**. It contains a binary module **db2i.node** in the bin directory and a library file **db2.js** in the lib directory. If you want to copy the add-on to other places, please remain the folder structure.

To use the DB2i add-on, you only need to require the **db2.js** file in your source code.

# <span style="font-size:28px;">DB2 for i Access APIs</span>

[Examples](#Examples) - [Basic Query](#BasicQuery) - [Node6 Basic Query](#Node6Basic) - [Stored Procedure](#StoredProcedure)

[Methods](#Methods)

[autoCommit](#autoCommit)  
[serverMode](#serverMode)  
[cursorType](#cursorType)  
[setEnvAttr](#setEnvAttr)  
[setConnAttr](#setConnAttr)  
[setStmtAttr](#setStmtAttr)  
[getEnvAttr](#getEnvAttr)  
[getConnAttr](#setConnAttr)  
[getStmtAttr](#getStmtAttr)  
[init](#init)  
[conn](#conn)  
[exec](#exec)  
[prepare](#prepare)  
[bindParam](#bindParam)  
[execute](#execute)  
[nextResult](#nextResult)  
[commit](#commit)  
[rollback](#rollback)  
[close](#close)  
[fetch](#fetch)  
[numFields](#numFields)  
[numRows](#numRows)  
[fieldType](#fieldType)  
[fieldWidth](#fieldWidth)  
[fieldNullable](#fieldNullable)  
[fieldName](#fieldName)  
[fieldPrecise](#fieldPrecise)  
[fieldScale](#fieldScale)  
[validStmt](#validStmt)  

[stmtError](#stmtError) 

[debug](#debug)

[Diagnostics](#Diagnostics)

[Back to top](#top)



# <span style="font-size:36px;"><a id="Examples" name="Examples">Examples</a></span>

## <a id="BasicQuery" name="BasicQuery">BasicQuery</a>

```
var db = require('/QOpenSys/QIBM/ProdData/Node/os400/db2i/lib/db2');
try{
    db.debug(true);  // Enable Debug Mode if needed.
    db.init(function(){  // Initialize the environment for database connections.
           db.serverMode(true); // Enable Server Mode if needed
    });
    db.conn(“*LOCAL”, “USER”, “PASSWORD”, function(){ // Connect to a database
           db.autoCommit(true); // Enable the Auto Commit feature if needed.
    });
    db.exec(“CREATE TABLE TEST.NAMEID (ID INTEGER, NAME VARCHAR(50), SALARY DECIMAL(8,2))”);  
    // Create a new table in the database.
    db.exec(“INSERT INTO TEST.NAMEID VALUES (0, 'David', 999.99)”); // Insert a new record in the table.
    console.log(“There are %d rows affected.”, db.numRows()); // Get the execution result.
    db.exec(“SELECT * FROM TEST.NAMEID”,   // Query the data in the new table.
           function(jsonObj) {  // Print the output in a readble way.
           console.log(“Result: %s”, JSON.stringify(jsonObj));
           var fieldNum = db.numFields();
           console.log(“There are %d fields in each row.”, fieldNum);
           console.log(“Name | Length | Type | Precise | Scale | Null”);  // Print all the fields information.
           for(var i = 0; i < fieldNum; i++)
                  console.log(“%s | %d | %d | %d | %d | %d”, db.fieldName(i), db.fieldWidth(i), db.fieldType(i), db.fieldPrecise(i), db.fieldScale(i), db.fieldNullable(i));
           }
    );
    db.exec(“DROP TABLE TEST.NAMEID”);  // Delete the example table from the database.
    db.close();  // Release any used resource.
    } catch(e) {  // Exception handler
        console.log(e);
    }
```
[Back to top](#top)

## <a id="Node6 Basic" name="Node6Basic">Node6 Basic Example</a>
```
    var db = require('/QOpenSys/QIBM/ProdData/OPS/Node6/os400/db2i/lib/db2a')
    var dbconn = new db.dbconn(); // Create a connection object.

    dbconn.conn("*LOCAL", function() {
      dbconn.setConnAttr(db.SQL_ATTR_AUTOCOMMIT, db.SQL_TXN_NOCOMMIT)
    })
    var stmt = new db.dbstmt(dbconn)
    var SQL = `insert into table values('A','B')`
    stmt.exec(SQL, function() {
      stmt.close() // Clean up the statement object (PTF SI64401)
      dbconn.disconn() // Disconnect from the database.
      dbconn.close() // Clean up the connection object (PTF SI64401)
    })
```

[Back to top](#top)

## <a id="StoredProcedure" name="StoredProcedure">Stored Procedure</a>
```
var db = require('/QOpenSys/QIBM/ProdData/Node/os400/db2i/lib/db2');
function testSimpleSp(sql) {
    var ipc = “*NA”;
    var ctl = “*here”;
    var xmlIn =“<?xml version='1.0'?><script><comment>XML</comment></script>“;
    var xmlOut = ““;
    try{
           db.debug(true);  // Enable Debug Mode if needed.
           db.init(function(){  // Initialize the environment for database connections.
                  db.serverMode(true); // Enable Server Mode if needed
           });
           db.conn(“*LOCAL”, “USER”, “PASSWORD”, function(){ // Connect to a database
                  db.autoCommit(true); // Enable the Auto Commit feature if needed.
           });
           db.prepare(sql); // Prepare for the SQL statement.
           db.bindParam([  // Bind parameters for each markers in the SQL statement.
                  [ipc, db.SQL_PARAM_INPUT, 1],
                  [ctl, db.SQL_PARAM_INPUT, 1],
                  [xmlIn, db.SQL_PARAM_INPUT, 0],
                  [xmlOut, db.SQL_PARAM_OUTPUT, 0],
           ]);
           db.execute(function callback(out) {  //Out is an array of each output parameters.
                  for (i=0; i<out.length; i++)
                         console.log(“Output Param[%d] = %s \n”, i, out[i]);
           });
           db.close();  // Release any used resource.
    } catch(e) {  // Exception handler
           console.log(e);
    }
};

testSimpleSp(“call QXMLSERV.iPLUG512K(?,?,?,?)”);
```

[Back to top](#top)

# <span style="font-size:28px;"><a id="Methods" name="Methods">Methods</a></span>

## <a id="autoCommit" name="autoCommit">autoCommit</a>

**Description:**
Get or set the AUTOCOMMIT state for a database connection.

**Syntax 1:**
autoCommit()

**Syntax 2:**
autoCommit(Boolean OnOff)

**Parameter** OnOff:
false (default) -- The SQL statements are not automatically committed. If running with commitment control, changes must be explicitly committed or rolled back using either commit() or rollback().

true -- each SQL statement is automatically committed as it is processed.

**Return Object:**
For Syntax 1, it returns a Boolean value which indicates if AUTOCOMMIT is enabled for current connection if the operation is ended successfully.

**DB2 CLI API:**

SQLGetConnectAttr() / SQLSetConnectAttr()

**DB2 CLI Attributes:**

SQL_ATTR_AUTOCOMMIT

**Valid Scope:**

After allocating the connection handler.

**Example:**
```
var mode = true;
try{
    db.init();
    db.conn(“*LOCAL”, function(){
           db.autoCommit(mode);
           if(mode != db.autoCommit()) {
                  db.close();
                  console.log("Failed to set Auto Commit on. ");
           }
           mode = false;
           db.autoCommit(mode);
           if(mode != db.autoCommit()) {
                  db.close();
                  console.log("Failed to set Auto Commit off.");
           }
    });
    db.close();
} catch(e) {
    console.log(e);
}
```

[Back to top](#top)

## <a id="serverMode" name="serverMode">serverMode</a>

**Description:**

Get or set the Server Mode state for a database connection. The reason for running in SQL server mode is that many applications need to act as database servers. This means that a single job performs SQL requests on behalf of multiple users. Without using SQL server mode, applications might encounter one or more of the following limitations:

*   A single job can have only one commit transaction per activation group.

*   A single job can be connected to a relational database (RDB) only once.

*   All SQL statements run under the user profile of the job, regardless of the user ID passed on the connection.

SQL server mode circumvents these limitations by routing all SQL statements to separate jobs. Each connection runs in its own job. The system uses prestart jobs named QSQSRVR in the QSYSWRK subsystem or a selected subsystem to minimize the startup time for each connection.

**Syntax 1:**

serverMode()

**Syntax 2:**

serverMode(Boolean OnOff)

**Parameter** OnOff:

false (default) -- DB2 for i CLI processes the SQL statements of all connections within the same job. All changes compose a single transaction. This is the default mode of processing.

true -- DB2 for i CLI processes the SQL statements of each connection in a separate job. This allows multiple connections to the same data source, possibly with different user IDs for each connection. It also separates the changes made under each connection handle into its own transaction. This allows each connection handle to be committed or rolled back, without impacting pending changes made under other connection handles.

**Return Object:**

For Syntax 1, it returns a Boolean value indicating if the program is running under Server Mode.

**DB2 CLI API:**

SQLGetStmtAttr() / SQLSetEnvAttr()

**DB2 CLI Attributes:**

SQL_ATTR_SERVER_MODE

**Valid Scope:**

After allocating the environment handler.

*For Syntax 1, before making the initial connection.

**Example:**
```
var mode = true;
try{
    db.init( function(){
           db.serverMode(mode);
           if(mode != db.serverMode()) {
                  db.close();
                  console.log(“Failed to set Server Mode on.”);
           }
    });
    db.close();
} catch(e) {
    console.log(e);
}
```

[Back to top](#top)

## <a id="cursorType" name="cursorType">cursorType</a>

**Description:**

Specifies the behavior of cursors opened for this statement handle.

**Syntax 1:**

cursorType()

**Syntax 2:**

cursorType(int CursorType)

**Parameter** CursorType:

SQL_CURSOR_FORWARD_ONLY (default) -- Cursors are not scrollable, and the scrolling feature in the fetch() function cannot be used against them.

SQL_CURSOR_DYNAMIC -- Cursors are scrollable. The scrolling feature in the fetch() function can be used to retrieve data from these cursors.

**Return Object:**

For Syntax 1, it returns an integer value indicating current cursor type.

**DB2 CLI API:**

SQLGetStmtAttr() / SQLSetStmtAttr()

**DB2 CLI Attributes:**

SQL_ATTR_CURSOR_TYPE

**Valid Scope:**

After allocating the statement handler.

**Example:**
```
var db = require('/QOpenSys/QIBM/ProdData/Node/os400/db2i/lib/db2');
var mode = db.SQL_CURSOR_DYNAMIC;
try{
    db.init();
    db.conn("*LOCAL");
    db.cursorType(mode);          
    if(mode != db.cursorType()) {
           db.close();
           console.log(“Failed to set Cursor Type.”);
    }
    mode = db.SQL_CURSOR_FORWARD_ONLY;
    db.cursorType(mode);
    if(mode != db.cursorType()) {
           db.close();
           console.log(“Failed to set Cursor Type.”);
    }
    db.close();
} catch(e) {
    console.log(e);
}
```

[Back to top](#top)

## <a id="setEnvAttr" name="setEnvAttr">setEnvAttr</a>

**Description:**

Sets an environment attribute for the current environment.

In environments where the current application may exist in the same job as other applications using CLI, connections attributes should be used instead of environment attributes. Otherwise, setting environment attributes may cause the other application to behave unexpectedly. Ideally, the only environment attributes that should be used are SQL_ATTR_ENVHNDL_COUNTER and SQL_ATTR_SERVER_MODE.

**Syntax:**

setEnvAttr(int Attribute, int/string Value)

**Parameter** Attribute:

Attribute is the environment attribute to set. Refer to [this table](http://www-01.ibm.com/support/knowledgecenter/ssw_ibm_i_71/cli/rzadpfnsenva.htm%23rzadpfnsenva__tbenva) for more details.

**Parameter** Value:

Appropriate value for Attribute. Value can be a string or a numeric value depending on different attribute.

**DB2CLI API:**

SQLSetEnvAttr

**Valid Scope:**

After allocating the environment handler.

Before making the initial connection.

**Example:**
```
var db = require('/QOpenSys/QIBM/ProdData/Node/os400/db2i/lib/db2');
var mode = db.SQL_TRUE;
try{
    db.init(function(){
           db.setEnvAttr(db.SQL_ATTR_ENVHNDL_COUNTER, mode);
           if(mode != db.getEnvAttr(db.SQL_ATTR_ENVHNDL_COUNTER)) {
                  db.close();
                  console.log(“Failed to set Environment Attribute.”);
           }
           mode = db.SQL_FALSE;
           db.setEnvAttr(db.SQL_ATTR_ENVHNDL_COUNTER, mode);
           if(mode != db.getEnvAttr(db.SQL_ATTR_ENVHNDL_COUNTER)) {
                  db.close();
                  console.log(“Failed to set Environment Attribute.”);
           }
    });
    db.close();
} catch(e) {
    console.log(e);
}
```

[Back to top](#top)

## <a id="setConnAttr" name="setConnAttr">setConnAttr</a>

**Description:**

Set connection attributes.

**Syntax:**

setConnAttr(int Attribute, int/string Value)

**Parameter** Attribute:

Attribute is the connection attribute to set. Refer to [this table](http://www-01.ibm.com/support/knowledgecenter/ssw_ibm_i_71/cli/rzadpfnsconx.htm%23rzadpfnsconx__tbcono) for more details.

**Parameter** Value:

Depending on the Attribute, this can be an integer value, or a character string.

**DB2 CLI API:**

SQLSetConnectAttr

**Valid Scope:**

After allocating the connection handler.

**Example:**
```
var db = require('/QOpenSys/QIBM/ProdData/Node/os400/db2i/lib/db2');
var mode = "MYLIB";
    try{
        db.init();
        db.conn("*LOCAL", function(){
            db.setConnAttr(db.SQL_ATTR_DBC_DEFAULT_LIB , mode);
            if(mode != db.getConnAttr(db.SQL_ATTR_DBC_DEFAULT_LIB )) {
                db.close();
                console.log(“Failed to set Connection Attribute.”);
            }
        });
        db.close();
    } catch(e) {
        console.log(e);
    }
```
[Back to top](#top)

## <a id="setStmtAttr" name="setStmtAttr">setStmtAttr</a>

**Description:**

Set an attribute of a specific statement handle. To set an option for all statement handles associated with a connection handle, the application can call setConnAttr().

**Syntax:**

setStmtAttr(int Attribute, int/string Value)

**Parameter** Attribute:

Attribute is the statement attribute to set. Refer to [this table](http://www-01.ibm.com/support/knowledgecenter/ssw_ibm_i_71/cli/rzadpfnsstma.htm%23rzadpfnsstma__tbstmto) for more details.

**Parameter** Value:

Depending on the Attribute, this can be an integer value, or a character string.

**DB2 CLI API:**

SQLSetStmtAttr

**Valid Scope:**

After allocating the statement handler.

**Example:**
```
var db = require('/QOpenSys/QIBM/ProdData/Node/os400/db2i/lib/db2');
var mode = db.SQL_TRUE;
try{
    db.init();
    db.conn("*LOCAL");
    db.setStmtAttr(db.SQL_ATTR_FOR_FETCH_ONLY, mode);          
    if(mode != db.getStmtAttr(db.SQL_ATTR_FOR_FETCH_ONLY)) {
           db.close();
           console.log(“Failed to set Statement Attribute.”);
    }
    mode = db.SQL_FALSE;
    db.setStmtAttr(db.SQL_ATTR_FOR_FETCH_ONLY, mode);          
    if(mode != db.getStmtAttr(db.SQL_ATTR_FOR_FETCH_ONLY)) {
           db.close();
           console.log(“Failed to set Statement Attribute.”);
    }
    db.close();
} catch(e) {
    console.log(e);
}
```

[Back to top](#top)

## <a id="getEnvAttr" name="getEnvAttr">getEnvAttr</a>

**Description:**

Returns the current settings for the specified environment attribute.

**Syntax:**

getEnvAttr(int Attribute)

**Parameter** Attribute:

Attribute is the environment attribute to set. Refer to [this table](http://www-01.ibm.com/support/knowledgecenter/ssw_ibm_i_71/cli/rzadpfnsenva.htm%23rzadpfnsenva__tbenva) for more details.

**Return Object:**

It returns the attribute option in the format of an integer or a string depending on the attribute type.

**DB2CLI API:**

SQLGetEnvAttr

**Valid Scope:**

After allocating the environment handler.

**Example:**

Refer to the example of [setEnvAttr](#setEnvAttr).

[Back to top](#top)

## <a id="getConnAttr" name="getConnAttr">getConnAttr</a>

**Description:**

Returns the current settings for the specified connection option

**Syntax:**

getConnAttr(int Attribute)

**Parameter** Attribute:

Attribute is the connection attribute to set. Refer to [this table](http://www-01.ibm.com/support/knowledgecenter/ssw_ibm_i_71/cli/rzadpfnsconx.htm%23rzadpfnsconx__tbcono) for more details.

**Return Object:**

It returns the attribute option in the format of an integer or a string depending on the attribute type.

**DB2CLI API:**

SQLGetConnectAttr

**Valid Scope:**

After allocating the connection handler.

**Example:**
Refer to the example of [setConnAttr](#setConnAttr).

[Back to top](#top)

## <a id="getStmtAttr" name="getStmtAttr">getStmtAttr</a>

**Description:**

Returns the current settings for the specified connection option

**Syntax:**

getStmtAttr(int Attribute)

**Parameter** Attribute:

Attribute is the connection attribute to set. Refer to [this table](http://www-01.ibm.com/support/knowledgecenter/ssw_ibm_i_71/cli/rzadpfnsstma.htm%23rzadpfnsstma__tbstmto) for more details.

**Return Object:**

It returns the attribute option in the format of an integer or a string depending on the attribute type.

**DB2CLI API:**

SQLGetStmtAttr

**Valid Scope:**

After allocating the statement handler.

**Example:**
Refer to the example of [setStmtAttr](#setStmtAttr).

[Back to top](#top)

## <a id="init" name="init">init</a>

**Description:**

Prepares an environment for database connections.

**Syntax 1:**

init()

**Syntax 2:**

init(function Callback)

**Parameter** Callback:

Callback is a callback function to set any environment attributes.

**Comments:**

*It is recommended to invoke the setEnvAttr() function or enabling Server Mode in this callback function.

**DB2CLI API:**

SQLAllocEnv

**Valid Scope:**

Before calling the conn() function.

**Example:**
Refer to the [Basic Query](#BasicQuery) example.

[Back to top](#top)

## <a id="conn" name="conn">conn</a>

**Description:**

Establishes a connection to the target database. The application can optionally supply a target SQL database, an authorization name, and an authentication string.

**Syntax 1:**

conn(string Database)

**Syntax 2:**

conn(string Database, function Callback)

**Syntax 3:**

conn(string Database, string User, string Password)

**Syntax 4:**

conn(string Database, string User, string Password, function Callback)

**Parameter** Database:

Database is the name or alias name of the database. You may issue CL command WRKRDBDIRE to get the Entry names. Or simply use “*LOCAL” to connect to the local database.

**Parameter** User:

User is the authorization name (user identifier). It is a user profile on IBM i.

**Parameter** Password:

Password is the authentication string (password). It is the password of above user profile.

**Parameter** Callback:

Callback is a callback function to set connection attributes.

**Comments:**

* It is recommended to invoke the setConnAttr() function or enabling Auto Commit in this callback function.

**DB2CLI API:**

SQLConnect

**Valid Scope:**

After calling the init() function.

Before calling the exec() or prepare() function.

* It is not valid to use setStmtAttr() or setting Cursor Type before calling this function.

**Example:**
Refer to the [Basic Query](#BasicQuery) example.

[Back to top](#top)

## <a id="exec" name="exec">exec</a>

**Description:**

Directly runs the specified SQL statement. The statement can only be processed once. Also, the connected database server must be able to prepare the statement.

**Syntax 1:**

exec(string SQL)

**Syntax 2:**

exec(string SQL, function Callback(JsonObj))

**Parameter** SQL:

SQL is the SQL statement string.

**Parameter** Callback(JsonObj):

Callback is a callback function to process the result set of the SQL statement for callers. JsonObj is the result set of the SELECT SQL statement. It is in the JSON format.

**Comments:**

* If the SQL statement is UPDATE, INSERT, MERGE, SELECT from INSERT, or DELETE statement, nothing will be returned and it is recommended to use Syntax 1\. And user can issue the numRows() function to get the affected row number.

* It is recommended to invoke the numFields(), numRows(), fieldName() and other result set related functions in this callback function. Because they rely on the temporal result set in memory. After running exec() the result set will be destroyed and cleaned up.

**DB2CLI API:**

SQLExecDirect

**Valid Scope:**

After calling the conn() function.

**Example:**

Refer to the [Basic Query](#BasicQuery) example.

[Back to top](#top)

## <a id="prepare" name="prepare">prepare</a>

**Description:**

Associates an SQL statement with the input statement handle and sends the statement to the DBMS to be prepared. The application can reference this prepared statement by passing the statement handle to other functions.

**Syntax:**

prepare(string SQL)

**Parameter** SQL:

SQL is the SQL statement string.

**Comments:**

* If the statement handler has been used with a SELECT statement, closeCursor() must be called to close the cursor, before calling prepare() again.

**DB2CLI API:**

SQLPrepare

**Valid Scope:**

After calling the conn() function.

Before calling the execute() or bindParam() function.

**Example:**

Refer to the [Stored Procedure](#StoredProcedure) example.

[Back to top](#top)

## <a id="bindParam" name="bindParam">bindParam</a>

**Description:**

Associate (bind) parameter markers in an SQL statement to application variables. Data is transferred from the application to the Database Management System (DBMS) when execute() is called. Data conversion might occur when the data is transferred.

This function must also be used to bind application storage to a parameter of a stored procedure where the parameter can be input, output.

**Syntax:**

bindParam(array ParamList)

**Parameter** ParamList:

ParamList is a java script array representing the binding parameter list. Each parameter has three attributes which are also represented as an array. The three attributes are Value, In/Out Type and Indicator. Value can be an integer value or a string. In/Out Type is an integer. If Value is an input value, please set it to 0\. Otherwise, set it to 1\. Indicator is an integer flag to tell the function how to process some special types of parameters. Different type of Value requires corresponding Indicator. Please refer to below table for details.

<table border="1" cellpadding="0" cellspacing="0" dir="ltr" style="width: 422px;">

<tbody>
<tr>
<td style="width: 70px;">
Indicator
</td>
<td style="width: 169px;">
Data Type
</td>
<td style="width: 175px;">
SQL Type
</td>
</tr>
<tr>
<td style="width: 70px;">
0
</td>
<td style="width: 169px;">
CLOB String
</td>
<td style="width: 175px;">
SQL_C_CHAR
</td>
</tr>
<tr>
<td style="width: 70px;">
1
</td>
<td style="width: 169px;">
Null Terminated String
</td>
<td style="width: 175px;">
SQL_C_CHAR
</td>
</tr>
<tr>
<td style="width: 70px;">
2
</td>
<td style="width: 169px;">
Integer
</td>
<td style="width: 175px;">
SQL_C_LONG
</td>
</tr>
<tr>
<td style="width: 70px;">
3
</td>
<td style="width: 169px;">
NULL
</td>
<td style="width: 175px;">
SQL_C_DEFAULT
</td>
</tr>
</tbody>
</table>

**DB2CLI API:**

SQLBindParameter

**Valid Scope:**

After calling the prepare() function.

Before calling the execute() or bindParam() function.

**Example:**

Refer to the [Stored Procedure](#StoredProcedure) example.

[Back to top](#top)

## <a id="execute" name="execute">execute</a>

**Description:**

Runs a statement that was successfully prepared using prepare() once or multiple times. The statement is processed with the current values of any application variables that were bound to parameter markers by bindParam().

**Syntax 1:**

execute()

**Syntax 2:**

execute(function Callback(OutParamList))

**Parameter** Callback(OutParamList):

Callback is a callback function to process the output parameters of the parameter markers. OutParamList is a list of the output parameters. It is in the java script array format.

**Comments:**

* If the statement also return a result set, user can issue the fetch() function to retrieve the data row by row.

**DB2CLI API:**

SQLExecute

**Valid Scope:**

After calling the prepare() function.

**Example:**

Refer to the [Stored Procedure](#StoredProcedure) example.

[Back to top](#top)

## <a id="nextResult" name="nextResult">nextResult</a>

**Description:**

Determines whether there is more information available on the statement handle that has been associated with a stored procedure that is returning result sets.

**Syntax:**

nextResult()

**Comments:**

* After completely processing the first result set, the application can call nextResult() to determine if another result set is available. If the current result set has unfetched rows, nextResult() discards them by closing the cursor.

**DB2CLI API:**

SQLMoreResults

**Valid Scope:**

After calling the execute() function.

[Back to top](#top)

## <a id="commit" name="commit">commit</a>

**Description:**

Commit all changes to the database that have been made on the connection since connect time or the previous call to commit().

**Syntax:**

commit()

**DB2CLI API:**

SQLTransact

**Valid Scope:**

After calling the execute() or exec() function.

[Back to top](#top)

## <a id="rollback" name="rollback">rollback</a>

**Description:**

Rollback all changes to the database that have been made on the connection since connect time or the previous call to commit().

**Syntax:**

rollback()

**DB2CLI API:**

SQLTransact

**Valid Scope:**

After calling the execute() or exec() function.

[Back to top](#top)

## <a id="close" name="close">close</a>

**Description:**

Ends the connection associated with the database connection handle and release all used handlers and resources. If Auto Commit is disabled, it will rollback all transactions before exit.

**Syntax:**

close()

**DB2CLI API:**

SQLEndTran

SQLFreeStmt

SQLDisconnect

SQLFreeConnect

SQLFreeEnv

**Valid Scope:**

All the life cycle.

**Example:**

Refer to the [Basic Query](#BasicQuery) example.

[Back to top](#top)

## <a id="fetch" name="fetch">fetch</a>

**Description:**

Advances the cursor to the next row of the result set, and retrieves any bound columns. Or positions the cursor based on the requested orientation and then retrieves any bound columns.
This is a new non-blocking API to fetch data.

**Syntax 1:**

    fetch ([int orientation, int offset,] function callback(result, error))

**Parameter** 

Callback(result, error)

Callback is a callback function to process the fetched row. Row is the fetched row represented in a key-value java script array.

**Parameter** 
    orientation:

Orientation sets the fetch orientation. The valid values are below:

    SQL_FETCH_ABSOLUTE:Move to the row specified by the Offset argument. 
    SQL_FETCH_FIRST:Move to the first row of the result set. 
    SQL_FETCH_LAST:Move to the last row of the result set. 
    SQL_FETCH_NEXT:Move to the row following the current cursor position. 
    SQL_FETCH_PRIOR:Move to the row preceding the current cursor position. 
    SQL_FETCH_RELATIVE If Offset is: 
        Positive, advance the cursor that number of rows. 
        Negative, back up the cursor that number of rows. 
        Zero, do not move the cursor. 

**Parameter** 

Offset:
    Offset is the row offset for relative positioning.

**DB2CLI API:**
    SQLFetch or SQLFetchScroll

**Valid Scope:**
    When the result set is available.

**Example:**
```
var conn = new db.dbconn();
conn.conn("*LOCAL");
var stmt = new db.dbstmt(conn);
stmt.prepare("SELECT * FROM ...", function(){
  stmt.execute(function(){
    function asyncFetch(){
      stmt.fetch(function callback(row, rc){
        assert(rc != db.SQL_ERROR);
        console.log(row);
        if(rc != db.SQL_NO_DATA_FOUND)
          asyncFetch();
        else { // the last row.
          delete stmt;
          conn.disconn();
          delete conn;
        }
      });
    }
    asyncFetch();
  });
});
```
## <a id="fetchSync" name="fetchSync">fetchSync</a>

**Description:**

Advances the cursor to the next row of the result set, and retrieves any bound columns. Or positions the cursor based on the requested orientation and then retrieves any bound columns.

**Syntax 1:**

fetch()

**Syntax 2:**

fetch(function Callback(Row))

**Syntax 3:**

fetch(int Orient, int Offset)

**Syntax 4:**

fetch(int Orient, int Offset, function Callback(Row))

**Parameter** Callback(Row):

Callback is a callback function to process the fetched row. Row is the fetched row represented in a key-value java script array.

**Parameter** Orient:

Orient sets the fetch orientation. The valid values are below:

SQL_FETCH_ABSOLUTE:Move to the row specified by the Offset argument.

SQL_FETCH_FIRST:Move to the first row of the result set.

SQL_FETCH_LAST:Move to the last row of the result set.

SQL_FETCH_NEXT:Move to the row following the current cursor position.

SQL_FETCH_PRIOR:Move to the row preceding the current cursor position.

SQL_FETCH_RELATIVE If Offset is:

Positive, advance the cursor that number of rows.

Negative, back up the cursor that number of rows.

Zero, do not move the cursor.

**Parameter** Offset:

Offset is the row offset for relative positioning.

**DB2CLI API:**

SQLFetch or SQLFetchScroll

**Valid Scope:**

When the result set is available.

**Example:**
```
try{
    db.init();
    db.conn("*LOCAL");
    db.prepare("SELECT LSTNAM, STATE FROM QIWS.QCUSTCDT");
    db.execute();
    var rc;
    do{
           rc = db.fetch(function callback(row) {
                  console.log(row);
           });
    } while(rc != db.SQL_NO_DATA_FOUND);
    db.close();
} catch(e) {
    db.close();
    console.log(e);
}
```
[Back to top](#top)

## <a id="numFields" name="numFields">numFields</a>

**Description:**

Returns the number of fields contained in a result set.

**Syntax:**

numFields()

**Return Object:**

It returns an integer value indicating number of fields in the result set.

**DB2CLI API:**

SQLNumResultCols

**Valid Scope:**

When the result set is available.

**Example:**

Refer to the [Basic Query](#BasicQuery) example.

[Back to top](#top)

## <a id="numRows" name="numRows">numRows</a>

**Description:**

Returns the number of rows in a table affected by an UPDATE, INSERT, MERGE, SELECT from INSERT, or DELETE statement processed against the table.

**Syntax:**

numRows()

**Return Object:**

It returns an integer value indicating number of rows affected by the operation.

**DB2CLI API:**

SQLRowCount

**Valid Scope:**

When the result set is available.

**Example:**

Refer to the [Basic Query](#BasicQuery) example.

[Back to top](#top)

## <a id="fieldType" name="fieldType">fieldType</a>

**Description:**

Returns the data type of the indicated column in a result set.

**Syntax:**

fieldType(int Index)

**Parameter** Index:

Index is the column number in a result set, ordered sequentially left to right, starting at 0.

**Return Object:**

It returns an integer value indicating the data type of the specified column in the result set.

**DB2CLI API:**

SQLColAttribute

**Valid Scope:**

When the result set is available.

**Example:**

Refer to the [Basic Query](#BasicQuery) example.

[Back to top](#top)

## <a id="fieldWidth" name="fieldWidth">fieldWidth</a>

**Description:**

Returns the width of the indicated column in a result set.

**Syntax:**

fieldWidth(int Index)

**Parameter** Index:

Index is the column number in a result set, ordered sequentially left to right, starting at 0.

**Return Object:**

It returns an integer value indicating the width of the specified column in the result set.

**DB2CLI API:**

SQLColAttribute

**Valid Scope:**

When the result set is available.

**Example:**

Refer to the [Basic Query](#BasicQuery) example.

[Back to top](#top)

## <a id="fieldNullable" name="fieldNullable">fieldNullable</a>

**Description:**

Returns if the indicated column in a result set can be NULL.

**Syntax:**

fieldNullable(int Index)

**Parameter** Index:

Index is the column number in a result set, ordered sequentially left to right, starting at 0.

**Return Object:**

It returns an Boolean value indicating if the indicated column in a result set can be NULL.

**DB2CLI API:**

SQLColAttribute

**Valid Scope:**

When the result set is available.

**Example:**

Refer to the [Basic Query](#BasicQuery) example.

[Back to top](#top)

## <a id="fieldName" name="fieldName">fieldName</a>

**Description:**

Returns the name of the indicated column in a result set.

**Syntax:**

fieldName(int Index)

**Parameter** Index:

Index is the column number in a result set, ordered sequentially left to right, starting at 0.

**Return Object:**

It returns an string value indicating the name of the specified column in the result set.

**DB2CLI API:**

SQLColAttribute

**Valid Scope:**

When the result set is available.

**Example:**

Refer to the [Basic Query](#BasicQuery) example.

[Back to top](#top)

## <a id="fieldPrecise" name="fieldPrecise">fieldPrecise</a>

**Description:**

Returns the precision of the indicated column in a result set.

**Syntax:**

fieldPrecise(int Index)

**Parameter** Index:

Index is the column number in a result set, ordered sequentially left to right, starting at 0.

**Return Object:**

It returns an integer value indicating the precision of the specified column in the result set.

**DB2CLI API:**

SQLColAttribute

**Valid Scope:**

When the result set is available.

**Example:**

Refer to the [Basic Query](#BasicQuery) example.

[Back to top](#top)

## <a id="fieldScale" name="fieldScale">fieldScale</a>

**Description:**

Returns the scale of the indicated column in a result set.

**Syntax:**

fieldScale(int Index)

**Parameter** Index:

Index is the column number in a result set, ordered sequentially left to right, starting at 0.

**Return Object:**

It returns an integer value indicating the scale of the specified column in the result set.

**DB2CLI API:**

SQLColAttribute

**Valid Scope:**

When the result set is available.

**Example:**

Refer to the [Basic Query](#BasicQuery) example.

[Back to top](#top)

## <a id="validStmt" name="validStmt">validStmt</a>

**Description:**

Checks if the SQL string is valid and interprets vendor escape clauses. If the original SQL string that is passed by the application contains vendor escape clause sequences, DB2 for i CLI returns the transformed SQL string that is seen by the data source (with vendor escape clauses either converted or discarded as appropriate).

**Syntax:**

validStmt(string Statement)

**Parameter** Statement:

Statement is a SQL string that needs to be checked and escaped.

**Return Object:**

It returns an integer value indicating the scale of the specified column in the result set.

**DB2CLI API:**

SQLNativeSql

**Valid Scope:**

After calling conn() function

**Example:**
```
db.init();
db.conn(conf.Database);
console.log("Escaped string is : %s\n", db.validStmt("SELECT * FROM …"));
db.close();
```

[Back to top](#top)

## <a id="stmtError" name="stmtError">stmtError</a>

**Description:**

Returns the diagnostic information associated with the most recently called function for a particular statement, connection, or environment handler.

**Syntax:**

stmtError(int hType, int Recno, function Callback(ErrMsg))

**Parameter** hType:

hType indicates the handler type of diagnostic information. It can be following values:

SQL_HANDLE_ENV:Retrieve the environment diagnostic information

SQL_HANDLE_DBC:Retrieve the connection diagnostic information

SQL_HANDLE_STMT:Retrieve the statement diagnostic information

**Parameter** Recno:

Recno indicates which error should be retrieved. The first error record is number 1.

**Parameter** Callback(ErrMsg):

Callback is a call back function to process the retrieved error message. ErrMsg is the retrieved error message. The information consists of a standardized SQLSTATE, the error code, and a text message.

**DB2CLI API:**

SQLGetDiagRec

**Valid Scope:**

After calling conn() function

[Back to top](#top)

## <a id="debug" name="debug">debug</a>

**Description:**

Print more detailed debugging information during execution.

**Syntax:**

debug(boolean OnOff)

**Parameter** OnOff:

Default value is false. If it is true, the program will print more detailed information.

**Valid Scope:**

All the life cycle.

**Example:**

Refer to the [Basic Query](#BasicQuery) example.

[Back to top](#top)

# <span style="font-size:28px;"><a id="Diagnostics" name="Diagnostics">Diagnostics</a></span>

<table border="1" cellpadding="0" cellspacing="0" dir="ltr" style="width: 361px;">
<tbody>
<tr>
<td style="width: 84px;">
Error Code
</td>
<td style="width: 271px;">
Meaning
</td>
</tr>
<tr>
<td style="width: 84px;">
0
</td>
<td style="width: 271px;">
Success
</td>
</tr>
<tr>
<td style="width: 84px;">
-1
</td>
<td style="width: 271px;">
Error
</td>
</tr>
<tr>
<td style="width: 84px;">
1
</td>
<td style="width: 271px;">
Success with information
</td>
</tr>
<tr>
<td style="width: 84px;">
8001
</td>
<td style="width: 271px;">
Invalid parameter numbers
</td>
</tr>
<tr>
<td style="width: 84px;">
8002
</td>
<td style="width: 271px;">
Invalid parameter type
</td>
</tr>
<tr>
<td style="width: 84px;">
8003
</td>
<td style="width: 271px;">
Invalid parameter range
</td>
</tr>
<tr>
<td style="width: 84px;">
8011
</td>
<td style="width: 271px;">
Environment handler is not allocated
</td>
</tr>
<tr>
<td style="width: 84px;">
8012
</td>
<td style="width: 271px;">
Connection handler is not allocated
</td>
</tr>
<tr>
<td style="width: 84px;">
8013
</td>
<td style="width: 271px;">
Statement handler is not allocated
</td>
</tr>
<tr>
<td style="width: 84px;">
8014
</td>
<td style="width: 271px;">
Result set is not ready.
</td>
</tr>
</tbody>
</table>

[Back to top](#top)

</div>