// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 

document.addEventListener('DOMContentLoaded', function() {
  quoteList = document.getElementById('quote-list')
  newQuoteForm = document.getElementById('new-quote-form')
  editMode = false
  
  //
  
  getQuoteList()
  newQuoteForm.addEventListener('submit', submitForm)
  quoteList.addEventListener('click', function(event){
    event.preventDefault()
    
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
    <button class='btn-outline-primary edit'>Edit</button>
    <button class='btn-outline-danger delete'>Delete</button>
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

    if (!!editMode) {
      //get the li being edited
      const editLi = quoteList.querySelector(`li[data-id = "${editMode}"]`)
      const blockquote = editLi.querySelector('blockquote')
      blockquote.style = ""
      
      const form = editLi.querySelector('form#edit-quote-form')
      
      // define quote object from editLi before its removal in case it is needed for submit
      quote = {
        quote: form["edit-quote"].value,
        author: form.author.value,
        id: parseInt(editLi.dataset.id)
      }
      
      form.remove()
      editMode = false
    }

    if (classList.includes("delete")) {
      console.log("delete")
      deleteQuote(li)
      
    } else if (classList.includes("likes")) {
      console.log("like")
      likeQuote(li)

    } else if (classList.includes("edit")) {
      console.log("edit")
      editQuote(li)

    } else if (classList.includes("submit")) {
      console.log("submit")
      submitEdit(quote)

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

  function editQuote(li){
    // define quote object from li
    quote = {
      quote: li.querySelector('p.mb-0').innerText,
      author: li.querySelector('footer.blockquote-footer').innerText,
      id: parseInt(li.dataset.id)
    }

    // create and insert edit form; hide blockquote
    const blockquote = li.querySelector('blockquote')
    blockquote.style.display = "none"
    
    const form = editForm(quote)
    li.insertBefore(form, blockquote)
    
    editMode = quote.id

    //the rest is handles by an event handler upon submit
  }

  function editForm(quote){
    const form = document.createElement('form')
    form.id = 'edit-quote-form'
    form.innerHTML = `
      Edit Quote
      <hr>
      <div>
        <div class="form-group">
          <label for="edit-quote">Quote Text</label>
          <input type="text" class="form-control" id="edit-quote" value="${quote.quote}">
        </div>
        <div class="form-group">
          <label for="Author">Author</label>
          <input type="text" class="form-control" id="author" value="${quote.author}">
        </div>
        <button type="submit" class="btn btn-primary submit">Submit</button>
      </div>
      <hr>
    `
    return form

  }

  function submitEdit(editedQuote){

    configObj = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accepts": "application/json"
      },
      body: JSON.stringify(editedQuote)
    }

    fetch("http://localhost:3000/quotes/" + quote.id, configObj)
    .then(resp => resp.json())
    .then(quote => {
      li = quoteList.querySelector(`li[data-id = "${quote.id}"`)
      li.querySelector(`p.mb-0`).innerText = quote.quote
      li.querySelector(`footer.blockquote-footer`).innerText = quote.author
    })
  }



})