
![Logo](https://github.com/AliiMuhammed/ExamGuards.Ai/assets/93393629/cba47212-3f54-46b8-b074-d67d835b9c12)



# ExamGuards.Ai

"Exam Guards.Ai" is designed to provide a comprehensive online proctoring solution for educational institutions. The system integrates AI models for features such as eye gaze estimation and face recognition to detect and prevent cheating during online exams. Additionally, it offers tools for exam management, grading, and course materials access, enhancing the overall online learning experience.

## Features

- __Proctoring__: AI-driven monitoring using:
    - __Eye Gaze Estimation__: Tracks the user's eye movements to detect       potential cheating behavior.
    - __Face Recognition__: Verifies the identity of the user throughout the exam session.
    - __Voice Detection__: Monitors ambient noise and user speech to identify unauthorized communication.
    - __Object Detection__: Detects unauthorized objects in the user's environment to prevent cheating.
- __Exam Management__: Instructors can create, update, and delete exams, including setting visibility and adding questions.
- __Grading__: Instructors can assign grades to students and view their performance.
- __Student Participation__: Students can log in, access exams, and view course materials.
- __Security__: Robust authentication, data encryption, and compliance with data protection regulations.
- __Scalability__: The system supports horizontal scaling to accommodate growing user numbers.


## Target Audience
The project is primarily designed for educational institutions that conduct online exams and need to ensure academic integrity. It is useful for instructors who need a reliable and secure platform to manage exams and monitor student performance. Additionally, it benefits students by providing a user-friendly interface for accessing exams and course materials.

The project aims to address the increasing demand for secure online proctoring solutions, especially in the context of the shift to online learning due to the COVID-19 pandemic.
## Technologies Used

- __Client__: React.js, CSS, JavaScript, Redux toolkit
- __Server__: Node.js, Mongo DB
- __AI Models__: Python with libraries such as NumPy, pandas, scikit-learn, and specialized frameworks for eye gaze estimation, face recognition, voice detection, and object detection.
- __Deployment__: Heroku
- __Tools__: VS Code, Postman, Anaconda Navigator, JupyterLab, Google Colab, Kaggle

## Demo

Experience the power of "Exam Guards.Ai" firsthand—watch our demo to see how our AI-driven proctoring solution ensures the integrity and security of online exams!

__[Watch the demo](https://drive.google.com/file/d/1F6URYNpcUOOD0Li5bVuAo4vPESai9EWV/view?usp=sharing)__
## Screenshots

- __Login__:
  
<img src="https://github.com/AliiMuhammed/ExamGuards.Ai/assets/93393629/da294592-cd12-4008-9a3b-b5a7d9772c51" alt="login Screenshot" width="600px">

- __My Courses__:
  
<img src="https://github.com/AliiMuhammed/ExamGuards.Ai/assets/93393629/adf07e21-d162-4869-ba85-04ef8c43d942" alt="Courses Screenshot" width="600px">

- __Course Modules__:
  
<img src="https://github.com/AliiMuhammed/ExamGuards.Ai/assets/93393629/115111cb-41fe-4100-9033-4becaf9dfdca" alt="Modules Screenshot" width="600px">

- __Student Profile__:
  
<img src="https://github.com/AliiMuhammed/ExamGuards.Ai/assets/93393629/258653a0-6229-4d02-a776-7910b2f1d0a4" alt="Profile Screenshot" width="600px">

- __Exam Example__:
  
<img src="https://github.com/AliiMuhammed/ExamGuards.Ai/assets/93393629/7cb6ae6f-b97a-4e37-bac2-2e2044452f95" alt="Exam Example" width="600px">

- __Cheating Example (Not the same student)__:
  
<img src="https://github.com/AliiMuhammed/ExamGuards.Ai/assets/93393629/45eac06c-bd55-4044-8902-f59f2bce6019" alt="Cheating Example"  width="600px" >

- __More Example__:
  
<img src="https://github.com/AliiMuhammed/ExamGuards.Ai/assets/93393629/d76e9daa-fb47-44c1-b50f-4ef5247d83f1" alt="More Example" width="600px">

<img src="https://github.com/AliiMuhammed/ExamGuards.Ai/assets/93393629/3933032f-3613-429d-a6d2-58300ab7553e" alt="Another Example" width="600px">




## Run Locally

Clone the project

```bash
  git clone https://github.com/AliiMuhammed/ExamGuards.Ai.git
```
- __[1] To run Client side & Server Side__:
    - Go to the Clinet directory
    ```bash
        cd ExamGuards.Ai\Clinet\teachable
    ```
    - And for Server directory Go to
    ```bash
        cd ExamGuards.Ai\Server
    ```
    - Install dependencies

    ```bash
        npm install
    ```

    - Start the server

    ```bash
        npm run start
    ```

- __[2] To run Object Model__:
    - [1] Install Anaconda [Link](https://www.anaconda.com/)
    - [2] Install Cuda toolkit from the nvidia [Link](https://developer.nvidia.com/cuda-toolkit)
    - [3] Go to the Objects model directory
        ```bash
        cd ExamGuards.Ai\Models\Objects model
        ```
    - [4] open anaconda prompt and write 

        ```bash
        conda create --name "your env name" python=3.10
        ```
    - [5] then active your env
        ```bash
        conda activate "your env name"
        ```
    - [6] Install all in requirements.txt
        ```bash
        pip install -r requirements.txt
        ```
    - [7] You must install this dependencies using anaconda prompet and     make sure you are in the same directory
    ```bash
        pip install torch==2.0.0+cu118 torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118 --trusted-host download.pytorch.org
    ```
    ```bash
        pip install tensorflow-gpu
    ```
    ```bash
        pip install --upgrade ultralytics
    ```
- __[3] To run Eye Tracking Model__:
    - [1] Go to the Model directory
    ```bash
        cd  ExamGuards.Ai\Models\Eye Tracking Model
    ```
    - [2] open anaconda prompt and write
    ```bash
        conda create --name "your env name" python=3.11.9
    ```
    - [3] then active your env
    ```bash
        conda activate "your env name"
    ```
    - [4] Install all in requirements.txt
    ```bash
        pip install -r requirements.txt
    ```
    - [5] Run the Flask app
    ```bash
        python app.py
    ```
    __The app will run on http://localhost:5000/ by default.__

    - [5.1] Endpoints
        - POST /detect: This endpoint accepts a form-data request with images URL.
        - Request:
            - imagefiles: List of image files.
        - Response: JSON array of results for each image, indicating whether chetening or not Cheating images include a Cloudinary URL.
    
    ```bash
    [ Notes ]

    •	Ensure shape_predictor_68_face_landmarks.dat is downloaded for facial landmark detection.
    •	Images are uploaded to Cloudinary for storage and analysis results.Files
    •	app.py: Main Flask application file containing routes for image upload and cheating detection.
    •	function.py: Contains functions for facial feature detection (blinking and gaze direction).
    •	runtime.txt: Specifies Python version (python-3.11.9) for deployment.
    •	shape_predictor_68_face_landmarks.dat: Dlib's facial landmark detection model (not included).
    ```


- __[4] To run Face recognition Model__:
    - [1] Go to the Model directory
    ```bash
        cd  ExamGuards.Ai\Models\Face Recognition Model
    ```
    - [2] Open anaconda prompt and write
    ```bash
        conda create --name "your env name" python=3.11.9
    ```
    - [3] Then active your env
    ```bash
        conda activate "your env name"
    ```
    - [4] Install all in requirements.txt
    ```bash
        pip install -r requirements.txt
    ```
    - [5] Run the Flask app
    ```bash
        python app.py
    ```
    __The app will run on http://localhost:5000/ by default.__

    - [5.1] Endpoints
        - POST /detect: This endpoint accepts a form-data request with images and a reference image URL.
        - Request:
            - imagefiles: List of image files to compare.
            - reference_image_url: URL of the reference image.
        - Response:JSON array of results for each image,indicating whether it matches the reference image. Non-matching images include a Cloudinary URL.
    ```bash
    [ Notes ]

    •	Images are uploaded to Cloudinary for storage and analysis results.Files
    •	app.py: The main application file defines the Flask app and the /detect endpoint.
    •	function.py: Contains the SimpleFacerec class for loading and comparing faces.
    •	requirements.txt Lists all Python dependencies for the project.
    •   runtime.txt Specifies the Python runtime version.
    ```

- __[5] To run Voice recognition Model__:
    - [1] Go to the Model directory
    ```bash
        cd  ExamGuards.Ai\Models\Voice Recogonition Model
    ```
    - [2] Open anaconda prompt and write
    ```bash
        conda create --name "your env name" python=3.11.9
    ```
    - [3] Then active your env
    ```bash
        conda activate "your env name"
    ```
    - [4] Install all in requirements.txt
    ```bash
        pip install -r requirements.txt
    ```
    - [5] Run the Flask app
    ```bash
        python app.py
    ```
    __The app will run on http://localhost:5000/ by default.__

    - [5.1] Endpoints
        - POST /detect: This endpoint accepts a form-data request with voice file.
        - Request:
            - voice_file: audio file to check if there any human talks.
            
        - Response:JSON array of results for audio file,indicating whether there is human talks or not. if there is talking detected it uploaded to Cloudinary.
    ```bash
    [ Notes ]

    • Audios are uploaded to Cloudinary for storage and analysis results.
    • app.py: The main application file defines the Flask app and the /detect endpoint.
    • function.py: Contains the VoiceDetection class for loading and comparing voices.
    • requirements.txt: Lists all Python dependencies for the project.
    • runtime.txt: Specifies the Python runtime version.
    ```
    
         

          

## Documentation

Read Project [Documentation](https://drive.google.com/file/d/1D4ow1UnLmJ90gqCTGBvdJafhJqb8VXqn/view?usp=sharing)


## Authors

- [@Ali Muhammed](https://www.linkedin.com/in/ali-muhammed-dev/)
- [@Shahdan Hegazy](https://www.linkedin.com/in/shahdan-hegazy-23b516203/?lipi=urn%3Ali%3Apage%3Ad_flagship3_detail_base%3B%2Fo6dPfFJQAmltltbOBKmiw%3D%3D)
- [@Abdelrahman Hassan](https://www.linkedin.com/in/abdelrahmanhassanabbas/?lipi=urn%3Ali%3Apage%3Ad_flagship3_detail_base%3B%2Fo6dPfFJQAmltltbOBKmiw%3D%3D)
- [@Dina Ziada](https://www.linkedin.com/in/dina-ziada-723032225/?lipi=urn%3Ali%3Apage%3Ad_flagship3_detail_base%3B%2Fo6dPfFJQAmltltbOBKmiw%3D%3D)
- [@Haneen Mohamed](https://www.linkedin.com/in/haneen-mohamed-mostafa-5a3196253/?lipi=urn%3Ali%3Apage%3Ad_flagship3_detail_base%3B%2Fo6dPfFJQAmltltbOBKmiw%3D%3D)


## Acknowledgements

 We extend our heartfelt thanks to our supervisor, [@Dr. Ensaf Hussein](https://www.linkedin.com/in/ensaf-hussein-7b257492/?lipi=urn%3Ali%3Apage%3Ad_flagship3_detail_base%3BrdJgsAMwSw%2BF%2BDz1MTQfJA%3D%3D), for her invaluable guidance and support. We are also grateful to the Faculty of Computer and Artificial Intelligence at Helwan University, our families, and friends for their unwavering support throughout our journey.
We believe that ExamGuards.AI can play a pivotal role in ensuring the integrity of online exams, thereby fostering a fair and trustworthy educational environment.
