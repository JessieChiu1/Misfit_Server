# Misfit Server

## Setting up .env file 
Your `.env` file should look something like this:
```
DB_URI=<MongoDB URI String with "/dev">
JWT_SECRET=<Some secret key use to hash your password>
```

- You will get `DB_URI` from setting up your MongoDB Atlas
- `JWT_SECRET` is just a random string, you can put anything here 

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
- `__test__` jest testing folder
    - `controllers` 
        - `auth.test.js` 
        - `post.test.js`
        - `user.test.js`
    - `app.test.js`
- `coverage` - folder containing the jest summary
- `src` 
    - `config` database connection configuration
        - `db.js` mongodb connection file
    - `controllers` all api call functions are store here
        - `auth.js`
        - `post.js`
        - `user.js`
    - `models` - schema
        - `post.js`
        - `user.js`
    - `routes` routing from express and redirect to controllers functions
        - `auth.js`
        - `post.js`
        - `user.js`
    - `app.js` express and middleware
    - `server.js` entry point that activate the mongodb connection promise in `config/db.js`
- `.env`
- `.gitignore`

## libraries and what they are
- `express` - framework for the Node.js backend. (Middleware, Routing, loading static files, error handling)
- `dotenv` - access your sensitive information from the `.env` file, things such as API key, secret key, password, and other sensitive informations you don't want other to use
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

```
npm install express
npm install dotenv
npm install bcrypt
npm install jsonwebtoken
npm install morgan
npm install supertest --save-dev
npm install --save-dev jest
npm install mongodb-memory-server --save-dev
```

## Running the files:
1. `node server.js` - this will activate the DB and the backend port 3001
You should see something like this:
    ```
    listening
    connected to MongoDB @ac-nr0bkff-shard-00-01.awn8gnn.mongodb.net
    ```
