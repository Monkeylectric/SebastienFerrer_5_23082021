class ProductList {
    constructor() {
        // ----- Initialisation des variables ----- //
        this.product_container = document.querySelector("#productList__container");
        //this.temp, this.item, this.card, this.productImgContainer, this.productText, this.cameraImg, this.productHeader, this.title, this.price, this.desc;

        this.temp = document.getElementsByTagName("template")[0];
        this.item = this.temp.content.querySelector("a");

        this.productImgContainer = this.temp.content.querySelector(".productList__imgContainer"); // this.item.children[0];
        this.productText         = this.temp.content.querySelector(".productList__text"); // this.item.children[1];
        this.cameraImg           = this.temp.content.querySelector("img"); // this.productImgContainer.children[0];
        this.productHeader       = this.temp.content.querySelector(".productList__header"); // this.productText.children[0];
        this.title               = this.temp.content.querySelector(".productList__title"); // this.productHeader.children[0];
        this.price               = this.temp.content.querySelector(".productList__price"); // this.productHeader.children[1];
        this.desc                = this.temp.content.querySelector(".productList__descrpition"); // this.productText.children[1];
    }

    // ----- Méthode getProductList() permettant de faire la requête à l'api et de construire la liste ----- //
    getProductList() {
        // ----- Stockage en session pour éviter de recharger l'api à chque retour à l'accueil (Temporaire) ----- //
        if (sessionStorage.getItem("orinocoProducts")) {
            const value = JSON.parse(sessionStorage.getItem("orinocoProducts"));

            for (const camera of value){
                // console.log(camera);
                this.buildProductCard(camera);
            }
        }else {
            (async () => {
                // ----- Requête à l'api ----- //
                const response = await fetch("http://localhost:3000/api/cameras");

                if (!response.ok) {
                    throw new Error(`Erreur HTTP ! statut : ${response.status}`);
                }

                // -- Stockage de la réponse dans la variable value
                const value = await response.json();

                sessionStorage.setItem("orinocoProducts", JSON.stringify(value));

                // -- Boucle sur chaque élément de la responnse
                for (const camera of value){
                    // console.log(camera);
                    this.buildProductCard(camera);
                }
            })()
                .catch(err => {
                    console.log(`Une erreur est survenue: ${err}`);
                })
        }
    }

    // ----- Méthode buildProductCard() permettant de crée la carte du produit ----- //
    buildProductCard(camera) {
        // -- Initialisation de chaque paramètre dans les emplacements correspondant
        this.item.id         = camera._id;
        this.item.href       = `product.html?id=${camera._id}`;
        this.cameraImg.src   = camera.imageUrl;
        this.cameraImg.alt   = `Appareil ${camera.name}`;
        this.title.innerHTML = camera.name;
        this.price.innerHTML = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format((camera.price) / 100);
        this.desc.innerHTML  = camera.description;

        // -- Importation du template
        this.card = document.importNode(this.item, true);
        // -- Ajout des éléments dans le template
        this.product_container.appendChild(this.card);
    }
}