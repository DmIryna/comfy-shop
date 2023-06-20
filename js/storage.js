export class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products))
  }

  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"))
    return products.find((product) => product.id === id)
  }

  static saveCart(cartArray) {
    localStorage.setItem("cart", JSON.stringify(cartArray))
  }

  static getCartItems() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : []
  }
}
