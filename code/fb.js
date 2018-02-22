//make facebook interface between library and server

//my fb id "100013582237495"
//this is like a manager between external (facebook-api-library) and our internal server

var fs = require('fs'),
   args = process.argv.slice(2),
   login = require("facebook-chat-api"),
   fb = null;

function connectFB(path, callback) {
   if(fs.existsSync(__dirname + 'appstate.json')) //login from cookie file
     login({appState: JSON.parse(fs.readFileSync(__dirname + 'appstate.json', 'utf8'))}, (err, api) => {
       if(err) return console.error(err)
       callback(new FB({cookie:true, api: api}))
     })
   else //login through username/password
     login({email: args[0], password: args[1]}, (err, api) => {
       if(err) return console.error(err)
       callback(new FB({cookie:false, api: api}))
     })
}

class FB {
  constructor(config) {
    this.cookie = config.cookie || false; //logged in from a file or had to use credentials first timer?
    this.api = config.api; //without this no point in FB object
    this.log('login_type') //1510854288056 - the oldest message timestamp
    // this.pullHistory(778695889, 50, undefined, function(data) {
    //  console.log(data.messages)
    // })
  } //constructor FB end

  pullHistory(threadID, count, timestamp, callback) {

    this.api.getThreadHistoryGraphQL(threadID, count, timestamp, 
      function(messages_data) {
        //perhaps rename messages to thread
        var messages = JSON.parse(messages_data['res'].substring(0, messages_data['res'].indexOf("]}}}}}")+7))['o0']['data']['message_thread'];
        let ThreadHistory = {
          id: messages.thread_key.thread_fbid || messages.thread_key.other_user_id,
          threadUsers: [],
          messages: [],
          messages_count: messages.messages_count,
          unread_count: messages.unread_count,
          name: messages.name,
          image: messages.image,
          last_mesage: messages.last_message.nodes[0]
        }
        for(let participant in messages['all_participants']['nodes'])
          ThreadHistory.threadUsers.push({
              id: messages['all_participants']['nodes'][participant]['messaging_actor']['id'],
              type: messages['all_participants']['nodes'][participant]['messaging_actor']['__typename']
          })
        
        for(let message in messages['messages']['nodes'])
          ThreadHistory.messages.push({ //message_source_data, message_reply_data ?! maybe later on
            type: messages['messages']['nodes'][message]['__typename'],
            id: messages['messages']['nodes'][message]['message_id'],
            senderID: messages['messages']['nodes'][message]['message_sender']['id'],
            senderEmail: messages['messages']['nodes'][message]['message_sender']['email'],
            unread: messages['messages']['nodes'][message]['unread'],
            timestamp: messages['messages']['nodes'][message]['timestamp_precise'],
            text: messages['messages']['nodes'][message]['message']['text'],
            reactions: JSON.stringify(messages['messages']['nodes'][message]['message_reactions'])
          })

        if(ThreadHistory.messages.length > 0)
          ThreadHistory.prev = ThreadHistory.messages[0].timestamp;
          
        callback(ThreadHistory)
        // console.log(ThreadHistory)
      })
  }


  send(threadID, text, filePath) {
        if (filePath && fs.existsSync(filePath)) //if message has file going with it?
    	  this.api.sendMessage({body: text, attachment: fs.createReadStream(filePath)}, threadID)
        else //send ordinary message
          this.api.sendMessage(text, threadID)
	      //log that message has been sent
        this.log('message_sent', threadID+': '+text)
  }


  receive(callback) {
    this.api.listen((err, message) => {
      if(err) return console.error(err);
      callback(message)
    })
  }


  list(callback) {
    this.api.getFriendsList((err, data) => {
      if(err) return console.error(err);
      callback(data)
  });
  }


  

  

  log(type, about) {
    if(type=='login_type')
      if(this.cookie)
        console.log('\x1b[32m%s\x1b[0m', "Messenger Client Logged in (Cookie-File)!")
      else
        console.log('\x1b[32m%s\x1b[0m', "Messenger Client Logged in (Credentials)!")

    if(type=='message_sent')
        console.log('\x1b[32m%s\x1b[0m', "Message Sent! - " + about)

  }
}

module.exports = connectFB;
/*
{ thread_key: { thread_fbid: null, other_user_id: '778695889' },
  name: null,
  last_message: { nodes: [ [Object] ] },
  unread_count: 0,
  messages_count: 324,
  image: null,
  updated_time_precise: '1519083873705',
  mute_until: null,
  is_pin_protected: false,
  is_viewer_subscribed: true,
  thread_queue_enabled: false,
  folder: 'INBOX',
  has_viewer_archived: false,
  is_page_follow_up: false,
  cannot_reply_reason: null,
  ephemeral_ttl_mode: 0,
  customization_info: null,
  thread_admins: [],
  approval_mode: null,
  joinable_mode: { mode: '0', link: '' },
  thread_queue_metadata: null,
  event_reminders: { nodes: [] },
  montage_thread: null,
  last_read_receipt: { nodes: [ [Object] ] },
  related_page_thread: null,
  rtc_call_data:
   { call_state: 'NO_ONGOING_CALL',
     server_info_data: '',
     initiator: null },
  marketplace_thread_data: null,
  associated_object: null,
  privacy_mode: 1,
  reactions_mute_mode: 'REACTIONS_NOT_MUTED',
  mentions_mute_mode: 'MENTIONS_NOT_MUTED',
  customization_enabled: true,
  thread_type: 'ONE_TO_ONE',
  participant_add_mode_as_string: null,
  is_canonical_neo_user: false,
  participants_event_status: [],
  page_comm_item: null,
  all_participants: { nodes: [ [Object], [Object] ] },
  messages:
   { page_info: { has_previous_page: true },
     nodes:
      [ [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object] ] } }


{ __typename: 'UserMessage',
  message_id: 'mid.$cAABa9hRjS-Zn4bi0wFhsHNsSH6VN',
  offline_threading_id: '6371499300049888589',
  message_sender: { id: '778695889', email: '778695889@facebook.com' },
  ttl: 0,
  timestamp_precise: '1519083809984',
  unread: false,
  is_sponsored: false,
  ad_id: null,
  ad_client_token: null,
  commerce_message_type: null,
  customizations: [],
  tags_list: [ 'inbox', 'source:chat:orca', 'app_id:237759909591655' ],
  platform_xmd_encoded: null,
  message_source_data: null,
  montage_reply_data: null,
  message_reactions: [],
  message: { text: 'Sounds goood', ranges: [] },
  meta_ranges: [],
  extensible_attachment: null,
  sticker: null,
  blob_attachments: [],
  page_admin_sender: null }
{ __typename: 'UserMessage',
  message_id: 'mid.$cAABa9hRjS-Zn4bmtqVhsHRlSeQsn',
  offline_threading_id: '6371499567417461543',
  message_sender: { id: '100013582237495', email: '100013582237495@facebook.com' },
  ttl: 0,
  timestamp_precise: '1519083873705',
  unread: false,
  is_sponsored: false,
  ad_id: null,
  ad_client_token: null,
  commerce_message_type: null,
  customizations: [],
  tags_list: [ 'sent', 'inbox', 'source:chat:orca', 'app_id:237759909591655' ],
  platform_xmd_encoded: null,
  message_source_data: null,
  montage_reply_data: null,
  message_reactions: [],
  message:
   { text: 'We also are going to have to do lots of diagrams to illustrate components as functional entities ... that’s the hard part xD',
     ranges: [] },
  meta_ranges: [],
  extensible_attachment: null,
  sticker: null,
  blob_attachments: [],
  page_admin_sender: null }






  { alternateName: '',
    firstName: 'Daniel',
    gender: 'male_singular',
    userID: '100007821102928',
    isFriend: true,
    fullName: 'Daniel Scutaru',
    profilePicture: 'https://scontent-lht6-1.xx.fbcdn.net/v/t1.0-1/c0.8.32.32/p32x32/14642358_1787869118150441_4915041769106205160_n.jpg?oh=06b29ee8ab03cabfc90bca0b26e0db03&oe=5B219880',
    type: 'friend',
    profileUrl: 'https://www.facebook.com/daniel.scutaru.5',
    vanity: 'daniel.scutaru.5',
    isBirthday: false } 
*/