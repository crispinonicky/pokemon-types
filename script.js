$(document).ready(function () {
    $('#dropdownDisplay').on('click', function () {
        $('#dropdownContent').toggle();
        $("#searchInput").focus();
    });

    $('#searchInput').on('input', function () {
        let value = $(this).val().toLowerCase();
        $('#dropdownList li').filter(function () {
            $(this).toggle($(this).text()
                   .toLowerCase().indexOf(value) > -1);
        });
    });

    $('#dropdownList').on('click', 'li', function () {
        $('#dropdownDisplay').text($(this).text());
        $('#dropdownContent').hide();
        renderData($(this));
    });

    $(document).on('click', function (e) {
        if (!$(e.target).closest('.search-dropdown').length) {
            $('#dropdownContent').hide();
        }
    });

    function renderData(elem) {
        console.log(elem)
        $("#pokemon-data").removeClass("d-none");
        let imgUrl = "";

        console.log(elem[0].innerHTML.toLowerCase())
        let pokemonName = elem[0].innerHTML.toLowerCase();
        pokemonName = pokemonName.replace(/’+/g,'');
        console.log(pokemonName)

        // Image edge cases go here
        if (
            elem[0].innerHTML.includes("-Mega") 
            || elem[0].innerHTML.includes("-Primal") 
            || elem[0].innerHTML.includes("-Therian") 
            || elem[0].innerHTML.includes("Deoxys-")
            || elem[0].innerHTML.includes("Meloetta-")
            || elem[0].innerHTML.includes("Shaymin-")
            || elem[0].innerHTML.includes("Kyurem-")
            || elem[0].innerHTML.includes("Keldeo-")
        ) {
            let dexName = pokemonName;
            imgUrl = `https://img.pokemondb.net/artwork/large/${dexName}.jpg`;
        } else if (
            elem[0].innerHTML.includes("Castform-")
            || elem[0].innerHTML.includes("Cherrim-")
            || elem[0].innerHTML.includes("Wormadam-")
            || elem[0].innerHTML.includes("Rotom-")
        ) {
            let dexName = pokemonName;
            imgUrl = `https://img.pokemondb.net/artwork/vector/${dexName}.png`;
        } else if (elem[0].innerHTML.includes("-Origin")) {
            let dexName = pokemonName;
            imgUrl = `https://img.pokemondb.net/artwork/avif/${dexName}.avif`;
        } else if (elem[0].innerHTML == "Floette-Eternal") {
            imgUrl = `https://assets.pokeos.com/pokemon/home/render/670-eternal.png`;
        } else if (elem[0].innerHTML == "Darmanitan-Zen") {
            imgUrl = `https://img.pokemondb.net/artwork/large/darmanitan-zen.jpg`;
        } else if (elem[0].innerHTML == "Darmanitan-Galar-Zen") {
            imgUrl = `https://img.pokemondb.net/artwork/large/darmanitan-galarian-zen.jpg`;
        } else if (
            elem[0].innerHTML.includes("-Alola") 
            || elem[0].innerHTML.includes("-Paldea")
        ) {
            if (elem[0].innerHTML.includes("Tauros")) {
                let dexName = elem[0].innerHTML.split("-");
                dexName = (dexName[0] + "-paldean-" + dexName[2]).toLowerCase();
                imgUrl = `https://img.pokemondb.net/artwork/${dexName}.jpg`;
            } else {
                let dexName = pokemonName;
                imgUrl = `https://img.pokemondb.net/artwork/${dexName}n.jpg`;
            }
        } else if (elem[0].innerHTML.includes("-Hisui")) {
            let dexName = pokemonName;
            imgUrl = `https://img.pokemondb.net/artwork/large/${dexName}an.jpg`;
        } else if (elem[0].innerHTML.includes("-Galar")) {
            let dexName = pokemonName;
            imgUrl = `https://img.pokemondb.net/artwork/large/${dexName}ian.jpg`;
        } else {
            let dexNum = elem[0].dataset.num
            if (dexNum.toString().length < 3) {
                dexNum = dexNum.padStart(3, "0");
            }
            imgUrl = `https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/detail/${dexNum}.png`;
        }
        $("#pokemon-data .img-wrapper img").attr("src", imgUrl);
        // End image logic

        let data = JSON.parse(elem[0].dataset.info);
        console.log(data);
        //console.log(calcMatchups("I", "D/l"));

        $(".type-wrapper .type-1").attr("src", `img/${data.types[0]}.png`)
        if (data.types.length == 1) {
            $(".type-wrapper .type-2").addClass("d-none");
        } else if (data.types.length == 2) {
            $(".type-wrapper .type-2").removeClass("d-none");
            $(".type-wrapper .type-2").attr("src", `img/${data.types[1]}.png`)
        } else {
            $(".type-wrapper .type-1").addClass("d-none");
            $(".type-wrapper .type-2").addClass("d-none");
        }

        let matchups = {
            immune: [],
            stronglyResists: [],
            resists: [],
            weak: [],
            veryWeak: []
        }

        const typeRef = {
            Bug: "B",
            Water: "W",
            Steel: "S",
            Electric: "E",
            Ice: "I",
            Rock: "R",
            Normal: "N",
            Ground: "u",
            Flying: "l",
            Dark: "k",
            Psychic: "c",
            Dragon: "D",
            Poison: "P",
            Ghost: "o",
            Fighting: "t",
            Fairy: "y",
            Fire: "e",
            Grass: "G"
        }

        let defensiveType = [];
        for (let i = 0; i < data.types.length; i++) {
            defensiveType.push(typeRef[data.types[i]]);
        }
        defensiveType = defensiveType.join("/")

        for (var [key, value] of Object.entries(typeRef)) {
            let currMatchup = calcMatchups(value, defensiveType);
            if (currMatchup == 0) {
                matchups.immune.push(key);
            } else if (currMatchup == 0.25) {
                matchups.stronglyResists.push(key);
            } else if (currMatchup == 0.5) {
                matchups.resists.push(key);
            } else if (currMatchup == 2) {
                matchups.weak.push(key);
            } else if (currMatchup == 4) {
                matchups.veryWeak.push(key);
            } 
            // Potential to-do: add category for neutral damage
        }

        for (var key in matchups) {
            let typeHtml = "";
            if (matchups[key].length == 0) {
                typeHtml = "None"
            } else {
                matchups[key].forEach(type => {
                    typeHtml += `<img class='type' src='img/${type}.png'>`;
                })
            }
            $(`.${key} span`).html(typeHtml);
        }

    }

    // Type matchup logic: https://codegolf.stackexchange.com/a/55843    
    function calcMatchups(a,b) {
        // keys is a list of letters found in the types of attacks/defenses
        keys = [..."BWSEIRNulkcDPotyeG"]; 
        
        // getIndex is a single case statement.
        // it checks each of keys, one-by-one, falling through until we've found the proper index
        getIndex=x=>keys.findIndex(c=>x.match(c));
        
        // encodedValues is a list, indexed by `keys`, where each value is 7-characters.
        encodedValues = "kjwhcgnj2xd6elihtlneemw82duxijsazl3sh4iz5akjmlmsqds06xf1sbb8d0rl1nu7a2kjwi3mykjwlbpmk1up4mzl1iuenedor0bdmkjwmpk6rhcg4h3en3pew5";
        
        // the 7-character value (e.g., B=0="kjwhcgn", W=1="j2xd6el") were created by 
        // turning base4 values into base36, so let's turn this back into a string the same way
        valuesForAttack = parseInt(encodedValues.substr(getIndex(a)*7,7),36).toString(4);
        
        // valuesForAttack is indexed by defenseType.  The value will be 0..3, depending on the multiplier
        
        // let's get an array of the multipliers and reduce...
        multiplier = b.split('/').reduce((oldMultiplier,defenseType)=>oldMultiplier * [0,.5,1,2][valuesForAttack[getIndex(defenseType)]],1);
        
        return multiplier;
    }
});
