var lib = {
  version : '163 : ',
  ota : function(){
  try{
   let type = 'beta'
   let version = 163
   let res = JSON.parse(UrlFetchApp.fetch('https://raw.githubusercontent.com/butthx/butthx-library/master/ota.json').getContentText())
    if(res[type] <= version){
      return `BUTTHX OTA\nNo updates available. You are using the latest version.`
     }
    if(res[type] > version){
     return `BUTTHX OTA\n📥 Update Avalible.\nVersion : ${res[type]}\nChangelog : ${res.changelog}\nPlease update the library to enjoy the latest features!`
    }
   }catch(error){
     return `BUTTHX OTA\nCan't to find updates. Please try again later.`
   }
  }
}

ph.prototype.lib = lib
dg.prototype.lib = lib
bot.prototype.lib = lib
