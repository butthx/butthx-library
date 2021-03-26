var mt = class mt{
     constructor(regex){
       this.default = /\((?<text>[^\)]+)\,(?<url>[^\s+]+)\)(?<same>(?:\:same)?)/gmi
       this.regex = regex || this.default
     }
     all(text,extra){
     try{
       if(extra){
         if(extra.regex){
           if(/default/i.exec(extra.regex)){
             this.regex = this.default
           }else{
            this.regex = extra.regex
            }
         }
       }
       let btnRegex = this.regex
       let keyboard = new Array()
       let restext = null
       if(!text){
         return 'text required!'
       }
       if(typeof text !== 'string'){
         return 'text must be a string!'
       }
       //detect keyboard
       if(btnRegex.exec(text)){
         let match = text.match(btnRegex)
         for(let i = 0; i < match.length; i++){
             let btn = btnRegex.exec(match[i])
             let btnText = btn.groups.text
             let btnUrl = btn.groups.url
          if(btn.groups.same){
            if(keyboard.length == 0){
              let rows = new Array()
              rows.push({text:btnText,url:btnUrl})
              if (rows.length >= 1) {
                   keyboard.push(rows)
                } else {
                   keyboard.push(rows)
                }
            }else{
               let num = Number(keyboard.length-1)
               keyboard[num].push({text:btnText,url:btnUrl})
            }
          }else{
            let rows = new Array()
              rows.push({text:btnText,url:btnUrl})
              if (rows.length >= 1) {
                   keyboard.push(rows)
                } else {
                   keyboard.push(rows)
                }
          }
           btn = btnRegex.exec(match[i])
         }
         restext = text.replace(btnRegex,'').trim()
       }else{
         restext = text
       }
       return JSON.stringify({text:restext,keyboard:keyboard})
     }catch(error){
       return error
     }
    }
  button(text,extra){
    try{
    let res = this.all(text,extra)
    let rss = JSON.parse(res)
    return rss.keyboard
    } catch (error){
      return error
    }
  }
  text(text,extra){
    try{
    let res = this.all(text)
    let rss = JSON.parse(res)
    return rss.text
    } catch (error){
      return error
    }
  }
  custRegex(regex){
    try{
        this.regex = regex
    }catch (error){
      return error
    }
  }
  defaultRegex(regex){
    try{
      this.default = regex
    } catch (error){
      return error
    }
  }
}
