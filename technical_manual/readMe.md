<center>Table of Contents</center>
===
&nbsp;
## [1.Introduction](#1-introduction)
### [1.1 Overview](#11-overview-1)	
### [1.2 Business Context](#12-business-context-1)	
### [1.3 Intended Audience and Reading Suggestions](#13-intended-audience-and-reading-suggestions-1)
### [&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 1.3.1 Glossary](#131-glossary)
&nbsp;
## [2.System Architecture](#2-system-architecture)
### [2.1 ](#21-)	
### [2.2 ](#22-)						
### [2.3 ](#23-)
### [2.4 ](#24-)						
### [2.5 ](#25-)
### [2.6 ](#26-)
### [2.7 ](#27-)
&nbsp;
## [3. High-Level Design](#3-high-level-design-1)
### [3.1 Introduction](#-31-introduction)
### [3.2 Design Goal](#32-design-goal)
### [3.3 Architecture](#33-)
### [3.4 Use Cases](#-34-)
###  [3.4.1 Login](#-341-login)
###  [3.4.2 Add User](#-342-add-user)
###  [3.4.3 Combine](#-343-combine)
###  [3.4.4 Break](#-344-break)
###  [3.4.5 Delete](#-345-delete)
###  [3.4.6 User Profile](#-346-user-profile)
###  [3.4.7 Logout](#-347-logout)
### [3.5 User Flow Diagram](#-34-user-flow-diagram)
### [3.6 High Level Design Diagram](#-34-high-level-design-diagram)
### [3.7 Context Diagram](#-34-context-diagram)
### [3.8 Implementation Design](#-35-implementation-design)

&nbsp;
## [4. Problems and Resolution](#-4-problems-and-resolution)
### [4.1 Social Media API](#41-)
### [4.2 Design Decisions](#42-)
### [4.3 Server Client Communication](#43-)
### [4.4 Learing different coding languges](#44-)
## [5. Installation Guide](#-5-installation-guide)
### [5.1 Cross-Platform](#51-)
###	[ &nbsp; &nbsp; &nbsp; 5.1.1 Hardware](#511-)
### [&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 5.1.2 Software](#-512-)
### [&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 5.1.3 Version](#-513-)
### [5.2 Facebook/Google Login](#-52-)
###	[ &nbsp; &nbsp; &nbsp; 5.2.1 FaceBook](#521-)
### [&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 5.2.2 Google](#-522-)
&nbsp;
## [6. Maintenance](#-6-maintenance)
### [6.1 API](#-61-)
### [6.2 Server/Client ](#-62-)
### [6.3 Database](#-63-)
&nbsp;
## [7. Appendix](#-7-appendix-)
### [7.1 Appendix A: Resources](#-71-resources)
### [7.2 Appendix B: References](#-72-references)
       										 
&nbsp;

<center>1 Introduction</center>
===

### <center>1.1 Overview</center>

The product being developed is best described as a Messaging 
Application. It will allow people to link up their various social media 
chat client into one application. Members will be able accept
messages from various social medias in our application. They can then 
send one message, to another user that will send to all that users 
social media selected. The system was developed to serve the needs of 
people with limited time to check all their messaging services, 
this application helps satisfy that need. Various other functions are 
available, and these will be listed and explained more in depth later. 
For now, we have decided to use three social medias as the foundation of 
this app, however that number might increase depending on the API.s that 
we find.

Users will log into the our application using either facebook or google. when the user is logged in, they will face an empty chat lobby, where the user will be required to log into their prespective social media application. After logging into the application, they can select the chats that they want to import to our application.
This will be true too two social media platforms. facebook and Skype. Where the user has the control to merge and break group chats of the different social medias. An example would be where, i would add my friend Marin facebook and skype chat conversation into one, where the user will recieve messages from both platform in our application. Sending messages, the applicaton will defaultly respond with the same platform the message recieved was from.



### <center>1.2 Business Context</center>

There are four possible business contexts in relation to this product. 
These contexts are:

* *Selling the Application: The product could be sold in the electronic 
stores with a one-off payment.*

* *Buying the Application: Larger companies get in touch to buy the 
software.*
 
* *Advertising: The application can have a system for advertisement to 
develop, this can be generalized or targeted at specific users of the 
application. <br/>There is also the  possibility that bigger companies 
like facebook and instagram would want to collaborate with our 
application.*

* *Features: Application can have special features within, that can only 
be accessed through a subscription or a fee. *



### <center>1.3 Intended Audience and Reading Suggestions</center>

The Application is targeting anyone who has more than one social media 
platform that we have chosen, therefore the target audience is very 
broad. 
This document is targeted for computer science majors, developers, 
computer science lecturers or anyone that has an interest in application 
development.


### <center>1.3.1 Glossary</center>



* **PHP**: Recursive acronym for PHP Hypertext Processor. An open 
source, server-side, HTML embedded scripting language used to create 
dynamic Web pages. 

* **API**: In computer programming, an application programming interface 
(API) is a set of subroutine definitions, protocols, and tools for 
building application software. In general terms, it is a set of clearly 
defined methods of communication between various software components.

* **Material Design Framework**: It is a complete open-source SDK. A 
modern responsive front-end framework based on Material Design  Concept 
designed by Google. 

* **Server**: Sharing data or resources among multiple clients, or 
performing computation for a client, also this will be our personal 
server.

* **HTML**: Acronym for: Hypertext Markup Language. This is the 
authoring language used to create documents on the World Wide Web.
 
* **SQL**:An example of Associative Memory in Databases and the 
implications in terms of programming languages is SQL. In SQL, data is 
stored as tuples (rows) in relations (tables).

* **MySQL**:MySQL is an open-source relational database management 
system

* **Session**: The period of time a user interfaces with an application. 
The user session begins when the user accesses the application and ends 
when the user quits the application. This also refers to the amount of 
time a user uses a website for. The session starts once the user logs in 
and finishes when the user logs out.














<center>2	System Architecture</center>
===

### <center>2.1 </center>




### <center>2.2 </center>





### <center>2.3 </center>





### <center>2.4 /center>


 

### <center>2.5 </center>







### <center>2.6 </center>



### <center>2.7 </center>




<center>3 High-Level Design</center>
===


### <center>3.1 Introduction </center>

This part of the manual will explain the proposed design concepts of our messaging application "Cubik", diving into the goals and the different user cases we will explain how the application funtions with the many different diagrams. At the end of this section, readers will understand the different dynamics this application produces.


### <center>3.2 Design Goal </center>

The main features of this application is to combine the different social media messaging platform into one, where users can select their existing accounts, sending and recieveing messages from their various accounts into our application. Our goals can be identified as:
1.Add users chats from their favourite social medias into our platform.
2.Option to merge various social medias chats into one chat window.
3.Users have full control to combine or break their chat groups consisiting of different friends social medias.

### <center>3.3 Architecture </center>

The model of our application can be summarized with the diagram below, the server is in charge of authenticating users, and will only allow users logged in to use the application.
Once users are logged in, they will be given a certain token that identifies them, further into the application the users will be required to log into the various social medias, where certain tokens pertaining to that social media will allow the user to import their personal chats into our application.
![System Architecture Diagrams](SystemArchitectureDiagram.png "System Architecture Diagrams")

### <center>3.4 Use Cases </center>


## 3.4.1 Login

## 3.4.2 Add User

## 3.4.3 Combine

## 3.4.4 Break

## 3.4.5 Delete

## 3.4.6 User Profile

## 3.4.7 Logout

### <center>3.5 User Flow Diagram</center>

![User Flow Diagram](highleveldesigndiagram.png "High Level Design Diagram.png")


### <center> 3.6 High Level Design Diagram </center>
![High Level Design Diagram](highleveldesigndiagramp.png "High Level Design Diagram from our perspective")


### <center>3.7 Context Diagram </center>

![Context Diagram](contextdiagram.png "Context Diagram")


### <center>3.8 Implementation Design </center>


![Class Diagram](classdiagram.png "Class Diagram")



<center> 4	Problems and Resolutions </center>
===



### <center>4.1 Social Media API</center>

Social medias all have different API's, where initially the project was designed to include the most popular social media platforms like Facebook,Twitter,Instagram and Whatsupp. However after investigating the different platforms, we found each application had a different diffcult to use API's. Some API's didnt exist anymore, some were too decrecated to be used, others were not what our project covered and couldnt be used. Therefore we had to limit our scope to social media's that have working API's, that we could use in out project. After investigating the different API's we decided to use Facebook and Skype, since they were our best options. Even after using and coding the API's to work, problems still arised, especially when facebook changes something related to their features, the result is us changing the code to make it work again. 
There arnt alot of resources online to help develop and use API's, therefore we had to use our teamwork to continue building the necessary functionality.
If some problems arised with issues we didnt know how to deal with, we would ask our supervisor, Stephen Blotts, to help us make a decision.


### <center>4.2 Design Decisions</center>

Since the application was bulit using HTML/CSS and javascript, there were alot of libraries aviliable online to help design the application. 
After disccussing the possabilities with each other, we found using the new Materialze Library would be perfect, since its designed to be streamlined with efficiency and fluidity being the concepts behind the library.
However after encountering the different problems arising from a new library, and the small amount of documentation, we had to improvise with our own CSS, and javascript. Our design is aimed to reduce the dependancy of the library in our design, preferring to code our own design.
When it comes to difference of opinion in terms of design, we would usually discuess the pros and cons of each design, thinking about the user and the different hardware limitations and how it would affect the user experience. This method usually helped decide any differences we had, another solution we found was seeing how the well known social medias designed their chat application. Comparing the different designs and what we liked, we designed the chat application.
Our final phase of design, we asked different people to give use their experience using the application, and discuess how they felt about the design, changing a few things to depending on the feedback. 








## <center>4.3 Server Client Communication</center>


Setting up the server client communication, required some research on how it is set up. After setting up the communication, we needed to set up the database communication. Afterwards we needed to set up the authentication services for the different API's that we are using from the server side. we had to send to client service online status, so now they can use the system without breaking it,the problem is that if a user does before services are not registered, we ignore their token confirmation and they send it,
then our system sends them that we don't have a valid token, it's because we don't have the services which actually define the tokens
Therefore it can crash both ends if user tries to use the app immediately after the server is up, after services auth, it's safe to do so.
what else we can do to solve this problem is to give the client an user database ID so that token is not the only way they can authenticate.
However on one side of the coin this fixes the problem while leaving it more vunerable on the other as tokens are relatively harder to guess than users IDs but I suppose if we ignore security for now, we can make this run with less errors.



## <center>4.4 Learning different Coding Languages</center>

Since this project was mostly made with javascript, learning the new language and implementing advanced technologies was hard to learn. Using online resources helped resolve some problems, while some gave us enough guidance to get the code to work. 

<center> 5 Installation Guide</center>
===

### <center>5.1 Cross-Platform</center>
Our application will be crossplatformed, we will use electron to make our web based application into a multiplatform application.

### <center>5.1.1 Hardware</center>
Application Hardware Specification: 
<li>Server</li>
<li>Desktop/Laptop</li>
<li>Mobile Device</li> 

### <center>5.1.2 Software</center>


### <center>5.1.3 Versions</center>



### <center> 5.2 Facebook/Google Login </center>






### <center>5.2.1 FaceBook</center>




### <center> 5.2.2 Google</center>




<center> 6	Maintanince</center>
===



### <center> 6.1  API</center>




### <center> 6.2 Server/Client</center>




### <center> 6.3 Database</center>





<center> 7	Appendix </center>
===
	

### <center> 7.1 Resources</center>

www.draw.io
www.materializecss.com
www.mysql.com 
www.w3cschools.com

### <center> 7.2 References</center>

www.google.com 
www.computing.dcu.ie/~davids/CA326/