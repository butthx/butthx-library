/*This library made by @butthx! to make it easier for you to use the telegra.ph api!
Telegra.ph api : https://telegra.ph/api
ID : 1OnTWLtbd0GD3qGd2pSZUxWD1j_G4Rki75baKIgFdTN5WB78qLnjZj7qj
Beta : 1QnAO4mNqFd4Kn_MOtvIqCmGC1BvTvxv0MDmB1BvSBzAMmevVejvuk2HW
*/
var ph = class ph {
  constructor(token,author_name,author_url){
    this.urlApi = 'https://api.telegra.ph/'
    this.phToken = token
    this.authName = author_name
    this.authUrl = author_url
  }
  request(method = "",data = {}){
    var option = {
      method : "post",
      payload : data
    }
    try{
      let res =  UrlFetchApp.fetch(this.urlApi+method,option)
      let reS = JSON.parse(res)
      if(reS.ok){
        return reS.result
      }else{
        return res
      }
    }catch(error){
      return error
    }
  }
  createAccount(short_name,author_name,author_url){
    try{
      let data = {
         short_name : short_name,
         author_name : author_name,
         author_url : author_url
       }
       return this.request('createAccount',data)
     }catch(error){
       return error
     }
  }
 editAccountInfo(short_name,author_name,author_url){
     try{
       let data = {
         access_token : this.phToken,
         short_name : short_name,
         author_name : author_name,
         author_url : author_url
       }
       return this.request('editAccountInfo',data)
     }catch(error){
       return error
     }
   }
 getAccountInfo(fields){
     try{
       if(!Array.isArray(fields)){
       return 'typeoff fields must be array'
     }
    let data = {
      access_token : this.phToken,
      fields : JSON.stringify(fields)
    }
    return this.request('getAccountInfo',data)
     }catch(error){
       return error
     }
   }
 revokeAccessToken(){
     try{
       let data = {
         access_token : this.phToken
       }
       return this.request('revokeAccessToken',data)
     }catch(error){
       return error
     }
   }
 createPage(title,content,return_content){
    try{
      let rc = return_content || false
      let data = {
        access_token : this.phToken,
        title : title,
         author_name : this.authName,
         author_url : this.authUrl,
         content : JSON.stringify(content),
         return_content : rc
      }
      return this.request('createPage',data)
    }catch(error){
      return error
    }
  }
  editPage(path,title,content,return_content){
    try{
      let rc = return_content || false
      let data = {
        access_token : this.phToken,
        title : title,
        path : path,
        author_name : this.authName,
        author_url : this.authUrl,
        content : JSON.stringify(content),
        return_content : rc
      }
      return this.request('editPage',data)
    }catch(error){
      return error
    }
  }
  getPage (path,return_content){
    try{
      let rc = return_content || false
      let data = {
        path : path,
        return_content : rc
      }
      return this.request('getPage',data)
    }catch(error){
      return error
    }
  }
  getPageList(offset,limit){
    try{
      let data = {
        access_token : this.phToken,
        offset : offset,
        limit : limit
      }
      return this.request('getPageList',data)
    }catch(error){
      return error
    }
  }
  getViews(path,year,month,day,hour){
    try{
      let data = {
        path : path,
        year : year,
        month : month,
        day : day,
        hour : hour
      }
      return this.request('getViews',data)
    }catch(error){
      return error
    }
  }
}
