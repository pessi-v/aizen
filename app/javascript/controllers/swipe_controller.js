import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="swipe"
export default class extends Controller {
  connect() {
    this.tinderContainer = this.element
    this.allCards = this.element.querySelectorAll('.tinder--card')
    this.nope = this.element.querySelector('#nope')
    this.love = this.element.querySelector('#love')
    
    this.initCards()
    this.setupEventListeners()
  }
  
  initCards() {
    const newCards = this.element.querySelectorAll('.tinder--card:not(.removed)')
    
    newCards.forEach((card, index) => {
      card.style.zIndex = this.allCards.length - index
      
      if (index === 0) {
        // Show the top card
        card.style.transform = ''
        card.style.opacity = 1
      } else if (index === 1) {
        // Show the second card
        card.style.transform = ''
        card.style.opacity = 1
      } else {
        // Hide all other cards completely
        card.style.transform = ''
        card.style.opacity = 0
      }
    })
    
    this.tinderContainer.classList.add('loaded')
  }
  
  setupEventListeners() {
    this.allCards.forEach((el) => {
      // Mouse events for desktop
      let isDragging = false
      let startX = 0
      let startY = 0
      
      el.addEventListener('mousedown', (event) => {
        isDragging = true
        startX = event.clientX
        startY = event.clientY
        el.classList.add('moving')
        event.preventDefault()
      })
      
      document.addEventListener('mousemove', (event) => {
        if (!isDragging) return
        
        const deltaX = event.clientX - startX
        const deltaY = event.clientY - startY
        
        if (deltaX === 0) return
        
        this.tinderContainer.classList.toggle('tinder_love', deltaX > 0)
        this.tinderContainer.classList.toggle('tinder_nope', deltaX < 0)
        
        const xMulti = deltaX * 0.03
        const yMulti = deltaY / 80
        const rotate = xMulti * yMulti
        
        el.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${rotate}deg)`
      })
      
      document.addEventListener('mouseup', (event) => {
        if (!isDragging) return
        
        isDragging = false
        const deltaX = event.clientX - startX
        const deltaY = event.clientY - startY
        
        el.classList.remove('moving')
        this.tinderContainer.classList.remove('tinder_love')
        this.tinderContainer.classList.remove('tinder_nope')
        
        const moveOutWidth = document.body.clientWidth
        const keep = Math.abs(deltaX) < 80
        
        el.classList.toggle('removed', !keep)
        
        if (keep) {
          el.style.transform = ''
        } else {
          const endX = Math.max(Math.abs(deltaX) * 2, moveOutWidth)
          const toX = deltaX > 0 ? endX : -endX
          const endY = Math.abs(deltaY) * 2
          const toY = deltaY > 0 ? endY : -endY
          const xMulti = deltaX * 0.03
          const yMulti = deltaY / 80
          const rotate = xMulti * yMulti
          
          el.style.transform = `translate(${toX}px, ${toY + deltaY}px) rotate(${rotate}deg)`
          this.initCards()
        }
      })
      
      // Touch events for mobile
      let touchStartX = 0
      let touchStartY = 0
      let isTouching = false
      
      el.addEventListener('touchstart', (event) => {
        isTouching = true
        touchStartX = event.touches[0].clientX
        touchStartY = event.touches[0].clientY
        el.classList.add('moving')
      })
      
      el.addEventListener('touchmove', (event) => {
        if (!isTouching) return
        
        const deltaX = event.touches[0].clientX - touchStartX
        const deltaY = event.touches[0].clientY - touchStartY
        
        if (deltaX === 0) return
        
        this.tinderContainer.classList.toggle('tinder_love', deltaX > 0)
        this.tinderContainer.classList.toggle('tinder_nope', deltaX < 0)
        
        const xMulti = deltaX * 0.03
        const yMulti = deltaY / 80
        const rotate = xMulti * yMulti
        
        el.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${rotate}deg)`
        event.preventDefault()
      })
      
      el.addEventListener('touchend', (event) => {
        if (!isTouching) return
        
        isTouching = false
        const deltaX = event.changedTouches[0].clientX - touchStartX
        const deltaY = event.changedTouches[0].clientY - touchStartY
        
        el.classList.remove('moving')
        this.tinderContainer.classList.remove('tinder_love')
        this.tinderContainer.classList.remove('tinder_nope')
        
        const moveOutWidth = document.body.clientWidth
        const keep = Math.abs(deltaX) < 80
        
        el.classList.toggle('removed', !keep)
        
        if (keep) {
          el.style.transform = ''
        } else {
          const endX = Math.max(Math.abs(deltaX) * 2, moveOutWidth)
          const toX = deltaX > 0 ? endX : -endX
          const endY = Math.abs(deltaY) * 2
          const toY = deltaY > 0 ? endY : -endY
          const xMulti = deltaX * 0.03
          const yMulti = deltaY / 80
          const rotate = xMulti * yMulti
          
          el.style.transform = `translate(${toX}px, ${toY + deltaY}px) rotate(${rotate}deg)`
          this.initCards()
        }
      })
    })
    
    // Button event listeners
    if (this.nope) {
      this.nope.addEventListener('click', this.createButtonListener(false).bind(this))
    }
    
    if (this.love) {
      this.love.addEventListener('click', this.createButtonListener(true).bind(this))
    }
  }
  
  createButtonListener(love) {
    return (event) => {
      const cards = this.element.querySelectorAll('.tinder--card:not(.removed)')
      const moveOutWidth = document.body.clientWidth * 1.5
      
      if (!cards.length) return false
      
      const card = cards[0]
      card.classList.add('removed')
      
      if (love) {
        card.style.transform = `translate(${moveOutWidth}px, -100px) rotate(-30deg)`
      } else {
        card.style.transform = `translate(-${moveOutWidth}px, -100px) rotate(30deg)`
      }
      
      this.initCards()
      event.preventDefault()
    }
  }
}
