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

Once you have node.js installed, install express. Run this command in terminal (assuming mac) (may not be needed).
* npm install express

Next, we need to you connected to the database. Install MySQLWorkbench
* https://dev.mysql.com/downloads/workbench/

Once this is done, we can now connect to the database. Click the '+' near MySQLConnections to add a new connection. 
Set the params as follows. Once you get to this step, let me know because I need to add you as a valid IP address.
* Database Name: whatever you want (mine is footballdb)
* Connection Method: Standard (TCP/IP)

* hostname : 'footballdb.cr1jtswtem4i.us-west-2.rds.amazonaws.com'
* port     : 3306
* username : 'masterUsername'
* password : 'HNuxJSEjqXUS!auk-eRV6CG8+!^JJAt2M?-Lc4y#+'

Be careful, you can now delete and destroy all of the work we have done :(

Neat, now we need to get the project. I use SourceTree for working with Git. I recommend installing this. 
* https://www.sourcetreeapp.com/

Now, open SourceTree. Go to File->New/Clone . Choose 'Clone from URL', and paste the url for the GitHub Repo (there is a little link for it on the main page). Choose where you want to save this repository too and bam.

Lastly, we need to open the code. I am using Webstorm, which is dope. You can signup for the student edition and its free.
* https://www.jetbrains.com/webstorm/

Open the code in WebStorm. Click the 'run' button on www located in the 'bin' folder. Now, go to your internet machine and type localhost:3000. You should see something. Weeee we did it.



<% if(team_week_data.length > 0) {
                                    console.log("start");

                                    var m = 0;
                                        while(m < team_week_data[m].length){

                                    console.log("team week");

                                    var posAcuteLoad= 0;
                                    var pos_load_percentage = 0;
                                    var pos_acuteDuration = 0;
                                    var pos_rpeAVG = 0;
                                    var pos_avg = 0;
                                    var pos_chronic_load = 0;

                                %>

                                <tr>
                                    <td>Team</td>



                                    <%
                                        for(var jj = 0; jj < chronic_team.length; jj++)
                                        {
                                            if(chronic_team[jj].username == chronic_team[m].position)
                                            {
                                                pos_chronic_load = chronic_team[jj].chronicSum;
                                                pos_chronic_load = pos_chronic_load / chronic_team[jj].weekcount;
                                                pos_chronic_load = Math.round(pos_chronic_load);
                                                break;
                                            }
                                        }


                                    %>


                                    <% if(team_week_data[m].indexday == 1 && team_week_data[m].time == "AM"){
                                        pos_rpeAVG = pos_rpeAVG + team_week_data[m].pavg;
                                        pos_avg++;
                                        pos_acuteDuration = pos_acuteDuration + team_week_data[m].duration;
                                        posAcuteLoad = posAcuteLoad + (team_week_data[m].pavg * team_week_data[m].duration );
                                    %>

                                    <td><%= team_week_data[m].pavg %></td>
                                    <td> <%= team_week_data[m].duration %> </td>
                                    <td><%= (team_week_data[m].pavg * team_week_data[m].duration ) %></td>
                                    <%
                                        m = m+1;
                                    if(m == team_week_data.length)
                                    { %>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>


                                    <% pos_rpeAVG = pos_rpeAVG / pos_avg;
                                        pos_rpeAVG = Math.round(pos_rpeAVG * 10)/10; //nearest tenth
                                        pos_load_percentage = (posAcuteLoad / pos_chronic_load) * 100;
                                        pos_load_percentage = Math.round(pos_load_percentage * 10)/10; //nearest tenth
                                    %>

                                    <td><%= pos_rpeAVG%></td>
                                    <td><%= pos_acuteDuration%></td>
                                    <td><%= posAcuteLoad%></td>
                                    <td><%= pos_chronic_load%></td>
                                    <td><%= pos_load_percentage%>%</td>

                                    <% break; }


                                    }
                                    else{ %>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <% } %>

                                    <% if(team_week_data[m].indexday == 1 && team_week_data[m].time == "PM"){
                                        pos_rpeAVG = pos_rpeAVG + team_week_data[m].pavg;
                                        pos_avg++;
                                        pos_acuteDuration = pos_acuteDuration + team_week_data[m].duration;
                                        posAcuteLoad = posAcuteLoad + (team_week_data[m].pavg * team_week_data[m].duration );
                                    %>

                                    <td><%= team_week_data[m].pavg %></td>
                                    <td> <%= team_week_data[m].duration %> </td>
                                    <td><%= (team_week_data[m].pavg * team_week_data[m].duration ) %></td>
                                    <%
                                        m = m+1;
                                    if(m == team_week_data.length)
                                    { %>


                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <% pos_rpeAVG = pos_rpeAVG / pos_avg;
                                        pos_rpeAVG = Math.round(pos_rpeAVG * 10)/10; //nearest tenth
                                        pos_load_percentage = (posAcuteLoad / pos_chronic_load) * 100;
                                        pos_load_percentage = Math.round(pos_load_percentage * 10)/10; //nearest tenth
                                    %>

                                    <td><%= pos_rpeAVG%></td>
                                    <td><%= pos_acuteDuration%></td>
                                    <td><%= posAcuteLoad%></td>
                                    <td><%= pos_chronic_load%></td>
                                    <td><%= pos_load_percentage%>%</td>

                                    <% break; }


                                    }
                                    else{ %>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <% } %>





                                    <% if(team_week_data[m].indexday == 2 && team_week_data[m].time == "AM"){
                                        pos_rpeAVG = pos_rpeAVG + team_week_data[m].pavg;
                                        pos_avg++;
                                        pos_acuteDuration = pos_acuteDuration + team_week_data[m].duration;
                                        posAcuteLoad = posAcuteLoad + (team_week_data[m].pavg * team_week_data[m].duration );
                                    %>

                                    <td><%= team_week_data[m].pavg %></td>
                                    <td> <%= team_week_data[m].duration %> </td>
                                    <td><%= (team_week_data[m].pavg * team_week_data[m].duration ) %></td>
                                    <%
                                        m = m+1;
                                    if(m == team_week_data.length)
                                    { %>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>



                                    <% pos_rpeAVG = pos_rpeAVG / pos_avg;
                                        pos_rpeAVG = Math.round(pos_rpeAVG * 10)/10; //nearest tenth
                                        pos_load_percentage = (posAcuteLoad / pos_chronic_load) * 100;
                                        pos_load_percentage = Math.round(pos_load_percentage * 10)/10; //nearest tenth
                                    %>

                                    <td><%= pos_rpeAVG%></td>
                                    <td><%= pos_acuteDuration%></td>
                                    <td><%= posAcuteLoad%></td>
                                    <td><%= pos_chronic_load%></td>
                                    <td><%= pos_load_percentage%>%</td>




                                    <% break;}


                                    }
                                    else{ %>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <% } %>





                                    <% if(team_week_data[m].indexday == 2 && team_week_data[m].time == "PM"){
                                        pos_rpeAVG = pos_rpeAVG + team_week_data[m].pavg;
                                        pos_avg++;
                                        pos_acuteDuration = pos_acuteDuration + team_week_data[m].duration;
                                        posAcuteLoad = posAcuteLoad + (team_week_data[m].pavg * team_week_data[m].duration );
                                    %>

                                    <td><%= team_week_data[m].pavg %></td>
                                    <td> <%= team_week_data[m].duration %> </td>
                                    <td><%= (team_week_data[m].pavg * team_week_data[m].duration ) %></td>
                                    <%
                                        m = m+1;
                                    if(m == team_week_data.length)
                                    { %>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>



                                    <% pos_rpeAVG = pos_rpeAVG / pos_avg;
                                        pos_rpeAVG = Math.round(pos_rpeAVG * 10)/10; //nearest tenth
                                        pos_load_percentage = (posAcuteLoad / pos_chronic_load) * 100;
                                        pos_load_percentage = Math.round(pos_load_percentage * 10)/10; //nearest tenth
                                    %>

                                    <td><%= pos_rpeAVG%></td>
                                    <td><%= pos_acuteDuration%></td>
                                    <td><%= posAcuteLoad%></td>
                                    <td><%= pos_chronic_load%></td>
                                    <td><%= pos_load_percentage%>%</td>




                                    <% break;}


                                    }
                                    else{ %>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <% } %>




                                    <% if(team_week_data[m].indexday == 3 && team_week_data[m].time == "AM"){
                                        pos_rpeAVG = pos_rpeAVG + team_week_data[m].pavg;
                                        pos_avg++;
                                        pos_acuteDuration = pos_acuteDuration + team_week_data[m].duration;
                                        posAcuteLoad = posAcuteLoad + (team_week_data[m].pavg * team_week_data[m].duration );
                                    %>

                                    <td><%= team_week_data[m].pavg %></td>
                                    <td> <%= team_week_data[m].duration %> </td>
                                    <td><%= (team_week_data[m].pavg * team_week_data[m].duration ) %></td>
                                    <%
                                        m = m+1;
                                    if(m == team_week_data.length)
                                    { %>


                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>




                                    <% pos_rpeAVG = pos_rpeAVG / pos_avg;
                                        pos_rpeAVG = Math.round(pos_rpeAVG * 10)/10; //nearest tenth
                                        pos_load_percentage = (posAcuteLoad / pos_chronic_load) * 100;
                                        pos_load_percentage = Math.round(pos_load_percentage * 10)/10; //nearest tenth
                                    %>

                                    <td><%= pos_rpeAVG%></td>
                                    <td><%= pos_acuteDuration%></td>
                                    <td><%= posAcuteLoad%></td>
                                    <td><%= pos_chronic_load%></td>
                                    <td><%= pos_load_percentage%>%</td>


                                    <% break;}


                                    }
                                    else{ %>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <% } %>



                                    <% if(team_week_data[m].indexday == 3 && team_week_data[m].time == "PM"){
                                        pos_rpeAVG = pos_rpeAVG + team_week_data[m].pavg;
                                        pos_avg++;
                                        pos_acuteDuration = pos_acuteDuration + team_week_data[m].duration;
                                        posAcuteLoad = posAcuteLoad + (team_week_data[m].pavg * team_week_data[m].duration );
                                    %>

                                    <td><%= team_week_data[m].pavg %></td>
                                    <td> <%= team_week_data[m].duration %> </td>
                                    <td><%= (team_week_data[m].pavg * team_week_data[m].duration ) %></td>
                                    <%
                                        m = m+1;
                                    if(m == team_week_data.length)
                                    { %>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>



                                    <% pos_rpeAVG = pos_rpeAVG / pos_avg;
                                        pos_rpeAVG = Math.round(pos_rpeAVG * 10)/10; //nearest tenth
                                        pos_load_percentage = (posAcuteLoad / pos_chronic_load) * 100;
                                        pos_load_percentage = Math.round(pos_load_percentage * 10)/10; //nearest tenth
                                    %>

                                    <td><%= pos_rpeAVG%></td>
                                    <td><%= pos_acuteDuration%></td>
                                    <td><%= posAcuteLoad%></td>
                                    <td><%= pos_chronic_load%></td>
                                    <td><%= pos_load_percentage%>%</td>


                                    <% break;}


                                    }
                                    else{ %>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <% } %>




                                    <% if(team_week_data[m].indexday == 4 && team_week_data[m].time == "AM"){
                                        pos_rpeAVG = pos_rpeAVG + team_week_data[m].pavg;
                                        pos_avg++;
                                        pos_acuteDuration = pos_acuteDuration + team_week_data[m].duration;
                                        posAcuteLoad = posAcuteLoad + (team_week_data[m].pavg * team_week_data[m].duration );
                                    %>

                                    <td><%= team_week_data[m].pavg %></td>
                                    <td> <%= team_week_data[m].duration %> </td>
                                    <td><%= (team_week_data[m].pavg * team_week_data[m].duration ) %></td>
                                    <%
                                        m = m+1;
                                    if(m == team_week_data.length)
                                    { %>


                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>



                                    <% pos_rpeAVG = pos_rpeAVG / pos_avg;
                                        pos_rpeAVG = Math.round(pos_rpeAVG * 10)/10; //nearest tenth
                                        pos_load_percentage = (posAcuteLoad / pos_chronic_load) * 100;
                                        pos_load_percentage = Math.round(pos_load_percentage * 10)/10; //nearest tenth
                                    %>

                                    <td><%= pos_rpeAVG%></td>
                                    <td><%= pos_acuteDuration%></td>
                                    <td><%= posAcuteLoad%></td>
                                    <td><%= pos_chronic_load%></td>
                                    <td><%= pos_load_percentage%>%</td>

                                    <% break;}


                                    }
                                    else{ %>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <% } %>




                                    <% if(team_week_data[m].indexday == 4 && team_week_data[m].time == "PM"){
                                        pos_rpeAVG = pos_rpeAVG + team_week_data[m].pavg;
                                        pos_avg++;
                                        pos_acuteDuration = pos_acuteDuration + team_week_data[m].duration;
                                        posAcuteLoad = posAcuteLoad + (team_week_data[m].pavg * team_week_data[m].duration );
                                    %>

                                    <td><%= team_week_data[m].pavg %></td>
                                    <td> <%= team_week_data[m].duration %> </td>
                                    <td><%= (team_week_data[m].pavg * team_week_data[m].duration ) %></td>
                                    <%
                                        m = m+1;
                                    if(m == team_week_data.length)
                                    { %>


                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>



                                    <% pos_rpeAVG = pos_rpeAVG / pos_avg;
                                        pos_rpeAVG = Math.round(pos_rpeAVG * 10)/10; //nearest tenth
                                        pos_load_percentage = (posAcuteLoad / pos_chronic_load) * 100;
                                        pos_load_percentage = Math.round(pos_load_percentage * 10)/10; //nearest tenth
                                    %>

                                    <td><%= pos_rpeAVG%></td>
                                    <td><%= pos_acuteDuration%></td>
                                    <td><%= posAcuteLoad%></td>
                                    <td><%= pos_chronic_load%></td>
                                    <td><%= pos_load_percentage%>%</td>

                                    <% break;}


                                    }
                                    else{ %>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <% } %>


                                    <% if(team_week_data[m].indexday == 5 && team_week_data[m].time == "AM"){
                                        pos_rpeAVG = pos_rpeAVG + team_week_data[m].pavg;
                                        pos_avg++;
                                        pos_acuteDuration = pos_acuteDuration + team_week_data[m].duration;
                                        posAcuteLoad = posAcuteLoad + (team_week_data[m].pavg * team_week_data[m].duration );
                                    %>

                                    <td><%= team_week_data[m].pavg %></td>
                                    <td> <%= team_week_data[m].duration %> </td>
                                    <td><%= (team_week_data[m].pavg * team_week_data[m].duration ) %></td>
                                    <%
                                        m = m+1;
                                    if(m == team_week_data.length)
                                    { %>


                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>


                                    <% pos_rpeAVG = pos_rpeAVG / pos_avg;
                                        pos_rpeAVG = Math.round(pos_rpeAVG * 10)/10; //nearest tenth
                                        pos_load_percentage = (posAcuteLoad / pos_chronic_load) * 100;
                                        pos_load_percentage = Math.round(pos_load_percentage * 10)/10; //nearest tenth
                                    %>

                                    <td><%= pos_rpeAVG%></td>
                                    <td><%= pos_acuteDuration%></td>
                                    <td><%= posAcuteLoad%></td>
                                    <td><%= pos_chronic_load%></td>
                                    <td><%= pos_load_percentage%>%</td>


                                    <% break;}


                                    }
                                    else{ %>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <% } %>




                                    <% if(team_week_data[m].indexday == 5 && team_week_data[m].time == "PM"){
                                        pos_rpeAVG = pos_rpeAVG + team_week_data[m].pavg;
                                        pos_avg++;
                                        pos_acuteDuration = pos_acuteDuration + team_week_data[m].duration;
                                        posAcuteLoad = posAcuteLoad + (team_week_data[m].pavg * team_week_data[m].duration );
                                    %>

                                    <td><%= team_week_data[m].pavg %></td>
                                    <td> <%= team_week_data[m].duration %> </td>
                                    <td><%= (team_week_data[m].pavg * team_week_data[m].duration ) %></td>
                                    <%
                                        m = m+1;
                                    if(m == team_week_data.length)
                                    { %>


                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>



                                    <% pos_rpeAVG = pos_rpeAVG / pos_avg;
                                        pos_rpeAVG = Math.round(pos_rpeAVG * 10)/10; //nearest tenth
                                        pos_load_percentage = (posAcuteLoad / pos_chronic_load) * 100;
                                        pos_load_percentage = Math.round(pos_load_percentage * 10)/10; //nearest tenth
                                    %>

                                    <td><%= pos_rpeAVG%></td>
                                    <td><%= pos_acuteDuration%></td>
                                    <td><%= posAcuteLoad%></td>
                                    <td><%= pos_chronic_load%></td>
                                    <td><%= pos_load_percentage%>%</td>


                                    <% break;}


                                    }
                                    else{ %>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <% } %>


                                    <% if(team_week_data[m].indexday == 6 && team_week_data[m].time == "AM"){
                                        pos_rpeAVG = pos_rpeAVG + team_week_data[m].pavg;
                                        pos_avg++;
                                        pos_acuteDuration = pos_acuteDuration + team_week_data[m].duration;
                                        posAcuteLoad = posAcuteLoad + (team_week_data[m].pavg * team_week_data[m].duration );
                                    %>

                                    <td><%= team_week_data[m].pavg %></td>
                                    <td> <%= team_week_data[m].duration %> </td>
                                    <td><%= (team_week_data[m].pavg * team_week_data[m].duration ) %></td>
                                    <%
                                        m = m+1;
                                    if(m == team_week_data.length)
                                    { %>


                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>


                                    <% pos_rpeAVG = pos_rpeAVG / pos_avg;
                                        pos_rpeAVG = Math.round(pos_rpeAVG * 10)/10; //nearest tenth
                                        pos_load_percentage = (posAcuteLoad / pos_chronic_load) * 100;
                                        pos_load_percentage = Math.round(pos_load_percentage * 10)/10; //nearest tenth
                                    %>

                                    <td><%= pos_rpeAVG%></td>
                                    <td><%= pos_acuteDuration%></td>
                                    <td><%= posAcuteLoad%></td>
                                    <td><%= pos_chronic_load%></td>
                                    <td><%= pos_load_percentage%>%</td>


                                    <% break;}


                                    }
                                    else{ %>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <% } %>


                                    <% if(team_week_data[m].indexday == 6 && team_week_data[m].time == "PM"){
                                        pos_rpeAVG = pos_rpeAVG + team_week_data[m].pavg;
                                        pos_avg++;
                                        pos_acuteDuration = pos_acuteDuration + team_week_data[m].duration;
                                        posAcuteLoad = posAcuteLoad + (team_week_data[m].pavg * team_week_data[m].duration );
                                    %>

                                    <td><%= team_week_data[m].pavg %></td>
                                    <td> <%= team_week_data[m].duration %> </td>
                                    <td><%= (team_week_data[m].pavg * team_week_data[m].duration ) %></td>
                                    <%
                                        m = m+1;
                                    if(m == team_week_data.length)
                                    { %>


                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>



                                    <% pos_rpeAVG = pos_rpeAVG / pos_avg;
                                        pos_rpeAVG = Math.round(pos_rpeAVG * 10)/10; //nearest tenth
                                        pos_load_percentage = (posAcuteLoad / pos_chronic_load) * 100;
                                        pos_load_percentage = Math.round(pos_load_percentage * 10)/10; //nearest tenth
                                    %>

                                    <td><%= pos_rpeAVG%></td>
                                    <td><%= pos_acuteDuration%></td>
                                    <td><%= posAcuteLoad%></td>
                                    <td><%= pos_chronic_load%></td>
                                    <td><%= pos_load_percentage%>%</td>


                                    <% break;}


                                    }
                                    else{ %>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <% } %>



                                    <% if(team_week_data[m].indexday == 7 && team_week_data[m].time == "AM"){
                                        pos_rpeAVG = pos_rpeAVG + team_week_data[m].pavg;
                                        pos_avg++;
                                        pos_acuteDuration = pos_acuteDuration + team_week_data[m].duration;
                                        posAcuteLoad = posAcuteLoad + (team_week_data[m].pavg * team_week_data[m].duration );
                                    %>

                                    <td><%= team_week_data[m].pavg %></td>
                                    <td> <%= team_week_data[m].duration %> </td>
                                    <td><%= (team_week_data[m].pavg * team_week_data[m].duration ) %></td>
                                    <%
                                        m = m+1;
                                    if(m == team_week_data.length)
                                    { %>

                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>

                                    <%
                                        pos_rpeAVG = pos_rpeAVG / pos_avg;
                                        pos_rpeAVG = Math.round(pos_rpeAVG * 10)/10; //nearest tenth
                                        pos_load_percentage = (posAcuteLoad / pos_chronic_load) * 100;
                                        pos_load_percentage = Math.round(pos_load_percentage * 10)/10; //nearest tenth
                                    %>

                                    <td><%= pos_rpeAVG%></td>
                                    <td><%= pos_acuteDuration%></td>
                                    <td><%= posAcuteLoad%></td>
                                    <td><%= pos_chronic_load%></td>
                                    <td><%= pos_load_percentage%>%</td>


                                    <% break; }


                                    }
                                    else{
                                    %>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <% } %>



                                    <% if(team_week_data[m].indexday == 7 && team_week_data[m].time == "PM"){
                                        pos_rpeAVG = pos_rpeAVG + team_week_data[m].pavg;
                                        pos_avg++;
                                        pos_acuteDuration = pos_acuteDuration + team_week_data[m].duration;
                                        posAcuteLoad = posAcuteLoad + (team_week_data[m].pavg * team_week_data[m].duration );
                                    %>

                                    <td><%= team_week_data[m].pavg %></td>
                                    <td> <%= team_week_data[m].duration %> </td>
                                    <td><%= (team_week_data[m].pavg * team_week_data[m].duration ) %></td>
                                    <%
                                        m = m+1;
                                    if(m == team_week_data.length)
                                    {
                                        pos_rpeAVG = pos_rpeAVG / pos_avg;
                                        pos_rpeAVG = Math.round(pos_rpeAVG * 10)/10; //nearest tenth
                                        pos_load_percentage = (posAcuteLoad / pos_chronic_load) * 100;
                                        pos_load_percentage = Math.round(pos_load_percentage * 10)/10; //nearest tenth
                                    %>

                                    <td><%= pos_rpeAVG%></td>
                                    <td><%= pos_acuteDuration%></td>
                                    <td><%= posAcuteLoad%></td>
                                    <td><%= pos_chronic_load%></td>
                                    <td><%= pos_load_percentage%>%</td>


                                    <% break; }


                                    }
                                    else{
                                    %>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <% } %>


                                    <%
                                        pos_rpeAVG = pos_rpeAVG / pos_avg;
                                        pos_rpeAVG = Math.round(pos_rpeAVG * 10)/10; //nearest tenth

                                        pos_load_percentage = (posAcuteLoad / pos_chronic_load) * 100;
                                        pos_load_percentage = Math.round(pos_load_percentage * 10)/10; //nearest tenth
                                    %>

                                    <td><%= pos_rpeAVG%></td>
                                    <td><%= pos_acuteDuration%></td>
                                    <td><%= posAcuteLoad%></td>
                                    <td><%= pos_chronic_load%></td>
                                    <td><%= pos_load_percentage%>%</td>




                                </tr>








                                <% } %>
                                <% } %>