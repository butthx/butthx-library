var dg = class dg{
  constructor(type){
    this.type = type || 'deldog'
  }
  paste(code,title,author){
    try{
      // deldog
      if(this.type == 'deldog'){
        let option = {
          method : 'POST',
          contentType:'text/plain',
          payload: code
        }
        let result = JSON.parse(UrlFetchApp.fetch('https://del.dog/documents',option))
        return {
          content: code,
          url : 'https://del.dog/'+result.key,
          result : result
        }
      }
      // nekobin
      if(this.type == 'nekobin'){
        let option = {
          method : 'POST',
          payload: {
            content : code,
            title : title || null,
            author : author || null
          }
        }
        let res = UrlFetchApp.fetch('https://nekobin.com/api/documents',option)
        let result = JSON.parse(res)
        if(result.ok){
          return {
            content : code,
            url : `https://nekobin.com/${result.result.key}`,
            result : result.result
          }
        }else{
          return res
        }
      }
      return;
    }catch(error){
      return error
    }
  }
}
