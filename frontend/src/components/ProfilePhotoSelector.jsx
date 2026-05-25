import { useRef, useState } from "react";
import { LuUser, LuUpload } from "react-icons/lu";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS, BASE_URL } from "../utils/apiPaths";

const ProfilePhotoSelector = ({ image, setImage, preview, setPreview }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
    setImage(file);
  };

  return (
    <div className="profile-photo-selector">
      <div
        className="profile-photo-wrapper"
        onClick={() => inputRef.current.click()}
      >
        {preview ? (
          <img src={preview} alt="Profile" className="profile-photo-img" />
        ) : (
          <div className="profile-photo-placeholder">
            <LuUser />
          </div>
        )}
        <div className="profile-upload-btn">
          <LuUpload size={12} />
        </div>
      </div>
      <input
        type="file"
        ref={inputRef}
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ProfilePhotoSelector;
