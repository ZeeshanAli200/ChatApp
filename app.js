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
var storage = firebase.storage();
let chatWin = document.getElementById('chatWin');
let profPic=document.getElementById('upload-image');

//////////////////////////////////////Registration Page
var emailel = document.getElementById("emailel");
var passel = document.getElementById("passel");
var usrel = document.getElementById("usrel");
let profimgEle=document.getElementById('avatar-custom');

function uploadImageToStorage(UID) {
  return new Promise(async (resolve, reject) => {
      let image = profPic.files[0];
      let storageRef = storage.ref();
      let imageRef = storageRef.child(`avatar/${UID}/${image.name}`);
      await imageRef.put(image);
      let url = await imageRef.getDownloadURL();
      resolve(url);
  })
}
let getimgBool=true;

function getimg(){
  
  if(getimgBool){
  let image=profPic.files[0];
  console.log(image)
  profimgEle.src=`./images/${image.name}`;

  console.log(image)
  
}else{getimgBool=false}
}

function regEmail() {
  
  if(usrel.value!=''&&passel.value!=''&&getimgBool){
  firebase.auth().createUserWithEmailAndPassword(emailel.value, passel.value)
  .then(async(userCredential) => {
      // firebase.auth().signOut()    
      // logmsg.innerHTML="Signed in suceessfully"
      var user = userCredential.user;
      let getimgUrl=await uploadImageToStorage(user.uid)
      console.log(user)
      let usrInfo = {
        username: usrel.value,
        email: emailel.value,
        UID: user.uid,
        profURL:getimgUrl
        
      }

      saveDatainDB(usrInfo);
    }
    )
  }
}

function saveDatainDB(usrObj) {
  db.collection("Myusers").doc(usrObj.UID).set(usrObj)
    .then(() => {
      firebase.auth().signOut();
      window.location.replace('./loginpage.html')
    })
}



function signInEmail() {
  // console.log("emailel",emailel);
  let emailel = document.getElementById("emailel");
  let passel = document.getElementById("passel");

  console.log("emailel",emailel.value);
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





function getUsersList(ele) {
  let anotheruser = "";
  let chatBox = document.getElementById('chatBox');
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


var OtherUser, msgFullId = "";
let sendbtn = document.getElementById('sendbtn');
let count = 0;




let winheight = window.outerHeight;

chatWin.style.height = (winheight - 200) + 'px'

var boolvarforsnap=false;
function gettingMsg(btnUsrEle) {
  
  let msgUl = document.getElementById('msgUl');

  let btnEle = "";  
  let boolvar1 = true
  
  if (boolvar1 && btnUsrEle != btnEle) {
    let curruserID = ""
    btnEle = document.getElementById(btnUsrEle.id);
    console.log("Check***************")
    msgUl.querySelectorAll('*').forEach(n => n.remove());

    var Cur_uid = firebase.auth().currentUser.uid;

    curruserID = Cur_uid
    OtherUser = btnUsrEle.id
    // console.log(user,uid)
    let msgId = String(Cur_uid + btnUsrEle.id)
    msgFullId = msgId;
    snapReal(Cur_uid, msgId)
    
    boolvarforsnap=true


  }
  else {
    btnEle.disabled = false;

    console.log("else")
    boolvar1 = true;


  }
}

var unsubscribe;
function snapReal(currId, msgid) {
  
  
  if(boolvarforsnap){unsubscribe()}
  
  // boolvarforsnap=true
  unsubscribe = db.collection("Myusers").doc(currId).collection(msgid)
    .orderBy("timeStamp", "asc")
    .onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {


        let usrName;
        if (change.type === "added") {

          // console.log(change.doc.ref.parent.parent.id)

          usrName = document.createElement('LI');
          usrName.style.listStyleType = "none"

          let usrNameTextNode = document.createTextNode(change.doc.data().messgeFrom + ": " + change.doc.data().message)

          usrName.appendChild(usrNameTextNode)
          msgUl.appendChild(usrName)
          // console.log(usrNameTextNode)


          // console.log(change.doc.data())
          

        }

      });

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







async function sendFunc() {
  let msgInp = document.getElementById('msgInp');
  let curruserID = ""
  var Cur_uid = await firebase.auth().currentUser.uid;

    curruserID = Cur_uid

  db.collection("Myusers").get()
    .then((userDoc) => {
      console.log("send get*********")
      userDoc.forEach((userData) => {
        console.log(userData.id,curruserID)
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



