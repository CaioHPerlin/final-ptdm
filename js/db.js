import { openDB } from "idb";

let db;

const createDB = async () => {
    try {
        db = await openDB('feunadb', 1, {
            upgrade(db, oldVersion, newVersion, transaction) {
                switch(oldVersion){
                    case 0:
                    case 1:
                        const store = db.createObjectStore('fairs', {
                            keyPath: 'titulo'
                        });
                        store.createIndex('id', 'id');
                        console.log('banco criado')
                }
            }
        })
    } catch (err) {

    }
}