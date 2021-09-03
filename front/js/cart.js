class Cart {
    constructor() {
        // ----- Initailisation des variables ----- //
        this.cartSection = document.querySelector("#cart__main");
        this.cartSum = document.querySelector("#cart__sum");

        this.temp = document.getElementsByTagName("template")[0];
        this.item = this.temp.content.querySelector("div");

        this.productImgContainer = this.temp.content.querySelector(".cart__imgContainer"); // this.item.children[0];
        this.productImg          = this.temp.content.querySelector("img"); // this.productImgContainer.children[0];
        this.productText         = this.temp.content.querySelector(".cart__text"); // this.item.children[1];
        this.productLense        = this.temp.content.querySelector(".cart__lense"); // this.item.children[2];
        this.productQuantity     = this.temp.content.querySelector(".cart__quantity"); // this.item.children[3];
        this.productPrice        = this.temp.content.querySelector(".cart__price"); // this.item.children[4];
        this.productRemove       = this.temp.content.querySelector(".cart__remove"); // this.item.children[5];
    }

    // ----- Méthode getCart() permettant d'ajouter les produits dans le panier ----- //
    getCart() {
        // ----- Récuperation des produits ajoutés au panier ------ //
        if(!localStorage.getItem("productsCart")){
            document.querySelector("#cart__empty").style.display = "flex";
        }else{
            // -- Récuperation de l'objet productsCart depuis le localStorage
            this.productsCart = JSON.parse(localStorage.getItem("productsCart"));
            // -- Initialisation de la somme
            this.sum = 0;
            let card;
            
            // -- Bouble sur les produits du panier
            this.productsCart.forEach((product, index) => {
                // -- Contruction des cartes "produit"
                this.item.id                   = `product_${index}`;
                this.productImg.src            = product.imageUrl;
                this.productText.innerHTML     = `<h4>${product.name}</h4><p class='cart__desc'>${product.description}</p>`;
                this.productLense.innerHTML    = `<p>${product.lenseSelected}</p>`;
                this.productQuantity.innerHTML = `<p>${product.quantity}</p>`;
                this.productPrice.innerHTML    = `<p>${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format((product.price * product.quantity) / 100)}</p>`;
                this.productRemove.innerHTML   = `<img src='front/icons/remove.svg' />`;

                // -- Ajout de la carte au DOM
                card = document.importNode(this.item, true);
                this.cartSection.appendChild(card);

                // -- Calcul de la somme
                this.sum += (product.price * product.quantity);
            });
            
            // -- Ajout de la somme dans le DOM
            this.cartSum.innerHTML = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(this.sum / 100);
        
            // -- Lancement la fonction removeProduct();
            this.removeProduct();
            // -- Puis de getUserForm();
            this.getUserForm();
        }
    }

    // ----- Méthode removeProduct() permettant de supprimer le produit dans le panier ----- //
    removeProduct() {
        // ----- Event quand on clique sur le bouton supprimer ----- //
        document.querySelectorAll(".cart__remove").forEach((btn, btn_id) => {

            btn.addEventListener('click', () => {
                // -- Suppression du produit selectionné dans le DOM
                document.querySelector("#product_" + btn_id).remove();

                // -- Boucle sur les produits dans le panier pour supprimer le bon
                //console.log(productsCart);
                this.productsCart.forEach((prod, prod_id) => {
                    if(prod_id == btn_id){
                        //console.log(prod);
                        //this.sum -= prod.price * prod.quantity;
                        //console.log(this.sum);
                        //this.cartSum.innerHTML = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(this.sum / 100);
                        this.productsCart.splice(prod_id, 1);
                        //console.log(productsCart);
                        
                        // -- Mise à jour du panier
                        if(this.productsCart.length == 0){
                            localStorage.removeItem("productsCart");
                            document.querySelector("#cart__empty").style.display = "flex";
                        }else {
                            localStorage.removeItem("productsCart");
                            localStorage.setItem("productsCart", JSON.stringify(this.productsCart));
                            //console.log(this.sum);
                        }

                        // -- Rafraichissement de la page pour actualiser le prix total
                        document.location.reload();

                    }
                })
                
            })

        })
    }

    // ----- Méthode getUserForm() permettant d'obtenir les informations de l'utilisateur ----- //
    getUserForm() {
        // -- Initialisation des variables pour le formulaire
        const form          = document.querySelector("#validate_form");
        const userFirstName = document.querySelector("#userFirstName");
        const userLastName  = document.querySelector("#userLastName");
        const userAddress   = document.querySelector("#userAddress");
        const userCity      = document.querySelector("#userCity");
        const userEmail     = document.querySelector("#userEmail");

        // -- Quand le formulaire est envoyé
        form.addEventListener("submit", (e) => {
            // -- Désactivation de l'action par defaut
            e.preventDefault();
            
            // -- Definition de l'objet userInfos avec les informations renseignées dans le formulaire
            this.userInfos = {
                firstName: userFirstName.value,
                lastName: userLastName.value,
                address: userAddress.value,
                city: userCity.value,
                email: userEmail.value
            };
            //console.log(userInfos);

            // -- Appel de la méthode getOrder()
            this.getOrder();
        })

    }

    // ----- Méthode getOrder() permettant d'envoyer toutes les informations à l'api ----- //
    getOrder() {
        // -- Récuperation des produits du panier
        const orderProducts = JSON.parse(localStorage.getItem("productsCart"));
        //console.log(orderProducts);

        // -- Pour chaque produit on prend que l'id du produit
        const products_id =  orderProducts.map(product => {
            return product._id;
        })
        //console.log(products_id);

        // -- Objet order qui contient toutes les infos qu'on envoie à l'api
        const order = {
            contact: this.userInfos,
            products: products_id
        }
        //console.log(order);

        // -- Transformation de l'objet en string
        const orderString = JSON.stringify(order);
        //console.log(orderString);
        
        // -- Requête à l'api
        fetch(`http://localhost:3000/api/cameras/order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: orderString,
        })
            .then(response => { 
                if (response.ok) return response.json();
            })
            .then(value => {
                // console.log(value);

                let orderId = value.orderId;
                let totalPrice = this.cartSum.textContent;
                // console.log(`order id: ${value.orderId}`);

                const validateOrder = {
                    orderId,
                    totalPrice,
                }
                //console.log(validateOrder);

                // -- Stockage des infos en session pour les recuperer sur la page suivante
                sessionStorage.setItem("validateOrder", JSON.stringify(validateOrder));
                // -- Réinitialisation à 0 du panier
                localStorage.removeItem('productsCart');
                // -- Renvoi vers la page de validation
                window.location.href = `${window.location.origin}/P5_Orinoco/validate.html`;
            })
            .catch(err => {
                console.log(err);
            })
        
    }
}