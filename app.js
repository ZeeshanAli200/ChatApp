var firebaseConfig = {
  apiKey: "AIzaSyCPZlEbyLtHuFAGBCKTArx2hlGjvKrDxp0",
  authDomain: "fire-auth-prac.firebaseapp.com",
  databaseURL: "https://fire-auth-prac.firebaseio.com",
  projectId: "fire-auth-prac",
  storageBucket: "fire-auth-prac.appspot.com",
  messagingSenderId: "123729269376",
  appId: "1:123729269376:web:8b89b5e3f9e0d1e91d0c65",
  measurementId: "G-24KGY4ZCNN"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();


var db = firebase.firestore();
let chatWin = document.getElementById('chatWin');
let msgUl = document.getElementById('msgUl');

//////////////////////////////////////Registration Page
var emailel = document.getElementById("emailel");
var passel = document.getElementById("passel");
var usrel = document.getElementById("usrel");
let msgData = []

function regEmail() {
  firebase.auth().createUserWithEmailAndPassword(emailel.value, passel.value)
    .then((userCredential) => {
      // firebase.auth().signOut()    
      // logmsg.innerHTML="Signed in suceessfully"
      var user = userCredential.user;
      console.log(user)
      let usrInfo = {
        username: usrel.value,
        email: emailel.value,
        UID: user.uid,
        msgcountVal: 0
      }
      saveDatainDB(usrInfo);
    }
    )
}

function saveDatainDB(usrObj) {
  db.collection("Myusers").doc(usrObj.UID).set(usrObj)
    .then(() => {
      firebase.auth().signOut();
      window.location.replace('./loginpage.html')
    })
}



function signInEmail() {
  firebase
    .auth()
    .signInWithEmailAndPassword(emailel.value, passel.value)
    .then((userCredential) => {

      window.location.replace('./chatHome.html')

      // Signed in
      var user = userCredential.user;


    })
    .catch((error) => {


      var errorCode = error.code;
      var errorMessage = error.message;
    });
}
//////////////////////////////////////Registration Page

let chatBox = document.getElementById('chatBox');
let msgInp = document.getElementById('msgInp');

let anotheruser = "";
function getUsersList(ele) {
  let timelap = setTimeout(() => {
    db.collection("Myusers").get()
      .then((userDoc) => {

        userDoc.forEach((userData) => {
          for (let i = 0; i < chatBox.childNodes.length - 1; i++) {
            chatBox.childNodes[i].remove();
          }
          if (ele.value == userData.data().username || userData.data().username.startsWith(ele.value) == true) {
            let btnUsr = document.createElement("BUTTON")
            btnUsr.innerHTML = userData.data().username;
            btnUsr.id = userData.id
            usrDataVal = userData.id;
            anotheruser = userData.id;
            btnUsr.setAttribute("onclick", "gettingMsg(this)")

            btnUsr.setAttribute("class", "col-lg-12")
            chatBox.appendChild(btnUsr)
            // console.log(userData.data())
            clearInterval(timelap)
          }
          else {
            for (let i = 0; i < chatBox.childNodes.length - 1; i++) {
              chatBox.childNodes[i].remove();
            }
          }

        })
      })
  }, 1500);
}


let curruserID = "", OtherUser, msgFullId = "";
let sendbtn = document.getElementById('sendbtn');
let boolvar1 = true, count = 0;
let btnEle = "";
let msgCount = 0



let winheight = window.outerHeight;
chatWin.style.height = (winheight - 200) + 'px'


function gettingMsg(btnUsrEle) {
  if (boolvar1 && btnUsrEle != btnEle) {

    btnEle = document.getElementById(btnUsrEle.id);
    console.log("Check***************")

     msgUl.querySelectorAll('*').forEach(n => n.remove());
     
     var Cur_uid = firebase.auth().currentUser.uid;
     
     curruserID = Cur_uid
     OtherUser = btnUsrEle.id
     // console.log(user,uid)
     let msgId = String(Cur_uid + btnUsrEle.id)
     msgFullId = msgId;
     console.log(Cur_uid,msgId)
     snapReal(Cur_uid,msgId)
     
     
    }
  else {
    btnEle.disabled = false;

    console.log("else")
    boolvar1 = true;


  }
}

function snapReal(curr,msgid) {
  

    
    db.collection("Myusers").doc(curr).collection(msgid)
      .orderBy("timeStamp", "asc")
      .onSnapshot((snapshot) => {
        console.log("msg count from snapshot ", snapshot.docChanges())
        console.log("msg data check", snapshot.docChanges())
        console.log("msgid",msgid)
        msgData=[];
        // msgData = snapshot.docChanges()
        snapshot.docChanges().forEach((change) => {

console.log("change in snaoshot",change)
          
console.log("msg CONDITON",(change.type === "added" && snapshot.docChanges().length !== msgCount.length ))
          // if (change.type === "added" && snapshot.docChanges().length !== msgCount.length ) {

let msgObj={messageFrom:change.doc.data().messgeFrom , messageText : change.doc.data().message }
            msgData.push(msgObj)

            // let usrName;
            // // console.log(change.doc.ref.parent.parent.id)

            // usrName = document.createElement('LI');
            // usrName.style.listStyleType = "none"

            // let usrNameTextNode = document.createTextNode(change.doc.data().messgeFrom + ": " + change.doc.data().message)

            // usrName.appendChild(usrNameTextNode)
            // msgUl.appendChild(usrName)
            // console.log(usrNameTextNode)


            // console.log(change.doc.data(),"**************")
            // chatWin.append(usrName)
            // node.querySelectorAll('*').forEach(n => n.remove());

          // }

        });

        console.log("msg from MSGUL",msgUl.childElementCount)
        msgCount = msgUl.childElementCount
        console.log("msg from msgCount",msgCount)
        console.log("msg data +",msgData)
        

      });



}



// function snapReal(curr,msgid){
//   console.log("***********")
//   db.collection("Myusers").doc(curr).collection(msgid)
//     .orderBy("timeStamp", "asc")
//     .onSnapshot((snapshot) => {
//       snapshot.docChanges().forEach((change) => {


//         let usrName;
//         if (change.type === "added") {

//           // console.log(change.doc.ref.parent.parent.id)

//           usrName = document.createElement('LI');
//           usrName.style.listStyleType = "none"

//           let usrNameTextNode = document.createTextNode(change.doc.data().messgeFrom + ": " + change.doc.data().message)

//           usrName.appendChild(usrNameTextNode)
//           msgUl.appendChild(usrName)
//           console.log(usrNameTextNode)


//           console.log(change.doc.data())
//           // chatWin.append(usrName)
//           // node.querySelectorAll('*').forEach(n => n.remove());

//         }

//       });

//     });


//   }







function sendFunc() {



  db.collection("Myusers").get()
    .then((userDoc) => {
      console.log("send get*********")
      userDoc.forEach((userData) => {
        // console.log(userData.id,curruserID)
        let msgObj = { messgeFrom: userData.data().username, message: msgInp.value, timeStamp: new Date() }
        if (userData.id == curruserID && OtherUser != curruserID) {



          db.collection("Myusers").doc(curruserID).collection(msgFullId).add(msgObj)

          db.collection("Myusers").doc(OtherUser).collection(msgFullId).add(msgObj)


        }
        else if (OtherUser == curruserID) {
          db.collection("Myusers").doc(curruserID).collection(msgFullId).add(msgObj)
        }

      })
    })

  // db.collection("Myusers").doc(curruserID).collection("Messages").doc(msgFullId).set({message:msgInp.value})
}



