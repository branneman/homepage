!(function() {
  // Utils
  const q = s => document.querySelector(s)
  const randomItem = list => list[Math.round(Math.random() * (list.length - 1))]

  // Config
  const config = decodeURIComponent(window.location.search.substr(1)).split('|')
  const keywords = config[0].split(',')
  const api = {
    baseUrl: 'https://api.unsplash.com',
    version: 'v1',
    accessKey: config[1]
  }
  const app = q('.app')
  const location = q('.app .location')
  const user = q('.app .user')

  // App
  const qs = [
    'featured',
    `query=${randomItem(keywords)}`,
    `w=${app.offsetWidth}`,
    `h=${app.offsetHeight}`
  ]
  window
    .fetch(`${api.baseUrl}/photos/random?${qs.join('&')}`, {
      headers: {
        'Accept-Version': api.version,
        Authorization: `Client-ID ${api.accessKey}`
      }
    })
    .then(res => res.json())
    .then(res => {
      app.style.backgroundImage = `url('${res.urls.custom}')`

      const hasText = res.location && res.location.title
      const hasLatLng =
        res.location &&
        res.location.position &&
        res.location.position.latitude &&
        res.location.position.longitude
      if (hasText && hasLatLng) {
        location.innerHTML = res.location.title
        const { latitude, longitude } = res.location.position
        location.setAttribute(
          'href',
          `https://www.google.com/maps/@${latitude},${longitude},12z`
        )
      } else if (hasText && !hasLatLng) {
        location.parentElement.innerHTML = res.location.title
      } else {
        location.parentElement.remove()
      }

      user.innerHTML = res.user.name
      user.setAttribute('href', res.user.links.html)
    })
})()
