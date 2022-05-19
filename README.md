# LingoThyme Note Taking
### Image Gallery: https://imgur.com/a/MPX5pLr
- - - -
## Summary 
LingoThyme Note Taking is an application that strives to help users come up with solutions to problems, responses to questions, and ideas. The application achieves this by fostering a collaborative learning environment. Users join private rooms, are given a question/problem to tackle, brainstorm as a team, and then write individual solutions whilst bouncing ideas off each other. At the end of the session, the administrator is sent a user friendly PDF of the session to their email which they can later forward to the participants.

While the startup LingoThyme is focused on helping its users learn written English in a collaborative fashion, the Note Taking application was abstracted from the main product due to the belief that it is a good tool to run small interactive group session that are not currently in the market.

## Tech Stack
* The MERN stack (MongoDB, Express, React, Node.js) was used for the overall web functionality.
* socket.IO was used to have the app built on an event-driven architecture in the web.
* Puppeteer was used to parse through the session at the end and convert it into a user friendly PDF.
* SendGrid/mail was used to send the PDF to the administrator of the session through email.
* Misc:
  * SSCC preprocessing was used isntead of CSS for styling.
  * node-schedule was used to check if any created rooms have been expired.
  * axios was used to send HTTP requests to the backend.

## Design Decisions
* ### Authentication
  * There are many different applications that broadly achieve the same thing that this application does - group collaboration. However, many of those applications also require all the participants to create an account. At the very minimum, the host is required to create an account. In all honesty, adding authentication to this app would not have been hard at all - spin up a firebase project and slap the auth onto the app. There was a big reason on why we chose to not implement authentication and it revolves around intent. Authentication should be used if there is sensitive data linked to users and while the sessions are sensitive data, creating an account for a single use/single purpose becomes cumbersome to the end user. Requiring authentication was bypassed by giving the administrator a private key to distinguish themselves from the users with the public key as well as sending the sensitive data (the session) to the administrator's email which is more secure and (should) have authentication implemented.
 
* ### Data Syncing
  * To have a fluid real-time event driven architecture, two things need to be done, data syncing with the other users and data syncing with the database. Data syncing with other users is needed to make sure that everyone is seeing the most up-to-date information from the other users. Data syncing with the database is needed to ensure the data is saved if a single user or all the users are dropped from the session. These two processes can get resource intensive very fast with the consideration for scaling. Do you sync to the database on every keystroke? Every 5 seconds? Every minute? Because servers don't have infinite resources (nor do we have infinite money), a balance needs to be achieved that can be both resource-efficient and often. As a result, this could get really complicated and be very optimized (look at how Google Documents chooses to sync data), we settled on the best solution that could be implemented in a short period of time. To begin, the application has a data syncing functionally similar to a client-server format mixed with a peer-to-peer format. The application will always designate a user (usually the admin) as the master. This user is delegated the responsibility of carrying the master version during the session - when the session is saved to the database, the masters version is used. This is done to offset some of the computing power from the servers to the clients. Because of that, the database is not up-to-date with the session in real time and will almost always have an out-of-date version of the session. The database mainly acts as a fail-safe in case every user is dropped from the session and for data processing after the session is over. This means that if a user joins midsession and syncs from the database, they will not have the most up-to-date info. That's why users sync from the master when they join the document.  

## Replicating Locally
To replicate this project locally to its full functionality, the following steps will need to be done.
1. Download the repository to your local system.
2. Open the command line and enter the project path
3. Download all backend dependencies through the command line with "npm i"
4. Traverse to the frontend folder through the command line with "cd ./client"
5. Download all frontend dependencies through the command line with "npm i"
6. Create a config.env file in the config file and enter some env variables
   * PORT = 5000
   * MONGO_URI = (YOUR_MONGO_ATLAS_URI_HERE)
   * SOCKET_ORIGIN = http://localhost:3000
   * SENDGRID_API_KEY = (YOUR_SENDGRID_API_KEY_HERE)
8. Run the backend by going to the main directory in the command line and entering "npm run start"
9. Run the frontend by going to the main directory in the command line and entering "npm run start"
   * Note: If the frontend doesn't work, you may need to add change the start script to be: "set NODE_OPTIONS=--openssl-legacy-provider && react-scripts start".

- - - -
Note: This project is no longer being contributed to.
