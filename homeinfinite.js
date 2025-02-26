/**
 * Extract id as string from url to pokemon
 * @param {string} pokemonUrl - a url to a pokemon from pokeApi 
 * @returns {string}
 */
function getIdFromPokemon(pokemonUrl) {
    return pokemonUrl.slice(0, -1).split("/").pop()
}

const artworkUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork"

// her begynder selve komponentet
let sectionElm = document.createElement("section")
sectionElm.className = "pokelist"

let offset = 0;

let observer = new IntersectionObserver(function(entries) {
    //console.log(entries[0])
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            console.log(entry.target);
            // observer.unobserve(entry.target)
            offset = offset + 50;
            getSomePokes(offset)
        }
    })
    
}, {
    threshold: 1
})

let imgObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if(entry.isIntersecting) {
            entry.target.src = entry.target.dataset.imagesrc;  
            imgObserver.unobserve(entry.target)
        }
    });
})



function getSomePokes(offset) {
    fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=50`)
    .then(function(response) {
        return response.json()
    }).then(
        function(data) {
            console.log(data);
            
            sectionElm.innerHTML +=  data.results.map(pokemon => `
                <article>
                    <p>${getIdFromPokemon(pokemon.url)}</p>   
                    <h2>${pokemon.name}</h2>
                    <img class="poke__img" src="/img/placeholder.png" data-imagesrc="${artworkUrl}/${getIdFromPokemon(pokemon.url)}.png" alt="${pokemon.name}">

                </article>
            `).join("")
            let observedPokemon = sectionElm.querySelector("article:nth-last-child(5)")
            
            let observedImgs = sectionElm.querySelectorAll(".poke__img")
            console.log(observedImgs);
            
            observer.observe(observedPokemon)

            observedImgs.forEach(observedImg  => imgObserver.observe(observedImg))
            
        }
    )
    document.querySelector("main").append(sectionElm)

}

getSomePokes(0)