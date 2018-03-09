<h1>Cubik User Manual</h1>

<center>Table of Contents</center>
===
&nbsp;

## [1.Login](#1-introduction)
### [1.1 Facebook](#11-overview-1)	
### [1.2 Google](#12-business-context-1)	


## [2.Chat Lobby](#2-system-architecture)

2.1 Import Chats

 2.2 Sign In

  2.2.1 Facebook/Skype

 2.3 Combine

  2.3.1 Groups

 2.4 Break

  2.4.1 Original chat

 2.5 Search bar

### [2.1 Import Chats](#21-user)	
### [2.2 Sign In](#-341-login)
### [2.2.1 Facebook/Skype](#22-server)			### [2.3 Combine](#23-client)
### [2.3.1 Groups](#24-materialize-design)		
##  [2.4 Break](#3-high-level-design-1)
### [2.5 Search bar](#32-design-goal)

### [3.3 Architecture](#33-)
### [3.4 Use Cases](#-34-)
###  [3.4.1 Login](#-341-login)
###  [3.4.2 Add Friend Chat](#-342-add-user)
###  [3.4.3 Combine](#-343-combine)
###  [3.4.4 Break](#-344-break)
###  [3.4.5 Delete](#-345-delete)
###  [3.4.6 Logout](#-347-logout)
### [3.5 User Flow Diagram](#-34-user-flow-diagram)
### [3.6 Context Diagram](#-34-context-diagram)
### [3.7 Class Diagram](#-35-class-diagram)

&nbsp;
## [4. Problems and Resolution](#-4-problems-and-resolution)
### [4.1 Social Media API](#41-)
### [4.2 Design Decisions](#42-)
### [4.3 Server Client Communication](#43-)
### [4.4 Code Readability](#44-)
### [4.5 Learning different coding languages](#45-)
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
Table of Content

1.login

 1.1 Facebook

 1.2 Google

2.Chat Lobby

 2.1 Import Chats

 2.2 Sign In

  2.2.1 Facebook/Skype

 2.3 Combine

  2.3.1 Groups

 2.4 Break

  2.4.1 Original chat

 2.5 Search bar

3. Messaging

 3.1 Enter chat

 3.2 Send message

 3.3 Receiving message

 3.4 Group Chat

4.Logout







# Login

This is where you can log into the application, you have two options to log into Cubik.


![Login](Login.png "Login.png")





**Facebook**

![Facebook Log](facebook_log.png "facebook_log.png") 

**Google**

![Google Log In](GoogleLogIn.png "GoogleLogIn.png") 


# Chat Lobby


![Main Chat Lobby](MainChatLobby.png "MainChatLobby.png") 


This is the main chat lobby for the Cubik application, where groups created will be under the &quot;Group&quot; title and under &quot;People&quot; will be your imported chats. Clicking on the menu button on the top right of the screen will allow you to access all our features.

**Import Chat**


![Log In Both Services](LogInBothService.png "LogInBothService") 


This Service page is where you need to input your details allowing us to import your chats into our application.



**Sign in Facebook/Skype:**

![Log In Both Services](FilledInRegister.png "LogInBothService") 




![Log In Both Services](Succesf.png "LogInBothService") 


After successfully inputting your Facebook/skype information, clicking on the respective button &quot;Facebook&quot; or &quot;Skype&quot; will register your information and your chats are now imported into our application.

![Log In Both Services](fb_registered.png "LogInBothService") 

Information shown on the Services, to informs you that there is no need to log into Facebook again, as its already registered the service, users can also sign into skype.

After successfully logging into both services, both chats are imported, you will not need to log into these services again and the application will remember you the next time you log in.


![Log In Both Services](bothServiceReg.png "bothServiceReg") 





**Combine:**

To create groups you will need to click the &quot;Combine&quot; button, before doing so ensure that you have successfully registered with at least one service(Facebook/Skype).



![Log In Both Services](MakingGroup.png "MakingGroup") 

After clicking the &quot;Combine&quot; button, you will need to highlight the chats you want to create into a group, whether its Facebook or Skype does not matter. After selecting the chats, you want, click the create a group button on the top right. You can also press the &quot;Cancel&quot; button if you don&#39;t want to create a group anymore.


![Log In Both Services](CreateButtonClicked.png "CreateButtonClicked") 




After creating the group that you want, you can name the new group, if not then it will assign each group user&#39;s name as the group name.


![Log In Both Services](NameGroup.png "NameGroup") 

The Newly created group will be under the &quot;Group&quot; title in the main chat lobby, where you can access it with simply clicking on the group.


![Log In Both Services](createdGroup.png "createdGroup") 








**Break:**


To break(delete) the group you created you will need to click the &quot;Break&quot; button where you will then be redirected to the main lobby.

![Log In Both Services](breakButton.png "breakButton") 

You will highlight your existing groups where you will then click on the &quot;Delete Group&quot; button, after which the groups selected will be deleted.



![Log In Both Services](delete.png "delete") 



**Search bar:**

You will also have access to a search bar that will search all your imported chats, where you can search for any contact you have and our search bar will also search for any words in the conversations you have had with your contacts.



![Log In Both Services](MakingGroup.png "MakingGroup") 


# Messaging

  **Enter chat:**

 

To enter the chat simply clicking on the message box will make you enter the chat message window.

![Log In Both Services](enterChat.png "enterChat") 

**Send message:**



**Receiving message:**









**Group Chat:**

When creating the groups users will be identified by their avatar next to their message and the Social media account they sent the message from. They can also be identified if you hover over their name, where their name will show.


![Log In Both Services](GroupChat.png "GroupChat") 

Having different Social medias in the group chat, will allow the user to pick the social media they want to send the message too and to which user in the group. While you will receive any messages sent to you by any of the contacts in your group.



# Logout

User will need to click the logout button in the service area to log out of the application.



![Log In Both Services](logOut.png "logOut") 

Clicking this button, you will need to relog into the application, the existing contacts will still be available after logging out.