var bot = class bot{
constructor(token){
 this.BOT_TOKEN = token
 this.update = {}
 this.botInfo = {}
 this.prefix = ["!",".","/"]
}
buildJSON(json){
 let result = {}
 if(!json){
   return result
 }
 for(let element of Object.entries(json)){
  if(element[1]){
    if(element[0] == 'advanced'){
     for(let moreObj of Object.entries(element[1])){
       if(moreObj[0]){
         if(typeof(moreObj[1]) == 'string'){
             result[moreObj[0]] = moreObj[1]
           }else{
             result[moreObj[0]] = JSON.stringify(moreObj[1])
           }
      }
     }
   }else{
    result[element[0]] = element[1]
   }
  }
 }
 return result
}
request(method,data){
try{
let option = {
  method : 'POST'
}
  if(data){option.payload = this.buildJSON(data)}
  let res = UrlFetchApp.fetch('https://api.telegram.org/bot'+this.BOT_TOKEN+'/'+method,option)
  let Res = JSON.parse(res)
  if(Res.ok){
   return Res.result
  }else{
   throw res
  }
 }catch(error){
  throw error
 }
}
handleUpdate(e){
 try{
  if (e.postData.type == "application/json") {
      let update = JSON.parse(e.postData.contents);
      if (update){
       this.update = update
       this.botInfo = this.getMe()
    }
  }
 }catch(error){
   return error
 }
}
//custom
cb(data,next){
  try{
    if(this.update.callback_query && (this.update.callback_query.data == data)){
      return next(this.update)
    }
    return;
  }catch(error){
    return error
  }
}
sleep(time){
 try{
  let t = String(time)
  let ms = /(?<time>(\d+)(?:\.(\d+))?)ms/i
  let s = /(?<time>(\d+)(?:\.(\d+))?)s/i
  let m = /(?<time>(\d+)(?:\.(\d+))?)m/i
  let h = /(?<time>(\d+)(?:\.(\d+))?)h/i
  let d = /(?<time>(\d+)(?:\.(\d+))?)d/i
  if(ms.exec(t)){
    let a = ms.exec(t)
    let ti = Number(a.groups.time)
    let tim = ti
    Utilities.sleep(tim)
    return tim
  }else if(s.exec(t)){
    let a = s.exec(t)
    let ti = Number(a.groups.time)
    let tim = ti * 1000
    Utilities.sleep(tim)
    return tim
  }else if(m.exec(t)){
    let a = m.exec(t)
    let ti = Number(a.groups.time)
    let tim = ti * 1000 * 60
    Utilities.sleep(tim)
    return tim
  }else if(h.exec(t)){
    let a = h.exec(t)
    let ti = Number(a.groups.time)
    let tim = ti * 1000 * 60 * 60
    Utilities.sleep(tim)
    return tim
  }else if(d.exec(t)){
    let a = d.exec(t)
    let ti = Number(a.groups.time)
    let tim = ti * 1000 * 60 * 60 * 24
    Utilities.sleep(tim)
    return tim
  }
 return;
 }catch(error){
   return error
 }
}
setPrefix(array){
try{
 return this.prefix = array
}catch(error){
 return error
}
}
command(array,next,ignore){
 try{
  let more = "(?:\@(?<username>[^\s+]+))?"
  if(ignore){ more = "(?:\@(?<username>[^\s+]+))?$"}
  if(Array.isArray(array)){
    let txt = this.update.message.text;
    let regex = new RegExp("^["+this.prefix.toString()+"]("+array.join('|')+")"+more,"i")
    if(regex.exec(txt)){
     let sm = regex.exec(txt)
     if(sm.groups.username){
       if(sm.groups.username == this.botInfo.username){
        return next(this.update)
       }else{
        return
       }
      }else{
        return next(this.update)
      }
     }
   }else{
     let txt = this.update.message.text;
     let regex = new RegExp("^["+this.prefix.toString()+"]"+array+more,"i")
     if(regex.exec(txt)){
      let sm = regex.exec(txt)
      if(sm.groups.username){
        if(sm.groups.username == this.botInfo.username){
          return next(this.update)
        }else{
          return
        }
       }else{
       return next(this.update)
     }
   }
  }
 } catch (error){
   return error
}
}
cmd(array,next,ignore){
try{
  let more = "(?:\@(?<username>[^\s+]+))?"
  if(ignore){more = "(?:\@(?<username>[^\s+]+))?$"};
   if(Array.isArray(array)){
    let txt = this.update.message.text;
    let regex = new RegExp("^["+this.prefix.toString()+"]("+array.join('|')+")"+more,"i")
    if(regex.exec(txt)){
    let sm = regex.exec(txt)
    if(sm.groups.username){
       if(sm.groups.username == this.botInfo.username){
        return next(this.update)
       }else{
        return
       }
      }else{
        return next(this.update)
      }
     }
   }else{
     let txt = this.update.message.text;
     let regex = new RegExp("^["+this.prefix.toString()+"]"+array+more,"i")
     if(regex.exec(txt)){
      let sm = regex.exec(txt)
      if(sm.groups.username){
        if(sm.groups.username == this.botInfo.username){
          return next(this.update)
        }else{
          return
        }
       }else{
       return next(this.update)
     }
   }
  }
 } catch (error){
   return error
}
}
regex(regex,next){
 try{
   let txt = this.update.message.text;
   if(regex.exec(txt)){
    return next(this.update,regex.exec(txt))
   }
 } catch (error){
   return error
}
}
listen(text,next){
try{
   let txt = this.update.message.text;
   let regex = new RegExp(text,"i")
   if(regex.exec(txt)){
    return next(this.update)
   }
 } catch (error){
   return error
}
}
reply(text,advanced){
 if(this.update.callback_query){
   return this.sendMessage(this.update.callback_query.message.chat.id,text,advanced)
 }
 if(this.update.edited_message){
   return this.sendMessage(this.update.edited_message.chat.id,text,advanced)
 }
 return this.sendMessage(this.update.message.chat.id,text,advanced)
}
replyPhoto(photo,advanced){
  if(this.update.callback_query){
     return this.sendPhoto(this.update.callback_query.message.chat.id,photo,advanced)
   }
   if(this.update.edited_message){
     return this.sendPhoto(this.update.edited_message.chat.id,photo,advanced)
   }
  return this.sendPhoto(this.update.message.chat.id,photo,advanced)
}
replyVideo(video,advanced){
  if(this.update.callback_query){
     return this.sendVideo(this.update.callback_query.message.chat.id,video,advanced)
   }
   if(this.update.edited_message){
     return this.sendVideo(this.update.edited_message.chat.id,video,advanced)
   }
  return this.sendVideo(this.update.message.chat.id,video,advanced)
}
replyDocument(document,advanced){
  if(this.update.callback_query){
     return this.sendDocument(this.update.callback_query.message.chat.id,document,advanced)
   }
   if(this.update.edited_message){
     return this.sendDocument(this.update.edited_message.chat.id,document,advanced)
   }
  return this.sendDocument(this.update.message.chat.id,document,advanced)
}
replyAudio(audio,advanced){
  if(this.update.callback_query){
     return this.sendAudio(this.update.callback_query.message.chat.id,audio,advanced)
   }
   if(this.update.edited_message){
     return this.sendAudio(this.update.edited_message.chat.id,audio,advanced)
   }
  return this.sendAudio(this.update.message.chat.id,audio,advanced)
}
replyDice(dice,advanced){
  if(this.update.callback_query){
     return this.sendDice(this.update.callback_query.message.chat.id,dice,advanced)
   }
   if(this.update.edited_message){
     return this.sendDice(this.update.edited_message.chat.id,dice,advanced)
   }
  return this.sendDice(this.update.message.chat.id,dice,advanced)
}
replyAnimation(animation,advanced){
  if(this.update.callback_query){
     return this.sendAnimation(this.update.callback_query.message.chat.id,animation,advanced)
   }
   if(this.update.edited_message){
     return this.sendAnimation(this.update.edited_message.chat.id,animation,advanced)
   }
  return this.sendAnimation(this.update.message.chat.id,animation,advanced)
}
replyVoice(voice,advanced){
  if(this.update.callback_query){
     return this.sendVoice(this.update.callback_query.message.chat.id,voice,advanced)
   }
   if(this.update.edited_message){
     return this.sendVoice(this.update.edited_message.chat.id,voice,advanced)
   }
  return this.sendVoice(this.update.message.chat.id,voice,advanced)
}
replyVideoNote(video_note,advanced){
  if(this.update.callback_query){
     return this.sendVideoNote(this.update.callback_query.message.chat.id,video_note,advanced)
   }
   if(this.update.edited_message){
     return this.sendVideoNote(this.update.edited_message.chat.id,video_note,advanced)
   }
  return this.sendVideoNote(this.update.message.chat.id,video_note,advanced)
}
replyMediaGroup(media,advanced){
  if(this.update.callback_query){
     return this.sendMediaGroup(this.update.callback_query.message.chat.id,media,advanced)
   }
   if(this.update.edited_message){
     return this.sendMediaGroup(this.update.edited_message.chat.id,media,advanced)
   }
  return this.sendMediaGroup(this.update.message.chat.id,media,advanced)
}
replyLocation(latitude,longitude,advanced){
  if(this.update.callback_query){
     return this.sendLocation(this.update.callback_query.message.chat.id,latitude,longitude,advanced)
   }
   if(this.update.edited_message){
     return this.sendLocation(this.update.edited_message.chat.id,latitude,longitude,advanced)
   }
  return this.sendLocation(this.update.message.chat.id,latitude,longitude,advanced)
}
replyVenue(latitude,longitude,advanced){
  if(this.update.callback_query){
     return this.sendVenue(this.update.callback_query.message.chat.id,latitude,longitude,advanced)
   }
   if(this.update.edited_message){
     return this.sendVenue(this.update.edited_message.chat.id,latitude,longitude,advanced)
   }
  return this.sendVenue(this.update.message.chat.id,latitude,longitude,advanced)
}
replyContact(phone_number,first_name,advanced){
if(this.update.callback_query){
   return this.sendContact(this.update.callback_query.message.chat.id,phone_number,first_name,advanced)
 }
 if(this.update.edited_message){
   return this.sendContact(this.update.edited_message.chat.id,phone_number,first_name,advanced)
 }
return this.sendContact(this.update.message.chat.id,phone_number,first_name,advanced)
}
replyPoll(question,options,advanced){
if(this.update.callback_query){
   return this.sendPoll(this.update.callback_query.message.chat.id,question,options,advanced)
 }
 if(this.update.edited_message){
   return this.sendPoll(this.update.edited_message.chat.id,question,options,advanced)
 }
return this.sendPoll(this.update.message.chat.id,question,options,advanced)
}
replyChatAction(action){
if(this.update.callback_query){
   return this.sendChatAction(this.update.callback_query.message.chat.id,action)
 }
 if(this.update.edited_message){
   return this.sendChatAction(this.update.edited_message.chat.id,action)
 }
return this.sendChatAction(this.update.message.chat.id,action)
}
replySticker(sticker,advanced){
if(this.update.callback_query){
   return this.sendSticker(this.update.callback_query.message.chat.id,sticker,advanced)
 }
 if(this.update.edited_message){
   return this.sendSticker(this.update.edited_message.chat.id,sticker,advanced)
 }
return this.sendSticker(this.update.message.chat.id,sticker,advanced)
}
replyMdV2(text,advanced){
if(this.update.callback_query){
   return this.sendMessage(this.update.callback_query.message.chat.id,text,this.buildJSON({parse_mode:'MarkdownV2',advanced:advanced}))
 }
 if(this.update.edited_message){
   return this.sendMessage(this.update.edited_message.chat.id,text,this.buildJSON({parse_mode:'MarkdownV2',advanced:advanced}))
 }
return this.sendMessage(this.update.message.chat.id,text,this.buildJSON({parse_mode:'MarkdownV2',advanced:advanced}))
}
replyMd(text,advanced){
if(this.update.callback_query){
   return this.sendMessage(this.update.callback_query.message.chat.id,text,this.buildJSON({parse_mode:'Markdown',advanced:advanced}))
 }
 if(this.update.edited_message){
   return this.sendMessage(this.update.edited_message.chat.id,text,this.buildJSON({parse_mode:'Markdown',advanced:advanced}))
 }
return this.sendMessage(this.update.message.chat.id,text,this.buildJSON({parse_mode:'Markdown',advanced:advanced}))
}
replyHTML(text,advanced){
if(this.update.callback_query){
   return this.sendMessage(this.update.callback_query.message.chat.id,text,this.buildJSON({parse_mode:'HTML',advanced:advanced}))
 }
 if(this.update.edited_message){
   return this.sendMessage(this.update.edited_message.chat.id,text,this.buildJSON({parse_mode:'HTML',advanced:advanced}))
 }
return this.sendMessage(this.update.message.chat.id,text,this.buildJSON({parse_mode:'HTML',advanced:advanced}))
}
replyToMessage(text,advanced){
if(this.update.callback_query){
   return this.sendMessage(this.update.callback_query.message.chat.id,text,this.buildJSON({reply_to_message_id:this.update.callback_query.message.message_id,advanced:advanced}))
 }
 if(this.update.edited_message){
   return this.sendMessage(this.update.edited_message.chat.id,text,this.buildJSON({reply_to_message_id:this.update.edited_message.message_id,advanced:advanced}))
 }
return this.sendMessage(this.update.message.chat.id,text,this.buildJSON({reply_to_message_id:this.update.message.message_id,advanced:advanced}))
}
replyToUser(text,advanced){
let msg_id = this.update.message.message_id
  if(this.update.message.reply_to_message){
    msg_id = this.update.message.reply_to_message.message_id
  }
 if(this.update.callback_query){
  if(this.update.callback_query.message.reply_to_message){
    return this.sendMessage(this.update.callback_query.message.chat.id,text,this.buildJSON({reply_to_message_id:this.update.callback_query.message.reply_to_message.message_id,advanced:advanced}))
  }else{
    return this.sendMessage(this.update.callback_query.message.chat.id,text,this.buildJSON({reply_to_message_id:this.update.callback_query.message.message_id,advanced:advanced}))
  }
 }
 if(this.update.edited_message){
   if(this.update.edited_message.reply_to_message){
      return this.sendMessage(this.update.edited_message.chat.id,text,this.buildJSON({reply_to_message_id:this.update.edited_message.reply_to_message.message_id,advanced:advanced}))
 }else{
    return this.sendMessage(this.update.edited_message.chat.id,text,this.buildJSON({reply_to_message_id:this.update.edited_message.message_id,advanced:advanced}))
  }
 }
return this.sendMessage(this.update.message.chat.id,text,this.buildJSON({reply_to_message_id:msg_id,advanced:advanced}))
}
remsg(text,advanced){
  return this.replyToMessage(text,advanced)
}
reuser(text,advanced){
  return this.replyToUser(text,advanced)
}
getFileLink(path){
if(!path){ return 'path required'}
return `https://api.telegram.org/file/bot${this.BOT_TOKEN}/${path}`
}
getPathFileLink(file_id){
if(!file_id){return 'file_id required!'}
let path = this.getFile(file_id).file_path
return this.getFileLink(path)
}
on(text,next){
 try {
    if(text == 'message' && this.update.message){
     return next(this.update)
    };
    if((text == 'new_chat_members' || text == 'new_chat_member' || text == 'new_chat_participant')&& this.update.message.new_chat_members){
     return next(this.update)
    };
    if((text == 'left_chat_member' || text == 'left_chat_participant') && this.update.message.left_chat_member){
     return next(this.update)
    };
    if((text == 'callback_query' || text == 'callbackQuery') && this.update.callback_query){
     return next(this.update)
    };
    if(text == 'edited_message' && this.update.edited_message){
     return next(this.update)
    };
    if(text == 'inline_query' && this.update.inline_query){
     return next(this.update)
    };
    if(text == 'sticker' && this.update.message.sticker){
     return next(this.update)
    };
    if(text == 'document' && this.update.message.document){
     return next(this.update)
    };
    if(text == 'poll' && (this.update.message.poll || this.update.poll)){
     return next(this.update)
    };
    if(text == 'location' && this.update.message.location){
     return next(this.update)
    };
    if(text == 'contact' && this.update.message.contact){
     return next(this.update)
    };
    if(text == 'audio' && this.update.message.audio){
     return next(this.update)
    };
    if(text == 'voice' && this.update.message.voice){
     return next(this.update)
    };
    if(text == 'channel_post' && this.update.channel_post){
     return next(this.update)
    };
    if(text == 'edited_channel_post' && this.update.edited_channel_post){
     return next(this.update)
    };
    if(text == 'chosen_inline_result' && this.update.chosen_inline_result){
     return next(this.update)
    };
    if(text == 'shipping_query' && this.update.shipping_query){
     return next(this.update)
    };
    if(text == 'pre_checkout_query' && this.update.pre_checkout_query){
     return next(this.update)
    };
    if(text == 'poll_answer' && this.update.poll_answer){
     return next(this.update)
    };
    if(text == 'animation' && this.update.message.animation){
     return next(this.update)
    };
    if(text == 'dice' && this.update.message.dice){
     return next(this.update)
    };
    if(text == 'video_note' && this.update.message.video_note){
     return next(this.update)
    };
    if(text == 'pinned_message' && this.update.message.pinned_message){
     return next(this.update)
    };
    if(text == 'text' && this.update.message.text){
     return next(this.update)
    };
    if(text == 'voice_chat_started' && this.update.message.voice_chat_started){
     return next(this.update)
    };
    if(text == 'voice_chat_ended' && this.update.message.voice_chat_ended){
     return next(this.update)
    };
    if(text == 'voice_chat_participants_invited' && this.update.message.voice_chat_participants_invited){
     return next(this.update)
    };
    if(text == 'notify_voice_chat' && (this.update.message.voice_chat_participants_invited||this.update.message.voice_chat_ended||this.update.message.voice_chat_started)){
     return next(this.update)
    };
    if((text == 'timer_message'|| text == 'message_auto_delete_timer_changed') && this.update.message.message_auto_delete_timer_changed){
     return next(this.update)
    };
    if(text == 'chat_member' && this.update.chat_member){
     return next(this.update)
    };
    if(text == 'my_chat_member' && this.update.my_chat_member){
     return next(this.update)
    };
    if(text == 'forward_message' && (this.update.message.forward_from||this.update.message.forward_from_chat||this.update.message.forward_from_message_id||this.update.message.forward_signature||this.update.message.forward_sender_name||this.update.message.forward_date)){
     return next(this.update)
    };
    if(text == 'via_bot' && this.update.message.via_bot){
     return next(this.update)
    };
    if(text == 'media_group' && this.update.message.media_group_id){
     return next(this.update)
    };
    if(text == 'game' && this.update.message.game){
     return next(this.update)
    };
    if(text == 'new_chat_title' && this.update.message.new_chat_title){
     return next(this.update)
    };
    if(text == 'new_chat_photo' && this.update.message.new_chat_photo){
     return next(this.update)
    };
    if(text == 'delete_chat_photo' && this.update.message.delete_chat_photo){
     return next(this.update)
    };
    if(text == 'group_chat_created' && this.update.message.group_chat_created){
     return next(this.update)
    };
    if(text == 'supergroup_chat_created' && this.update.message.supergroup_chat_created){
     return next(this.update)
    };
    if(text == 'channel_chat_created' && this.update.message.channel_chat_created){
     return next(this.update)
    };
    if(text == 'migrate_chat' && (this.update.message.migrate_to_chat_id||this.update.message.migrate_from_chat_id)){
     return next(this.update)
    };
 return;
} catch (error) {
 return error
}
}
//telegram api
getUpdates(offset,limit,advanced){
 let data = {
   offset: offset,
   limit:limit
 }
 if(advanced){
      data.advanced = advanced
 }
 return this.request('getUpdates',data)
}
setWebhook(url,advanced){
 let data = {
   url: url,
 }
 if(advanced){
      data.advanced = advanced
 }
 return this.request('setWebhook',data)
}
deleteWebhook(drop_pending_updates){
 let data = {}
 if(drop_pending_updates){
      data.drop_pending_updates = drop_pending_updates
 }
 return this.request('deleteWebhook',data)
}
getWebhookInfo(){
 return this.request('getWebhookInfo')
}
getMe(){
 return this.request('getMe')
}
logOut(){
 return this.request('logOut')
}
close(){
 return this.request('close')
}
sendMessage(chat_id,text,advanced){
 let data = {
   chat_id: String(chat_id),
   text:text
 }
 if(advanced){
      data.advanced = advanced
 }
 return this.request('sendMessage',data)
}
forwardMessage(chat_id,from_chat_id,message_id,advanced){
 let data = {
   chat_id: String(chat_id),
   from_chat_id: String(from_chat_id),
   message_id : Number(message_id)
 }
 if(advanced){
      data.advanced = advanced
 }
 return this.request('forwardMessage',data)
}
copyMessage(chat_id,from_chat_id,message_id,advanced){
 let data = {
   chat_id: String(chat_id),
   from_chat_id: String(from_chat_id),
   message_id : Number(message_id)
 }
 if(advanced){
      data.advanced = advanced
 }
 return this.request('copyMessage',data)
}
sendPhoto(chat_id,photo,advanced){
 let data = {
   chat_id: String(chat_id),
   photo: photo
 }
 if(advanced){
      data.advanced = advanced
 }
 return this.request('sendPhoto',data)
}
sendAudio(chat_id,audio,advanced){
 let data = {
   chat_id: String(chat_id),
   audio: audio
 }
 if(advanced){
      data.advanced = advanced
 }
 return this.request('sendAudio',data)
}
sendDocument(chat_id,document,advanced){
 let data = {
   chat_id: String(chat_id),
   document: document
 }
 if(advanced){
      data.advanced = advanced
 }
 return this.request('sendDocument',data)
}
sendVideo(chat_id,video,advanced){
let data = {
   chat_id: String(chat_id),
   video: video
 }
 if(advanced){
      data.advanced = advanced
 }
 return this.request('sendVideo',data)
}
sendAnimation(chat_id,animation,advanced){
let data = {
   chat_id: String(chat_id),
   animation: animation
 }
 if(advanced){
      data.advanced = advanced
 }
 return this.request('sendAnimation',data)
}
sendVoice(chat_id,voice,advanced){
let data = {
   chat_id: String(chat_id),
   voice: voice
 }
 if(advanced){
      data.advanced = advanced
 }
 return this.request('sendVoice',data)
}
sendVideoNote(chat_id,video_note,advanced){
let data = {
   chat_id: String(chat_id),
   video_note: video_note
 }
 if(advanced){
      data.advanced = advanced
 }
 return this.request('sendVideoNote',data)
}
sendMediaGroup(chat_id,media,advanced){
let data = {
   chat_id: String(chat_id),
   media: JSON.stringify(media)
 }
 if(advanced){
      data.advanced = advanced
 }
 return this.request('sendMediaGroup',data)
}
sendLocation(chat_id,latitude,longitude,advanced){
let data = {
   chat_id: String(chat_id),
   latitude: latitude,
   longitude:longitude
 }
 if(advanced){
      data.advanced = advanced
 }
 return this.request('sendLocation',data)
}
editMessageLiveLocation(chat_id,message_id,latitude,longitude,advanced){
let data = {
   chat_id: String(chat_id),
   message_id: message_id,
   latitude: latitude,
   longitude:longitude
 }
 if(advanced){
      data.advanced = advanced
 }
 return this.request('editMessageLiveLocation',data)
}
stopMessageLiveLocation(chat_id,message_id,advanced){
let data = {
   chat_id: String(chat_id),
   message_id: message_id
 }
 if(advanced){
      data.advanced = advanced
 }
 return this.request('stopMessageLiveLocation',data)
}
sendVenue(chat_id,latitude,longitude,advanced){
let data = {
   chat_id: String(chat_id),
   latitude: latitude,
   longitude : longitude
 }
 if(advanced){
      data.advanced = advanced
 }
 return this.request('sendVenue',data)
}
sendContact(chat_id,phone_number,first_name,advanced){
let data = {
   chat_id: String(chat_id),
   phone_number: phone_number,
   first_name : first_name
 }
 if(advanced){
      data.advanced = advanced
 }
 return this.request('sendContact',data)
}
sendPoll(chat_id,question,options,advanced){
let data = {
   chat_id: String(chat_id),
   question: question,
   options : JSON.stringify(options)
 }
 if(advanced){
      data.advanced = advanced
 }
 return this.request('sendPoll',data)
}
sendDice(chat_id,emoji,advanced){
let data = {
   chat_id: String(chat_id),
   emoji : emoji
 }
 if(advanced){
      data.advanced = advanced
 }
 return this.request('sendDice',data)
}
sendChatAction(chat_id,action){
let data = {
   chat_id: String(chat_id),
   action : action
 }
 return this.request('sendChatAction',data)
}
getUserProfilePhotos(user_id,offset,limit){
let data = {
   user_id: String(user_id),
   offset : offset,
   limit : limit
 }
 return this.request('getUserProfilePhotos',data)
}
getFile(file_id){
let data = {
   file_id : file_id
 }
 return this.request('getFile',data)
}
kickChatMember(chat_id,user_id,advanced){
let data = {
   chat_id: String(chat_id),
   user_id : String(user_id)
 }
 if(advanced){
      data.advanced = advanced
 }
 return this.request('kickChatMember',data)
}
unbanChatMember(chat_id,user_id,advanced){
let data = {
   chat_id: String(chat_id),
   user_id :String(user_id)
 }
 if(advanced){
      data.advanced = advanced
 }
 return this.request('unbanChatMember',data)
}
restrictChatMember(chat_id,user_id,advanced){
let data = {
   chat_id: String(chat_id),
   user_id : String(user_id)
 }
 if(advanced){
      data.advanced = advanced
 }
 return this.request('restrictChatMember',data)
}
promoteChatMember(chat_id,user_id,advanced){
let data = {
   chat_id: String(chat_id),
   user_id : String(user_id)
 }
 if(advanced){
      data.advanced = advanced
 }
 return this.request('promoteChatMember',data)
}
setChatAdministratorCustomTitle(chat_id,user_id,custom_title){
let data = {
   chat_id: String(chat_id),
   user_id : String(user_id),
   custom_title : custom_title
 }
 return this.request('setChatAdministratorCustomTitle',data)
}
setChatPermissions(chat_id,permissions){
let data = {
   chat_id: String(chat_id),
   permissions : JSON.stringify(permissions)
 }
 return this.request('setChatPermissions',data)
}
exportChatInviteLink(chat_id){
let data = {
   chat_id: String(chat_id)
 }
 return this.request('exportChatInviteLink',data)
}
setChatPhoto(chat_id,photo){
let data = {
   chat_id: String(chat_id),
   photo : photo
 }
 return this.request('setChatPhoto',data)
}
deleteChatPhoto(chat_id){
let data = {
   chat_id: String(chat_id)
 }
 return this.request('deleteChatPhoto',data)
}
setChatTitle(chat_id,title){
let data = {
   chat_id: String(chat_id),
   title : title
 }
 return this.request('setChatTitle',data)
}
setChatDescription(chat_id,description){
let data = {
   chat_id: String(chat_id),
   description : description
 }
 return this.request('setChatDescription',data)
}
pinChatMessage(chat_id,message_id,advanced){
let data = {
   chat_id: String(chat_id),
   message_id : message_id
 }
 if(advanced){
      data.advanced = advanced
 }
 return this.request('pinChatMessage',data)
}
unpinChatMessage(chat_id,message_id){
let data = {
   chat_id: String(chat_id),
   message_id : message_id
 }
 return this.request('unpinChatMessage',data)
}
unpinAllChatMessages(chat_id){
let data = {
   chat_id: String(chat_id)
 }
 return this.request('unpinAllChatMessages',data)
}
leaveChat(chat_id){
let data = {
   chat_id: String(chat_id)
 }
 return this.request('leaveChat',data)
}
getChat(chat_id){
let data = {
   chat_id: String(chat_id)
 }
 return this.request('getChat',data)
}
getChatAdministrators(chat_id){
let data = {
   chat_id: String(chat_id)
 }
 return this.request('getChatAdministrators',data)
}
getChatMembersCount(chat_id){
let data = {
   chat_id: String(chat_id)
 }
 return this.request('getChatMembersCount',data)
}
getChatMember(chat_id,user_id){
let data = {
   chat_id: String(chat_id),
   user_id : String(user_id)
 }
 return this.request('getChatMember',data)
}
setChatStickerSet(chat_id,sticker_set_name){
let data = {
   chat_id: String(chat_id),
   sticker_set_name : sticker_set_name
 }
 return this.request('setChatStickerSet',data)
}
deleteChatStickerSet(chat_id){
let data = {
   chat_id: String(chat_id)
 }
 return this.request('deleteChatStickerSet',data)
}
answerCallbackQuery(callback_query_id,text,advanced){
let data = {
   callback_query_id: String(callback_query_id),
   text : text
 }
 if(advanced){
      data.advanced = advanced
 }
 return this.request('answerCallbackQuery',data)
}
setMyCommands(commands){
let data = {
   commands: JSON.stringify(commands)
 }
 return this.request('setMyCommands',data)
}
getMyCommands(){
 return this.request('getMyCommands')
}
editMessageText(chat_id,message_id,text,advanced){
let data = {
   chat_id: String(chat_id),
   message_id : message_id,
   text : text
 }
 if(advanced){
      data.advanced = advanced
 }
 return this.request('editMessageText',data)
}
editMessageCaption(chat_id,message_id,caption,advanced){
let data = {
   chat_id: String(chat_id),
   message_id : message_id,
   caption : caption
 }
 if(advanced){
      data.advanced = advanced
 }
 return this.request('editMessageCaption',data)
}
editMessageMedia(chat_id,message_id,media,advanced){
let data = {
   chat_id: String(chat_id),
   message_id : message_id,
   media : JSON.stringify(media)
 }
 if(advanced){
      data.advanced = advanced
 }
 return this.request('editMessageMedia',data)
}
editMessageReplyMarkup(chat_id,message_id,reply_markup,advanced){
let data = {
   chat_id: String(chat_id),
   message_id : message_id,
   reply_markup : JSON.stringify(reply_markup)
 }
 if(advanced){
      data.advanced = advanced
 }
 return this.request('editMessageReplyMarkup',data)
}
stopPoll(chat_id,message_id,advanced){
let data = {
   chat_id: String(chat_id),
   message_id : message_id
 }
 if(advanced){
      data.advanced = advanced
 }
 return this.request('stopPoll',data)
}
deleteMessage(chat_id,message_id){
let data = {
   chat_id: String(chat_id),
   message_id : message_id
 }
 return this.request('deleteMessage',data)
}
sendSticker(chat_id,sticker,advanced){
let data = {
   chat_id: String(chat_id),
   sticker : sticker
 }
 if(advanced){
      data.advanced = advanced
 }
 return this.request('sendSticker',data)
}
getStickerSet(name){
let data = {
   name : name
 }
 return this.request('getStickerSet',data)
}
uploadStickerFile(user_id,png_sticker){
let data = {
   user_id : String(user_id),
   png_sticker : png_sticker
 }
 return this.request('uploadStickerFile',data)
}
createNewStickerSet(user_id,name,title,emojis,advanced){
let data = {
   user_id: String(user_id),
   name : name,
   title : title,
   emojis : emojis
 }
 if(advanced){
      data.advanced = advanced
 }
 return this.request('createNewStickerSet',data)
}
addStickerToSet(user_id,name,emojis,advanced){
let data = {
   user_id: String(user_id),
   name : name,
   emojis : emojis
 }
 if(advanced){
      data.advanced = advanced
 }
 return this.request('addStickerToSet',data)
}
setStickerPositionInSet(sticker,position){
let data = {
   sticker : sticker,
   position : position
 }
 return this.request('setStickerPositionInSet',data)
}
deleteStickerFromSet(sticker){
let data = {
   sticker : sticker
 }
 return this.request('deleteStickerFromSet',data)
}
setStickerSetThumb(name,user_id,thumb){
let data = {
   name : name,
   user_id : String(user_id),
   thumb : thumb
 }
 return this.request('setStickerSetThumb',data)
}
answerInlineQuery(inline_query_id,results,advanced){
let data = {
   inline_query_id: inline_query_id,
   results : JSON.stringify(results)
 }
 if(advanced){
      data.advanced = advanced
 }
 return this.request('answerInlineQuery',data)
}
createChatInviteLink(chat_id,advanced){
  let data = {
   chat_id: String(chat_id)
 }
 if(advanced){
      data.advanced = advanced
 }
 return this.request('createChatInviteLink',data)
}
editChatInviteLink(chat_id,invite_link,advanced){
  let data = {
   chat_id: String(chat_id),
   invite_link : invite_link
 }
 if(advanced){
      data.advanced = advanced
 }
 return this.request('editChatInviteLink',data)
}
revokeChatInviteLink(chat_id,invite_link){
  let data = {
   chat_id: String(chat_id),
   invite_link : invite_link
 }
 return this.request('revokeChatInviteLink',data)
}
}
