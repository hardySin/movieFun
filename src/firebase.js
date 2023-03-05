import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc,getDocs } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, updateProfile, createUserWithEmailAndPassword, signOut } from "firebase/auth";

const config = {
    apiKey: "AIzaSyBR50dWzhzX-8XsU7QlgED3Cw9QXZdtMfI",
    authDomain: "moviefun-6c4c2.firebaseapp.com",
    databaseURL: "https://moviefun-6c4c2.firebaseio.com",
    projectId: "moviefun-6c4c2",
    storageBucket: "moviefun-6c4c2.appspot.com",
    messagingSenderId: "356787472",
    appId: "1:356787472:web:1d23d52970394c60c0b195",
    measurementId: "G-Z44NQJLGM1"
};


class firebase {


    constructor(config) {
        this.app = initializeApp(config);
        this.db = getFirestore(this.app);
        this.auth = getAuth(this.app);
        this.currentUser = getAuth().currentUser;
        console.log("this.currentUser ", this.currentUser)

    }

    login(email, password) {
        return signInWithEmailAndPassword(this.auth, email, password)
    }

    logout() {
        return signOut(this.auth);
    }

    async register(email, password) {
        let num = Math.floor(Math.random() * 2000) + 1;
        let name = "HAcker" + num;
        await createUserWithEmailAndPassword(this.auth, email, password)
        console.log("name", name)
        return updateProfile(this.auth.currentUser, { displayName: name })
    }

    currentUser() {
        return this.auth.currentUser.uid;
    }

    async isIntializated() {
        return new Promise(resolve => {
            this.auth.onAuthStateChanged(resolve)
        });
    }

    async addComment(userId, userComment, userName, movieId) {
        let date = new Date();
        const CommentColl = doc(collection(this.db, "Comments"));
        await setDoc(CommentColl, {
            "userId": userId, "userComment": userComment, "userName": userName, "timing": date, "movieId": movieId, "year": date.getFullYear(),
            "month": date.getMonth(), "date": date.getDate()
        });
    }

    async getCommentOnId(userId) {
        return  await getDocs(collection(this.db, "Comments"));
    }

}

export default new firebase(config);
