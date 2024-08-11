import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { createContext, useContext } from "react";
import { storage, firestore } from "../../server/firebase";
import { v4 } from "uuid";
import toast from "react-hot-toast";

const StorageContext = createContext();

export function useStorage() {
  return useContext(StorageContext);
}

export function StorageProvider({ children }) {
  const toastMessage = (message) => toast(message);

  const UploadImage = async (imageFile, userId) => {
    const imageId = v4();
    const imageStorageRef = ref(storage, `images/${imageId}-${imageFile.name}`);
    try {
      await uploadBytes(imageStorageRef, imageFile);

      const downloadURL = await getDownloadURL(imageStorageRef);

      await setDoc(doc(firestore, "imageUploads", imageId), {
        uploadedBy: userId,
        uploadDate: new Date(),
        fileName: imageFile.name,
        downloadURL: downloadURL,
        path: imageStorageRef.fullPath,
      });

      toastMessage("Uploaded Image successfully");
      return { downloadURL, imageId };
    } catch (error) {
      toastMessage("Error uploading image: " + error.message);
      throw error;
    }
  };

  const RetrieveImage = async (imageId) => {
    try {
      const docRef = doc(firestore, "imageUploads", imageId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const downloadURL = await getDownloadURL(ref(storage, data.path));
        return {
          ...data,
          downloadURL,
          uploadDate: data.uploadDate.toDate(),
        };
      } else {
        throw new Error("No such image!");
      }
    } catch (error) {
      toastMessage("Error retrieving image: " + error.message);
      throw error;
    }
  };

  const value = {
    UploadImage,
    RetrieveImage,
  };

  return (
    <StorageContext.Provider value={value}>{children}</StorageContext.Provider>
  );
}
