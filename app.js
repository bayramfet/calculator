//* ======================================================
//*                     IOS CALCULATOR
//* ======================================================

const numberButtons = document.querySelectorAll(".num");
const operationButtons = document.querySelectorAll(".operator");
const equalButtons = document.querySelector(".equal");
const acButtons = document.querySelector(".ac");
const pmButtons = document.querySelector(".pm");
const percentButtons = document.querySelector(".percent");
const ustEkran = document.querySelector(".previous-display");
const altEkran = document.querySelector(".current-display");

//?operator değişkenleri
let ustEkranYazi = "";
let altEkranYazi = "";
let islem = "";
let esittirVeyaPercentPressed = false;

//!target kullanmak calculator da bug a sebep oluyor. o da şu ki mesela 7 ye bastığımızda hep 7 ye basılabiliyor, 8 e geçilmiyor
// document.querySelector(".num").onclick=(number)=>{
//  altEkranYazi+=number.target.textContent
// altEkran.textContent=altEkranYazi

// }

numberButtons.forEach((number) => {
  number.onclick = () => {
    //!ekrana hazırlık, bütün bug ları kontrol fonksiyonu
    ekranaHazirlik(number.textContent);
    //!ekrana bastır
    updateEkran();
  };
});

const ekranaHazirlik = (num) => {
  //?ekranda = 0 varken, kullanıcı 0 veya . giremesin, bunların dışında bişey girerse o görünsün
  if (num != "0" && num != "." && altEkranYazi == "0") {
    altEkranYazi = num;
    //! 0 girersen üstüne sayı girersen o görünsün, yani 0 girdiğimde boş dön, bu return ü yazmazsak ve 0 a basarsak 0 dan eli boş dönmüyor, 0 ve . dışında bir sayıya bastığımızda onu 2 kere yazdırıyor, bir sefer 0 için 1 sefer sayının kendi için, çünkü biz ekranda 0 ve . dışındaki girişler görünsün ama basılmasın demedik, basılmasın komutunu return yaptı
    return;
  }

  //?ekran boşken . girilmesin
  if (num === "." && altEkranYazi == "") return;

  //?kullanıcı herhangi bir yerde . girmişken , tekrar . girmeye kalkarsa girilmesin

  if (num === "." && altEkranYazi.includes(".")) return;

  //?kullanıcı ilk başta 0 girer ardından tekrar 0 girerse, girilmesin ekranda 1 tane 0 görünsün

  if (num === "0" && altEkranYazi === "0") return;

  //*eşittire basılınca if içi true olur ve altEkranda sadece o an girilen sayı gözükür, sonrasında işleme normal devam etmek istediğim için, fabrika ayarlarına geri döndüm, yani esittirVeyaPercentPressed değişkenini false yaptım ki bu if e giremesin
  if (esittirVeyaPercentPressed) {
    esittirVeyaPercentPressed = false;
    altEkranYazi = num;
    //!çok fazla if varsa, oralardan veri gelebilir hata alırım, tek benim dediğimi yap farklı bişey varsa boş dön return diyoruz
    return;
  }

  //?bütün şartları başarıyla geçtikten sonra, basılan numaraları ardarda ekranda göster
  altEkranYazi = altEkranYazi + num;
};

//? javascriptt te yapılanlar ekrana DOM a bastırılacak

const updateEkran = () => {
  //!ekranda 9 basamaktan fazlası görünmesin
  //*toString() eklememin nedeni 4 işlemden sonra altEkranYazi number a dönüşür, ve stringlerde geçerli slice metodu çalışmaz, bu yüzden tekrar string e çevirdik

  if (altEkranYazi.toString().length > 9) {
    altEkranYazi = altEkranYazi.toString().slice(0, 9);
  }

  altEkran.textContent = altEkranYazi;
  //?işlem null dışında ne girilirse (+,- ,"") alttaki çalışsın
  if (islem != null) {
    ustEkran.textContent = `${ustEkranYazi} ${islem}`; //backtick ekrana kolay ve boşluklu basmamıza yaradı, şart değil
  }
};

operationButtons.forEach((op) => {
  op.onclick = () => {
    //?herhangi bir işleme basıldıktan sonra (ustEkran dolu altEkran boşken), işlemi değiştirmek istersek
    if (ustEkranYazi && altEkranYazi == "") {
      islem = op.textContent;
      updateEkran();
    }

    //?ekran boşken işleme basılmasın
    if (altEkranYazi === "") return;

    //? eşittire basılmadan arka arkaya işleme basılırsa (altEkran ve UstEkran doluyken işleme basılırsa)
    if (altEkranYazi && ustEkranYazi) {
      hesapla();
    }

    islem = op.textContent;
    ustEkranYazi = altEkranYazi;
    altEkranYazi = "";
    updateEkran();
  };
});

equalButtons.onclick = () => {
  hesapla();
  updateEkran();
  esittirVeyaPercentPressed = true;
};

const hesapla = () => {
  let sonuc;
  switch (islem) {
    case "+":
      sonuc = +ustEkranYazi + Number(altEkranYazi);
      break;

    case "-":
      sonuc = ustEkranYazi - altEkranYazi;
      break;

    case "x":
      sonuc = ustEkranYazi * altEkranYazi;
      break;

    case "÷":
      sonuc = ustEkranYazi / altEkranYazi;
      break;

    default:
      break;
  }
  altEkranYazi = sonuc;
  ustEkranYazi = "";
  islem = "";
};

//?AC butonuna basıldığında

acButtons.addEventListener("click", () => {
  islem = "";
  altEkranYazi = "";
  ustEkranYazi = "";
  updateEkran();
});

//? PM butonuna basıldığında

pmButtons.onclick = () => {
  //*ekran boşken pm butonu çalışmasın, yoksa ekran boşken pm e basıldığında updateEkran yüzünden, ekranda 0 baslıyor
  if (!altEkranYazi) return;

  altEkranYazi = altEkranYazi * -1;
  updateEkran();
};

percentButtons.onclick = () => {
  if (!altEkranYazi) return;

  altEkranYazi = altEkranYazi / 100;

  updateEkran();
  esittirVeyaPercentPressed = true;
};
