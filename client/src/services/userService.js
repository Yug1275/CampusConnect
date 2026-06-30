import api from "./api";

export const getMyProfile = () => api.get("/users/profile");

export const updateMyProfile = (data) => api.put("/users/profile", data);

// File upload requires multipart/form-data, not JSON
export const uploadProfilePicture = (file) => {
  const formData = new FormData();
  formData.append("profileImage", file);

  return api.post("/users/profile/picture", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};