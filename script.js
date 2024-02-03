const URL="https://cdn.shopify.com/s/files/1/0564/3685/0790/files/singleProduct.json?v=1701948448";
let selectedColor=null;
let selectedSize=null
let productBuyed={}

window.onload=()=>{
    main();
};

async function main(){
    let productData=await fetchData();
    setImages(productData.product.images);
    setDetails(productData.product);
}

function fetchData(){
   return fetch(URL)
    .then(async(res)=>{
        return await res.json();
    });   
}

let setImages=(images)=>{  
    for(let i=0;i<=images.length;i++){
        let currDiv=document.querySelector(`.image-${i}`);
        let currImg=document.createElement("img");
        if(!(i>=images.length)){
            currImg.src=images[i].src;
        }
        else{
            currImg.src=images[1].src;
        }
        if(i==1){
            currImg.style.border="3px solid #3a4980"
        }
        currDiv.appendChild(currImg);
    }
    
}


let setDetails=(product)=>{
    document.querySelector("#Product-vendor").textContent=product.vendor;
    document.querySelector("#Product-title").textContent=product.title;
    productBuyed.name=product.title;
    document.querySelector("#price").textContent=product.price+".00";
    let discount=calDiscount(product.compare_at_price,product.price);
    document.querySelector("#percent-off").textContent=discount+"% off";    
    document.querySelector("#compair-at-price").textContent=product.compare_at_price+".00";
    product.options.forEach(element => {
        setClrAndSize(element);
    });
    document.querySelector(".description").innerHTML=`<p>${product.description}<p>`;
}


let setClrAndSize=(e)=>{
    let heading=document.createElement("p");
    heading.classList.add("heading")
    heading.textContent=`Choose a ${e.name}`;
    let container=document.createElement("div");
    if(e.name==="Color"){
        let colDiv=document.querySelector(".color-selecter");
        colDiv.append(heading);
        for(let i=0;i<e.values.length;i++){
            let box=document.createElement("div");
            box.classList.add("color-box");
            let div=document.createElement("div");
            let colorName=Object.keys(e.values[i])[0];
            div.style.backgroundColor=e.values[i][colorName];
            box.append(div);

            
            if(i==0){
                selectedColor=box;
                changeColor(box,e.values[i][colorName]);
                productBuyed.color=colorName;
            }
            box.addEventListener("click", function () {
                changeColor(this, e.values[i][colorName]);
                productBuyed.color=colorName;
            });
            container.classList.add("color-container");
            container.append(box);
            colDiv.append(container);
        }
        
    }
    else{
        let sizDiv=document.querySelector(".size-selector");
        sizDiv.append(heading);
        for(let i=0;i<e.values.length;i++){
            let btnBox=document.createElement("div");
            let btn=document.createElement("input");
            btn.setAttribute("type","radio");
            btn.setAttribute("id",e.values[i]);
            btn.setAttribute("name","size");
            let label=document.createElement("label");
            label.setAttribute("for",e.values[i]);
            label.textContent=e.values[i];
            btnBox.append(btn);
            btnBox.append(label);
            container.append(btnBox);
            container.classList.add("buttons-container");
            if(i==0){
                btnBox.querySelector('input').click();
                changeSize(btnBox);
                productBuyed.size=e.values[i];
            }
            btnBox.addEventListener("click",function(event){
                const radioBtn = event.target.querySelector('input');
                if(radioBtn){
                    radioBtn.click(); 
                }        
                changeSize(this); 
                productBuyed.size=e.values[i];
            })
        }
        sizDiv.append(container);
    }
}


let calDiscount=(oldPrice,newPrice)=>{
    oldPrice=parseInt(oldPrice.replace(/\D/g, ''), 10);
    newPrice=parseInt(newPrice.replace(/\D/g, ''), 10);

    return parseInt((((oldPrice-newPrice)/oldPrice)*100));
}

let changeColor=(box,color)=>{
    if(selectedColor){
        selectedColor.style.border="3px solid transparent";
        let span=selectedColor.querySelector("div span");
        if (span) {
            span.parentNode.removeChild(span);
        }
    }    
    selectedColor=box;
    selectedColor.style.border=`3px solid ${color}`;
    const checkIcon = document.createElement('span');
    checkIcon.classList.add('material-symbols-outlined');
    checkIcon.textContent = 'check';
    box.querySelector("div").append(checkIcon); 
}


let changeSize=(btnBox)=>{
    if(selectedSize){
        selectedSize.classList.remove("selected-size");
    }
    selectedSize=btnBox;
    selectedSize.classList.add("selected-size");
}

let add=document.querySelector("#add");
let remove=document.querySelector("#remove");
    add.addEventListener("click",()=>{
        let quantity=add.previousElementSibling;
        quantity.textContent=parseInt(quantity.textContent)+1;
    });
    remove.addEventListener("click",()=>{
        let quantity=remove.nextElementSibling;
        if(parseInt(quantity.textContent)> 1){
            quantity.textContent=parseInt(quantity.textContent)-1;
        }
    });

let addToCart=document.querySelector(".add-to-cart");
addToCart.addEventListener("click",()=>{
    let productAdded=document.querySelector("#product-added");
    productAdded.innerHTML=`<p>${productBuyed.name} with Color ${productBuyed.color} and Size ${productBuyed.size} Added to Cart</p>`;
   productAdded.classList.remove("disable");
});





