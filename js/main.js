import products from "../productList.json" assert { type: "json" }
import { createOverlayCart, UI } from "./ui.js"
import { Storage } from "./storage.js"
import { Cart } from "./cart.js"

const initShop = () => {
  const cartContainer = document.querySelector(".cart-container")
  createOverlayCart(cartContainer)
  const ui = new UI()
  const userCart = new Cart()

  const homeAddress = `http://127.0.0.1:5500/index.html`
  const productAddress = `http://127.0.0.1:5500/pages/products.html`

  const cartContent = cartContainer.querySelector(".cart-content")
  const cartBtn = document.querySelector(".cart-btn")
  const closeCartBtn = cartContainer.querySelector(".close-btn")
  const barIcon = document.querySelector(".fa-bars")
  const closeBarIcon = document.querySelector(".close-nav-bar")
  const searchForm = document.querySelector(".search-form")
  const checkoutBtn = cartContainer.querySelector(".checkout-btn")
  const breadCrumbs = document.querySelector(".breadcrumbs")

  let cart = Storage.getCartItems()

  if (
    window.location.href === homeAddress ||
    window.location.href === `http://127.0.0.1:5500/`
  ) {
    ui.displayProductList(products.slice(0, 3))
  }

  if (window.location.href === productAddress) {
    ui.displayProductList(products)
    ui.displayCompanies(products)
  }

  const getBtns = (e) => {
    if (e?.target.classList.contains("btn-bag")) {
      const btn = e.target
      const id = btn.dataset.id
      cart = userCart.addToCart(id, cart)
    }
  }

  ui.cardContainer && ui.cardContainer.addEventListener("click", getBtns)

  searchForm &&
    searchForm.addEventListener("click", (e) => {
      e.preventDefault()
      const element = e.target
      if (element.id === "search-input") {
        ui.handleFilters(element, "keyup", products)
      } else if (element.id === "company") {
        ui.singleCompany = element.textContent
        ui.handleFilters(element, "click", products)
      } else if (element.id === "range-price") {
        ui.handleFilters(element, "input", products)
      } else if (element.id === "filtered-company") {
        ui.clearFilter(products)
      }
    })

  Storage.saveProducts(products)

  breadCrumbs && ui.displayBreadcrumbs(breadCrumbs)

  userCart.setCartValues(cart)
  userCart.populateCart(cart)

  cartContent.addEventListener("click", (e) => {
    const currElement = e.target
    const id = currElement.dataset.id
    if (e.target.classList.contains("remove-item")) {
      cart = userCart.removeItemFromCart(cart, id, currElement)
    } else if (e.target.classList.contains("fa-chevron-up")) {
      cart = userCart.increaseAmountInCart(cart, id, currElement)
    } else if (e.target.classList.contains("fa-chevron-down")) {
      cart = userCart.decreaseAmountInCart(cart, id, currElement)
    }
  })

  checkoutBtn &&
    checkoutBtn.addEventListener(
      "click",
      () => (cart = userCart.clearCart(cart))
    )

  cartBtn.addEventListener("click", () => userCart.toggleCart())
  closeCartBtn.addEventListener("click", () => userCart.toggleCart())
  barIcon.addEventListener("click", () => ui.toggleBarIcon())
  closeBarIcon.addEventListener("click", () => ui.toggleBarIcon())
}

document.addEventListener("DOMContentLoaded", initShop())
