#Make an ssl certificate
#https://certbot.eff.org/#debiantesting-other
apt install certbot 

#generate certificate
certbot certonly --standalone -d ie.dyndns.tv

#for auto renew
certbot renew --dry-run

#or just renew manually
certbot renew






# get all node.js components that are required
npm install --save express
npm install --save https
npm install --save ws
npm install --save fs


#messenger API

npm install --save facebook-chat-api             |    npm install Schmavery/facebook-chat-api




#google login button URL
https://developers.google.com/identity/sign-in/web/sign-in
https://console.developers.google.com/apis/credentials/oauthclient?project=cubik-1518266532650&authuser=0

#web sockets alternative to unique user 
https://github.com/websockets/ws#expressjs-example





