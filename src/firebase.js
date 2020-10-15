import  app  from "firebase/app";
import 'firebase/auth';
import 'firebase/firebase-firestore';
const config = {
    apiKey: "AIzaSyCOGgt4D2MoJ3xGVGVf9ZlnxTBVPCRjm10",
    authDomain: "moviefun-6c4c2.firebaseapp.com",
    databaseURL: "https://moviefun-6c4c2.firebaseio.com",
    projectId: "moviefun-6c4c2",
    storageBucket: "moviefun-6c4c2.appspot.com",
    messagingSenderId: "356787472",
    appId: "1:356787472:web:1d23d52970394c60c0b195",
    measurementId: "G-Z44NQJLGM1"
 }
class firebase 
{
    constructor()
    {
        app.initializeApp(config);
            this.auth=app.auth();
            this.db=app.firestore();
    }

    login(email,password)
    {
        return this.auth.signInWithEmailAndPassword(email,password)
    }

    logout()
    {
        return this.auth.signOut();
    }

    async register(email,password)
    {
        let num=Math.floor(Math.random() * 2000) + 1;
        let name="HAcker"+num;
        await this.auth.createUserWithEmailAndPassword(email,password)
        return this.auth.currentUser.updateProfile({
            displayName:name
        })
    }
    
    currentUser()
    {
        return this.auth.currentUser.uid  ;  
    }

    isIntializated()
    {
       return new Promise(resolve=>
            {
                this.auth.onAuthStateChanged(resolve)
            }); 
    }
    
  async  addComment(userId,userComment,userName,movieId)
    {
        let date=new Date();

       await this.db.collection("Comments").doc()
       .set({"userId":userId,"userComment":userComment,"userName":userName,"timing":date,"movieId":movieId,"year":date.getFullYear(),
            "month":date.getMonth(),"date":date.getDate()})
                return this.db.collection(userId)
        }

   async    getCommentOnId(userId)
    {
        return await this.db.collection("Comments").get()
    }
}

 
export default new firebase();
