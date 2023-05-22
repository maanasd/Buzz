import SQLite from 'react-native-sqlite-storage';
// SQLite.DEBUG(true);
SQLite.enablePromise(false);

const database_name = "creds.db";
const database_version = "1.0";
const database_displayname = "SQLite Test Database";
const database_size = 200000;




class DatabaseHandler {
    public db: SQLite.SQLiteDatabase;
    constructor() {
        // open database
        this.db = SQLite.openDatabase({ name: database_name, location:'default' }, this.openCB, this.errorCB);
        // console.log(SQLite);
    }

    openCB() {
        // console.log("Database OPENED");
    }

    successCB() {
        // console.log("SQL executed fine");
    }

    errorCB(err: any) {
        // console.log("SQL Error: " + err);
    }

    createTable() {
        this.db.transaction((tx: SQLite.Transaction) => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS Creds (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT, username TEXT, password TEXT);',
                [], this.errorCB, this.successCB);
        });
    }
    insertData(url: string, username: string, password: string) {
        this.db.transaction((tx: SQLite.Transaction) => {
            tx.executeSql('INSERT INTO Creds (url, username, password) VALUES (?,?,?)',
                [url, username, password], this.errorCB, this.successCB);
        });
    }

    getAllData(callback: (data: any) => void) {
        // without promise
        this.db.transaction((tx: SQLite.Transaction) => { 
            tx.executeSql('SELECT * FROM Creds ORDER BY id DESC', [], (tx: SQLite.Transaction, results: SQLite.ResultSet) => {
                callback(results.rows.raw());
            });
        }, this.errorCB, this.successCB);

    }
    filterData(query: string, callback: (data: any) => void) {  
        // search for matching url or username
        this.db.transaction((tx: SQLite.Transaction) => {   
            tx.executeSql('SELECT * FROM Creds WHERE url LIKE ? OR username LIKE ?', ['%'+query+'%', '%'+query+'%'], (tx: SQLite.Transaction, results: SQLite.ResultSet) => {
                // console.log(results.rows.raw());
                callback(results.rows.raw());
            });
        })
    }

    deleteData(id: number) {
        this.db.transaction((tx: SQLite.Transaction) => {
            tx.executeSql('DELETE FROM Creds WHERE id=?', [id], this.errorCB, this.successCB);
        });
    }

    updateData(id: number, url: string, username: string, password: string) {
        this.db.transaction((tx: SQLite.Transaction) => {
            tx.executeSql('UPDATE Creds SET url=?, username=?, password=? WHERE id=?',
                [url, username, password, id], this.errorCB, this.successCB);
        });
    }


}


export default DatabaseHandler;