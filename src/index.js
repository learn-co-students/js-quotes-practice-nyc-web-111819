// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
document.addEventListener('DOMContentLoaded', function(){

let baseUrl = `http://localhost:3000/quotes?_embed=likes`

  // fetch(baseUrl)
  // .then(resp => resp.json())
  // .then(data => {
  //   console.log(data)
  // })
function fetchQuotes(){
  fetch(baseUrl)
  .then(resp => resp.json())
  .then(quotes => {
    quotes.forEach(quote => {
      renderQuotes(quote)
    })//end of forEach
  })//end of second.thhen
}//end of fetchQuote
fetchQuotes()


function renderQuotes(quote){
  let ul = document.getElementById('quote-list')
    let quoteLi = document.createElement('li')
      quoteLi.id = quote.id
      let blockquote = document.createElement('BLOCKQUOTE')
        blockquote.className = "blockquote"
        quoteLi.appendChild(blockquote)
      let quoteP = document.createElement('p')
        quoteP.className = 'mb-0'
        quoteP.innerText = quote.quote
        blockquote.appendChild(quoteP)
      let quoteFooter = document.createElement('FOOTER')
        quoteFooter.className = "blockquote-footer"
        quoteFooter.innerText = quote.author
        blockquote.appendChild(quoteFooter)
      let quoteBr = document.createElement('BR')
        blockquote.appendChild(quoteBr)
      let successButton = document.createElement('BUTTON')
        successButton.className = 'btn-success'
        successButton.innerText = "Likes: "
        blockquote.appendChild(successButton)
        let span = document.createElement('SPAN')
          span.id = quote.id
          // span.innerText = !!quote.likes ? quote.likes[quote.likes.length -1].likes : "0"
          span.innerText = !!quote.likes ? quote.likes.length : "0"
          // span.innerText = quote.likes
        successButton.appendChild(span)
      let dangerButton = document.createElement('BUTTON')
        dangerButton.id = quote.id
        dangerButton.className = 'btn-danger'
        dangerButton.innerText = "Delete"
        blockquote.appendChild(dangerButton)
      ul.appendChild(quoteLi)
}

let form = document.getElementById('new-quote-form')
form.addEventListener('submit', function(e){
  e.preventDefault()
  // console.log(e.target)
  let newQuote = document.getElementById('new-quote').value
  let newAuthor = document.getElementById('author').value
  let newSubmit = {
    quote: newQuote,
    author: newAuthor
  }

    fetch(`http://localhost:3000/quotes`, {
      method: 'POST', 
      headers:{
        'content-type': 'application/json',
        accepts: 'application/json'
      },
      body: JSON.stringify(newSubmit)
    })
    .then(resp => resp.json())
    .then(quote => {
      renderQuotes(quote)
      console.log(quote)
  })//end of fetch
  e.target.reset()
})

let ul = document.getElementById('quote-list')
ul.addEventListener('click', function(e){
  // console.log(e.target)
  if (e.target.className === 'btn-danger') {
    console.log('clicking red')
    fetch(`http://localhost:3000/quotes/${e.target.id}`, {
      method: 'DELETE'
    })
    .then (resp => resp.json())
    .then (quote => {
      e.target.parentNode.parentNode.remove()
      // console.log(e.target)
    })
  } 
  else if (e.target.className === 'btn-success'){
    let li = e.target.parentNode.parentNode
    let likesCount = parseInt(e.target.childNodes[1].innerText)
    likesCount++
    console.log('clicking green')
    fetch(`http://localhost:3000/likes`,{
      method: 'POST',
      headers:{
        'content-type': 'application/json',
        accepts: 'application/json'
      },
      body: JSON.stringify({
        quoteId: parseInt(e.target.parentNode.parentNode.id),
        likes: likesCount
      })
    })
    .then(resp => resp.json())
    .then(() => {
      li.querySelector('span').innerText = likesCount
    })
    
    // .then(resp => resp.json())
    // .then(quote => {
    //   likesCount = likesCount + 1
    // })
  }
})






















})