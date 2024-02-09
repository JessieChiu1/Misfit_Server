# Misfit Server

The server is hosted on Cyclic and will automatically redeploy when it detect changes to main. Workflow will be to work on new feature on branches and then merge with main after.

## Setting up .env file 
Your `.env` file should look something like this:
```
DB_URI=<MongoDB URI String with "/dev">
JWT_SECRET=<Some secret key use to hash your password>
AWS_BUCKET_NAME=
AWS_BUCKET_REGION=
AWS_ACCESS_KEY=
AWS_SECRET_KEY=
```

- You will get `DB_URI` from setting up your MongoDB Atlas
- `JWT_SECRET` is just a random string, you can put anything here 
- `AWS_BUCKET_NAME`/`AWS_BUCKET_REGION`/`AWS_ACCESS_KEY`/`AWS_SECRET_KEY` take info taken from the AWS S3 page

This will be in your `.gitignore`
```
/node_modules
.env
```

## Setting up MongoDB Atlas

[Tutorial](https://www.youtube.com/watch?v=084rmLU1UgA)

1. Signup/Login to [MongoDB](https://www.mongodb.com/).
2. Click `Build a Database` and choose the free option and just stick with the default
3. Create a **Username** and **Password** and write down the Password somewhere
4. At the bottom of the same page, you need to add an IP Address (Your IP Address from your computer)
5. Onces the Database is set up, under **Deployment - Databases**
    - click **Connect**
    - click **Connect your application**
    - copy your connection string, you will need to replace the **<username>** and **<password>** with the username and password from step 3
    - add this string to your `.env` file

## File structures and file you will need to create

    __test__                    # jest testing folder
    ├── __snapshot__
    │   └── app.test.js.snap    # app.js snapshot output
    ├── controllers
    │   ├── __snapshot__        # controllers function snapshot
    │   │   ├── auth.test.js.snap
    │   │   ├── post.test.js.snap
    │   │   └── user.test.js.snap
    │   ├── auth.test.js
    │   ├── post.test.js
    │   └── user.test.js
    └── app.test.js
    coverage                    # folder containing the jest coverage summary - meaning how much of the code did we test

    src
    ├── controllers             # all API call functions are stored here
    │   ├── auth.js
        └── photo.js               
        └── photoS3.js          # controllers function to interact with AWS S3 bucket
    │   ├── post.js
    │   └── user.js
    ├── middleware              # all middleware
    │   └── authenticate.js
    ├── models                  # schema
    │   ├── post.js
    │   └── user.js
    ├── routes                  # routing from express and redirection to controllers functions
    │   ├── auth.js
    │   ├── photo.js
        ├── post.js
    │   └── user.js
    └── app.js                  # entry point, DB and express setup


    .env
    .gitignore



## libraries and what they are
- `express` - framework for the Node.js backend. (Middleware, Routing, loading static files, error handling)
- `dotenv` - access your sensitive information from the `.env` file, things such as API key, secret key, password, and other sensitive information you don't want other to use
- `bcrypt` - used for securely hashing passwords, that's what the `SECRET_KEY` is for, a code to hash and un-hash the password for verification
- `jsonwebtoken`
    - authentication and authorization tool
    - consist of 3 part `<header>.<payload>.<signature>`
        - header consist of information about the type of token it is (JWT) and the signing algorithm used
        - payload is the actual information on the user but hashed
        - signature helps determined if the JWT is valid or not
    - [What is JWT and Why you Should Use a JWT - video](https://www.youtube.com/watch?v=7Q17ubqLfaM)
- `supertest` - will help test end-point 
- `jest` - test overall functionality
- `mongodb-memory-server` - to establish a empty mongodb shell for testing
- `aws-sdk` - to interact with AWS S3 storage
- `multer` - to handle image 

## Running the files:
1. `node server.js` - this will activate the DB and the backend port 3001
You should see something like this:
    ```
    listening
    connected to MongoDB @{some string.net}
    ```

## TODOs
- need to refactor the routes and controllers function:
    - I built the backend code before thinking deeply about what I want my frontend to be able to do so I created routes/controllers function based on what I think I need. As I flesh out the backend, I will need to rewrite the backend code.
- flesh out schemas
    - same issue: I create the schema without thinking too much about features. As I get a better sense of what features I want to include I will need to rewrite the schema
        - Tags
        - Better organize what type I need in post schema
        - user profile picture?
        - rewrite authenticate with OAuth with Gmail and add email field in user schema*
            - use email to sign in instead of username
 - rewrite Jest file
    - same issue: I have since edited the controller functions so I should rewrite the Jest test cases also
- **Future**
    - figure out a queuing system to handle a lot of requests to a single endpoint
    - figure out how to add a cooldown period to prevent DDOS attack
    - figure out optimization as I go
    - figure out how to make my backend more secure