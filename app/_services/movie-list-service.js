import { addDoc, collection, getDocs, query } from "firebase/firestore";
import { db } from "../_utils/firebase";


export async function dbGetAllMovieList(userId, itemsListStateSetter) {
    try {
        const allItemsReference = collection(db, "users", userId, "myList");
        const allItemsQuery = query(allItemsReference);
        const querySnapshot = await getDocs(allItemsQuery);
        let itemsList = [];
        querySnapshot.forEach( (doc) => {
            let thisItem = {
                id: doc.id,
                ...doc.data()
            }
            itemsList.push(thisItem);
        });
        itemsListStateSetter(itemsList);
    } catch (error) {
        console.log(error);
    }
}

export async function dbAddMovieItem(userId, itemObj) {
    try {
        const newItemReference = collection(db, "users", userId, "myList");
        const newItemPromise = await addDoc(newItemReference, itemObj);
        console.log(newItemPromise.id);
    } catch (error) {
        console.log(error);
    }
}