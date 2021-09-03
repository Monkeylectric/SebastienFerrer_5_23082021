window.addEventListener("DOMContentLoaded", (event) => {
    // -- Récupération du prix et de l'id en session
    const validateOrder = JSON.parse(sessionStorage.getItem("validateOrder"));

    // console.log(validateOrder);
    console.log(`Order id: ${validateOrder.orderId}`);
    console.log(`Price: ${validateOrder.totalPrice}`);

    const totalPrice = document.querySelector("#totalPrice");
    const orderId    = document.querySelector("#orderId");

    // -- Affichage du prix et de l'id dans le DOM
    totalPrice.innerHTML = validateOrder.totalPrice;
    orderId.innerHTML = validateOrder.orderId;
})