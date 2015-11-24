window.psHero = {
  start: function start() {
    function hasClass(el, className) {
      if (el.classList)
        return el.classList.contains(className)
      else
        return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
    }

    function addClass(el, className) {
      if (el.classList)
        el.classList.add(className)
      else if (!hasClass(el, className)) el.className += " " + className
    }

    function removeClass(el, className) {
      if (el.classList)
        el.classList.remove(className)
      else if (hasClass(el, className)) {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
        el.className=el.className.replace(reg, ' ')
      }
    }

    function loadSound(sound, filePath, done) {
      sound.innerHTML = '<audio class="psh__audio">' +
          '<source src="' + filePath + '.mp3" type="audio/mpeg" />' +
          '<source src="' + filePath + '.ogg" type="audio/ogg" />' +
        '</audio>'
    }

    function createTimer() {
      var startTime = Date.now()
      return function timer() {
        return Date.now() - startTime
      }
    }

    function roundTimeTo(time, nearest) {
      return Math.round(time / nearest) * nearest
    }

    function roundTime(time) {
      return roundTimeTo(time, 500)
    }

    function isActionKey(KEYS, key) {
      return Object.keys(KEYS)
        .map(function (k) { return +k })
        .indexOf(key) > -1
    }

    function getLane(KEYS, key) {
      return KEYS[key]
    }

    function isInLane(targetLane, lane) {
      return targetLane === lane
    }

    function isInTime(targetTime, time) {
      return time <= targetTime + HIT_ALLOWANCE
          && time >= targetTime - HIT_ALLOWANCE
    }

    function isHit(song, lane, time) {
      return song.filter(function (note) {
        return isInTime(time, note.time) && isInLane(lane, note.lane)
      }).length > 0
    }

    function setScore(actual, outOf) {
      document.querySelector('.psh__score__actual').innerHTML = actual
      document.querySelector('.psh__score__out-of').innerHTML = '/' + outOf
    }

    function highlightLane(lane) {
      var btn = document.querySelector('.psh__hitkey--' + lane)
      addClass(btn, 'psh__hitkey--highlight')
      addClass(btn, 'psh__hitkey--highlight--' + lane)
      setTimeout(function () {
        removeClass(btn, 'psh__hitkey--highlight')
        removeClass(btn, 'psh__hitkey--highlight--' + lane)
      }, TIME_TO_KEY_FEEDBACK)
    }

    function detectHit(getTime, evt) {
      var key = evt.which
      if (isActionKey(KEYS, key)) {
        highlightLane(getLane(KEYS, key))

        if (isHit(song, getLane(KEYS, key), getTime())) {
          setScore(score++, song.length)
          addClass(hitzone, 'psh__hitzone--hit')
          setTimeout(function () { removeClass(hitzone, 'psh__hitzone--hit') }, TIME_TO_HIT_FEEDBACK)
        } else {
          addClass(hitzone, 'psh__hitzone--miss')
          setTimeout(function () { removeClass(hitzone, 'psh__hitzone--miss') }, TIME_TO_HIT_FEEDBACK)
        }
      }
    }

    function isTimeToDrop(targetTime, time) {
      return (TIME_TO_HITZONE + roundTimeTo(targetTime, 100)) === time
    }

    function dropNote(note) {
      var el = document.createElement('div')
      el.className = 'psh__token psh__falling'

      var lane = document.querySelector('.psh__lane--' + note.lane)
      lane.appendChild(el)
      setTimeout(function () { lane.removeChild(el) }, TIME_TO_DISAPPEAR)
    }

    function dropNotes(getTime, evt) {
      song.forEach(function (note) {
        if (isTimeToDrop(getTime(), note.time)) {
          dropNote(note)
        }
      })
    }

    function endGame() {
      removeClass(modal, 'psh__modal--hidden')
      addClass(hitzone, 'psh__hitzone--hidden')
    }

    var HIT_ALLOWANCE = 300
    var TIME_TO_KEY_FEEDBACK = 300
    var TIME_TO_HIT_FEEDBACK = 400
    var TIME_TO_HITZONE = 1000
    var TIME_TO_DISAPPEAR = 1500
    var SONG_TIME = 25000
    var SOUND_FILE_PATH = 'song'
    var KEYS = {
      65: 1, // A
      83: 2, // S
      68: 3, // D
      70: 4  // F
    }

    var song = [
      { lane: 1, time: 1800 },
      { lane: 2, time: 2700 },
      { lane: 3, time: 3600 },
      { lane: 4, time: 4500 },
      { lane: 1, time: 5500 },
      { lane: 2, time: 6400 },
      { lane: 3, time: 7300 },
      { lane: 4, time: 8200 },
      { lane: 1, time: 9100 },
      { lane: 3, time: 10000 },
      { lane: 2, time: 11000 },
      { lane: 4, time: 11900 },
      { lane: 1, time: 12800 },
      { lane: 3, time: 13700 },
      { lane: 2, time: 14700 },
      { lane: 4, time: 15500 },
      { lane: 1, time: 16500 },
      { lane: 2, time: 17400 },
      { lane: 3, time: 18300 },
      { lane: 4, time: 19200 },
      { lane: 1, time: 20100 },
      { lane: 2, time: 21000 },
      { lane: 3, time: 21900 },
      { lane: 4, time: 22900 }
    ]
    var score = 0
    var sound = document.querySelector('.psh__sound')
    var hitzone = document.querySelector('.psh__hitzone')
    var modal = document.querySelector('.psh__modal')

    loadSound(sound, SOUND_FILE_PATH)

    var audio = document.querySelector('.psh__audio')
    audio.addEventListener('canplaythrough', function () {
      var getTime = createTimer()
      document.addEventListener('keydown', detectHit.bind(this, getTime))
      audio.play()
      setInterval(dropNotes.bind(this, getTime), 100)
      setScore(score, song.length)

      setTimeout(endGame, SONG_TIME)
    })
  }
}
