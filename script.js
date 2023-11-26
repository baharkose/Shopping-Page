const btnDivs = document.getElementById("btns");
const productDivs = document.getElementById("products");
const searchInput = document.getElementById("searchInput");
const categoryTitle = document.getElementById("category");

// https://anthonyfs.pythonanywhere.com/api/products/

let products = [];
let baskets = [];

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
        // sepete ekle butonunu yakala
        // ürünleri sepete ekle

        addToCart(item);

        //! arrayden gelen ürün bilgisi elimizde olduğu için direk itemi yani seçilen ürünü aldık ve baskete yolladık.
      }
    });
    productDivs.append(productDiv);
  });
}

// ! SAKLA

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
    baskets.push(product);
  }
  console.log(baskets);
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

    const filteredProducts = filtered(selectedCategory, value)
    //! all a basınca hiç bişey gelmedi bunun için kısayoldan bir filtreleme yapısı kuralım.

    displayProducts(filteredProducts);

    //* Seçilen kategori eğer all ise sadece productsı getir yoksa filtreleme yap. selectedCategory === "all" ? products : products.filter(item => item.category.toLowerCase() === selectedCategory)
  }
});

//! inputtan gelenleri yakalama- inputtan gelen veriyi yazdığımızda da kategori alanın değişmesi
searchInput.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  const selectedCategory = categoryTitle.innerText.toLowerCase();
  const filteredProducts = filtered(selectedCategory, value)
  displayProducts(filteredProducts)
});

//? DRY

function filtered(selectedCategory, value) {

    //+ Her butona tıklandığında ve her tıklama olayınca sadece istenilen verilerin gelmesi
  const newArr = selectedCategory === "all"
      ? products
      : products.filter(
          (item) =>
            item.category.toLowerCase() === selectedCategory &&
            item.title.includes(value.toLowerCase())
        );
  return newArr;
}
