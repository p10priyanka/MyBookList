// Book Class: Represent A Book

class Book{
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

//UI Class: Handle UI task

class UI{
    static displayBooks(){
        
        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }
    static addBookToList(book){
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</td>
        `;
        list.appendChild(row);
    }

    static deleteBook(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className){
        const div = document.createElement('div');
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        //Vanish Alert in 3second
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

//Store Class: Handles Storage

class Store {
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        } else{
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    };

    static addBooks(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    };
    
    static removeBook(isbn){
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    };
}


//Events: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//Events: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => 
{
    //Prevent actual Submit
    e.preventDefault();
    //Get Form Value
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    //Validate
    if(title === '' || author === '' | isbn === ''){
        UI.showAlert('Please fill in all the field', 'alert-danger');
    } else{

    //Instantiate Book
    const book = new Book(title, author, isbn);
    
    //Add Book to UI
    UI.addBookToList(book);

    //Add Book to Store
    Store.addBooks(book);

    //Sucess Message
    UI.showAlert('Book Added', 'alert-success');

    //Clear Fields
    UI.clearFields();
    }
})

//Events: Remove a Book

document.querySelector('#book-list').addEventListener('click', (e) => 
{
    //Remove Book from UI
    UI.deleteBook(e.target);

    //Remove Book from Storage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    //Sucess Message
    UI.showAlert('Book Removed', 'alert-warning');
});