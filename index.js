
let find_btn = document.getElementById('find');
let find_input = document.getElementById('input');
let characters_div = document.getElementById('api-response');

const URL = "https://rickandmortyapi.com/api/character";

let characters_array =[];

//traer personajes
const fetchCharacter = async (url = URL) => {
    try{
        const response = await fetch(url, {method: "GET"})

        const { results : characters} = await response.json();
    
        console.log("respuesta de FETCH: ", response)
    
        console.log("Array de personajes con su info: ", characters)
        return characters;
    }
    catch (err){
        console.error(err);
    }
}

const showMessage = () => {
    document.getElementById('message').innerHTML = 
    `
    <div style="height: 70vh;">
        <h5 class="text-center p-5 mb-2 bg-warning text-white rounded"> No hay más personajes </h5>
        <button class="btn btn-info d-block mt-5 mx-auto" onClick="showAll()">Mostrar todos los personajes</button>
    </div>
    `;
    find_input.disabled = true;
}

//Borrar personaje del DOM
const deleteCharacter = (idCharacter) => {
    document.getElementById(`${idCharacter}`).remove();
    characters_array = characters_array.filter(character => character.id != idCharacter);
    find_input.value = ''; 
    characters_array.length === 0 ? showMessage() : null;  
};

const iconCard = (x) => {
    if(x === "Alive"){
        return '<i class="fas fa-circle pe-2" style="color: rgb(85, 204, 68); font-size: 12px;"></i>';
    }else if(x === "Dead"){
        return '<i class="fas fa-circle pe-2" style="color: rgb(214, 61, 46); font-size: 12px;"></i>';
    }else{
        return '<i class="fas fa-circle pe-2" style="color: rgb(255, 255, 255); font-size: 12px;"></i>';
    } 
}
const createNode = ({id, image, name, species, status, origin, gender}) => {
    
    const node = 
    //cards:
    `
    <div class="card mb-3" style="max-width: 580px;" id="${id}">
        <div class="row g-0">
            <div class="col-md-5">
                <img src="${image}" class="img-fluid rounded-start" alt="${name}">
            </div>
            <div class="col-md-7">
                <div class="card-body rounded-end">
                    <h5 class="card-title">${name}</h5>
                    <h6 class="card-text"> 
                    ${iconCard(status)} ${status} - Especie: ${species}</h6>
                    <p class="card-text"> Género: ${gender}</p>
                    <p class="card-text">Origen: ${origin.name}</p>
                    <button class="btn btn-dark btn-block" onClick=deleteCharacter(${id}) >Borrar</button>
                </div>
            </div>
        </div>
    </div>

    `;
    
    characters_div.insertAdjacentHTML("beforeend", node);
}


const searchCharacter = () => {
    
    let inputChar = find_input.value;
    
    let index = characters_array.filter(x => x.name.toLowerCase().includes(inputChar.toLowerCase().trim()));
    
    if(index.length == 0){
        characters_div.innerHTML = 
        `<div style="height: 70vh;">
            <h5 class="text-center p-5 mb-5 bg-warning text-white rounded w-75 mx-auto"> No hay resultados a tu búsqueda</h5>
            <button class="btn btn-info d-block mt-5 mx-auto pulse" onClick="showAll()">Mostrar todos los personajes</button>
        </div>
        `;
    }else{
        characters_div.innerHTML = ``;
        for(let i =0; i < index.length; i++){
            createNode(index[i])
        }
        characters_div.insertAdjacentHTML("beforeend", 
        `<div style="height : 70vh";>
            <button class="btn btn-primary d-block my-5 mx-auto" onClick="showAll()"> Ver todos los personajes </button>
        </div>
        `) ;
        find_input.value = '';
    }

}


find_input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      find_btn.click();
    }
});


const iterateCharacters = (characters) => {
    characters.map(character => createNode(character));
}

//.... carga el DOM
async function start (){
    find_btn.addEventListener('click', searchCharacter);
    characters_array = await fetchCharacter();
    iterateCharacters(characters_array);
}

const showAll = () => {
    characters_div.innerHTML = '';
    find_input.value = ''; 
    start();
}
window.onload = start()
