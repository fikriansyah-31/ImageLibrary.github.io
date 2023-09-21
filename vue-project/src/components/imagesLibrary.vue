<template>
  <div>
    <div class="image-upload-box">
      <div class="image-preview">
        <img :src="previewImageUrl" alt="Preview Image" v-if="previewImageUrl" />
      </div>
      <label for="fileInput" class="upload-button">
        Upload Gambar
      </label>
      <input
        type="file"
        id="fileInput"
        ref="fileInput"
        @change="previewImage"
        accept="image/jpeg, image/jpg, image/bmp, image/png, image/gif"
        style="display: none;"
      />
    </div>
    <button @click="submitImage" :disabled="!previewImageUrl">Submit</button>
    <p v-if="uploadStatus" :class="{ 'error-message': uploadStatus.startsWith('Hanya'), 'upload-message': !uploadStatus.startsWith('Hanya') }">{{ uploadStatus }}</p>
    <div class="image-gallery">
      <div v-for="url in imageUrls" :key="url">
        <img :src="url" alt="Uploaded Image" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      uploadStatus: '',
      imageUrls: [],
      previewImageUrl: '',
    };
  },
  methods: {
    async previewImage(event) {
      const file = event.target.files[0];
      if (!file) return;

      if (!this.isValidImageFile(file)) {
        this.uploadStatus = 'Hanya boleh file gambar';
        this.previewImageUrl = '';
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        this.uploadStatus = 'File gambar terlalu besar';
        this.previewImageUrl = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.previewImageUrl = reader.result;
      };
      reader.readAsDataURL(file);
    },
    async uploadImage() {
      const fileInput = this.$refs.fileInput;
      const file = fileInput.files[0];
      if (!file) return;

      if (!this.isValidImageFile(file)) {
        this.uploadStatus = 'Hanya boleh file gambar';
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        this.uploadStatus = 'File gambar terlalu besar';
        return;
      }

      try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await this.uploadToImgbb(formData);
        if (response && response.data && response.data.data) {
          const imageUrl = response.data.data.url;
          this.imageUrls.push(imageUrl);
          localStorage.setItem('imageUrls', JSON.stringify(this.imageUrls));
          this.uploadStatus = 'Gambar berhasil di upload';
          this.previewImageUrl = '';
          fileInput.value = '';
        } else {
          this.uploadStatus = 'Upload error';
        }
      } catch (error) {
        console.error(error);
        this.uploadStatus = 'Upload error';
      }
    },
    isValidImageFile(file) {
      const allowedExtensions = ['jpg', 'jpeg', 'bmp', 'png', 'gif'];
      const fileExtension = file.name.split('.').pop().toLowerCase();
      return allowedExtensions.includes(fileExtension);
    },
    async uploadToImgbb(formData) {
      const apiKey = 'ee60b34004b5886fde515f8f0808b07f';
      const apiUrl = `https://api.imgbb.com/1/upload?key=${apiKey}`;

      return await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    submitImage() {
      if (this.previewImageUrl) {
        this.uploadImage();
      }
    },
  },
  mounted() {
    const savedImageUrls = localStorage.getItem('imageUrls');
    if (savedImageUrls) {
      this.imageUrls = JSON.parse(savedImageUrls);
    }
  },
};
</script>

<style scoped>
.image-upload-box {
  text-align: center;
  border: 2px dashed #007bff;
  border-radius: 5px;
  padding: 20px;
  margin-bottom: 20px;
  cursor: pointer;
  position: relative;
}

.image-upload-box:hover {
  border-color: #0056b3;
}

.upload-button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.upload-button:hover {
  background-color: #0056b3;
}

#fileInput {
  display: none;
}

.image-gallery {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 20px;
}

.image-gallery img {
  max-width: 100px;
  max-height: 100px;
  margin: 5px;
  border: 2px solid #eee;
  border-radius: 5px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease-in-out;
}

.image-gallery img:hover {
  transform: scale(1.1);
}

.upload-message {
  font-weight: bold;
  margin-top: 10px;
  color: #007bff;
}

.error-message {
  font-weight: bold;
  margin-top: 10px;
  color: #ff0000;
}

.image-preview {
  text-align: center;
  margin-bottom: 20px;
}

.image-preview img {
  max-width: 300px;
  max-height: 300px;
  border: 2px solid #eee;
  border-radius: 5px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
}
</style>
