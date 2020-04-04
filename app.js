var product = document.getElementById('product');
var buy = document.getElementById('buy');
var sell = document.getElementById('sell');
var quntity = document.getElementById('quntity');
var search = document.getElementById('search');

var db = firebase.firestore();

function saveData() {


    var productDetails = {
        product: product.value,
        buy: buy.value,
        sell: sell.value,
        quntity: quntity.value,

    };

    db.collection("shop").add(productDetails)
        .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
            product.value = "";
            buy.value = "";
            sell.value = "";
            quntity.value = 0;
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        });


}

function list() {
    db.collection("shop")
        .onSnapshot(function (snapshot) {
            snapshot.docChanges().forEach(function (change) {
                var u = change.doc.data();
                u.id = change.doc.id;
                console.log(u);
                console.log(change);
                if (change.type === "added") {
                    rander(u);
                    console.log("New city: ", change.doc.data());
                }
                if (change.type === "modified") {
                    console.log("Modified city: ", change.doc.data());


                }
                if (change.type === "removed") {
                    console.log("Removed city: ", change.doc.data());

                }
            });
        });
}

list();


function rander(u) {
    var x = document.createElement("TBODY");
    var y = document.createElement("TR");
    y.setAttribute('id', u.id);
    var w1 = document.getElementById("th1");
    var w2 = document.getElementById("th2");
    var w3 = document.getElementById("th3");
    var w4 = document.getElementById("th4");
    var w5 = document.getElementById("th5");

    var z1 = document.createElement("TD");
    var z2 = document.createElement("TD");
    var z3 = document.createElement("TD");
    var z4 = document.createElement("TD");
    var z5 = document.createElement("TD");


    w1.innerHTML = 'Product Name';
    w2.innerHTML = 'Buy Prize';
    w3.innerHTML = 'Sell Prize';
    w4.innerHTML = 'Quantity';


    z1.innerHTML = u.product;
    z2.innerHTML = u.buy;
    z3.innerHTML = u.sell;
    z4.innerHTML = u.quntity;



    y.appendChild(z1);
    y.appendChild(z2);
    y.appendChild(z3);
    y.appendChild(z4);
    y.appendChild(z5);

    x.appendChild(y);
    document.getElementById("myTable").appendChild(x);
}


function searchByProduct(n) {

    db.collection("shop").where("product", "==", search.value)
        .get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                console.log(doc.id, " => ", doc.data());

                var thh1 = document.getElementById('thh1');
                var thh2 = document.getElementById('thh2');
                var thh3 = document.getElementById('thh3');
                var thh4 = document.getElementById('thh4');
                var thh5 = document.getElementById('thh5');


                var td1 = document.getElementById('td1');
                var td2 = document.getElementById('td2');
                var td3 = document.getElementById('td3');
                var td4 = document.getElementById('td4');
                var td5 = document.getElementById('td5');
                var q = doc.data().quntity;

                thh1.innerHTML = 'Product Name';
                thh2.innerHTML = 'Buy Prize';
                thh3.innerHTML = 'Sell Prize';
                thh4.innerHTML = 'Quantity';
                thh5.innerHTML = 'Income';

                td1.innerHTML = doc.data().product;
                td2.innerHTML = doc.data().buy;
                td3.innerHTML = doc.data().sell;
                td4.innerHTML = q;

                search.value = '';

                var soldButton = document.getElementById('button');

                soldButton.innerHTML = 'Sold';

                soldButton.addEventListener('click', function () {
                    td4.innerHTML = --q;


                    if (q === 0) {
                        alert('Please Insert Some Product');
                    }

                })


            });
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
}