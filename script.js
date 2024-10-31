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
        if (elem[0].innerHTML.includes("-Mega") || elem[0].innerHTML.includes("-Primal")) {
            let dexName = elem[0].innerHTML.toLowerCase();
            imgUrl = `https://img.pokemondb.net/artwork/${dexName}.jpg`;
        } else if (elem[0].innerHTML.includes("-Alola")) {
            let dexName = elem[0].innerHTML.toLowerCase();
            imgUrl = `https://img.pokemondb.net/artwork/${dexName}n.jpg`;
        } else if (elem[0].innerHTML.includes("-Hisui")) {
            let dexName = elem[0].innerHTML.toLowerCase();
            imgUrl = `https://img.pokemondb.net/artwork/${dexName}an.jpg`;
    } else {
            let dexNum = elem[0].dataset.num
            if (dexNum.toString().length < 3) {
                dexNum = dexNum.padStart(3, "0");
            }
            imgUrl = `https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/detail/${dexNum}.png`;
        }
        $("#pokemon-data .img-wrapper img").attr("src", imgUrl);

        let data = JSON.parse(elem[0].dataset.info);
        console.log(data);

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
    }

    

});
