import * as firebase from 'firebase'

export default async (filename, pickerResult, completedCallback) => {
      try {
            const data = convertToByteArray(pickerResult.base64)

            var metadata = {
              contentType: 'image/jpeg',
            };
      
            var storageRef = firebase.storage().ref();
            var ref = storageRef.child(`profile_pictures/${filename}.jpg`)
            var bytes = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x2c, 0x20, 0x77, 0x6f, 0x72, 0x6c, 0x64, 0x21])
            let uploadTask = ref.put(data, metadata)
      
            uploadTask.on('state_changed', function (snapshot) {
      
              //progressCallback && progressCallback(snapshot.bytesTransferred / snapshot.totalBytes)
      
              var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
      
            }, function (error) {
              console.log("in _uploadAsByteArray ", error)
              completedCallback("error")
            }, function () {
              console.log("_uploadAsByteArray ", uploadTask.snapshot.downloadURL)
              completedCallback(uploadTask.snapshot.downloadURL)
            });
      
      
          } catch (ee) {
            console.log("when trying to load _uploadAsByteArray ", ee)
      }
}

const convertToByteArray = (input) => {
      var binary_string = atob(input);
      var len = binary_string.length;
      var bytes = new Uint8Array(len);
      for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
      }
      return bytes
}
    
const atob = (input) => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  
      let str = input.replace(/=+$/, '');
      let output = '';
  
      if (str.length % 4 == 1) {
        throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
      }
      for (let bc = 0, bs = 0, buffer, i = 0;
        buffer = str.charAt(i++);
  
        ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
          bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
      ) {
        buffer = chars.indexOf(buffer);
      }
  
      return output;
}