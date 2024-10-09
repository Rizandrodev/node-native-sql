import {DatabaseSync} from "node:sqlite"
import SqlBricks from "sql-bricks"

const database=new DatabaseSync('./db.sqlite')
function runSeed(items){
    database.exec(`DROP TABLE IF EXISTS students`)

    database.exec(`
        CREATE TABLE students(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL
        )STRICT`)
        insert({table:'students',items})

        // const query=SqlBricks
        // .select('name,phone')
        // .orderBy('name')
        // .from('students') 
        //  .toString()

      //console.log(select(query))
    }

export function select(query){
    return database.prepare(query).all()
}

export function insert({table,items}){
   const {text,values}= SqlBricks.insertInto(table,items)
    .toParams({placeholder:'?'})

    const insertStatement=database.prepare(text)
    insertStatement.run(...values)
    //console.log({text,values})
}
runSeed([{
    name:"Rui",
    phone:'44447d'
},
{
    name:"Ernesto bArtolomeu",
    phone:"45877"
}])