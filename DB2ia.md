<div>

<a id="top" name="top"></a>
# <span style="font-size: 36px;">DB2 for i Access APIs</span>

## [Introduction](#Introduction)

## [Examples](#Examples)

 - [Basic Query](#BasicQuery)
 - [Stored Procedure](#StoredProcedure)
 - [Concurrent Query](#ConcurrentQuery)

## [Class dbconn](#Classdbconn)

[setConnAttr](#setConnAttr)

[getConnAttr](#getConnAttr)

[conn](#conn)

[disconn](#disconn)

[close](#close)

[debug](#debug)

[validStmt](#validStmt)

## [Class dbstmt](#Classdbstmt)

[setStmtAttr](#setStmtAttr)

[getStmtAttr](#getStmtAttr)

[exec](#exec)

[execSync](#execSync)

[prepare](#prepare)

[prepareSync](#prepareSync)

[bindParam](#bindParam)

[bindParamSync](#bindParamSync)

[execute](#execute)

[executeSync](#executeSync)

[nextResult](#nextResult)

[commit](#commit)

[rollback](#rollback)

[close](#close)

[Cursor](#closeCursor)

[Statement close](#stmt_close)

[fetch](#fetch)

[fetchSync](#fetchSync)

[fetchAll](#fetchAll)

[fetchAllSync](#fetchAllSync)

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

## [debug](#debug)

## [Diagnostics](#Diagnostics)

[Back to top](#top)

# <a id="Introduction" name="Introduction">Introduction</a>

The new DB2 add-on for Node.js is a JavaScript API set for DB2 database manipulation on IBM i. The add-on is shipped with Node.js and located in /QOpenSys/QIBM/ProdData/OPS/Node4/os400/db2i/. It contains a new non-blocking driver **db2ia.node** and a deprecated blocking driver **db2i.node** in the **bin** directory, and their respective library file **db2a.js** and **db2.js** in the **lib** directory. For the usage of the old synchronized **db2i** add-on, please refer to the document – [https://www.ibm.com/developerworks/community/wikis/home?lang=en#!/wiki/IBM%20i%20Technology%20Updates/page/DB2%20for%20i%20access%20APIs](https://www.ibm.com/developerworks/community/wikis/home?lang=en#!/wiki/IBM%20i%20Technology%20Updates/page/DB2%20for%20i%20access%20APIs)

To use the DB2 add-on, you only need to require the **db2a.js** file in your source code.

**Note**: The new DB2 Add-on requires Node.js v4, please check the effective Node.js by command ‘node -v’ first.

[Back to top](#top)

# <a id="Examples" name="Examples">Examples</a>

## <a id="Basic Query" name="BasicQuery">Basic Query</a>

```
var db = require('/QOpenSys/QIBM/ProdData/OPS/Node4/os400/db2i/lib/db2a'); 
var sql = "SELECT STATE,LSTNAM FROM QIWS.QCUSTCDT";
var dbconn = new db.dbconn();  // Create a connection object.
dbconn.conn("*LOCAL");  // Connect to a database.
var stmt = new db.dbstmt(dbconn);  // Create a statement object of the connection.
stmt.exec(sql, function (result) {     
    console.log("Result: %s", JSON.stringify(result));     
    var fieldNum = stmt.numFields();     
    console.log("There are %d fields in each row.", fieldNum);     
    console.log("Name | Length | Type | Precise | Scale | Null");     
            for (var i = 0; i < fieldNum; i++) console.log("%s | %d | %d | %d | %d | %d", stmt.fieldName(i), stmt.fieldWidth(i), stmt.fieldType(i), stmt.fieldPrecise(i), stmt.fieldScale(i), stmt.fieldNullable(i));     
    stmt.close();  // Clean up the statement object.
    dbconn.disconn();  // Disconnect from the database.
    dbconn.close();  // Clean up the connection object.
});
```

[Back to top](#top)

## <a id="StoredProcedure" name="StoredProcedure">Stored Procedure</a>

```
var db = require('/QOpenSys/QIBM/ProdData/OPS/Node4/os400/db2i/lib/db2a');
var sql = "call QXMLSERV.iPLUG512K(?,?,?,?)";
var dbconn = new db.dbconn();
dbconn.conn("*LOCAL");
var stmt = new db.dbstmt(dbconn);
var ipc = "*NA";
var ctl = "*here";
var xmlIn = "<xmlservice><sh>system 'wrkactjob'</sh></xmlservice>";
var xmlOut = "";
stmt.prepare(sql, function () {
    stmt.bindParam([  
        [ipc, db.SQL_PARAM_INPUT, 1],
        [ctl, db.SQL_PARAM_INPUT, 1],        
        [xmlIn, db.SQL_PARAM_INPUT, 0],        
        [xmlOut, db.SQL_PARAM_OUTPUT, 0],    
    ], function () {       
        stmt.execute(function (out) {  //out is an array of the output parameters.                  
            for (var i = 0; i < out.length; i++)        console.log("Output Param[%d] = %s \n", i, out[i]);       
            stmt.close();       
            dbconn.disconn();       
            dbconn.close();      
        });   
    });
});
```

[Back to top](#top)

## <a id="ConcurrentQuery" name="ConcurrentQuery">Concurrent Query</a>
```
var dba = require('/QOpenSys/QIBM/ProdData/OPS/Node4/os400/db2i/lib/db2a');
var dbconn = new dba.dbconn();
dbconn.conn("*LOCAL");
var sqlA = new dba.dbstmt(dbconn);
var sqlB = new dba.dbstmt(dbconn);
console.log("Execute A.");
sqlA.exec(sql, function() {
        console.log("Execute A Done.");
        sqlA.close();
});
console.log("Execute B.");
sqlB.exec(sql, function() {
        console.log("Execute B Done.");
        sqlB.close();
});

setTimeout(function(){
         dbconn.disconn();
         dbconn.close();
},1000);  //Sleep for 1 second to wait for both queries done.
```

[Back to top](#top)

# <a id="Classdbconn" name="Classdbconn">Class dbconn</a>

The **dbconn** class represents a connection object. It can connect to a database, and disconnect from it. Please use the **new** operator to instantiate it and the **delete** function to clean up.

## <a id="setConnAttr" name="setConnAttr">setConnAttr</a>

**Description:**

Set connection attributes.

**Syntax:**

setConnAttr(int Attribute, int/string Value)

**Parameter** _Attribute_:

Attribute is the connection attribute to set. Refer to [this table](http://www-01.ibm.com/support/knowledgecenter/ssw_ibm_i_71/cli/rzadpfnsconx.htm%23rzadpfnsconx__tbcono) for more details.

**Parameter** _Value_:

Depending on the Attribute, this can be an integer value, or a character string.

**DB2 CLI API:**

SQLSetConnectAttr

**Valid Scope:**

Before connecting to a database.

**Comments:**

The **Auto Commit** feature is automatically enabled.

[Back to top](#top)

## <a id="getConnAttr" name="getConnAttr">getConnAttr</a>

**Description:** 

Returns the current settings for the specified connection option

**Syntax:**

getConnAttr(int _Attribute_)

**Parameters** _Attribute_:

_Attribute_ is the connection attribute to set.Refer to [this table](http://www-01.ibm.com/support/knowledgecenter/ssw_ibm_i_71/cli/rzadpfnsconx.htm%23rzadpfnsconx__tbcono) for more details.

**Return Object:**

It returns the attribute option in the format of an_integer_ or a _string_ depending on the attribute type.

**DB2CLI API:**

SQLGetConnectAttr

**Valid Scope:**

After instantiated the connection object.

[Back to top](#top)

## <a id="conn" name="conn">conn</a>

**Description:**

Establishes a connection to the target database. The application can optionally supply a target SQL database, an authorization name, and an authentication string.

**Syntax 1:**

conn(string _Database_)

**Syntax 2:**

conn(string _Database_, function _Callback_)

**Syntax 3:**

conn(string _Database_, string _User_, string _Password_)

**Syntax 4:**

conn(string _Database_, string _User_, string _Password_, function _Callback_)

**Parameters** _Database_:

_Database_ is the name or alias name of the database.

**Parameters** _User_:

_User_ is the authorization name (user identifier).

**Parameters** _Password_:

_Password_ is the authentication string (password).

**Parameters** _Callback_:

_Callback_ is a callback function running after the connection established.

**DB2CLI API:**

SQLConnect

**Valid Scope:**

Before calling the **exec()** or **prepare()** function.

[Back to top](#top)

## <a id="disconn" name="disconn">disconn</a>

**Description:**

Ends the connection associated with the database connection handle. After calling this function, either call conn() to connect to another database, or delete the connection object.

**Syntax:**

disconn()

**DB2CLI API:**

SQLDisconnect

**Valid Scope:**

After calling the **conn()** function.

[Back to top](#top)

## <a id="close" name="close">close</a>

**Description:**

Frees the connection object. All DB2 for i resources associated with the connection object are freed. disconn() must be called before calling this function.

**Syntax:**

close()

**DB2CLI API:**

SQLFreeConnect

**Valid Scope:**

After calling the **dis****conn()** function.

[Back to top](#top)

## <a id="debug" name="debug">debug</a>

**Description: **

Print more detailed debugging information during execution.

**Syntax:**

debug(boolean OnOff)

**Parameter** OnOff:

Default value is false. If it is true, the program will print more detailed information.

**Valid Scope:**

All the life cycle.

[Back to top](#top)

## <a id="validStmt" name="validStmt">validStmt</a>

**Description:**

Checks if the SQL string is valid and interprets vendor escape clauses. If the original SQL string that is passed by the application contains vendor escape clause sequences, DB2 for i CLI returns the transformed SQL string that is seen by the data source (with vendor escape clauses either converted or discarded as appropriate).

**Syntax:**

validStmt(string _Statement_)

**Parameters** _Statement_:

_Statement_ is a SQL string that needs to be checked and escaped.

**Return Object:**

It returns a _string_ with the escaped clauses.

**DB2CLI API:**

SQLNativeSql

**Valid Scope:**

After calling **conn**() function

**Example**
```
var db = require('/QOpenSys/QIBM/ProdData/OPS/Node6/os400/db2i/lib/db2a');

var dbconn = new db.dbconn();
dbconn.conn("*LOCAL")
try {
    // note invalid statement with 2 commas after aConst will throw error
    var escapedStmt = dbconn.validStmt("SELECT 'ConstantData' as aConst ,, cust.* FROM CUSTOMERS cust")
    console.log("Escaped string is : %s\n", escapedStmt);
} catch(err) {
    console.log(err.message)
}
dbconn.close();
```
[Back to top](#top)

# <a id="Classdbstmt" name="Classdbstmt">Class dbstmt</a>

The dbstmt class represents a SQL statement object along with its query result set. The construct function accepts an input parameter of a connection object. One connection object can derive many statement objects. Please use the new operator to instantiate it and the delete function to clean up.

## <a id="setStmtAttr" name="setStmtAttr">setStmtAttr</a>

**Description: **

Set an attribute of a specific statement handle. To set an option for all statement handles associated with a connection handle, the application can call setConnAttr().

**Syntax:**

setStmtAttr(int Attribute, int/string Value)

**Parameter** Attribute:

Attribute is the statement attribute to set. Refer to [this table](http://www-01.ibm.com/support/knowledgecenter/ssw_ibm_i_71/cli/rzadpfnsstma.htm%23rzadpfnsstma__tbstmto) for more details.

**Parameter** Value:

Depending on the Attribute, this can be an integer value, or a character string.

**DB2 CLI API:**

SQLSetStmtAttr

**Valid Scope:**

After allocating the statement handler.

[Back to top](#top)

## <a id="getStmtAttr" name="getStmtAttr">getStmtAttr</a>

**Description:**

Returns the current settings for the specified connection option

**Syntax:**

getStmtAttr(int Attribute)

**Parameter** Attribute:

Attribute is the connection attribute to set. Refer to [this table](http://www-01.ibm.com/support/knowledgecenter/ssw_ibm_i_71/cli/rzadpfnsstma.htm%23rzadpfnsstma__tbstmto) for more details.

**Return Object:**

It returns the attribute option in the format of an integer or a string depending on the attribute type.

**DB2CLI API:**

SQLGetStmtAttr

**Valid Scope:**

After allocating the statement handler.

[Back to top](#top)

## <a id="exec" name="exec">exec</a>

**Description:**

Directly runs the specified SQL statement. The statement can only be processed once. Also, the connected database server must be able to prepare the statement. This is a non-blocking API.

**Syntax:**

exec(string SQL, function Callback(JsonObj))

exec(string SQL, function Callback(JsonObj, Error))

**Parameter** SQL:

SQL is the SQL statement string.

**Parameter** Callback(JsonObj [, Error]):

Callback is a callback function to process the result set of the SQL statement for callers. JsonObj is the result set of the SELECT SQL statement. It is in the JSON format. Error is the error message when error happens. It's a optional parameter.

**DB2CLI API:**

SQLExecDirect

**Valid Scope:**

After calling the conn() function.

[Back to top](#top)

## <a id="execSync" name="execSync">execSync</a>

**Description:**

The synchronized version of exec(). This is a blocking API.

**Syntax 1:**

exec(string SQL)

**Syntax 2:**

exec(string SQL, function Callback(JsonObj))

**Parameter** SQL:

SQL is the SQL statement string.

**Parameter** Callback(JsonObj):

Callback is a callback function to process the result set of the SQL statement for callers. JsonObj is the result set of the SELECT SQL statement. It is in the JSON format.

**Comments:**

<div dir="ltr" style="margin-left: 40px;">* If the SQL statement is UPDATE, INSERT, MERGE, SELECT from INSERT, or DELETE statement, nothing will be returned and it is recommended to use Syntax 1\. And user can issue the numRows() function to get the affected row number.  

* It is recommended to invoke the numFields(), numRows(), fieldName() and other result set related functions in this callback function. Because they rely on the temporal result set in memory. After running execSync() the result set will be destroyed and cleaned up.</div>

**DB2CLI API:**

SQLExecDirect

**Valid Scope:**

After calling the conn() function.

**Example:**
```
var db = require('/QOpenSys/QIBM/ProdData/OPS/Node4/os400/db2i/lib/db2a');  
var sql = "SELECT STATE FROM QIWS.QCUSTCDT";  
var dbconn = new db.dbconn();  // Create a connection object.  
dbconn.conn("*LOCAL");  // Connect to a database.  
var stmt = new db.dbstmt(dbconn);  // Create a statement object of the connection.  
stmt.execSync(sql, function(result) {  
       console.log("Result: %s", JSON.stringify(result));  
});  
stmt.close();  
conn.disconn();  
conn.close();
```

[Back to top](#top)

## <a id="prepare" name="prepare">prepare</a>

**Description:**

Associates an SQL statement with the input statement handle and sends the statement to the DBMS to be prepared. The application can reference this prepared statement by passing the statement handle to other functions.

**Syntax:**

prepare(string SQL, function Callback())

prepare(string SQL, function Callback(Error))

**Parameter** SQL:

SQL is the SQL statement string.

**Parameter** Callback([Error]):

Callback is a callback function. Error is an optional parameter of the callback function. It is the error message when error happens.

**Comments:**

* If the statement handler has been used with a SELECT statement, closeCursor() must be called to close the cursor, before calling prepare() again.

**DB2CLI API:**

SQLPrepare

**Valid Scope:**

After calling the conn() function.

Before calling the execute() or bindParam() function.

[Back to top](#top)

## <a id="prepareSync" name="prepareSync">prepareSync</a>

**Description:**

The synchronized version of prepare(). This is a blocking API.

**Syntax 1:**

prepareSync(string SQL)

**Syntax 2:**

prepareSync(string SQL, function Callback())

**Parameter** SQL:

SQL is the SQL statement string.

**Parameter** Callback():

Callback is a callback function.

**Comments:**

* If the statement handler has been used with a SELECT statement, closeCursor() must be called to close the cursor, before calling prepareSync() again.

**DB2CLI API:**

SQLPrepare

**Valid Scope:**

After calling the conn() function.

Before calling the executeSync() or bindParamSync() function.

**Example:**
```
var db = require('/QOpenSys/QIBM/ProdData/OPS/Node4/os400/db2i/lib/db2a');  
var sql = "SELECT STATE FROM QIWS.QCUSTCDT";  
var dbconn = new db.dbconn();  // Create a connection object.  
dbconn.conn("*LOCAL");  // Connect to a database.  
var stmt = new db.dbstmt(dbconn);  // Create a statement object of the connection.  
stmt.prepareSync("call QXMLSERV.iPLUG512K(?,?,?,?)");  
stmt.bindParamSync([  
       ["*NA", db.SQL_PARAM_INPUT, 1],  
       ["*here", db.SQL_PARAM_INPUT, 1],  
       ["<xmlservice></xmlservice>", db.SQL_PARAM_INPUT, 0],  
       ["", db.SQL_PARAM_OUTPUT, 0],  
]);  
stmt.executeSync(function callback(out) {  //out is an array of the output parameters.  
       console.log("Result: %s", JSON.stringify(out));  
});  

stmt.close();  
conn.disconn();  
conn.close();
```
[Back to top](#top)

## <a id="bindParam" name="bindParam">bindParam</a>

**Description:**

Associate (bind) parameter markers in an SQL statement to application variables. Data is transferred from the application to the Database Management System (DBMS) when execute() is called. Data conversion might occur when the data is transferred.

This function must also be used to bind application storage to a parameter of a stored procedure where the parameter can be input, output.

This is a non-blocking API.

**Syntax:**

bindParam(array ParamList, function Callback())

bindParam(array ParamList, function Callback(Error))

**Parameter** ParamList:

ParamList is a java script array representing the binding parameter list. Each parameter has three attributes which are also represented as an array. The three attributes are Value, In/Out Type and Indicator. Value can be an integer value or a string. In/Out Type is an integer. If Value is an input value, please set it to 0\. Otherwise, set it to 1\. Indicator is an integer flag to tell the function how to process some special types of parameters. Different type of Value requires corresponding Indicator. If the parameter is CLOB string, set it to 0, if it is a NTS string, set it to 1, if it is an integer, set it to 2.

**Parameters** Callback([Error]): 

Callback is a callback function. Error is an optional parameter. It is the error message when error happens.

**DB2CLI API:**

SQLBindParameter

**Valid Scope:**

In the callback function of the prepare() function.

[Back to top](#top)

## <a id="bindParamSync" name="bindParamSync">bindParamSync</a>

**Description:**

The synchronized version of bindParam().   

This is a blocking API.

**Syntax 1:**

bindParamSync(array ParamList)

**Syntax 2:**

bindParamSync(array ParamList, function Callback())

**Parameter** ParamList:

ParamList is a java script array representing the binding parameter list. Each parameter has three attributes which are also represented as an array. The three attributes are Value, In/Out Type and Indicator. Value can be an integer value or a string. In/Out Type is an integer. If Value is an input value, please set it to 0\. Otherwise, set it to 1\. Indicator is an integer flag to tell the function how to process some special types of parameters. Different type of Value requires corresponding Indicator. If the parameter is CLOB string, set it to 0, if it is a NTS string, set it to 1, if it is an integer, set it to 2.

**Parameters** Callback(): 

Callback is a callback function.

**DB2CLI API:**

SQLBindParameter

**Valid Scope:**

After calling the prepareSync() function.  

Before calling the executeSync() function.

**Example:**

See the example of prepareSync().

[Back to top](#top)

## <a id="execute" name="execute">execute</a>

**Description:**

Runs a statement that was successfully prepared using prepare() once or multiple times. The statement is processed with the current values of any application variables that were bound to parameter markers by bindParam().

This is a non-blocking API.

**Syntax 1:**

execute(function Callback())

**Syntax 2:**

execute(function Callback(Out))

**Syntax 3:**

execute(function Callback(Error))

**Parameter** Callback(Out):

Callback is a callback function. If the output contains parameters of the parameter markers, Out is a list of the output parameters in the java script array format. Otherwise, the callback function takes no output parameter and is only for fetching the result set. Error is the error message when error happens.

**DB2CLI API:**

SQLExecute

**Valid Scope:**

In the callback function of the prepare() or bindParam() function.

[Back to top](#top)

## <a id="executeSync" name="executeSync">executeSync</a>

**Description:**

The synchronized version of execute().   

This is a blocking API.

**Syntax 1:**

executeSync()

**Syntax 2:**

execute(function Callback(OutParamList))

**Parameter** Callback(OutParamList):

Callback is a callback function to process the output parameters of the parameter markers. OutParamList is a list of the output parameters. It is in the java script array format.

**Comments:**

* If the statement also return a result set, user can issue the fetch() function to retrieve the data row by row.

**DB2CLI API:**

SQLExecute

**Valid Scope:**

After calling the prepareSync() function.

**Example:**

See the example of prepareSync().

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

**Description: **

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

## <a id="closeCursor" name="closeCursor">closeCursor</a>

**Description:** 

Calling closeCursor() closes any cursor associated with the dbstmt object and discards any pending results. If no open cursor is associated with the dbstmt object, the function has no effect. If the dbstmt object references a stored procedure that has multiple result sets, the closeCursor() closes only the current result set. Any additional result sets remain open and usable.  

If you want to reuse the dbstmt object, please call closeCursor() before calling exec() or prepare() for another SQL statement. Otherwise, you just need to call delete to completely remove it.

**Syntax:**

closeCursor()

**DB2CLI API:**

SQLCloseCursor

**Valid Scope:**

After calling the fetch() or fetchAll() function.

[Back to top](#top)

## <a id="stmt_close" name="stmt_close">close</a>

**Description:** 

DB2 for i resources associated with the statement object are freed. The open cursor, if any, is closed and all pending results are discarded.

**Syntax:**

close()

**DB2CLI API:**

SQLFreeStmt

**Valid Scope:**

After executing an SQL statement and processing the results.

[Back to top](#top)

## <a id="fetch" name="fetch">fetch</a>

**Description:**

Advances the cursor to the next row of the result set, and retrieves any bound columns. Or positions the cursor based on the requested orientation and then retrieves any bound columns.

This is a non-blocking API.

**Syntax 1:**

fetch()

**Syntax 2:**

fetch(function Callback(Row))

fetch(function Callback(Row, Error))

**Syntax 3:**

fetch(int Orient, int Offset)

**Syntax 4:**

fetch(int Orient, int Offset, function Callback(Row))

fetch(int Orient, int Offset, function Callback(Row, Error))

**Parameter** Callback(Row, Error):

Callback is a callback function to process the fetched row. Row is the fetched row represented in a key-value java script array. Error is the error message when error happens.

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
stmt.prepare("SELECT * FROM ...", function(){  
    stmt.execute(function(){  
        function asyncFetch(){  
            stmt.fetch(function callback(row, rc){  
                assert(rc != db.SQL_ERROR);  
                console.log(row);  
                if(rc != db.SQL_NO_DATA_FOUND)  
                    asyncFetch();  
                else { // the last row.  
                    stmt.close();  
                    conn.disconn();  
                    conn.close();  
                }  
            });  
        }  
        asyncFetch();  
    });  
});
```

[Back to top](#top)

## <a id="fetchSync" name="fetchSync">fetchSync</a>

**Description:**

The synchronized version of fetch().

This is a blocking API.

**Syntax 1:**

fetchSync()

**Syntax 2:**

fetchSync(function Callback(Row))

**Syntax 3:**

fetchSync(int Orient, int Offset)

**Syntax 4:**

fetchSync(int Orient, int Offset, function Callback(Row))

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

[Back to top](#top)

## <a id="fetchAll" name="fetchAll">fetchAll</a>

**Description:**

Fetch all the rows of data from the result set in one time.

This is a non-blocking API.

**Syntax:**

fetchAll(function Callback(Row))

fetchAll(function Callback(Row, Error))

**Parameter** Callback(Row[ , Error]):

Callback is a callback function to process the fetched row. Row is the fetched row represented in a key-value java script array. Error is an optional parameter. It is the error message when error happens.

**DB2CLI API:**

SQLFetch

**Valid Scope:**

When the result set is available.

**Example:**
```
stmt.prepare("SELECT * FROM ...", function(){  
    stmt.execute(function(){  
        stmt.fetchAll(function(result){   
            console.log(result);  
            stmt.close();  
        });  
    });  
});
```
[Back to top](#top)

## <a id="fetchAllSync" name="fetchAllSync">fetchAllSync</a>

**Description:**

The synchronized version of fetchAll().

This is a blocking API.

**Syntax:**

fetchAllSync(function Callback(Row))

**Parameter** Callback(Row):

Callback is a callback function to process the fetched row. Row is the fetched row represented in a key-value java script array.

**DB2CLI API:**

SQLFetch

**Valid Scope:**

When the result set is available.

**Example:**
```
stmt.prepareSync("SELECT * FROM ...");  
stmt.executeSync();  
stmt.fetchAllSync(function callback(rs){  
       console.log(rs);  
});  

stmt.close();
```
[Back to top](#top)

## <a id="numFields" name="numFields">numFields</a>

**Description: **

Returns the number of fields contained in a result set.

**Syntax:**

numFields()

**Return Object:**

It returns an integer value indicating number of fields in the result set.

**DB2CLI API:**

SQLNumResultCols

**Valid Scope:**

When the result set is available.

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

[Back to top](#top)

## <a id="fieldName" name="fieldName">fieldName</a>

**Description: **

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

# <a id="Diagnostics" name="Diagnostics">Diagnostics</a>

<table border="1" cellpadding="0" cellspacing="0" dir="ltr" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; width: 361px;">

<tbody>
<tr>
<td style="width: 84px;">Error Code</td>
<td style="width: 271px;">Meaning</td>
</tr>
<tr>
<td style="width: 84px;">0</td>
<td style="width: 271px;">Success</td>
</tr>
<tr>
<td style="width: 84px;">-1</td>
<td style="width: 271px;">Error</td>
</tr>
<tr>
<td style="width: 84px;">1</td>
<td style="width: 271px;">Success with information</td>
</tr>
<tr>
<td style="width: 84px;">8001</td>
<td style="width: 271px;">Invalid parameter numbers</td>
</tr>
<tr>
<td style="width: 84px;">8002</td>
<td style="width: 271px;">Invalid parameter type</td>
</tr>
<tr>
<td style="width: 84px;">8003</td>
<td style="width: 271px;">Invalid parameter range</td>
</tr>
<tr>
<td style="width: 84px;">8011</td>
<td style="width: 271px;">Environment handler is not allocated</td>
</tr>
<tr>
<td style="width: 84px;">8012</td>
<td style="width: 271px;">Connection handler is not allocated</td>
</tr>
<tr>
<td style="width: 84px;">8013</td>
<td style="width: 271px;">Statement handler is not allocated</td>
</tr>
<tr>
<td style="width: 84px;">8014</td>
<td style="width: 271px;">Result set is not ready.</td>
</tr>
</tbody>
</table>

[Back to top](#top)

</div>