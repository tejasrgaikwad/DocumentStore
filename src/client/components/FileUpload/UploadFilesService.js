import http from "../../http-common";

class UploadFilesService {
  upload(file, user, comments, onUploadProgress) {
    let formData = new FormData();

    formData.append("selectedFile", file);
    formData.append("user", user);
    formData.append("comments", comments);

    return http.post("/api/v1/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  }

  getFiles() {
    return http.get("/api/v1/files");
  }
}

export default new UploadFilesService();