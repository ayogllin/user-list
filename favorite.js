(function () {
  const BASE_URL = 'https://lighthouse-user-api.herokuapp.com/'
  const INDEX_URL = BASE_URL + 'api/v1/users/'
  const dataPanel = document.getElementById('data-panel')
  const data = JSON.parse(localStorage.getItem('favoriteUsers')) || []
  const searchBtn = document.getElementById('submit-search')
  const searchInput = document.getElementById('search')
  const pagination = document.getElementById('pagination')
  const USER_PER_PAGE = 18
  const genderFilter = document.getElementById('genderFilter')

  let paginationData = []

  // displayDataList(data)
  getTotalPages(data)
  getPageData(1, data)

  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-user')) {
      // console.log(event.target)
      showUser(event.target.dataset.id)
    } else if (event.target.matches('.btn-remove-favorite')) {
      // console.log(event.target)
      removeFavoriteUser(event.target.dataset.id)
    }
  })

  searchBtn.addEventListener('click', event => {
    let results = []
    event.preventDefault()

    const regex = new RegExp(searchInput.value, 'i')
    results = data.filter(user => user.name.match(regex) || user.surname.match(regex))
    displayDataList(results)
  })

  pagination.addEventListener('click', event => {
    if (event.target.tagName === 'A') {
      // console.log(event.target)
      getPageData(event.target.dataset.page)
    }
  })

  genderFilter.addEventListener('click', event => {
    let results = []
    event.preventDefault()

    if (event.target.matches('.allUser')) {
      results = data
    } else if (event.target.matches('.maleUser')) {
      results = data.filter(user => user.gender === "male")
    } else if (event.target.matches('.femaleUser')) {
      results = data.filter(user => user.gender.match("female"))
    }
    displayDataList(results)
  })

  function displayDataList(data) {
    let htmlContent = ''
    data.forEach(function (item) {
      const name = `${item.name} ${item.surname}`
      htmlContent += `
      <div class="col-sm-4 mt-3">
        <div class="card mb-2 border border-secondary rounded">
          <img class="card-img-top" src="${item.avatar}" alt="Card image cap" >
          <div class="card-body">
            <span class="card-title userName">${name}</span>
            <p class="card-text"><small>Last updated on ${item.updated_at.slice(0, 10)}</small></p>
          </div>
          <div class="card-footer">
            <div class="info">
              <button class="btn btn-info cardRegion" disabled>${item.region}</button>
              <button class="btn btn-info cardGender" disabled>${item.gender}</button>
            </div>
            <div class="moreAndRemove mt-2">
              <button class="btn btn-primary btn-show-user" data-toggle="modal" data-id="${item.id}" data-toggle="modal" data-target="#show-user-modal"><strong>More</strong></button>
              <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
            </div>
          </div>
        </div>
      </div>
      `
    })
  dataPanel.innerHTML = htmlContent
  }

  function showUser(id) {
    // GET ELEMENTS
    const modalName = document.getElementById('show-user-name')
    const modalImage = document.getElementById('show-user-image')
    const modalRegion = document.getElementById('show-user-region')
    const modalGender = document.getElementById('show-user-gender')
    const modalBirthday = document.getElementById('show-user-birthday')
    const modalEmail = document.getElementById('show-user-email')

    // SET REQUEST URL
    const url = INDEX_URL + id
    // console.log(url)

    // SEND REQUEST TO SHOW API
    axios.get(url).then((res) => {
      const data = res.data
      // console.log(data)
      const name = `${data.name} ${data.surname}`

      // INSERT DATA INTO MODAL UI
      modalName.textContent = name
      modalImage.innerHTML = `<img src="${data.avatar}" class="img-fluid border border-secondary rounded" alt="Responsive image">`
      modalRegion.textContent = `@${data.region}`
      // modalGender.textContent = `Gender: ${data.gender}`
      modalBirthday.textContent = `Birthday: ${data.birthday}`
      modalEmail.textContent = `Email: ${data.email}`
    })
  }

  function removeFavoriteUser(id) {
    const index = data.findIndex(item => item.id === Number(id))
    if (index === -1) return

    data.splice(index, 1)
    localStorage.setItem('favoriteUsers', JSON.stringify(data))

    displayDataList(data)
  }

  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / USER_PER_PAGE) || 1
    let pageItemContent = ''
    for (i = 0; i < totalPages; i++) {
      pageItemContent += `
      <li class="page-item">
        <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
      </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }

  function getPageData(pageNum, data) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * USER_PER_PAGE
    let pageData = paginationData.slice(offset, offset + USER_PER_PAGE)
    displayDataList(pageData)
  }

})()