# FootballProject
Project for the Iowa State football team. The goal is to create a platform that allows players and coaches to record and view workout data in order to better predict future performance. 

The web implemention of this platform will be built with the following stack.
* Database: MYSQL hosted on AWS
* Client Side: Javascript
* Web Server: Node.js with Express
* Front End: HTML5 (Bootstrap), CSS and EJS

Setup:

There is quite a bit of things that need to be setup in order to run the project locally. Luckily, it is not too hard :)

First, install node.js
* https://nodejs.org/en/download/

Once you have node.js installed, install express. Run this command in terminal (assuming mac)
* npm install express

Next, we need to you connected to the database. Install MySQLWorkbench
* https://dev.mysql.com/downloads/workbench/

Once this is done, we can now connect to the database. Click the '+' near MySQLConnections to add a new connection. 
Set the params as follows
* Database Name: whatever you want (mine is footballdb)
* Connection Method: Standard (TCP/IP)

* hostname : 'footballdb.cr1jtswtem4i.us-west-2.rds.amazonaws.com'
* username : 'masterUsername'
* password : 'HNuxJSEjqXUS!auk-eRV6CG8+!^JJAt2M?-Lc4y#+'

Be careful, you can now delete and destroy all of the work we have done :(

Neat, now we need to get the project. I use SourceTree for working with Git. I recommend installing this. 
* https://www.sourcetreeapp.com/

Now, open SourceTree. Go to File->New/Clone . Choose 'Clone from URL', and paste the url for the GitHub Repo (there is a little link for it on the main page). Choose where you want to save this repository too and bam.

Lastly, we need to open the code. I am using Webstorm, which is dope. You can signup for the student edition and its free.
* https://www.jetbrains.com/webstorm/

Open the code in WebStorm. Click the 'run' button on www located in the 'bin' folder. Now, go to your internet machine and type localhost:3000. You should see something. Weeee we did it.
