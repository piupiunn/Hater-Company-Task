//Yeniden kullanılablir html yapısı oluşturmak için js'den template oluşturuyoruz.
const template = document.createElement("template");

//Templatemizin içini dolduruyoruz

template.innerHTML = `
    <link rel="stylesheet" href="commentBoxStyle.css" />
    <div class="comment-box">
        <div class="comment-edit">
            <input class="comment-input" type="text" />
            <button class="submit-btn">Submit</button>
        </div>
        <div class="comment-display">
            <p class="comment">Comment</p>
            <p class="author">Author:</p>
            <p class="likes">Likes: 0</p>
            <button class="like-button">Like</button>
            <button class="unlike-button">Unlike</button>
            <button class="reply-button">Reply</button>
            <div class="reply-box"></div>
        </div>
    </div>
`;

//Nest Limit
const nestingLimit = 3;

//HTMLElement'den CommenBox classını oluşturma
export class CommentBox extends HTMLElement {
  constructor() {
    super();

    //Kademeleri belirlemek
    this.level = this.getAttribute("level")
      ? // Eğer değer kullanılabilirse okey
        parseInt(this.getAttribute("level"))
      : // Kullanılamazsa default olarak 0 olsun
        0;

    // Beğenme saysını init edip 0'dan başlatmak
    this.likeCount = 0;

    //attachShadow yöntemini çağırıp shadowDom eklemek. -Sayfanın genel css ve js özelliklerinden etkilenmeyen bileşenler için-
    this.attachShadow({ mode: "open" });

    // Yukarıda kı şablonun kopyasının shadowRoot'a eklenmesi
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // ShadowDom'daki edit ve display bileşenlerine erişmek.
    this.commentEdit = this.shadowRoot.querySelector(".comment-edit");
    this.commentDisplay = this.shadowRoot.querySelector(".comment-display");
  }
  //Butonlara eventlistener eklemek ve Dom'a içerik eklendiğinde yürütülmesi.
  connectedCallback() {
    // Submit butonu
    this.commentEdit
      .querySelector(".submit-btn")
      .addEventListener("click", () => this.commentSubmit());

    // Like butonu
    this.commentDisplay
      .querySelector(".like-button")
      .addEventListener("click", () => this.commentLike());

    // Unlike butonu
    this.commentDisplay
      .querySelector(".unlike-button")
      .addEventListener("click", () => this.commentUnLike());

    //Yanıtla düğmesi
    //Eğer mevcut nested yorumlar limitten azsa...
    if (this.level < nestingLimit) {
      this.commentDisplay
        .querySelector(".reply-button")
        .addEventListener("click", () => this.commentReply());
    } else {
      // Ama eğer limite ulaşılmışsa butonu devre dışı bırakma
      this.commentDisplay.querySelector(".reply-button").disabled = true;
    }
    //CommentDisplay'ı ilk başta saklıyoruz. Burası ilk başta gizli olacak ama yorum geldikten sonra görünür hale gelecek.
    this.commentDisplay.style.display = "none";
  }

  //Submit butonu
  commentSubmit() {
    //  Butonun input box'ını seçmek
    const commentInput = this.commentEdit.querySelector(".comment-input");

    // Yorumun görüntüleneceği divi seçmek
    const comment = this.commentDisplay.querySelector(".comment");

    // Yazar ismi
    const author = this.commentDisplay.querySelector(".author");

    // Kullanıcılardan gelen yorumları göstermek
    comment.innerHTML = commentInput.value;
    // Yazar adını diger js dosyasındaki sessianStorage'daki değere göre ayarlamak
    author.innerHTML = `Author: ${sessionStorage.getItem("currentUser")}`;

    // commentEdit'i saklamak
    this.commentEdit.style.display = "none";
    // commentDisplay'ı göstermek
    this.commentDisplay.style.display = "block";
  }

  //Beğenme butonu
  commentLike() {
    // Beğenilerin ve beğenmemelerin gösterileceği komponent
    const likes = this.commentDisplay.querySelector(".likes");

    // Her beğenide bir artırmak
    this.likeCount++;

    // Beğeni olduğunda bunu önceki beğenilere ekleyip göstermek
    likes.innerHTML = `Likes: ${this.likeCount}`;
  }
  //Beğenme butonu
  commentUnLike() {
    // Beğenilerin ve beğenmemelerin gösterileceği komponent
    const likes = this.commentDisplay.querySelector(".likes");

    // Her beğenide bir artırmak
    this.likeCount--;

    // Beğeni olduğunda bunu önceki beğenilere ekleyip göstermek
    likes.innerHTML = `Likes: ${this.likeCount}`;
  }

  //Yanıt verme Butonu
  commentReply() {
    // Yanıt kutusunu seçmek.
    const replyBox = this.commentDisplay.querySelector(".reply-box");
    // Yeni yorum kutusu oluşturmak
    const newCommentBox = document.createElement("comment-box");

    // Geçerli seviyeyi 1 artırarak yeni dzüey oluşturmak
    let newLevel = this.level + 1;
    // newCommentBox için seviye değerini yeni değer olarak ayarlamak
    newCommentBox.setAttribute("level", newLevel);
    newCommentBox.level = newLevel;

    // Yanıt kısmında alt yorumlar varsa....
    if (replyBox.childNodes) {
      // Yeni yanıt öncekilerden sonra eklenir
      replyBox.insertBefore(newCommentBox, replyBox.childNodes[0]);
    } else {
      // Eğer alt yorumlarsa yoksa normal eklenir
      replyBox.appendChild(newCommentBox);
    }
  }
}
