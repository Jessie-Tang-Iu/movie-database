import { addDoc, collection, deleteDoc, doc, getDocs, query } from "firebase/firestore";
import { db } from "../_utils/firebase";

export async function dbGetAllMovieList(userId, itemsListStateSetter) {
    try {
        const allItemsReference = collection(db, "users", userId, "myList");
        const allItemsQuery = query(allItemsReference);
        const querySnapshot = await getDocs(allItemsQuery);
        let itemsList = [];
        querySnapshot.forEach((doc) => {
            let thisItem = {
                firebaseId: doc.id,  // 🔧 Store Firebase ID separately
                ...doc.data()        // Spread the movie data
                // Note: if doc.data() has an 'id' field, it will overwrite firebaseId
                // So we need to ensure firebaseId is preserved
            };
            
            // 🔧 Make sure Firebase document ID is preserved
            if (thisItem.id && typeof thisItem.id === 'number') {
                // If 'id' is a number (TMDB ID), preserve it as tmdbId and use firebaseId as main id
                thisItem.tmdbId = thisItem.id;
                thisItem.id = doc.id;
            } else if (!thisItem.id || thisItem.id === doc.id) {
                // If no 'id' or it matches firebaseId, use firebaseId as main id
                thisItem.id = doc.id;
            }
            
            console.log("Loading movie from Firebase:", thisItem.title);
            console.log("Firebase Document ID:", doc.id);
            console.log("Final item ID:", thisItem.id);
            console.log("TMDB ID:", thisItem.tmdbId);
            
            itemsList.push(thisItem);
        });
        itemsListStateSetter(itemsList);
    } catch (error) {
        console.error("Error loading movie list:", error);
    }
}

export async function dbAddMovieItem(userId, itemObj) {
    try {
        // 🔧 Clean the item before saving - remove any existing Firebase IDs
        const cleanItem = {
            ...itemObj
        };
        
        // Remove Firebase-specific IDs to prevent conflicts
        delete cleanItem.firebaseId;
        
        // Make sure TMDB ID is stored as tmdbId
        if (cleanItem.id && typeof cleanItem.id === 'number') {
            cleanItem.tmdbId = cleanItem.id;
            delete cleanItem.id; // Remove the TMDB ID from 'id' field
        }
        
        console.log("Adding movie to Firebase:", cleanItem.title);
        console.log("Clean item being saved:", cleanItem);
        
        const newItemReference = collection(db, "users", userId, "myList");
        const newItemPromise = await addDoc(newItemReference, cleanItem);
        console.log("Movie saved with Firebase ID:", newItemPromise.id);
    } catch (error) {
        console.error("Error adding movie:", error);
    }
}

export async function dbRemoveMovieItem(userId, item) {
    try {
        // 🔧 Use the correct Firebase document ID
        const documentId = item.firebaseId || item.id;
        
        console.log("Removing movie from Firebase:", item.title);
        console.log("Using document ID:", documentId);
        console.log("Document ID type:", typeof documentId);
        
        if (!documentId || typeof documentId !== 'string') {
            throw new Error(`Invalid Firebase document ID: ${documentId}`);
        }
        
        const removeItemReference = doc(db, "users", userId, "myList", documentId);
        console.log("Document reference:", removeItemReference);
        await deleteDoc(removeItemReference);
        console.log("Successfully deleted movie with ID:", documentId);
    } catch (error) {
        console.error("Error removing movie:", error);
        throw error; // Re-throw to handle in the UI
    }
}