const btnDivs = document.getElementById("btns");
const productDivs = document.getElementById("products");
const searchInput = document.getElementById("searchInput");
const categoryTitle = document.getElementById("category");
const modalBody = document.querySelector(".modal-body");
const canvasBody = document.querySelector(".offcanvas-body");
const minus = document.querySelector(".fa-minus");
const plus = document.querySelector(".fa-plus");
const sepetPosition = document.getElementById("sepet");

// https://anthonyfs.pythonanywhere.com/api/products/

let products = [];
let baskets = [];
let countBasket = 0;

//* FETCH İŞLEMİ

const getProducts = async () => {
  const url = "https://anthonyfs.pythonanywhere.com/api/products/";
  const response = await fetch(url);
  const data = await response.json();
  products = data;
  category();
  displayProducts(products);
  console.log(products);
  // burada çağırmazsak veri gelmez
  try {
    if (!response.ok) {
      throw new Error("hata mesajı", response.status);
    }
  } catch (error) {
    console.log(error);
  }
};

getProducts();

//* KATEGORİ İŞLEMİ

const category = () => {
  console.log(products);
  // const categoryArr = products.map(item => item.category)
  // array return eder.
  // console.log(categoryArr);
  // kategorileri topladık.

  //! tekrar eden değerleri teke düşürme
  // //? 1. yol
  // let categoryArr = ["all"]
  // products.forEach(item=> {
  //     if(!(categoryArr.includes(item.category))){
  //         categoryArr.push(item.category)
  //     }
  // })

  // console.log(categoryArr);

  //! tekrar eden değerleri teke düşürme
  //     //? ikinci yol
  //     const categoryArr = products.reduce((acc, item)=> {
  //         if(!acc.includes(item.category)){
  //             acc.push(item.category)
  //         }
  //         return acc
  //     }, ["all"]) //! İçeriyi all'dan başlat
  //     console.log(categoryArr);
  // }

  //? 3. yol

  const btnColors = [
    "primary",
    "secondary",
    "success",
    "info",
    "warning",
    "danger",
    "light",
    "dark",
  ];

  //! tekrar eden değerleri teke düşürme
  // Set benzersiz değerleri tutan bir JavaScript nesnesidir. Her veri tipinde değer tutabilir. Fakat aynı değeri birden fazla kez içeremez

  const categoryArr = [
    "all",
    ...new Set(products.map((item) => item.category)),
  ];
  console.log(categoryArr);

  categoryArr.forEach((category, i) => {
    const btn = document.createElement("button");
    btn.innerText = category.toUpperCase();
    btn.classList.add("btn", `btn-${btnColors[i]}`);
    btnDivs.appendChild(btn);
    //* dizinin içinden çekip renk verme
  });
};
//  senkron yapısından dolayı veriyi göremiyoruz. [] verir halbuki veri vardır
console.log(products);

//* ÜRÜNLERİ LİSTELEME

function displayProducts(arr) {
  productDivs.innerHTML = "";
  arr.forEach((item) => {
    const { id, title, description, price, image } = item;
    const productDiv = document.createElement("div");
    productDiv.classList.add("col");
    productDiv.setAttribute("id", id);
    productDiv.innerHTML = `
          <div class="card">
              <img src="${image}" class="p-2" height="250px" alt="...">
              <div class="card-body">
        <h5 class="card-title line-clamp-1">${title}</h5>
                <p class="card-text line-clamp-3">${description}</p>
              </div>
              <div class="card-footer w-100 fw-bold d-flex justify-content-between gap-3">
              <span>Price:</span><span>${price} $</span>
                  
              </div>
              <div class="card-footer w-100 d-flex justify-content-center gap-3">
                  <button class="btn btn-danger">
                  Sepete Ekle
                  </button>
                  <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                  See Details
                  </button>
              </div>
            </div>
          `;

    productDiv.addEventListener("click", (e) => {
      if (e.target.classList.contains("btn-danger")) {
        addToCart(item);

        //! arrayden gelen ürün bilgisi elimizde olduğu için direk itemi yani seçilen ürünü aldık ve baskete yolladık.
      } else if (e.target.classList.contains("btn-primary")) {
        showModal(item);
      }
    });
    productDivs.append(productDiv);
  });
}

//! SHOW MODAL

function showModal(product) {
  const { image, title, description, price } = product;

  modalBody.innerHTML = `
    <div class="text-center">
    <img src="${image}" class="p-2" height="250px" alt="...">
    <h5 class="card-title">${title}</h5>
    <p class="card-text">${description}</p>
    <p class="card-text">Fiyat: ${price} $</p>
    </div>
    
    `;
  //! ikinci yol

  // fetch(`https://anthonyfs.pythonanywhere.com/api/products/${product.id}`)
  //   .then((res) => res.json())
  //   .then((res) => {
  //     modalBody.innerHTML = `<div class="text-center">
  //           <img src="${res.image}" class="p-2" height="250px" alt="...">
  //           <h5 class="card-title">${res.title}</h5>
  //           <p class="card-text">${res.description}</p>
  //           <p class="card-text">Fiyat: ${res.price} $</p>
  //           </div>
  //           `;
}

// ! SAKLA -- MAP İLE İÇERİK DEĞİŞTİRME

//! ADD TO CART
//* objelerde veri saklama yolu {key:value}

function addToCart(product) {
  console.log(product);

  // tek bir ürün arıyosak eğer some'ı kullanmamız gerekir.
  if (baskets.some((item) => item.title === product.title)) {
    //! eğer bir arrayi modifiye edeceksek orada devreye map girer.

    baskets = baskets.map((item) => {
      //! gücellemelerde obje ise obje dön ki yerine geçen yine obje olsun.
      return item.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item;
      // Bu yapı çok kullanılacak.
      //? hangisi ne kadar artacak. o nedenle item id == product id dedik.
      //* ...item ne demek bunun içini aç ve içindekileri buraya ata.
      //* önce eski verileri al. Sonra güncelleyeceğin verileri eski verilerin peşine ekle.
      //* quantity:quantity:item.quantity+1 -> yeni değeri yaz. quantity, eski veriyi yakala ve onu bir arttır. item.quantity+1
    });
  } else {
    countBasket++;
    sepetPosition.innerText = countBasket;
    baskets.push(product);
  }

  console.log(baskets);
  showCanvas(baskets);
  calculateProducts(baskets);
}

btnDivs.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn")) {
    //! butonun innerText'ini yakala. Yazdırdığını da kategori title a yazdır.
    const selectedCategory = e.target.innerText.toLowerCase();
    categoryTitle.innerText = selectedCategory.toUpperCase();

    //! INPUT KONTROLÜ
    const value = searchInput.value;

    //* bunun için yine filterdan devam edebiliriz. && item.title.includes(value.toLowerCase())

    // const filteredProducts =
    // selectedCategory === "all"
    //   ? products
    //   : products.filter(
    //       (item) =>
    //         item.category.toLowerCase() === selectedCategory &&
    //         item.title.includes(value.toLowerCase())
    //     );

    const filteredProducts = filtered(selectedCategory, value);
    //! all a basınca hiç bişey gelmedi bunun için kısayoldan bir filtreleme yapısı kuralım.

    displayProducts(filteredProducts);

    //* Seçilen kategori eğer all ise sadece productsı getir yoksa filtreleme yap. selectedCategory === "all" ? products : products.filter(item => item.category.toLowerCase() === selectedCategory)
  }
});

//! inputtan gelenleri yakalama- inputtan gelen veriyi yazdığımızda da kategori alanın değişmesi
searchInput.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  const selectedCategory = categoryTitle.innerText.toLowerCase();
  const filteredProducts = filtered(selectedCategory, value);
  displayProducts(filteredProducts);
});

//? DRY

function filtered(selectedCategory, value) {
  //+ Her butona tıklandığında ve her tıklama olayınca sadece istenilen verilerin gelmesi
  const newArr =
    selectedCategory.toLowerCase() === "all"
      ? products.filter((item) =>
          item.title.toLowerCase().includes(value.toLowerCase())
        )
      : products.filter(
          (item) =>
            item.category.toLowerCase() === selectedCategory &&
            item.title.toLowerCase().includes(value.toLowerCase())
        );
  return newArr;
}

//* SHOW CANVAS

const showCanvas = (baskets) => {
  console.log(baskets);

  canvasBody.innerHTML = "";
  baskets.forEach((basket, index) => {
    const { title, quantity, price, image } = basket;

    canvasBody.innerHTML += `
                <div class="card mb-3" style="max-width: 540px">
                <div class="row g-0">
                <div class="col-md-4 my-auto">
                    <img
                    src="${image}"
                    class="img-fluid rounded-start"
                   
                    />
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <div class="d-flex align-items-center gap-2" role="button">
                        <i
                        class="fa-solid fa-minus border rounded-circle bg-danger text-white p-2"
                        ></i
                        ><span class="fw-bold">${quantity}</span
                        ><i
                        class="fa-solid fa-plus border bg-danger text-white rounded-circle p-2"
                        ></i>
                    </div>
                    <p class="card-text">Total : ${price} x ${quantity}</p>
                    <button class="btn btn-danger">Remove</button>
                    </div>
                </div>
                </div>
            </div>
    
    `;
  });
};

//* CALCULATION

const calculateProducts = (baskets) => {
  const result1 = baskets.reduce(
    (acc, basket) => acc + basket.quantity * basket.price,
    0
  );

  console.log(result1);
  const resultText = document.getElementById("total");
  resultText.innerText = result1.toFixed(2);
};

// bin.addEventListener("click", () =>{
//     console.log(bin);
//     if(confirm("Are you sure you want to delete this")){
//       main.textContent = "silindi"
//     }

// })

// kural: üstekini bul çağır bubling yap.

//! hesaplama işlemi

canvasBody.addEventListener("click", (e) => {
  // Check if the clicked element is one of the icons
  if (e.target.classList.contains("fa-plus")) {
    handleQuantityChange(e.target, 1); // Increase quantity
  } else if (e.target.classList.contains("fa-minus")) {
    handleQuantityChange(e.target, -1); // Decrease quantity
  } else if (e.target.classList.contains("btn-danger")) {
    removeItem(e.target);
  }
});

// Function to handle quantity change
function handleQuantityChange(clickedElement, change) {
  // Get the parent card element
  const card = clickedElement.closest(".card");

  // Extract relevant information from the card (you may need to adjust this based on your HTML structure)
  const title = card.querySelector(".card-title").innerText;
  const price = parseFloat(
    card.querySelector(".card-text").innerText.split(":")[1]
  );

  // Find the corresponding item in the basket
  const basketItem = baskets.find((item) => item.title === title);

  // Update the quantity in the basket
  if (basketItem) {
    basketItem.quantity += change;

    // Ensure the quantity is not negative
    if (basketItem.quantity < 1) {
      basketItem.quantity = 1;
    }

    // Update the display
    showCanvas(baskets);

    // Recalculate the total
    calculateProducts(baskets);
  }
}

const removeItem = (e) => {
  const card = e.closest(".card");
  // Extract relevant information from the card (you may need to adjust this based on your HTML structure)
  const title = card.querySelector(".card-title").innerText;

  //! silme işlemi title eşit değilse basket itemı güncelle
  //+ arrayden istenileni çıkarmak için filter metoduyla olmayan hariç hepsini yazdır yaparak array güncellendi.

  const basketItem = baskets.filter((item) => item.title !== title);
  countBasket--;
  sepetPosition.innerText = countBasket;
  baskets = basketItem;
  console.log(baskets);
  showCanvas(baskets);
  calculateProducts(baskets);
};
