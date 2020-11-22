console.log('hola mundo!');
const noCambia = "Leonidas";

let cambia = "@LeonidasEsteban"

function cambiarNombre(nuevoNombre) {
  cambia = nuevoNombre
}

const getUser1= new Promise(function (todoBien, todoMal){
  setTimeout(function() {
    todoBien('se acabó el tiempo');
  }, 5000)  
})

const getUser= new Promise(function (todoBien, todoMal){
  setTimeout(function() {
    todoBien('se acabó el tiempo 3');
  }, 3000)  
})

// getUser
//   .then(function(){
//     console.log('Todo esta bien en la vida')
//   })
//   .catch(function(message){
//     console.log(message)
//   })
Promise.race([
  getUser,
  getUser1,
])
  .then(function(message){
    console.log(message)
  })
  .catch(function(message){
    console.log(message)
  })

$.ajax('https://randomuser.me/api/',{
  method: 'GET',
  success: function(data){
    console.log(data)
  },
  error: function(error){
    console.log(error)
  }
})

fetch('https://randomuser.me/api/')
  .then(function(response){
    // console.log(response)
    return response.json()
  })
  .then(function(user){
    console.log('user', user.results[0].name.first)
  })
  .catch(function(){
    console.log('Algo fallo')
  });

  (async function load(){
    async function getData(url){
      const response = await fetch(url)
      const data = await response.json()
      if(data.data.movie_count > 0){
        return data
      }
     throw new Error('No se encontró ningún resultado')
    }

    const $form = document.getElementById('form')
    const $home = document.getElementById('home')
    const $featuringContainer = document.getElementById('featuring')

    function setAttributes($element, attributes) {
      for (const attribute in attributes){
        $element.setAttribute(attribute, attributes[attribute])
      }
    }

    const BASE_API = 'https://yts.mx/api/v2/'

    function featuringTemplate(peli) {
      return (
        `
        <div class="featuring">
          <div class="featuring-image">
            <img src="${peli.medium_cover_image}" width="70" height="100" alt="">
          </div>
          <div class="featuring-content">
            <p class="featuring-title">Pelicula encontrada</p>
            <p class="featuring-album">${peli.title}</p>
          </div>
        </div>
        `
      )
    }

    $form.addEventListener('submit', async (event) => {
      event.preventDefault();
      $home.classList.add('search-active')
      const $loader = document.createElement('img')
      setAttributes($loader, {
        src: 'src/images/loader.gif',
        height: 50,
        width: 50
      })
      $featuringContainer.append($loader)

      const data = new FormData($form)
      try{
        const {
          data: {
            movies: pelis
          }
        } = await getData(`${BASE_API}list_movies.json?limit=1&query_term=${data.get('name')}`)
        const HTMLString = featuringTemplate(pelis[0])
        $featuringContainer.innerHTML = HTMLString
      } catch(error){
          alert(error.message)
          $loader.remove()
          $home.classList.remove('serch-active')
      }
    })
    

    function videoItemTemplate(movie, category){
      return(
      `<div class="primaryPlaylistItem" data-id="${movie.id}" data-category="${category}">
          <div class="primaryPlaylistItem-image">
            <img src="${movie.medium_cover_image}">
          </div>
          <h4 class="primaryPlaylistItem-title">
            ${movie.title}
          </h4>
        </div>`
      )
    }

    function createTemplate(HTLMString){
      const html = document.implementation.createHTMLDocument()
      html.body.innerHTML = HTLMString
      return html.body.children[0];
    }

    function addEventListener($element){
      $element.addEventListener('click', () =>{
        // alert('click')
        showModal($element)
      })
    }


    function renderMovieList(list, $container, category){
      $container.children[0].remove()
      list.forEach((movie) => {
        const HTLMString = videoItemTemplate(movie, category)
        const movieElement = createTemplate(HTLMString)
        $container.append(movieElement)
        const image = movieElement.querySelector('img')
        image.addEventListener('load', () => {
          event.srcElement.classList.add('fadeIn')
        })
        addEventListener(movieElement)
      })
    }
    
    async function cacheExist(category) {
      const listName = `${category}List`;
      const cacheList = window.localStorage.getItem(listName);
  
      if (cacheList) {
        return JSON.parse(cacheList);
      }
      const { data: { movies: data } } = await getData(`${BASE_API}list_movies.json?genre=${category}`)
      window.localStorage.setItem(listName, JSON.stringify(data))
  
      return data;
    }
    
    // const { data: { movies: actionList} } = await getData(`${BASE_API}list_movies.json?genre=action`)
  const actionList = await cacheExist('action');
  // window.localStorage.setItem('actionList', JSON.stringify(actionList))
  const $actionContainer = document.querySelector('#action');
  renderMovieList(actionList, $actionContainer, 'action');

  const dramaList = await await cacheExist('drama');
  const $dramaContainer = document.getElementById('drama');
  renderMovieList(dramaList, $dramaContainer, 'drama');

  const animationList = await await cacheExist('animation');
  const $animationContainer = document.getElementById('animation');
  renderMovieList(animationList, $animationContainer, 'animation');

    
    //de otro lado
    // async function users(url) {
    //   const response = await fetch (url)
    //   const data =  await response.json()
    //   return data
    // }
    // const user = await users('https://randomuser.me/api/?results=15')
    // function userListTemplate(user){
    //   return (  
    //     `<li class="playlistFriends-item">
    //     <a href="#">
    //       <img src="${user.picture.medium}" alt="${user.name.first}" />
    //       <span>
    //       ${user.name.first}  ${user.name.last}
    //       </span>
    //     </a>
    //   </li>
    //     `
    //   )
    // }
    // const $userContainer = document.getElementById ('playlistFriends')    
    // user.results.forEach((users) => {
    //   const HTMLString =  userListTemplate(users)
    //   const html = document.implementation.createHTMLDocument() //convertir string a html
    //   html.body.innerHTML = HTMLString                           //convertir string a html
    //   $userContainer.append(html.body.children[0])
    // })





    //
    // const $home = $('.home .list #item')
    const $modal = document.getElementById('modal')
    const $overlay = document.getElementById('overlay')
    const $hideModal = document.getElementById('hide-modal')

    const $modalTitle = $modal.querySelector('h1')
    const $modalImage = $modal.querySelector('img')
    const $modalDescription = $modal.querySelector('p')      

    function findById(list, id){
      return list.find(movie => movie.id === parseInt(id, 10))
    }

    function findMovie(id, category){
      switch (category){
        case 'action': {
          return findById(actionList, id)
        }
        case 'drama': {
          return findById(dramaList, id)
        }
        default:{
          return findById(animationList, id)
        }
      }
    }

    function showModal($element){
      $overlay.classList.add('active')
      $modal.style.animation = 'modalIn .8s forwards'
      const id = $element.dataset.id
      const category = $element.dataset.category
      const data = findMovie(id, category)
      $modalTitle.textContent = data.title
      $modalImage.setAttribute('src', data.medium_cover_image)
      $modalDescription.textContent = data.description_full
    }

    $hideModal.addEventListener('click', hideModal)

    function hideModal(){
      $overlay.classList.remove('active')
      $modal.style.animation = 'modalOut .8s forwards'
    }
   
  })()