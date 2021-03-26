var build = {
 button :{
  url : function(text,url){
   try{
   return {text:text,url:url}
   }catch(error){
    return error
   }
  },
  callback : function(text,callback_data,hide){
   try{
     return {text:text,callback_data:callback_data,hide: hide||false}
   }catch (error){
    return error
    }
   }
  },
  random : function (array){
   try{
     if(!array){
      return 'array required!'
     }
     return array[Math.floor(Math.random() * array.length)]
   }catch(error){
      return error
   }
  },
  loop : function (number,next){
  try{
    if(!number){
     return 'number required'
    }
    let num = Number(number)
    for(let i = 0; i < num; i++ ){
     next(i)
    }
  }catch (error){
    return error
  }
  },
  file : function (file_name,data,contentType){
   try{
    if(contentType){
     return Utilities.newBlob(data,contentType,file_name)
    }else{
     return Utilities.newBlob(data,null,file_name)
    }
   }catch(error){
    return error
   }
  },
  unzip : function(blob){
   try{
     return Utilities.unzip(blob)
   }catch(error){
     return error
   }
  },
  zip : function(name,blob,extension){
    try{
      if(extension){
        return Utilities.zip(blob,`${name}.${extension}`)
      }else{
        return Utilities.zip(blob,`${name}.zip`)
      }
    }catch(error){
      return error
    }
  }
}

bot.prototype.build = build
