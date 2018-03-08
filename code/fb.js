//make an interface/manager (connectFB, FB) USING imported library (facebook-chat-api)
var login = require("facebook-chat-api");

function IsJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
/**
* Generate A `FB` object given Correct Credentials
* @param {JSON} credentials - can be either and appState (cookie) OR email and password for initial authentication
* @param {function} callback - function which to give FB manager object and error (if any)
*/
function connectFB(f, user, credentials, callback) { //credentials = {email: X, password: Y} || {appState: Z}
  login(credentials, (error, api) => {
    callback(new FB({ f: f, user: user, cookie: ('appState' in credentials), api: api }), error)
  })
}

/**
 * FB - Manger {object} which allows usage of facebook service
 * @property {*} constructor - instance generator of logged in user API and ID, as well as method of authentication
 * @property {*} pullHistory - pull `Thread` messages which we don't currently have
 * @property {*} send - send a facebook message to a facebook user
 * @property {*} receive - listen for incomming messages to instantly receive the message
 * @property {*} list - list all the people you talked to
 */
class FB {
  /** 
   * This constructor can only instanciate an instance if facebook has successfully logged in
   * @param {string} name - Service name
   * @param {JSON} config - stores the {facebook-chat-api} "api" and {boolean} "cookie"
   * @property {boolean} cookie - logged in from a file OR had to use credentials first timer?
   * @property {facebook-chat-api} api - the facebook API which we can query facebook with, without this it's not much point in having an instance of `FB` class
   * @property {number} myID - facebook ID of the given instance
   * @property {boolean} debug - if allowed to log to console
   * @log - Show LoggedIn Instance && cookie or actual credentials
  */
  constructor(config) {
    this.name = 'facebook'
    this.cookie = config.cookie || false
    this.f = config.f //should always be provided
    this.user = config.user //should always be provided, this is helpful to indentify the user in services so it can send `listen()` events/messages if user is online
    this.api = config.api
    this.myID = config.api.getCurrentUserID()
    this.debug = true
    this.log('login_type')

    if(!this.cookie) this.cookie_setup()
    this.listen()
    this.update()

    var user = this.user
    var ff = this.f
    var sql = "SET NAMES utf8mb4;"
    this.list(function (contacts) {
      for (let i = 0; i < contacts.length; i++)
        sql += "INSERT INTO relations(yourID, theirID, type, service) VALUES (" + ff.con.escape(user) + "," + ff.con.escape(contacts[i].userID) + "," + ff.con.escape(contacts[i].type) + ",'facebook') ON DUPLICATE KEY UPDATE service=service;" +
          "INSERT INTO profiles (userID, name, avatar, type) VALUES (" + ff.con.escape(contacts[i].userID) + "," + ff.con.escape(contacts[i].fullName) + "," + ff.con.escape(contacts[i].profilePicture) + ",'facebook') ON DUPLICATE KEY UPDATE type=type;"
      ff.query(sql, function (res) { ff.log('Updated DB relations and profiles for FaceBook [' + user + ']') })


    })
  } //constructor FB end

  cookie_setup() {
    var user = this.user, ff = this.f, cookie_file = this.myID + '.json'
    ff.fs.writeFileSync(__dirname + '/user_data/' + cookie_file, JSON.stringify(this.api.getAppState()))
    ff.query("UPDATE services SET authFilePath=" + ff.con.escape(cookie_file) + " WHERE user=" + ff.con.escape(user) + " AND service='facebook'" , function(res) {
      ff.log(res.affectedRows + ' row(s) Updated [FB Cookie File]')
    })

  }

  // pullThreadInfo(threadID, callback) {
  //   this.api.getThreadInfoGraphQL(threadID, function(th_data) {
  //     if(th_data && 'res' in th_data && th_data['res'].indexOf("]}}}}}") != -1) {
  //       let toParse = th_data['res'].substring(0, th_data['res'].indexOf("]}}}}}") + 7)
  //       if (this.f.isJSON(toParse)) {

  //         var messages = JSON.parse(toParse)['o0']['data']['message_thread'];

  //         let ThreadInfo = {
  //           threadID: messages.thread_key.thread_fbid || messages.thread_key.other_user_id,
  //           threadUsers: [],
  //           total_msg: messages.messages_count,
  //           unread_count: messages.unread_count,
  //           name: messages.name,
  //           image: messages.image,
  //           last_message: messages.last_message.nodes[0]
  //         }
  //         for (let participant in messages['all_participants']['nodes'])
  //           ThreadInfo.threadUsers.push({
  //             id: messages['all_participants']['nodes'][participant]['messaging_actor']['id'],
  //             type: messages['all_participants']['nodes'][participant]['messaging_actor']['__typename']
  //           })

  //         callback(ThreadInfo)


  //       } else
  //           console.log('\x1b[31m%s\x1b[0m', 'Problem Parsing Facebook Thread Info')
  //     } else
  //         console.log('\x1b[31m%s\x1b[0m', 'FB Thread INFO DERICATED!')
  //   })
  // }


  // /** 
  //  * get Thread History
  //  * @param {number} threadID - conversation room unique indentifier
  //  * @param {string} lastMessageID - last message ID that our server has
  //  * @param {function} callback - function which to call so it receives a list of all the new messages
  // */

  // pullHistory(threadID, count, timestamp, callback) {
  //   //So the idea is to introduce which was the last message we do have from facebook 
  //   //@none is also accepted and we keep pulling 50 messages until we get to the bottom of the well,
  //   //but that seems better than telling how many messages to pull
  //   //to do that we may need to have an itterator over time so this function may have to run in background for a while
  //   this.api.getThreadHistoryGraphQL(threadID, count, timestamp,
  //     function (messages_data) {
  //       //perhaps rename messages to thread
  //       //check if it's possible to parse the json, then parse it...
  //       if(messages_data && 'res' in messages_data && messages_data['res'].indexOf("]}}}}}") != -1) {
  //         let toParse = messages_data['res'].substring(0, messages_data['res'].indexOf("]}}}}}") + 7)

  //         if (IsJsonString(toParse)) {

  //           var messages = JSON.parse(toParse)['o0']['data']['message_thread'];

  //           let ThreadHistory = {
  //             id: messages.thread_key.thread_fbid || messages.thread_key.other_user_id,
  //             threadUsers: [],
  //             messages: [],
  //             messages_count: messages.messages_count,
  //             unread_count: messages.unread_count,
  //             name: messages.name,
  //             image: messages.image,
  //             last_mesage: messages.last_message.nodes[0]
  //           }
  //           for (let participant in messages['all_participants']['nodes'])
  //             ThreadHistory.threadUsers.push({
  //               id: messages['all_participants']['nodes'][participant]['messaging_actor']['id'],
  //               type: messages['all_participants']['nodes'][participant]['messaging_actor']['__typename']
  //             })

  //           for (let message in messages['messages']['nodes'])
  //             if ('message' in messages['messages']['nodes'][message] && 'text' in messages['messages']['nodes'][message]['message'])
  //               ThreadHistory.messages.push({ //message_source_data, message_reply_data ?! maybe later on
  //                 type: messages['messages']['nodes'][message]['__typename'],
  //                 id: messages['messages']['nodes'][message]['message_id'],
  //                 senderID: messages['messages']['nodes'][message]['message_sender']['id'],
  //                 senderEmail: messages['messages']['nodes'][message]['message_sender']['email'],
  //                 unread: messages['messages']['nodes'][message]['unread'],
  //                 timestamp: messages['messages']['nodes'][message]['timestamp_precise'],
  //                 text: messages['messages']['nodes'][message]['message']['text'],
  //                 reactions: JSON.stringify(messages['messages']['nodes'][message]['message_reactions']),
  //                 files: JSON.stringify(messages['messages']['nodes'][message]['blob_attachments'])
  //               })

  //           if (ThreadHistory.messages.length > 0) //useful getting the last message timestamp for requesting previous messages of this thread
  //             ThreadHistory.prev = ThreadHistory.messages[0].timestamp;

  //           callback(ThreadHistory)
  //           // console.log(ThreadHistory)
  //         } else {
  //           console.log('\x1b[31m%s\x1b[0m', 'Problem Parsing Facebook Thread')
  //         }
  //       } else {
  //         console.log('\x1b[31m%s\x1b[0m', 'FB Thread History DERICATED!')
  //       }
  //     })
  // }
  /**
    * send a message to facebook Thread via text OR file + text
    * @param {number} threadID - conversation room unique indentifier
    * @param {string} text - message content
    * @param {binary} file - (optional) image/video/audio
    * @log - show that message has been sent (debug)
   */
  send(threadID, text, file) { //file = fs.createReadStream(filePath)
    if (!file) //ordinary text message
      this.api.sendMessage(text, threadID)
    else //text message with FILE
      this.api.sendMessage({ body: text, attachment: file }, threadID)     
    this.log('msg_sent', "(" + this.myID + " -> " + threadID + '): ' + (file ? '[FILE]' : '') + text)
  }
  /**
    * Listen for incomming messages
    * @param {function} callback - function which takes in new messages as argument
    * @log - show user is listening (debug)
   */
  listen() {
    this.api.setOptions({ listenEvents: true, selfListen: true });
    this.log('listening')
    var ff = this.f
    var user = this.user

    this.api.listen((err, message) => {
      if (err) return console.error(err)
      ff.query("SELECT userID FROM services WHERE user=" + ff.con.escape(this.user), function (userIDs) { //support multiquery in this query to insert the message 
        for (let i = 0; i < userIDs.length; i++) {

          ff.send_if_online(ff.wss, userIDs[i].userID, function(ws) { ws.send(JSON.stringify({message: message})) })



          if('messageID' in message && 'senderID' in message)
            ff.query("INSERT INTO messages(message_owner, service, threadID, id, type, senderID, timestamp, content) VALUES ("+
                    ff.con.escape(user)+",'facebook',"+
                    ff.con.escape(message.threadID)+","+
                    ff.con.escape(message.messageID)+","+
                    ff.con.escape((message.body ? 'text' : 'other'))+","+
                    ff.con.escape(message.senderID)+","+
                    ff.con.escape(message.timestamp)+","+
                    ff.con.escape((message.body ? message.body : JSON.stringify(message.attachments))) + ")  ON DUPLICATE KEY UPDATE timestamp=timestamp", function(res) {  // console.log(message.resource.imdisplayname + ": " + message.resource.content + " (" +  + ")")
                        ff.log(res.affectedRows + ' row(s) updated [New DB Message Facebook]')
                    })
        }

      })
      //save to DB if it's a message
      //Send it to all web socket users which we can relate to this



    })
  }

  /**
    * Listen for incomming messages
    * @param {function} callback - function which takes in a list of `Single Users (Threads)` as argument
   */
  list(callback) {
    this.api.getFriendsList((err, data) => {
      if (err) return console.error(err);
      callback(data)
    });
  }

  /**
    * Log Phases for debug
    * @param {function} callback - function which takes in a list of `Single Users (Threads)` as argument
   */
  log(type, info) {
    if (this.debug)
      switch (type) {
        case 'login_type':
          console.log('\x1b[32m%s\x1b[0m', 'facebook Client Logged in using ' + (this.cookie ? 'Cookie-File' : 'Credentials') + ' ID: ' + this.myID)
          break
        case 'msg_sent':
          console.log('\x1b[32m%s\x1b[0m', "Message Sent! - " + info)
          break
        case 'listening':
          console.log('\x1b[33m%s\x1b[0m', "ID: (" + this.myID + ") is Listening ...")
          break
        default:
          console.error('...')
      }
  }
  update() {
    var myID = this.myID
    var user = this.user
    var ff = this.f
    //this.list(function (contacts) {
      ff.query("SELECT userID FROM services WHERE user=" + ff.con.escape(user), function (userIDs) { //support multiquery in this query to insert the message 
        for (let i = 0; i < userIDs.length; i++)
          ff.send_if_online(ff.wss, userIDs[i].userID, function (ws) {
            // ff.query("SELECT COUNT(*) as len FROM relations INNER JOIN profiles ON relations.theirID=profiles.userID WHERE yourID=" + ff.con.escape(user) + " AND (SELECT timestamp FROM messages WHERE threadID=relations.theirID ORDER BY timestamp DESC LIMIT 1) IS NOT NULL", function (dtl) {
              // if (dtl.length > 0)
                ff.query("SELECT service, userID, name, avatar, (SELECT timestamp FROM messages WHERE threadID=relations.theirID ORDER BY timestamp DESC LIMIT 1) as timestamp, (SELECT content FROM messages WHERE threadID=relations.theirID ORDER BY timestamp DESC LIMIT 1) as text FROM relations INNER JOIN profiles ON relations.theirID=profiles.userID WHERE yourID=" + ff.con.escape(user) + " ORDER BY timestamp DESC", function (contacts) { // LIMIT " + ((parseInt(dtl[0].len) > 10) ? parseInt(dtl[0].len) : 10), function (contacts) {
                  ws.send(JSON.stringify({contacts: contacts}))
                })
            // })
          }, 'sent_fb_contacts')
      })
    //})
  }
} //end of FB class

//this file is required by `server.js`
module.exports = connectFB;

//Printed `messenger-chat-api` library objects (for learning) ....................................................................
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