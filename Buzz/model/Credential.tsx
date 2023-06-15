import SQLite from 'react-native-sqlite-storage';
import Encryption from './Encryption';
// SQLite.DEBUG(true);
SQLite.enablePromise(false);

const database_name = "creds.db";
const database_version = "1.0";
const database_displayname = "SQLite Test Database";
const database_size = 200000;




class DatabaseHandler {
    public db: SQLite.SQLiteDatabase;
    public encryptionKey: string = '';
    constructor() {
        // open database
        this.db = SQLite.openDatabase({ name: database_name, location:'default' }, this.openCB, this.errorCB);
    }
    setEncryptionKey(key: string) {
        this.encryptionKey = key;
    }
    getEncryptionKey(): string {
        return this.encryptionKey;
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
                [url, username, password]);
        });
    }

    getAllData(callback: (data: any) => void, encryptionKey: string) {
        // without promise
        this.db.transaction((tx: SQLite.Transaction) => { 
            tx.executeSql('SELECT * FROM Creds ORDER BY id DESC', [], async (tx: SQLite.Transaction, results: SQLite.ResultSet) => {
                const result = await Promise.all((results.rows.raw()).map(async (item: any) => {
                    let passCipher: {iv: string, cipher: string};
                    let pass:string;
                    try{
                        passCipher = JSON.parse(item.password);
                        pass = await Encryption.decryptData(passCipher, encryptionKey);
                    } catch {
                        passCipher = {iv: '', cipher: ''};
                        pass = ''
                    }
                    
                    return {
                        id: item.id,
                        url: item.url,
                        username: item.username,
                        password: pass
                    }
                }));

                callback(result);
            });
        }, this.errorCB, this.successCB);

    }
    filterData(query: string, callback: (data: any) => void, encryptionKey: string) {  
        // search for matching url or username
        this.db.transaction((tx: SQLite.Transaction) => {   
            tx.executeSql('SELECT * FROM Creds WHERE url LIKE ? OR username LIKE ?', ['%'+query+'%', '%'+query+'%'], async (tx: SQLite.Transaction, results: SQLite.ResultSet) => {
                const result = await Promise.all((results.rows.raw()).map(async (item: any) => {
                    let passCipher: {iv: string, cipher: string};
                    let pass: string;
                    try{
                        passCipher = JSON.parse(item.password);
                        pass = await Encryption.decryptData(passCipher, encryptionKey);
                    } catch {
                        passCipher = {iv: '', cipher: ''};
                        pass = ''
                    }
                    return {
                        id: item.id,
                        url: item.url,
                        username: item.username,
                        password: pass
                    }
                }));

                callback(result);
            });
        })
    }

    deleteData(id: number) {
        this.db.transaction((tx: SQLite.Transaction) => {
            tx.executeSql('DELETE FROM Creds WHERE id=?', [id], this.errorCB, this.successCB);
        });
    }

    updateData(id: number, url: string, username: string, password: string, callback: () => void) {
        this.db.transaction((tx: SQLite.Transaction) => {
            tx.executeSql('UPDATE Creds SET url=?, username=?, password=? WHERE id=?',
                [url, username, password, id], this.errorCB, this.successCB);
            callback();
        });
    }


}


export default DatabaseHandler;