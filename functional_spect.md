Table of Contents


1.Introduction
1.1 Purpose
1.2 Business Context
1.3 Intended Audience and Reading Suggestions
 1.3.1 Glossary


2.General Description

2.1 System Functions

2.2 User characteristics and Objectives
2.3 Operational Scenarios
2.4 Design and Implementation Constraints
2.5 Operating Environment
2.6 User Documentation
2.7 Assumptions and Dependencies

3. Functional Requirement

3.1 Sign Up/Register

3.2 Sign In
3.3 Chat Lobby
3.4 Profile
3.5 Upload Image
3..6 Add/Remove Chats
3..7 Log into different social media&#39;s
3.8  Merge/Break Chats
3.9 Messaging

3.10 Log Out

4. System Architecture

4.1 System Architecture Diagram
4.2 Website
4.3 PHP API
4.4 Database

5. High-Level Design

5.1 Design Overview
5.2 High Level Description
 5.2.1 High Level Design Diagram

5.2.2 High Level Design Diagram (from our perspective)

5.3 Context Diagram


6. Schedule


6.1 Overview of Preliminary Schedule

6.2 Task List
6.3 Task Tracker

7. Appendix

7.1 Appendix A:  Resources

7.2 Appendix B: References


1        INTRODUCTION

1.1 Purpose

The product being developed is best described as an Messaging 
Application. It will allow people to link up their various social media 
chat feature into one application. Members will be able receive and send 
messages from various social medias in our application. They can then 
send one message, to another user that will send to all that users 
social media selected. The system was developed to serve the needs of 
people with limited time to check all their messaging social 
media&#39;s, this application helps satisfy that need. Various other 
functions are available, and these will be listed and explained more in 
depth later. For now, we have decided to use three social medias as the 
foundation of this app, however that number might increase depending on 
the API&#39;s that we find, please note that this is still in the early 
stage.

1.2 Business Context

There are four possible business contexts in relation to this product. 
These contexts are:

.Selling the Application: The product could be sold in the electronic 
stores with a one-off payment.

.Buying the Application: Larger companies get in touch to buy the 
software.


.Advertising: The application can have a system for advertisement to 
develop, this can be generalized or targeted at specific users of the 
application.

There is also the  possibility that bigger companies like facebook and 
instagram would want to collaborate with our application.

.Features: Application can have special features within, that can only 
be accessed through a subscription or a fee.

1.3 Intended Audience and Reading Suggestions

The Application is targeting anyone who has more than one social media 
platform that we have chosen, therefore the target audience is very 
broad.
This document is targeted for computer science majors, developers, 
computer science lecturers or anyone that has an interest in application 
development. We suggest people read the document from the beginning to 
end, however the table of content is there for anyone who has an 
interest in certain sections of the document.
The document has several words that are related to the technological 
aspect of the application and therefore we will provide a glossary for 
keywords in this document.

1.3.1 Glossary

.PHP: Recursive acronym for PHP Hypertext Processor. An open source, 
server-side, HTML embedded scripting language used to create dynamic Web 
pages.

. API: In computer programming, an application programming interface 
(API) is a set of subroutine definitions, protocols, and tools for 
building application software. In general terms, it is a set of clearly 
defined methods of communication between various software components.

.Material Design Framework: It is a complete open-source SDK. A modern 
responsive front-end framework based on Material Design  Concept 
designed by Google.

. Server: Sharing data or resources among multiple clients, or 
performing computation for a client, also this will be our personal 
server.

. HTML: Acronym for: Hypertext Markup Language. This is the authoring 
language used to create documents on the World Wide Web.

. SQL:An example of Associative Memory in Databases and the implications 
in terms of programming languages is SQL. In SQL, data is stored as 
tuples (rows) in relations (tables).

. MYSQL:MySQL is an open-source relational database management system

. Session: The period of time a user interfaces with an application. The 
user session begins when the user accesses the application and ends when 
the user quits the application. This also refers to the amount of time a 
user uses a website for. The session starts once the user logs in and 
finishes when the user logs out.

2        GENERAL DESCRIPTION

2.1 System Functions

Since our project is a messaging application, it will have several 
functions which will be briefly touched upon in this section. Starting 
up the application users will need to go through a process. We will 
outline the general process below:

 . Register ~ New users are required to register to access the 
application.

 . Log In ~ Users logging in with their username and password will be 
directed to their main        chat lobby.

. Create Profile ~ Upon registering, users will be able to make their 
profile.

. Upload Image(s) ~ Users will be assigned the default picture, however 
they are able to upload an image for their profile picture at any point 
in time.

. Add/Remove Chats ~ Selecting the add feature in the application, the 
users are given choices of social media to log into, where they are then 
told to highlight the user they wish to add to the application. An 
option to remove friends is also available if they choose to delete 
their chat.

 . Merge/break ~ Clicking on the friends chat profile, users are given 
the choice to merge or break the chats that they have in their chat 
lobby.

2.2 User Characteristics and Objectives

The application is cross-platform and therefore will be accessible to 
any user with access to the internet. Since the target audience is 
anyone with more than one social media, it will be too broad to specify 
a specific age group or gender.
As the application will be hosted cross-platform, the product is 
accessible to anybody access to the Internet. The target audience will 
be anyone with the social medias we choose to implement. The application 
interface will be able to accommodate users with little or no knowledge 
of computing,however a user guide/video will be provided for people who 
have difficulty with technology.

2.3 Operational Scenarios

Due to the design of our application, there will be different scenarios 
under which the application will have to perform, below will be the 
different scenarios:

. Unregistered User: The unregistered user will have to register with 
our application to be able to enter the application, they will be able 
to register on their mobile devices or through the internet.

. Registered User (not logged in): The registered user, will also have 
to log in assuming that they logged out when they used the application 
last.

. Registered User (logged in):In this scenario we are assuming the user 
has registered and logged in before, and has not logged out, this will 
direct the user directly to his chat lobby, using the application fully.

.Edit Profile- Allows a logged in/registered user to update their 
personal profile with a small bio and the ability to upload a picture.

.Upload Images- You can add an image to your profile.

. Add/Remove Chats- Each user will be able to add their chats they have 
had with friends from different social medias, they can easily remove 
their chats as well.

.Log in different social medias: After activating the Add feature, users 
will be required to log into their perspective social medias, and select 
the chats that they wish to import to our application

. Merge/Break chats: This is one of the main features of the 
application, users can merge existing chats into one. They will also be 
able to reverse it with the break feature.

.Log Out- Users will also have the option to log out of their 
application, since its cross platform, having this feature ensure a 
secure closed session.

2.4 Design and Implementation Constraints

Since this is a messaging application data input and output is 
essential, therefore using a database is crucial and with that memory 
becomes a problem. Since we are using MYSQL account, we have limited 
scalability with our project. For the early stages of the application 
development it will not be a problem however as we increase social 
medias and have more users, database management significance will 
increase.

Since this project has a time constraint, the application will implement 
three social medias for the users, as the project evolve more API&#39;s 
are estimated to be added. However with our initial research, finding 
companies with good API&#39;s that are not deprecated will be the major 
concern and therefore getting into contact with companies to have some 
sort of collaboration will be essential for the growth of the 
application.

2.5 Operating Environment

Since the application is cross-platform, it can be accessed through any 
device with internet access.

2.6 User Documentation

We hope to provide the user with a guide on how the application works, 
either in the form of a video tutorial or a set of instructions within 
the application.

2.7 Assumption and Dependencies

The application depends on the API of the social medias we choose, 
therefore if the API is deprecated we would need to readjust the code, 
preventing it from crashing.  The application also requires users 
logging into their different social media to access their messaging 
application, therefore if the user forgets their password, it will limit 
their access in the application.

3        Functional Requirement

3.1 Sign Up/Register

**Description**

When using the application, there is button for the user to register, 
this is the first step new users need to make to become a member. Once 
the button is clicked users will be redirected to the registration part 
of the application where they will need to input some essential 
information, like their username and password. After completing this 
step users will be sent back to the main log in section of the 
application

**Criticality**

This is a critical step for new users to the application, without it 
users will not be able to proceed further into the application.

**Technical Issues**

The registration process will be handled by the ionic framework used for 
this project, also a database will be implemented to save certain pieces 
of information pertaining to the user.

**Dependencies**

 Users have to create strong credentials both for remembering and for 
protection.

3.2 Sign In

**Description**

This is considered the second step of the process, users need to input 
their registered username and password to enter the main features of the 
application.

**Criticality**

The process is critical for people who are either first-timers when it 
comes to logging in or users who logged out when using the application 
before and would need to sign in again.

**Technical Issues**

Username and password is stored in our SQL database, technically making 
sure it&#39;s working properly would be the only technical issue. Users 
who forget their password have the option to get their password sent to 
them via email.

Making the session cookie secure enough to let the user continue a 
session.

**Dependencies**

Users username and password.

3.3 Chat Lobby

**Description**

The main part of the application, the chat lobby displays all the 
options the user has, including visually seeing the chats that already 
exist. User can navigate to any part of the application in this section.

**Criticality**

Without this function, users won&#39;t be able to access any other part 
of the application.

**Technical Issues**

Since the application is cross platform, it means we have to make it 
consistent across all devices, so that the design is fluid and 
materialized while keeping the same functionality.

**Dependencies**

 Software developers fixing bugs when they appear, because of the 
different devices with different resolutions constantly appearing on the 
market.

3.4 Profile

**Description**

Users have the option to alter their profile, once clicked upon users 
can add a small bio and have the ability to upload an image as their 
profile picture. This part of the application isn&#39;t mandatory, if 
users ignore this section they will have a default image as their 
profile picture and their bios will be empty.

**Criticality**

Not critical to the usage of the application.

**Technical Issues**

 Styling it to user&#39;s preference.

**Dependencies**

Users willingness to alter their profile.

3.5 Upload Image

**Description**

This function allows the user to add an image to their profile. This 
will allow the user to browse folders on their device and upload the 
selected image.

**Criticality**

This function is not essential, it is up to the user. However if they do 
want to upload a picture, we need their permission to access their 
library if they are using it on a mobile device.

**Technical Issues**

 It is quite difficult to get cross platform image upload while keeping 
the fundamental design the same.

**Dependencies**

Users permission to access their devices library.

3.6 Add/Remove chat

**Description**

A function that allows users to import their social media&#39;s chats to 
the application. There will also be an option to remove existing chats.

**Criticality**

This function is critical to the application, as this is the main 
feature and premise the application is built.

**Technical Issues**

The API&#39;s of the social media the users selects haven&#39;t 
deprecated, allowing us access to their chats. Importing the data 
successfully.

**Dependencies**

Depends on the Social medias API&#39;s.

3.7 Log into different social media&#39;s

**Description**

When using the add/remove friends feature of the application, users are 
required to log into that social media before selecting the chats they 
want to import to the application.

**Criticality**

We need this function to access their social medias. It can also be seen 
as needing the users permission to import their chats to the 
application.

**Technical Issues**

Users need to be able to log into their social medias, handling the 
username and password would not be in our hands.

**Dependencies**

 User&#39;s having an existing account for the selected social media, 
also requires the users remembering their credentials.

3.8  Merge/Break Chats

**Description**

Another main feature of the application, where users can select existing 
chats within their application and merge them together. This feature 
will merge the two or more chats, therefore when the user&#39;s friend 
sends a message on another social media platform, as long as our users 
selected that chat to import, they will be able to receive that message.

On the opposite side of the spectrum, users can also select merged chats 
and decide to break them up to their original state.

**Criticality**

This is one of the main features of the application, users have the 
power to alter how they send and receive messages.

**Technical Issues**

Combining the chats and how they handle data, will be the major issue.

**Dependencies**

 On the ionic framework having no bugs when it comes to merging the 
chats, and the database handling the data properly.

3.9 Messaging

**Description**

This main feature will be critical on how we handle the data received 
and sent from the users. Users merging chats will have an impact on how 
the messaging works in the application, therefore we need to handle it 
in an appropriate manner.

**Criticality**

This is what the application is built on, sending and receiving 
messages.Its critically important to make sure all the data is going to 
the right places.

**Technical Issues**

We could have many issues with this function, since we need to handle 
the data with our database. Possible solution is to create a script for 
the database to handle how and where the data is sent and received.

**Dependencies**

 Database handling and API&#39;s working.

3.10 Select Platform to Message

**Description**

When users send a message they have the option of selecting their 
desired platform destination

**Criticality**

Make it a feature easy to use and understand.

**Technical Issues**

Design to make it fluid along with the send button and text bar. Default 
dropdown menu design for devices like IOS overwrite the existing design 
we want to implement.

**Dependencies**

None.

3.10 Log Out

**Description**

A function to secure a closed session for the user.

**Criticality**

Not critical for users on their mobile devices, however since this 
device is cross platform, people using it on their computers/laptops 
would need to log out to make sure the session is closed.

**Technical Issues**

Discarding a cookie over multiple devices.

**Dependencies**

 Users need to be logged in to be able to log out.

4 SYSTEM ARCHITECTURE

4.1 System Architecture Diagram

 
![](data:image/*;base64,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)

4.2 Application

The application itself is what the user will see and interact with, when 
it comes to the design and building the frontend of the application it 
will be implemented using our graphical user interface library and will 
be designed so that the user can use the application fluidly without any 
difficulty.

4.3 PHP API

