//var db = new PouchDB('teletext');

var app = new Vue({
  el: '#app',
  data: {
    pageStr: '100',
    page: 100,
    date: '',
    time: '',
    progress: 0,
    stories: {},
    subsetOfStories: {},
    story: {}
  },
  computed: {
    paddedPageStr: function() {
      return this.pageStr.padEnd(3, '_')
    }
  },
  created() {
    window.addEventListener('keydown', async (e) => {
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
      if (app.page === 999 && app.progress === 100) {
       /* await db.destroy().then( function() {
          db = new PouchDB('teletext')
          startup()
          setTimeout(function() {
            app.page = 100
            app.pageStr = '100'
          },1000)
        })*/
      }
    });
  },
  watch: {
    page: function() {
      if (this.page.toString().length !== 3) {
        return
      }
      this.subsetOfStories = {}
      this.story = {}
      if (this.page == 100) {
        return
      } 
      if (this.page >= 200) {
        this.story = this.stories[this.page]
      } else {
        const start = 200 + (this.page - 101) * 10
        for(var i = start; i < start + 10; i++) {
          this.subsetOfStories[i] = this.stories[i]
        }
      }
    }
  }
})

const formatDate = function() {
  const d = new Date()
  app.date = d.toISOString()
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
  return fetchURL(u)
}

const loadStory = async function(id) {
  const url = 'https://hacker-news.firebaseio.com/v0/item/' + id + '.json'
  return fetchURL(url)
}

const startup = async function() {
  app.progress = 0
  const stories = await loadStories()
  console.log(stories)
  return
  let id = 200
  for(var i in stories) {
    let cachedStory = null
    let story = null
    try {
      cachedStory = await db.get(stories[i].toString())
    } catch(e) {

    }
    if (!cachedStory) {
      story = await loadStory(stories[i])
      if (story.text) {
        story.text = he.decode(story.text).replace(/<[^>]*>?/gm, '').replace(/↵/g,' ')
      } else {
        story.text = ''
      }
      if (story.url) {
        const u = new URL(story.url)
        story.shorturl = u.hostname 
      }
      story._id = story.id.toString()
      delete story.id
      await db.put(story)
    } else {
      story = cachedStory
    }
    app.stories[id] = story
    app.progress++
    id++
    if (id >= 300) {
      break
    }
  }
}
startup()
