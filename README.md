### Pre-requisites

Ensure you have the following installed on your machine:

-[Node.js](https://nodejs.org) (version 16 or higher)

-[npm](https://www.npmjs.com) (comes with Node.js)

### Installation

Follow these steps to set up and run the project:

1. **Clone the repository**

   Open your terminal and run:

   `npm install`

2. **Install Dependencies**

   On your terminal, run:

   `npm install`

3. **Set up Environment Variables**

   Check the env.example file for the necessary vairables. Create a .env file in the root of the project and populate it with the required variables.

4. **Start the application**

   Start the application by running in your terminal:

   `npm start`

### File Structure

The main file is index.tsx, which conglomerates every react functional component from the components and pages folders, along with every context.

### Edpoints

This application uses React-Router-Dom to create multiple views in a single-page-application:

1. **"/"**

   Home page route that renders the created tasks of the logged in user, fetched from the backend. Also shows a creation form for a new task, along with sorting methods.

2. **"/signup"**

   Registration page that allows the user to create an account with a unique email, a name and a password.

3. **"/login"**

   Login page that allows the user to login with their unique email and password. Send the information to the backend and receives a JWT to store in the localStorage.

4. **"/profile"**

   Profile edition page that renders a form so the user can change any of their fields, including email, password and name, while sending the current password for security purposes.
