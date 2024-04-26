import React from "react";

const DownloadAndRunScript = () => {
  const downloadAndRun = async () => {
    // const fileUrl = 'http://localhost:8000/test.py?' + new Date().getTime();
    // const response = await fetch(fileUrl);
    // const pythonCode = await response.text();
    // eval(pythonCode);

    const code = `
    import cv2

def main():
    # Open the default camera (index 0)
    cap = cv2.VideoCapture(0)

    # Check if the camera opened successfully
    if not cap.isOpened():
        print("Error: Could not open camera.")
        return

    # Read and display the video stream
    while True:
        ret, frame = cap.read()

        if not ret:
            print("Error: Failed to capture frame.")
            break

        cv2.imshow('Camera', frame)

        # Wait for 'q' key to exit
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Release the camera and close all OpenCV windows
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
`;

    const pyodide = window.pyodide;
    pyodide.runPython(code);
  };

  const handleDownload = () => {
    downloadAndRun();
    // You can also add a delay to allow the file to fully download before running
    setTimeout(() => {
      // Run the script here
      console.log("Running the downloaded Python file");
    }, 1000); // Delay in milliseconds
  };

  return (
    <div>
      <button onClick={handleDownload}>Download and Run Script</button>
    </div>
  );
};

export default DownloadAndRunScript;
