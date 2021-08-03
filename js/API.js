const apiURLPopulares = 'https://api.themoviedb.org/3/movie/popular?api_key=0c17820676c89f9c682a0ba489f5b50c&language=en-US&page=1';
const apiURLProximos = 'https://api.themoviedb.org/3/movie/upcoming?api_key=0c17820676c89f9c682a0ba489f5b50c&language=en-US&page=1';

class ApiHelper {
  ApiHelper() { }

  async getMoviesApi(url) {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Error es ${response.status}`)
      } else {
        return await response.json()
      }
    } catch (error) {
      console.error(error)
    }
  }
}

let ApiHelperInstance = new ApiHelper();
initMain();

async function initMain() {
  await BuildRenderBody(apiURLPopulares, "ContainerPopulares");
  await BuildRenderBody(apiURLProximos, "ContainerProx");

  const imageObserver = new IntersectionObserver((entries, imgObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        debugger
        const lazyImage = entry.target
        console.log("lazy loading ", lazyImage)
        lazyImage.src = lazyImage.dataset.src
        lazyImage.classList.remove("lzy_img");
        imgObserver.unobserve(lazyImage);
      }
    })
  }, { rootMargin: "-12.5% 0% -12.5% 0%" }); //12.5 arriba y abajo hace el 25, pero se debe de revisar.(Este comentario se debe quitar.)
  const arr = document.querySelectorAll('img.img-fluid.lzy_img')
  arr.forEach((v) => {
    imageObserver.observe(v);
  })
}

async function BuildRenderBody(apiURL, elementId) {
  let Response = await ApiHelperInstance.getMoviesApi(apiURL);
  let BuildHtml = "";
  let NewHtml = "";
  Response.results.forEach(element => {
    BuildHtml = `<div class="col-lg-3 col-md-6" style="display:flex;">
        <div class="box" id="bxcontent">
          <h3 style="color: #ff901c;">${element.title}</h3>
          <img  class="img-fluid lzy_img" src="" alt="" data-src = "https://image.tmdb.org/t/p/w500/${element.poster_path}"/> 
          <a onclick="verDetalles(${element.id});" class="btn-buy">Ver más</a>
        </div>
      </div>`;

    NewHtml += BuildHtml;

    let Container = document.getElementById(elementId);
    Container.innerHTML = NewHtml;
  });
}

async function BuildRenderModal(apiURL, elementId) {
  let Response = await ApiHelperInstance.getMoviesApi(apiURL);
  let BuildHtml = "";
  let NewHtml = "";

  BuildHtml = `<div class="col-6 responsiveModalContent">
        <div class="card bg-light">
          <div class="card-body text-center">
            <img src="https://image.tmdb.org/t/p/w500/${Response.poster_path}" class="img-fluid" alt="">
            <hr>
            <form class="mt-5">
              <input type="hidden" name="id" value="${Response.id}">
              <p><h5>Deja tu valoración</h5></p>
              <p class="clasificacion">
                <input id="radio1" type="radio" name="estrellas" value="5">
                <label for="radio1">★</label>
                <input id="radio2" type="radio" name="estrellas" value="4">
                <label for="radio2">★</label>
                <input id="radio3" type="radio" name="estrellas" value="3">
                <label for="radio3">★</label>
                <input id="radio4" type="radio" name="estrellas" value="2">
                <label for="radio4">★</label>
                <input id="radio5" type="radio" name="estrellas" value="1">
                <label for="radio5">★</label>
              </p>
            </form>  
          </div>
        </div>
      </div>
      <div class="col-6 responsiveModalContent">
        <div class="card bg-light">
          <div class="card-body text-left">
           <p><h5 style="text-decoration: underline;"><strong>Titulo</strong></h5></p> 
           <p>${Response.title}</p><br> 
           <p><h5 style="text-decoration: underline;"><strong>Descripción</strong></h5></p> 
           <p>${Response.overview}</p>    
          </div>
        </div>
      </div>`;

  let Container = document.getElementById(elementId);
  Container.innerHTML = BuildHtml;
}

async function verDetalles(id) {
  var url = `https://api.themoviedb.org/3/movie/${id}?api_key=0c17820676c89f9c682a0ba489f5b50c&language=es`;
  const ElementId = "bodymodaldinamic";
  await BuildRenderModal(url, ElementId);
  $('#myModal').modal('show');
}



