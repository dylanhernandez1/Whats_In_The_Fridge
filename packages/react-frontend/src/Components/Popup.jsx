import FoodPopup from "./FoodPopup.jsx";
import ImagePopup from "./ImagePopup.jsx";

function Popup({ popupType, foodInfo, onDelete, onClose }) {
  if(popupType === "FoodPopup") {
    return (
      <FoodPopup 
        foodInfo={foodInfo}
        onDelete={onDelete}
        onClose={onClose}    
      />
    );
  } else if(popupType === "ImagePopup") {
    return (
      <ImagePopup
        foodInfo={foodInfo}
        onDelete={onDelete}
        onClose={onClose}
      />
    );
  };
}

export default Popup;
