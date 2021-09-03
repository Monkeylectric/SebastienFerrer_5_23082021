class Product {
    constructor() {
        // ----- Récuperation du paramètre de l'url ----- //
        let params = new URLSearchParams(window.location.search);
        let id = params.get("id");
        //console.log(id);

        // -- Initialisation des variables
        //console.log(value);
        this.product, this.imgProduct;
        this.productsCart = [];
        this.imgContainer = document.querySelector("#product__imgContainer");
        //const imgProduct = imgContainer.children[0];

        this.productForm        = document.querySelector("#product__formContainer");
        this.productName        = document.querySelector("#product__name");
        this.productDescription = document.querySelector("#product__description");
        this.productSelect      = document.querySelector("#product__select");
        this.productQuantity    = document.querySelector("#product__quantity");
        this.productPrice       = document.querySelector("#product__price");
        this.productSubmit      = document.querySelector("#product__submit");
        this.productOverlay     = document.querySelector("#overlay");
        this.productValidCard   = document.querySelector("#validateCard");

        (async () => {
            // ----- Requête à l'api ----- //
            const response = await fetch(`http://localhost:3000/api/cameras/${id}`);

            if (!response.ok) {
                throw new Error(`Erreur HTTP ! statut : ${response.status}`);
            }

            // -- Stockage de la réponse dans la variable value
            const value = await response.json();

            this.getProduct(value);
        })()
            .catch(err => {
                console.log(`Une erreur est survenue: ${err}`);
            })
    }

    // ----- Méthode getProduct permettant de faire apparaître le produit ----- //
    getProduct(value) {
        // -- Récuperation de la réponse de l'api qu'on stock dans produit
        this.product = value;
        console.log(this.product);

        // -- Création de l'image du produit
        this.imgProduct = document.createElement("img");
        this.imgProduct.src = this.product.imageUrl;
        this.imgProduct.alt = `Appareil ${this.product.name}`;
        this.imgContainer.appendChild(this.imgProduct);

        // -- Boucle sur les lentilles du produit
        (this.product.lenses).forEach((lense, index) => {
            // -- Création des options
            let opt = document.createElement('option');
            // -- Aux quelles on définit une valeur et un text
            opt.value = index+1;
            opt.innerHTML = lense;
            // -- Ajout des options au select
            this.productSelect.appendChild(opt);
        })

        // -- Construction des autres elements du formulaire
        this.productName.innerHTML        = this.product.name;
        this.productDescription.innerHTML = this.product.description;
        // -- Prix au format 100,00 €
        this.productPrice.innerHTML       = `Prix: ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format((this.product.price) / 100)}`;

        // -- Event qui change le prix en fonction de la quantité
        this.productQuantity.addEventListener("change", () => {
            // console.log(productQuantity.value);
            this.productPrice.innerHTML = `Prix: ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(((this.product.price) / 100) * this.productQuantity.value)}`;
        })

        this.addToCart();
    }

    // ----- Méthode addToCart permettant d'ajouter le produit au panier ----- //
    addToCart() {
        // -- Event quand on clique sur le boutonn d'ajout au panier
        this.productForm.addEventListener("submit", (e) => {
            e.preventDefault();

            this.product.lenseSelected   = this.productSelect.options[this.productSelect.selectedIndex].text;
            this.product.quantity        = this.productQuantity.value;
            console.log(this.product);
            //console.log("Lentille: " + productSelect.options[productSelect.selectedIndex].text);

            this.productOverlay.style.display = "flex";
            setTimeout(() => {
                this.productValidCard.style.opacity = 1;
            }, 50);

            if (localStorage.getItem("productsCart")){
                this.productsCart = JSON.parse(localStorage.getItem("productsCart"));
                //console.log(productsCard);
            }

            this.productsCart.push(this.product);
            //console.log(productsCard);
            localStorage.setItem("productsCart", JSON.stringify(this.productsCart));
        })
    }
}