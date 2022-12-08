import { CommentBox } from "./commentBox.js";

// Geçerli kullanıcıyı ayarlamak
sessionStorage.setItem("currentUser", "Caner");

//comment-box isimli custom bir html elementi oluşturmak.
window.customElements.define("comment-box", CommentBox);
