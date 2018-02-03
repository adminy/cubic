#Make an ssl certificate
#https://certbot.eff.org/#debiantesting-other
apt install certbot 

#generate certificate
certbot certonly --standalone -d anime4life.dyndns.tv

#for auto renew
certbot renew --dry-run

#or just renew manually
certbot renew






# get all node.js components that are required
npm install --save express
npm install --save https
npm install --save ws
npm install --save fs
