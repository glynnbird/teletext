//var db = new PouchDB('teletext');

var justify = function(str, len) {
  var re = RegExp("(?:\\s|^)(.{1," + len + "})(?=\\s|$)", "g");
  var res = [];
  var finalResult = [];
  while ((m = re.exec(str)) !== null) {
    res.push(m[1]);
  }
  for (var i = 0; i < res.length - 1; i++){    
    if(res[i].indexOf(' ') != -1){  
      while(res[i].length < len){      
        for(var j=0; j < res[i].length-1; j++){
          if(res[i][j] == ' '){
            res[i] = res[i].substring(0, j) + " " + res[i].substring(j);
            if(res[i].length == len) break;
            while(res[i][j] == ' ') j++;
          }
        }
      }      
    }    
    finalResult.push(res[i]);    
  }
  finalResult.push(res[res.length - 1]);
  let first = true
  finalResult = finalResult.map((l) => {
    if (first) {
      first = false
      return l
    } else {
      return ' ' + l
    }
  })
  return finalResult.join('\n');
}

var app = new Vue({
  el: '#app',
  data: {
    pageStr: '100',
    page: 100,
    date: '',
    time: '',
    progress: 0,
    stories: []
  },
  methods: {
    next: () => {
      app.goto((app.page+1).toString())
    },
    previous: () => {
      app.goto((app.page-1).toString())
    },
    goto: (page) => {
      if (typeof page === 'number') {
        app.pageStr = page.toString()
        app.page = page
      } else {
        app.pageStr = page
        app.page = parseInt(app.pageStr)
      }
    },
    key: async (e) => {
      if (e.keyCode === 39 || e.keyCode === 38) {
        app.page = ++app.page % 1000
        app.pageStr = app.page.toString()
      } else if (e.keyCode === 37 || e.keyCode === 40) {
        app.page = --app.page % 1000
        if (app.page === -1) {
          app.page = 999
        }
        app.pageStr = app.page.toString()
      } else if ((e.keyCode>=48 && e.keyCode <=57) || 
          (e.keyCode>=96 && e.keyCode <=105)) {
        if (app.pageStr.length === 3) {
          app.pageStr = ''
        }
        app.pageStr += e.key
        if(app.pageStr.length === 3) {
          app.page = parseInt(app.pageStr)
        }
      } else if (e.keyCode === 8 ) {
        if (app.pageStr.length > 0) {
          app.pageStr = app.pageStr.substr(0,app.pageStr.length - 1)
        }
      }
    }
  },
  computed: {
    paddedPageStr: function() {
      return this.pageStr.padEnd(3, '_')
    },
    subsetOfStories: function() {
      if (this.page < 101 || this. page >= 200) {
        return []
      }
      const start = 10 * (this.page - 101)
      return this.stories.slice(start, start + 10)
    },
    story: function() {
      if (this.page.toString().length !== 3) {
        return null
      }
      if (this.page >= 200) {
        return this.stories[this.page - 200]
      }
      return null
    }
  },
  created() {
    window.addEventListener('keydown', async (e) => {
      app.key(e)
    });
  }
})

const formatDate = function() {
  const d = new Date()
  app.date = d.toISOString().substring(0,19).replace('T',' ')
}
setInterval(formatDate, 1000)

const fetchURL = async function(url) {
  return new Promise((resolve, reject) => {
    fetch(url).then(function(response) {
      return response.json();
    }).then(function(j) {
      resolve(j)
    });
  })
}
const loadStories = async function() {
  const u = window.location.origin + '/api/poll'
  // return {"ok":true,"feed":[{"title":"CCTV shows pupils abused and locked in padded room","description":"Police have said staff will not face action over abuse of autistic children shown in videos leaked to the BBC.","link":"https://www.bbc.com/news/articles/cjw0e3zjx2lo","guid":{"#text":"https://www.bbc.com/news/articles/cjw0e3zjx2lo#0","@_isPermaLink":"false"},"pubDate":"2024-11-26T22:00:57.000Z","media":"https://ichef.bbci.co.uk/ace/standard/240/cpsprodpb/316f/live/601a4b30-ac03-11ef-bdf5-b7cb2fa86e10.jpg"},{"title":"Storm Conall brings more rain to parts of England and Wales","description":"Heavy rainfall is hitting southern England, where 100 flood warnings remain in place.","link":"https://www.bbc.com/news/articles/czxvlkql232o","guid":{"#text":"https://www.bbc.com/news/articles/czxvlkql232o#0","@_isPermaLink":"false"},"pubDate":"2024-11-27T08:07:15.000Z","media":"https://ichef.bbci.co.uk/ace/standard/240/cpsprodpb/5fa8/live/007aeda0-ac1d-11ef-a4fe-a3e9a6c5d640.jpg"},{"title":"Plan to boost NHS dental treatments 'not on track', says watchdog","description":"Watchdog warns target of 1.","link":"https://www.bbc.com/news/articles/cg7gxrv9v75o","guid":{"#text":"https://www.bbc.com/news/articles/cg7gxrv9v75o#0","@_isPermaLink":"false"},"pubDate":"2024-11-27T01:19:02.000Z","media":"https://ichef.bbci.co.uk/ace/standard/240/cpsprodpb/43e1/live/23dc2630-ac0c-11ef-bdf5-b7cb2fa86e10.jpg"},{"title":"Loyalty cards offer genuine savings, says watchdog","description":"Supermarket customers can save money with loyalty cards but should still shop around.","link":"https://www.bbc.com/news/articles/cew2ejj7lkvo","guid":{"#text":"https://www.bbc.com/news/articles/cew2ejj7lkvo#0","@_isPermaLink":"false"},"pubDate":"2024-11-27T08:41:25.000Z","media":"https://ichef.bbci.co.uk/ace/standard/240/cpsprodpb/fdb1/live/87a9e390-ac94-11ef-876e-1195952be83c.png"},{"title":"Electric car targets under review as backlash grows","description":"The government faces pressure from the industry to make changes to electric vehicle sales quotas.","link":"https://www.bbc.com/news/articles/c98dzyy850jo","guid":{"#text":"https://www.bbc.com/news/articles/c98dzyy850jo#0","@_isPermaLink":"false"},"pubDate":"2024-11-27T09:26:17.000Z","media":"https://ichef.bbci.co.uk/ace/standard/240/cpsprodpb/d106/live/7ece1560-abff-11ef-a04a-6f5efadaaae2.jpg"},{"title":"Gambling slots online to be limited to £5 per spin","description":"Government claims reforms will reduce gambling-related harm and raise funds to treat addiction.","link":"https://www.bbc.com/news/articles/ce3y60wzer6o","guid":{"#text":"https://www.bbc.com/news/articles/ce3y60wzer6o#0","@_isPermaLink":"false"},"pubDate":"2024-11-27T00:01:27.000Z","media":"https://ichef.bbci.co.uk/ace/standard/240/cpsprodpb/c3dc/live/4e17e380-ac34-11ef-b9f1-a72b8201662d.jpg"},{"title":"Aston Martin issues second profit warning in two months","description":"The iconic firm blames \"minor delay\" in deliveries of its ultra-exclusive Valiant cars for the shortfall.","link":"https://www.bbc.com/news/articles/c98dze04eyyo","guid":{"#text":"https://www.bbc.com/news/articles/c98dze04eyyo#0","@_isPermaLink":"false"},"pubDate":"2024-11-27T04:58:18.000Z","media":"https://ichef.bbci.co.uk/ace/standard/240/cpsprodpb/6324/live/f42ad5d0-ac6f-11ef-810c-759dc8d4fdc4.jpg"},{"title":"Groucho Club closes over 'serious crime' claims","description":"Westminster City Council says it suspended the Soho venue’s licence following a request by the Met.","link":"https://www.bbc.com/news/articles/cwy9rvpl4rpo","guid":{"#text":"https://www.bbc.com/news/articles/cwy9rvpl4rpo#1","@_isPermaLink":"false"},"pubDate":"2024-11-27T09:13:56.000Z","media":"https://ichef.bbci.co.uk/ace/standard/240/cpsprodpb/dcb0/live/4cf45b60-ac92-11ef-876e-1195952be83c.jpg"},{"title":"Remains exhumed from cemetery in search for Troubles dead","description":"The ICLVR says the timeframe and location \"coincide with the disappearance of Joe Lynskey in 1972\".","link":"https://www.bbc.com/news/articles/c5yxnenlj0qo","guid":{"#text":"https://www.bbc.com/news/articles/c5yxnenlj0qo#1","@_isPermaLink":"false"},"pubDate":"2024-11-26T23:46:03.000Z","media":"https://ichef.bbci.co.uk/ace/standard/240/cpsprodpb/8a58/live/72710970-ac4b-11ef-bfca-7d99fb9e396c.jpg"},{"title":"Mother of child hidden in drawer from birth jailed","description":"Prosecutors say the girl had \"never known daylight or fresh air\" when she was found.","link":"https://www.bbc.com/news/articles/c4gz1dv8ly2o","guid":{"#text":"https://www.bbc.com/news/articles/c4gz1dv8ly2o#1","@_isPermaLink":"false"},"pubDate":"2024-11-26T18:51:33.000Z","media":"https://ichef.bbci.co.uk/ace/standard/240/cpsprodpb/dcae/live/042d86a0-ac23-11ef-a0a3-db79ddc45b90.jpg"},{"title":"MPs back plans for phased smoking ban","description":"The legislation would make it illegal for anyone aged 15 or younger to ever buy cigarettes in the UK.","link":"https://www.bbc.com/news/articles/cx2lwjrdj1lo","guid":{"#text":"https://www.bbc.com/news/articles/cx2lwjrdj1lo#1","@_isPermaLink":"false"},"pubDate":"2024-11-26T20:29:33.000Z","media":"https://ichef.bbci.co.uk/ace/standard/240/cpsprodpb/7718/live/c2797750-ac31-11ef-857a-257cb5d14cdb.jpg"},{"title":"Vauxhall owner to close Luton factory ","description":"Motor giant Stellantis says it is closing the van making plant in the context of the UK's rules on electric vehicle sales.","link":"https://www.bbc.com/news/articles/cy8n3n62wq4o","guid":{"#text":"https://www.bbc.com/news/articles/cy8n3n62wq4o#1","@_isPermaLink":"false"},"pubDate":"2024-11-26T21:29:20.000Z","media":"https://ichef.bbci.co.uk/ace/standard/240/cpsprodpb/70c3/live/2323d5e0-ac10-11ef-a4fe-a3e9a6c5d640.jpg"},{"title":"UK winner of EuroMillions scoops £177m jackpot","description":"A UK ticket-holder has won £177m on EuroMillions, the third biggest jackpot in British history.","link":"https://www.bbc.com/news/articles/c154jn0gd0eo","guid":{"#text":"https://www.bbc.com/news/articles/c154jn0gd0eo#1","@_isPermaLink":"false"},"pubDate":"2024-11-27T04:09:39.000Z","media":"https://ichef.bbci.co.uk/ace/standard/240/cpsprodpb/20bb/live/88172b50-ac47-11ef-bfca-7d99fb9e396c.jpg"},{"title":"Devon water parasite outbreak area gets £1m boost","description":"The cash will help Brixham recover after the incident caused \"appalling” headlines, businesses say.","link":"https://www.bbc.com/news/articles/cdxv04gx1eqo","guid":{"#text":"https://www.bbc.com/news/articles/cdxv04gx1eqo#1","@_isPermaLink":"false"},"pubDate":"2024-11-27T06:10:10.000Z","media":"https://ichef.bbci.co.uk/ace/standard/240/cpsprodpb/3954/live/91959120-ab26-11ef-8487-d5a0de19ffaf.jpg"},{"title":"Youth to get 'guaranteed' training in jobs overhaul","description":"The government wants more young people in work as it aims to boost the overall employment rate.","link":"https://www.bbc.com/news/articles/cqxwv3n87g4o","guid":{"#text":"https://www.bbc.com/news/articles/cqxwv3n87g4o#1","@_isPermaLink":"false"},"pubDate":"2024-11-26T17:53:05.000Z","media":"https://ichef.bbci.co.uk/ace/standard/240/cpsprodpb/2d9f/live/501ec490-abc7-11ef-bf89-3587f5ea0a74.jpg"}]}
  return fetchURL(u)
}

const startup = async function() {
  app.progress = 0
  const stories = await loadStories()
  let id = 200
  for(var i in stories.feed) {
    story = stories.feed[i]
    story.text = story.title
    story.url = story.link
    story.shorturl = story.link.substr(0, 20)
    story.time = story.pubDate
    story.justified = justify(story.description, 39)
    story.justifiedTitle = justify(story.title, 39)
    story.id = id
    app.stories.push(story)
    app.progress++
    id++
    if (id >= 300) {
      break
    }
  }
}
startup()
