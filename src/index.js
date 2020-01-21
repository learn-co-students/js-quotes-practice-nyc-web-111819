document.addEventListener("DOMContentLoaded", function() {

    function fetchQuotes() {
        fetch("http://localhost:3000/quotes?_embed=likes")
        .then(response => response.json())
        .then(quotesData => {quotesData.forEach(quote => renderQuote(quote))
        })
    } // end of fetchQuotes function

    fetchQuotes()

    const quotesListUl = document.getElementById("quote-list")

    function renderQuote(quote) {
         let li = document.createElement('li')
         li.className += 'quote-card'
         li.dataset.id = `${quote.id}`
         li.innerHTML = `
            <blockquote class="blockquote">
            <p class="mb-0">${quote.quote}</p>
            <footer class="blockquote-footer">${quote.author}</footer>
            <br>
            <button id=${quote.id} class='btn-success'>Likes: <span id=spanId${quote.id}>${quote.likes.length}</span></button>
            <button id=delete${quote.id} class='btn-danger'>Delete</button>
           <!-- <button id=edit${quote.id} class="btn-edit">Edit</button> -->
            </blockquote>`
            quotesListUl.appendChild(li)
    } // end of renderQuote function

    quotesListUl.addEventListener("click", function(e) {
        if (e.target.className === "btn-success") {
            
            let likeSpan = document.getElementById(`spanId${e.target.id}`)
            likeSpan.innerText = parseInt(likeSpan.innerText) + 1
            const newQuoteId = parseInt(e.target.id)

            fetch("http://localhost:3000/likes", {
                method: "POST", 
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                  },
                  body: JSON.stringify({
                    "quoteId": newQuoteId
                  })
            })
        }

        if (e.target.className === "btn-danger") {

            let momNode = e.target.parentNode
            let grandParentNode = momNode.parentNode
            let id = grandParentNode.dataset.id
        
            
            fetch(`http://localhost:3000/quotes/${id}`, {
                method: "DELETE"
            })
            .then(response => response.json())
            .then(grandParentNode.remove())
        } // end of second if

        // if (e.target.className === "btn-edit" ) {

        //     let momNode = e.target.parentNode
        //     let grandParentNode = momNode.parentNode
        //     let id = grandParentNode.dataset.id

        //     console.log("clicking the edit button")
        //     let editForm = document.createElement('form')
        //     editForm.innerHTML = `
        //     <div class="form-group">
        //     <label for="new-quote">Quote</label>
        //     <input type="text" class="form-control" id="edit-quote" placeholder="Edit your quote here">
        //     </div>
        //     <div class="form-group">
        //     <label for="Author">Author</label>
        //     <input type="text" class="form-control" id="author" placeholder="Edit your author here">
        //     </div>
        //     <button type="submit" class="btn btn-primary">Update Quote</button>`

        //     grandParentNode.appendChild(editForm)

        // }// end of third if statement

    }) // end of ul event listener

    const form = document.getElementById("new-quote-form")

    form.addEventListener("submit", function(e) {
        e.preventDefault()
        // console.log(e.target)

        let newQuote = document.getElementById("new-quote")
        let newAuthor = document.getElementById("author")

        // console.log(newQuote.value)
        // console.log(author.value)

        fetch("http://localhost:3000/quotes", {
            method: "POST", 
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
                },
                body: JSON.stringify({
                    quote: newQuote.value,
                    author: newAuthor.value,
                    likes: []
                })
        })
        .then(response => response.json())
        .then(quote => renderQuote(quote))

        e.target.reset()

    }) // end of submit form listener function


}) // end of main funciton