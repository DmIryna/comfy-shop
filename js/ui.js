export const createOverlayCart = (container) => {
  const markup = `
  <div class="cart-overlay">
    <div class="cart">
      <button class="close-btn">
        <i class="fa-sharp fa-solid fa-xmark"></i>
      </button>
      <h2>Your bag</h2>
      <div class="cart-content">
        
      </div>

      <div class="cart-footer">
        <h3>Total: $<span class="total-cart"></span></h3>
        <button class="checkout-btn">Checkout</button>
      </div>
    </div>
  </div>
  `

  container.innerHTML = markup
}

export class UI {
  cardContainer = document.querySelector(".cards")
  companyContainer = document.querySelector(".company-list")
  filteredListOfCompany = document.querySelector(".filtered-company")
  searchInput = document.querySelector("#search-input")
  slider = document.querySelector("#range-price")
  outputRange = document.querySelector(".output-range")
  header = document.querySelector(".header")
  navHeader = this.header.querySelector("nav")
  singleCompany = ""

  displayProductList(productList) {
    productList.forEach((product) => {
      const markup = `
          <div class="card">
              <div class="img-container">
              <img src="${product.img}" alt="${product.name}" />
              <button class="btn-bag" data-id=${product.id}>
                  <i class="fas fa-shopping-cart"></i>Add to cart
              </button>
              </div>
              <p>${product.name}</p>
              <p>$ <span>${product.price}</span></p>
          </div>
          `

      this.cardContainer.insertAdjacentHTML("afterbegin", markup)
    })
  }

  clearCards() {
    this.cardContainer.innerHTML = ""
  }

  displayCompanies(productList) {
    const uniqueCompanies = new Set(
      productList.map((product) => product.company)
    )
    uniqueCompanies.forEach((company) => {
      const markup = `
        <li class="company-name" id="company">${company}</li>
      `

      this.companyContainer.insertAdjacentHTML("beforeend", markup)
    })
  }

  clearCompany() {
    this.filteredListOfCompany.innerHTML = ""
  }

  clearFilter(filteredList) {
    this.clearCompany()
    this.clearCards()
    this.displayProductList(filteredList)
    this.singleCompany = ""
  }

  toggleBarIcon() {
    this.header.classList.toggle("show-menu")
    this.navHeader.classList.toggle("show-nav")
  }

  displayBreadcrumbs(brdcrmbContainer) {
    const pathes = [{ label: "Home", path: window.location.origin }]

    const currPath = location.pathname.split("/").at(-1).slice(0, -5)
    const label = currPath[0].toUpperCase() + currPath.slice(1)
    pathes.push({ label, path: window.location.href })

    const markup = pathes.map((item) => {
      return `<li><a href=${item.path}>${item.label}</a></li>`
    })

    brdcrmbContainer.innerHTML = markup.join("/")
  }

  runFilters(productList) {
    const value = this.searchInput.value
    const text = this.singleCompany
    const rangeValue = this.slider.value

    if (!value && !text && !rangeValue) return

    this.clearCards()

    if (text !== "") {
      this.filteredListOfCompany.innerHTML = `<li class="company-name" id="filtered-company">${text}</li>`
    }

    this.outputRange.textContent = rangeValue

    const result = productList.filter((product) => {
      return (
        product.name.toLowerCase().includes(value.toLowerCase()) &&
        (text === "" || product.company === text) &&
        product.price <= +rangeValue
      )
    })

    this.displayProductList(result)

    return result
  }

  handleFilters(element, event, productList) {
    if (event === "keyup") {
      element.addEventListener(event, (e) => {
        e.preventDefault()

        return this.runFilters(productList)
      })
    }
    if (event === "click" || event === "input") {
      element.addEventListener(event, this.runFilters(productList))
    }
  }
}
