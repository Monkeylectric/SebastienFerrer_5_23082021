/**
 * Get element number in cart
 */
const getCartElementNumber = () => {
    const nbrElement = document.querySelector("#nbr_element");
    let element = 0;

    // -- Si l'objet "productsCart" existe dans le localStorage
    if (localStorage.getItem("productsCart")) {
        // -- On le recupère
        const cartElement = JSON.parse(localStorage.getItem("productsCart"));

        // -- Pour chaque element on incremente le nombre de 1
        cartElement.forEach(el => {
            element++;
        });

        // -- On affiche le nombre dans le DOM
        nbrElement.innerHTML = element;
        nbrElement.style.display = "block";
    }
}