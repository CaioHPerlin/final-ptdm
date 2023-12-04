import { openDB } from "idb";

let db;
async function criarDB(){
    try {
        db = await openDB('banco', 1, {
            upgrade(db, oldVersion, newVersion, transaction){
                switch  (oldVersion) {
                    case 0:
                    case 1:
                        const store = db.createObjectStore('feira', {
                            keyPath: 'titulo'
                        });
                        store.createIndex('id', 'id');
                        console.log("db criado");
                }
            }
        });
        const tx = await db.transaction('feira', 'readwrite');
        const store = await tx.objectStore('feira');
        const num = await store.count();
        if(num <= 0){
            await store.add({ titulo: "Feira do Universitário", lat: -22.218923912210965, long: -53.33480102208993 });
            await store.add({ titulo: "Feira Livre", lat: -22.25398676958308, long: -53.35252745399215 });
            await store.add({ titulo: "Feira do Produtor", lat: -22.2476899474564, long: -53.34076577190426 });
        }
        const feiras = await store.getAll();
        const divLista = feiras.map(feira => feiraHTML(feira.titulo, feira.lat, feira.long));
        listagem(divLista.join(' '));
        console.log("db aberto");
    }catch (e) {
        console.log('Erro ao criar banco: ' + e.message);
    }
}

window.addEventListener('DOMContentLoaded', async event =>{
    await criarDB();
    getFeiras();
    document.getElementsByTagName('form')[0].addEventListener('submit', (e) => {
        e.preventDefault();
        createFeira();
    });
});

async function getFeiras(){
    if(db == undefined){
        console.log("O banco de dados está fechado.");
    }
    const tx = await db.transaction('feira', 'readonly');
    const store = await tx.objectStore('feira');
    const feiras = await store.getAll();
    if(feiras){
        const divLista = feiras.map(feira => feiraHTML(feira.titulo, feira.lat, feira.long));
        listagem(divLista.join(' '));
    }
}

async function createFeira() {
    let titulo = document.getElementById("titulo").value;
    let lat = document.getElementById("latitude").value;
    let long = document.getElementById("longitude").value;
    const tx = await db.transaction('feira', 'readwrite')
    const store = tx.objectStore('feira');
    try {
        await store.add({ titulo: titulo, lat: lat, long: long });
        await tx.done;
        limparCampos();
        getFeiras();
        console.log('Feira adicionada com sucesso!');
    } catch (error) {
        console.error('Erro ao adicionar feira:', error);
        tx.abort();
    }
}

async function deleteFeira() {
    const tituloInput = document.getElementById('tituloRemocao');
    const anotacao = await buscarNoBanco(tituloInput.value);
    if(anotacao){
        const tx = await db.transaction('anotacao', 'readwrite');
        const store = tx.objectStore('anotacao');
        await store.delete(tituloInput.value);
        await tx.done;
        tituloInput.value = '';
        buscarTodasAnotacoes();
        console.log("Anotação removida com sucesso!");
    }else{
        console.log("Anotação não encontrada no banco")
    }
}

async function buscarNoBanco(titulo){
    if(db == undefined){
        return console.log("O banco de dados está fechado.");
    }
    const tx = await db.transaction('anotacao', 'readonly');
    const store = await tx.objectStore('anotacao');
    const anotacao = await store.get(titulo);
    await tx.done;
    if(anotacao) return anotacao;

    console.log("Anotação não encontrada.")
}

function limparCampos() {
    document.getElementById("titulo").value = '';
    document.getElementById("latitude").value = '';
    document.getElementById("longitude").value = '';
}

function listagem(text){
    document.getElementById('feiras').innerHTML = text;
}

function feiraHTML(titulo, lat, long){
    return `<div class="item">
        <h2>${titulo}</h2>
        <p>${lat}<br>${long}</p>
   </div>`
}