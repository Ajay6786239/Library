document.addEventListener('DOMContentLoaded', function() {
    var plus = document.getElementById("plus");
    var pop = document.querySelector(".pop");
    var black = document.querySelector(".black");
    var tab1 = document.querySelector(".tab1");
    var add = document.getElementById("add");
    var cancel = document.getElementById("cancel");

    // Show the popup for adding a book
    plus.addEventListener("click", function(event) {
        event.preventDefault();
        pop.style.display = "block";
        black.style.display = "block";
    });

    // Hide the popup without adding a book
    cancel.addEventListener("click", function(event) {
        event.preventDefault();
        pop.style.display = "none";
        black.style.display = "none";
    });

    // Handle form submission for adding a book
    add.addEventListener("click", function(event) {
        event.preventDefault();
        var form = document.querySelector("form");
        var title = form.querySelector('input[name="title"]').value.trim();
        var author = form.querySelector('input[name="author"]').value.trim();
        var description = form.querySelector('textarea[name="des"]').value.trim();

        // Validate form fields
        if (!title || !author || !description) {
            alert('All fields are required.');
            return;
        }

        var formData = new FormData(form);

        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                var div = document.createElement("div");
                div.setAttribute("class", "tab");
                div.innerHTML = `
                    <h2>${data.title}</h2>
                    <h3>By ${data.author}</h3>
                    <p>${data.description}</p>
                    <button onclick="deleteBook(event, ${data.id})">Delete</button>
                `;
                tab1.appendChild(div);
                pop.style.display = "none";
                black.style.display = "none";
                form.reset();
            } else {
                alert('Failed to add book.');
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    });

    // Handle book deletion
    window.deleteBook = function(event, id) {
        event.preventDefault();

        fetch(`/delete/${id}/`, {
            method: 'DELETE',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Remove the book element from the page
                event.target.parentElement.remove();
            } else {
                throw new Error('Failed to delete book.');
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }
});
