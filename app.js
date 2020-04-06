var product = document.getElementById('product');
var buy = document.getElementById('buy');
var sell = document.getElementById('sell');
var quntity = document.getElementById('quntity');
var search = document.getElementById('search');
var savebtn = document.getElementById('save');
var db = firebase.firestore();


var totalQuantity;

var id;

var isUpdate;
var updatedId;

function saveData() {


    var productDetails = {
        product: product.value,
        buy: buy.value,
        sell: sell.value,
        quntity: quntity.value,
        income : sell.value-buy.value

    };


    if (isUpdate) {
        db.collection("shop").doc(updatedId).update({
            product: product.value,
            buy: buy.value,
            sell: sell.value,
            quntity: quntity.value,
            income : sell.value-buy.value,
            id : updatedId,
        });
        savebtn.innerHTML = 'Save';
        isUpdate = false;
        product.value = '';
        buy.value = '';
        sell.value = '';
        quntity.value = '';

    }


    else {
        db.collection("shop").add(productDetails)
            .then(function (docRef) {
                console.log("Document written with ID: ", docRef.id);
                product.value = "";
                buy.value = "";
                sell.value = "";
                quntity.value = '';
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
            });
    }

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
                    var td1 = document.getElementById(u.id).firstElementChild;
                    var td2 = td1.nextSibling;
                    var td3 = td2.nextSibling;
                    var td4 = td3.nextSibling;
                    var td5 = td4.nextSibling;
                    td1.innerHTML =u.product;
                    td2.innerHTML = u.buy;
                    td3.innerHTML =u.sell;
                    td4.innerHTML = u.quntity;
                    td5.innerHTML = u.income


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
    var w6 = document.getElementById("th6");

    var z1 = document.createElement("TD");
    var z2 = document.createElement("TD");
    var z3 = document.createElement("TD");
    var z4 = document.createElement("TD");
    var z5 = document.createElement("TD");
    var z6 = document.createElement("TD");


    w1.innerHTML = 'Product Name';
    w2.innerHTML = 'Buy Prize';
    w3.innerHTML = 'Sell Prize';
    w4.innerHTML = 'Quantity';
    w5.innerHTML = 'Income';
    w6.innerHTML = 'Edit';


    z1.innerHTML = u.product;
    z2.innerHTML = u.buy;
    z3.innerHTML = u.sell;
    z4.innerHTML = u.quntity;
    z5.innerHTML = u.income;

    var editButton = document.createElement("button");

    editButton.innerHTML = 'Edit';

    z6.appendChild(editButton);





    z6.addEventListener('click', function () {
        product.value = u.product;
        buy.value = u.buy;
        sell.value = u.sell;
        quntity.value = u.quntity;

        isUpdate = true;
        updatedId = u.id;

        savebtn.innerHTML = 'Update';
    });



    y.appendChild(z1);
    y.appendChild(z2);
    y.appendChild(z3);
    y.appendChild(z4);
    y.appendChild(z5);
    y.appendChild(z6);

    x.appendChild(y);
    document.getElementById("myTable").appendChild(x);
}


function searchByProduct(n) {


    db.collection("shop").where("product", "==", search.value)
        .get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                console.log(doc.id, " => ", doc.data());
            id = doc.id;
            totalIncome(doc.data());
                console.log(doc.data());

                var docRef = db.collection("shop").doc(id);

                docRef.get().then(function(doc) {
                    console.log(doc.data());
                    totalQuantity=doc.data().quntity;
                }).catch(function(error) {
                    console.log("Error getting document:", error);
                });


                var thh1 = document.getElementById('thh1');

                var thh4 = document.getElementById('thh4');
                var thh5 = document.getElementById('thh5');


                var td1 = document.getElementById('td1');

                var td4 = document.getElementById('td4');
                var td5 = document.getElementById('td5');
                var q = doc.data().quntity;

                thh1.innerHTML = 'Product Name';
                thh4.innerHTML = 'Quantity';
                thh5.innerHTML = 'Income';

                td1.innerHTML = doc.data().product;

                td4.innerHTML = q;
                td5.innerHTML = 0;

                search.value = '';

                var soldButton = document.getElementById('button');

                soldButton.innerHTML = 'Sold';
                var income = doc.data().income;

                soldButton.addEventListener('click', function () {

                    if (q > 0){
                        td4.innerHTML = --q;

                    }

                    else{
                        alert('Please Insert Some Product')
                    }

                    console.log(totalQuantity);
                    td5.innerHTML  =(totalQuantity- td4.innerHTML)*income;




                    var updatebtn2= document.getElementById('updatebtn2');
                    updatebtn2.innerHTML='OK/Save';
                    updatebtn2.addEventListener('click',function () {

                        db.collection("shop").doc(id).update({


                            quntity: td4.innerHTML,
                            income : td5.innerHTML,



                        });



                        console.log(doc.data());



                        thh1.innerHTML = '';

                        thh4.innerHTML = '';
                        thh5.innerHTML = '';








                    })
                });






            });
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });



}

var p;




function totalIncome(inc) {
    db.collection("totalincome").add({
        productName:inc.product ,
        totalIncome: inc.income,
    })
        .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);


        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        });
}

var docRef = db.collection("totalincome").doc('vg1WnC5GKvVKwL8gLqqY');

docRef.get().then(function(doc) {
    console.log(doc.data());
}).catch(function(error) {
    console.log("Error getting document:", error);
});
