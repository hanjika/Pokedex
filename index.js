const clearBtn = document.querySelector('input[type="button"]');
clearBtn.addEventListener('click', clearAll);

let storedPokes = JSON.parse(localStorage.getItem('PokedexStorage'));

window.onload = () => {
    if (storedPokes !== null) {
        for (const storedPoke of storedPokes) {
        createCard(storedPoke); 
        }
    } else {
        storedPokes = [];
    }
}

function clearAll() {
    const allCards = document.querySelectorAll('.poke-card');
    const container = document.querySelector('.cards-container');

    for (const card of allCards) {
        container.removeChild(card);
    }

    localStorage.removeItem('PokedexStorage');
}

function submitForm(form) {
    const pokemon = form.pokemon.value.toLowerCase();

    fetch('https://pokeapi.co/api/v2/pokemon/' + pokemon)
    .then(response => response.json())
    .then(info => {
        let pokeObj = {
            name: info.name,
            id: info.id,
            moves: info.moves,
            image: info.sprites.front_default,
            type: info.types[0].type.name
        }

        let owned = alreadyOwned(pokeObj.id);

        if (owned === false) {
            fetch('https://pokeapi.co/api/v2/pokemon-species/' + pokeObj.id)
            .then(response => response.json())
            .then(info => {
                if (info.evolves_from_species.name !== null) {
                    evol = {
                        evolution: info.evolves_from_species.name
                    }
                }
                Object.assign(pokeObj, evol);
                addToStorage(pokeObj);
                createCard(pokeObj);
            })
            .catch(error => {
                addToStorage(pokeObj);
                createCard(pokeObj);
            })
        }
    })
}

function alreadyOwned(id) {
    for (const storedPoke of storedPokes) {
        if (id === storedPoke.id) {
            alert('You have already added this Pokémon');
            return true;
        }
    }
    return false;
}

function addToStorage(pokeObj) {
    storedPokes.push(pokeObj);
    localStorage.setItem('PokedexStorage', JSON.stringify(storedPokes));
}

function removeCard(e) {
    const id = e.target.id;
    const div = e.target.parentNode;

    for (let i = 0; i < storedPokes.length; i++) {
        if (storedPokes[i].id - id === 0) {
            storedPokes.splice(i, 1);
            localStorage.setItem('PokedexStorage', JSON.stringify(storedPokes));
        }
    }
    document.querySelector('.cards-container').removeChild(div);
}

function createCard(pokeObj) {
    const closeBtn = document.createElement('button');
    closeBtn.innerText = '×';
    closeBtn.setAttribute('id', pokeObj.id);
    closeBtn.addEventListener('click', removeCard);

    const div = document.createElement('div');
    div.setAttribute('id', pokeObj.id);
    div.classList.add('poke-card');
    div.classList.add(pokeObj.type);

    const img = document.createElement('img');
    img.setAttribute('src', pokeObj.image);

    const name = document.createElement('h3');
    name.innerText = pokeObj.name;

    const id = document.createElement('h4');
    id.innerText = '#' + pokeObj.id;

    const movesDiv = document.createElement('div');
    movesDiv.classList.add('moves');

    const movesH = document.createElement('h5');
    movesH.innerText = 'Moves';

    const movesUl = document.createElement('ul');
    if (pokeObj.id === 132) {
        const move = document.createElement('li');
        move.innerText = pokeObj.moves[0].move.name;
        
        movesUl.appendChild(move);
    } else {
        for (let i = 0; i < 4; i++) {
            const move = document.createElement('li');
            move.innerText = pokeObj.moves[i].move.name;
            
            movesUl.appendChild(move);
        }
    }

    const evolution = document.createElement('p');
    const capEvol = pokeObj.evolution;
    if (pokeObj.evolution !== undefined) {
        evolution.innerText = 'Evolution: ' + capEvol;
    }

    movesDiv.appendChild(movesH);
    movesDiv.appendChild(movesUl);
    div.appendChild(closeBtn);
    div.appendChild(img);
    div.appendChild(name);
    div.appendChild(id);
    div.appendChild(movesDiv);
    div.appendChild(evolution);
    document.querySelector('.cards-container').appendChild(div);
}

function ucfirst(str) {
    var firstLetter = str.slice(0,1);
    return firstLetter.toUpperCase() + str.substring(1);
}