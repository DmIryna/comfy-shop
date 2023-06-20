import { Storage } from "./storage.js"

export class Cart {
  cartOverlay = document.querySelector(".cart-overlay")
  cartTotalSum = this.cartOverlay.querySelector(".total-cart")
  cartDOM = this.cartOverlay.querySelector(".cart")
  totalItemsInCart = document.querySelector(".cart-items")
  cartContent = this.cartOverlay.querySelector(".cart-content")

  toggleCart() {
    this.cartOverlay.classList.toggle("show-overlay")
    this.cartDOM.classList.toggle("show-cart")
  }

  setCartValues(cartArray) {
    let totalSum = 0
    let totalAmount = 0

    cartArray.map((item) => {
      totalSum += item.price * item.amount
      totalAmount += item.amount
    })

    this.cartTotalSum.innerHTML = +totalSum.toFixed(2)
    this.totalItemsInCart.innerHTML = totalAmount
  }

  addCartItemInBag(item) {
    const markup = `
        <div class="cart-item">
          <img src="${item.img}" alt="${item.name}" />
          <div>
            <h4>${item.name}</h4>
            <h5>$${item.price}</h5>
            <button class="remove-item" data-id=${item.id}>remove</button>
          </div>
          <div>
            <i class="fas fa-chevron-up arrow" data-id=${item.id}></i>
            <p class="item-amount">${item.amount}</p>
            <i class="fas fa-chevron-down arrow" data-id=${item.id}></i>
          </div>
        </div>
      `

    this.cartContent.insertAdjacentHTML("afterbegin", markup)
  }

  addToCart(id, cartArray) {
    const item = cartArray.find((itemCart) => itemCart.id === id)
    if (!item) {
      const cartItem = { ...Storage.getProduct(id), amount: 1 }
      cartArray = [...cartArray, cartItem]
      Storage.saveCart(cartArray)
      this.setCartValues(cartArray)
      this.addCartItemInBag(cartItem)
    } else {
      const items = [...document.querySelectorAll(".fa-chevron-up")]
      const currItem = items.find((item) => item.dataset.id === id)
      this.increaseAmountInCart(cartArray, id, currItem)
    }

    return cartArray
  }

  populateCart(cartArray) {
    cartArray.forEach((item) => this.addCartItemInBag(item))
  }

  removeItemFromCart(cartArray, id, currElement) {
    cartArray = cartArray.filter((item) => item.id !== id)
    this.setCartValues(cartArray)
    Storage.saveCart(cartArray)
    this.cartContent.removeChild(currElement.parentElement.parentElement)

    return cartArray
  }

  increaseAmountInCart(cartArray, id, currElement) {
    const item = cartArray.find((item) => item.id === id)
    item.amount = item.amount + 1
    this.setCartValues(cartArray)
    Storage.saveCart(cartArray)
    currElement.nextElementSibling.innerText = item.amount

    return cartArray
  }

  decreaseAmountInCart(cartArray, id, currElement) {
    const item = cartArray.find((item) => item.id === id)
    item.amount = item.amount - 1

    if (item.amount > 0) {
      this.setCartValues(cartArray)
      Storage.saveCart(cartArray)
      currElement.previousElementSibling.innerText = item.amount

      return cartArray
    } else {
      return this.removeItemFromCart(cartArray, id, currElement)
    }
  }

  clearCart(cartArray) {
    cartArray = []
    Storage.saveCart(cartArray)
    this.setCartValues(cartArray)
    this.cartContent.innerHTML = ""

    return cartArray
  }
}
