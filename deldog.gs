/*
This Library made by @butthx to easy paste text in del.dog!
*/
var dg = class dg{
    constructor(url){
     this.baseurl = url || 'https://del.dog'
    }
    paste(code){
    try{
    let option = {
      method : 'POST',
      contentType:'text/plain',
      payload: code
     }
    let result = JSON.parse(UrlFetchApp.fetch(this.baseurl+'/documents',option))
    return {
    content: code,
    url : this.baseurl+'/'+result.key,
    result : result
    }
    }catch(error){
      return error
    }
    }
}
