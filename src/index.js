// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 

document.addEventListener('DOMContentLoaded', function() {
  quoteList = document.getElementById('quote-list')
  newQuoteForm = document.getElementById('new-quote-form')
  
  //
  
  getQuoteList()
  newQuoteForm.addEventListener('submit', submitForm)
  quoteList.addEventListener('click', function(event){
    // if click was on a button, run quoteClickHandler
    if (event.target.tagName === "BUTTON") {
      quoteClickHandler(event)
    }
  })

  //

  function getQuoteList(){
    fetch("http://localhost:3000/quotes?_embed=likes")
    .then(resp => resp.json())
    .then(quotes => parseQuoteList(quotes))
  }

  function parseQuoteList(quotes){
    for (const quote of quotes) {
      renderQuote(quote)
    }
  }
  
  function renderQuote(quote){
    const li = document.createElement('li')
    li.className = 'quote-card'
    li.dataset.id = quote.id
    
    // set likes
    let likes
    if (!!quote.likes) {
      likes = quote.likes.length
    } else {
      likes = 0
    }
    
    li.innerHTML = `
    <blockquote class="blockquote">
    <p class="mb-0">${quote.quote}</p>
    <footer class="blockquote-footer">${quote.author}</footer>
    <br>
    <button class='btn-success likes'>Likes: <span>${likes}</span></button>
    <button class='btn-danger delete'>Delete</button>
    </blockquote>
    `
    
    quoteList.append(li)
  }

  function submitForm(event){
    event.preventDefault()

    const submission = {
      author: event.target.author.value,
      quote: event.target['new-quote'].value
    }

    const configObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accepts": "application/json"
      },
      body: JSON.stringify(submission)
    }

    fetch("http://localhost:3000/quotes", configObj)
    .then(resp => resp.json())
    .then(quote => renderQuote(quote))

  }

  function quoteClickHandler(event){
    const classList = Array.from(event.target.classList)
    const li = event.target.closest('li')

    if (classList.includes("delete")) {
      console.log("delete")
      deleteQuote(li)
      
    } else if (classList.includes("likes")) {
      console.log("like")
      likeQuote(li)

    }
  }

  function deleteQuote(li){
    //optimistic render
    const id = li.dataset.id
    li.remove()

    //remove from database
    const configObj = { method: "DELETE" }
    fetch(`http://localhost:3000/quotes/${id}`, configObj)
  }
  
  function likeQuote(li){
    // optimistic render
    // get span
    span = li.querySelector('span')
    // increase likes on page
    span.innerText++
    // create update object
    updateObj = { 
      quoteId: parseInt(li.dataset.id),
      createdAt: Date.now()
     }

    // create config object
    configObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accepts": "application/json"
      },
      
      // stringify?
      body: JSON.stringify(updateObj)
    }

    // update database
    fetch("http://localhost:3000/likes", configObj)


  }

})