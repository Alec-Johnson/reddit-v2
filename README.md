
# Reddit v2
A fullstack clone of the website www.reddit.com. Users can expect to create an account if they wish to create/interact with a post in any fashion or to create a subreddit.


## Tech Stack

**Frontend:** Typescript, React, Next.js, Redux, TailwindCSS,

**Backend:** Typescript, Node.js, Express, TypeORM, PostgreSQL

### Why 
Typescript: Type safety and more robust code, overall improves the developer workflow and productivity.

Next.js: The out of the box server side rendering capabilites will allow us to send less code to the user, which makes the app faster. More SEO friendly, we want our posts to be indexed by search engines for better discoverability for example.

Express: Web framework of choice, to handle all the routes for the API and pages. Can add middleware to operate on the server side.

TypeORM: Works with SQL based database nicely (PostgreSQL), very easy to use with Typescript.
## Authentication flow
### Registration
Grabs the email, username, and password from the request body. Check to see if the username or email already exists in DB. Validate the User object. If no errors save the user to the DB 

**class-validator:** Makes sure User object is valid based on the decorators passed to the User entity (isEmail: email, Length: username, password).

### Login
Generate a JSON web token when login is successful. This is stored on the users machine and used to lets the server know the user is logged in on this machine. Store this token inside a cookie and send to the User, this user will then use the cookie in subsequent requests to identify them.

**Cookie-parser:** Middleware that lets express take cookies from the request and store in a object

### Me
User makes a GET request once logged in and verifies they are authenticated.

**JsonWebToken:** Grab token from the Request object, verify that the token is correct based on the username, if true return the user.

## Database
https://drawsql.app/a-32/diagrams/reddit-clone-postgresql/embed
