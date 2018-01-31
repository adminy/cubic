curl -X POST -H "Content-Type: application/json" -d '{
  "recipient":{
    "id":"778695889"
  },
  "message":{
    "text":"hello, world!"
  }
}' "https://graph.facebook.com/v2.6/me/messages?access_token=<PAGE_ACCESS_TOKEN>"


#Hassan's "<PSID>" == "778695889"
