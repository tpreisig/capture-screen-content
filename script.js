const screenshotBtn = document.querySelector("#screenshot-btn");
const captureScreen = async () => {
    try {
      // Check if mediaDevices and getDisplayMedia are supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        console.log("Screen capture is not supported in this browser.");
        return;
      }
  
      // Asking permission to use a media input to record the current tab
      const stream = await navigator.mediaDevices.getDisplayMedia({ 
        preferredCurrentTab: false,
        video: true,
        audio: false
      });

      // Structered logging of the stream tracks in a tabluar view using console.table
  
      if (!(stream instanceof MediaStream)) {
        console.log("Invalid stream type received.");
      }
      const tracks = stream.getTracks();
        const trackData = tracks.map((track, i) => ({
                "Track": i + 1,
                "Kind": track.kind,
                "ID": track.id,
                "Enabled": track.enabled,
                "Muted": track.muted,
                "Width": track.getSettings().width || "N/A",
                "Height": track.getSettings().height || "N/A",
                "Frame Rate": track.getSettings().frameRate || "N/A"
        })); 
      console.table(trackData);


      const video = document.createElement("video");
      video.addEventListener("loadedmetadata", () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
  
        // Passing video width and height as video width and height
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
  
        // Drawing an image from the captured video stream
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        document.body.appendChild(canvas);
      });
  
      // Set the stream as the video source, ensuring it's a MediaStream
      video.srcObject = stream;
  
      // Ensure the video starts playing
      await video.play().catch((error) => {
        console.log("Error playing video:", error);
      });


    } catch (err) {
      console.error("Error: " + err);
    }
  };

screenshotBtn.addEventListener("click", captureScreen);