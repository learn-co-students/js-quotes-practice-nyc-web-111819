//dom content
//defin ul 
//fetch get request to get all quotes
//run a foreach 
//create li for each quote
//append li to ul

window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');

    const ul = document.getElementById('quote-list')

    fetch('http://localhost:3000/quotes?_embed=likes')
        .then(resp => resp.json())
        .then(quoteData => quoteData.forEach(quote => renderQuote(quote))) //ends .then

    function renderQuote(quote) {
        let li = document.createElement('li')
        li.dataset.id = quote.id
        li.innerHTML = `
        <li class='quote-card'>
        <blockquote class="blockquote">
          <p class="mb-0">${quote.quote}</p>
          <footer class="blockquote-footer">${quote.author}</footer>
          <br>
          <button id=${quote.id} class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
          <button class = 'btn-danger'>Delete</button> 
          </blockquote> 
          </li>`
        ul.appendChild(li)

    }

    //eventlistener on form 
    //take input values
    //make object with these values
    //fetch post request
    //pass in object of input values
    //pass data to renderQuote function
    let form = document.getElementById('new-quote-form')
    form.addEventListener('submit', function(e) {
            e.preventDefault()
            let quote = document.getElementsByClassName('form-control')[0].value
            let author = document.getElementsByClassName('form-control')[1].value
            let likes = []

            let newQuote = {
                quote: quote,
                author: author,
                likes: likes
            }
            fetch('http://localhost:3000/quotes?_embed=likes', {
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                        accepts: "application/json"
                    },
                    body: JSON.stringify(newQuote)
                }) //ends fetch
                .then(resp => resp.json())
                .then(newData => renderQuote(newData))
        }) //ends eventlistener


    //event listener on delete button
    //find id 
    //get parent node 
    //remove parent node
    //fetch delete

    //event listener on likes button 
    //find span with likes
    //increment likes on dom 
    //find id 
    //fetch post
    //pass in quote id with id  


    ul.addEventListener('click', function(e) {
            let blockQuote = e.target.parentNode
            let grandBlockQuote = blockQuote.parentNode
            let targetNode = grandBlockQuote.parentNode
            let id = targetNode.dataset.id
            if (e.target.className === 'btn-danger') {
                targetNode.remove()

                fetch(`http://localhost:3000/quotes/${id}`, {
                    method: "DELETE"
                })
            } //ends if
            else if (e.target.className === 'btn-success') {
                let span = grandBlockQuote.querySelector('span')

                let newLikeCount = parseInt(span.innerText) + 1
                span.innerText = newLikeCount

                fetch('http://localhost:3000/likes', {
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                        accepts: "application/json"
                    },
                    body: JSON.stringify({ quoteId: parseInt(id) })
                })


            }



        }) //ends event listener 




}); // ends dom content loaded