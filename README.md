# NextJS Course Folder Structure Automation

## Description
This project automates the creation of a folder and file structure on Google Drive for a NextJS course. It uses the Google Drive API to create folders and Google Docs based on a predefined course module structure.

## Features
- Authenticates with Google Drive using OAuth2.
- Creates a main folder for the course.
- Creates subfolders for each module and section.
- Generates Google Docs within each section folder.

## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/yourproject.git
    cd yourproject
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up your Google API credentials:
    - Obtain your `credentials.json` file from the Google Developer Console.
    - Place the `credentials.json` file in the root directory of the project.

## Usage
1. Run the script:
    ```bash
    npm start
    ```

2. Follow the instructions to authorize the application and enter the authorization code.

## Project Structure
- `index.ts`: Main script that handles authentication and folder/file creation.
- `credentials.json`: Google API credentials file.
- `token.json`: File to store the OAuth2 token.

## Modules and Sections
The project creates the following structure on Google Drive

## Contributing
Feel free to submit issues or pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License.

## Contact
For any inquiries, please contact [your email or GitHub profile].