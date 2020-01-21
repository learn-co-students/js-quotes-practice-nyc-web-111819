// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 

document.addEventListener("DOMContentLoaded", () => {
        getQuotes()

        const ul = document.getElementById("quote-list")

        function getQuotes() {
            fetch("http://localhost:3000/quotes?_embed=likes")
                .then(response => response.json())
                .then(quotes => quotes.forEach(quote =>
                    renderQuote(quote),
                )) // ends second .then
        } // ends getQuotes function

        function renderQuote(quote) {
            let li = document.createElement('li')
            li.dataset.id = `${quote.id}`
            let h2 = document.createElement('h2')
            li.innerHTML =
                `<li class='quote-card'>
             <blockquote class="blockquote">${quote.quote}</p>
             <footer class="blockquote-footer">${quote.author}</footer>
             <br>
             <button id=${quote.id} class='btn-success'>Likes: <span id=span-id${quote.id}>${quote.likes.length}</span></button>
             <button id=delete${quote.id} class='btn-danger'>Delete</button>
             </blockquote>
             </li>`

            li.append(h2)
            ul.append(li)

        } // ends render quote function


        ul.addEventListener("click", function(e) {

                if (e.target.className === 'btn-success') {

                    let likeSpan = document.getElementById(`span-id${e.target.id}`)
                    likeSpan.innerText = parseInt(likeSpan.innerText) + 1
                    let newQuoteId = parseInt(e.target.id)
                        // console.log(newQuoteId, 'here is the id')

                    fetch("http://localhost:3000/likes", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Accept: "application/json"
                            }, // ends header
                            body: JSON.stringify({
                                    "quoteID": newQuoteId
                                }) // ends stringify
                        }) // ends fetch
                } // ends first if 
                if (e.target.className === 'btn-danger') {
                    // console.log('you have hit the delete')           
                    let quoteblock = e.target.parentNode
                    let mainLi = quoteblock.parentNode
                    let mainMainLi = mainLi.parentNode
                    let id = mainMainLi.dataset.id
                    mainMainLi.remove()
                    fetch(`http://localhost:3000/quotes/${id}`, {
                            method: "DELETE"
                        }) // ends fetch
                } // ends second if 
            }) // end event listener 

        const form = document.getElementById("new-quote-form")

        form.addEventListener('submit', function(e) {
                e.preventDefault()
                let quote = document.getElementById('new-quote').value
                let author = document.getElementById('author').value
                fetch("http://localhost:3000/quotes", {
                        method: "POST",
                        headers: {
                            "content-type": "application/json",
                            Accept: "application/json"
                        }, //ends header for post
                        body: JSON.stringify({
                            "quote": quote,
                            "author": author,
                            "likes": []
                        })
                    }) //ends fetch for post
                    .then(resp => resp.json())
                    .then(newQuote => renderQuote(newQuote))
                    // let input = {
                    //     quote: e.target.new - quote.value,
                    //     author: e.target.author.value
                    // }



            }) //ends submit form listener

    }) // ends domcontentloaded