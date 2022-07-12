// const { response } = require("express")

const socket=io()

const textarea =document.querySelector("#textarea")
const submitbtn =document.querySelector("#submitBtn")
const commentbox =document.querySelector(".comment__box")
const typingdiv =document.querySelector(".typing")

let user;
do{
    user=prompt("Enter ur name:");
}while(!user);
textarea.addEventListener("keyup",()=>{
    socket.emit("typing",user);
})
submitbtn.addEventListener("click",()=>{
    let comment = textarea.value;
    if (comment=="") {
        return;
    }
    let info={
        username:user,
        comment:comment.trim()
    }
    //addcommenttodom
    addtodom(info);
    textarea.value="";
    //Send to server
    socket.emit('comment',info);
    //sync with db
    syncWithdb(info);
})

 function addtodom(info){
     let litag=document.createElement("li")
     litag.classList.add("comment")
     let markup=`
<div class="card border-light mb-3">
     <div class="card-body">
         <h6>${info.username}</h6>
         <p>${info.comment}</p>
         <div>
             <img src="/img/clock.png" alt="clock">
             <small>${moment(info.time).format("LT")}</small>
         </div>
     </div>
 </div>
     `
     litag.innerHTML=markup;
     commentbox.prepend(litag);
 }


 socket.on('comment',(info)=>{
    addtodom(info);
 })

   let timerid=null;
   function debounce(func,time){
        if (timerid) {
            clearTimeout();
        }
        timerid = setTimeout(() => {
            func();
        }, time);
   }

 socket.on('typing',(username)=>{
    typingdiv.innerHTML=`${username} is typing.....`
    debounce(function(){
        typingdiv.innerHTML=``;
    },3000)
 })

 //Api calls
function syncWithdb(info){
    const headers ={
        'Content-Type':'applicaton/json'
    }

    fetch('/api/comments',{ method:'Post' , body:JSON.stringify(info) , headers })
        .then(response => response.json())
        .then(result =>{
            console.log(result);
        })
 }

