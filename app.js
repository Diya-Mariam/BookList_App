// Represent a  book
class Book{
    constructor(title, author, isbn){
        this.title= title;
        this.author = author;
        this.isbn = isbn;
    }
}

// Handle UI tasks

class UI {

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
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static setAlert(message, classList){
        const div = document.createElement('div');
        div.className = `alert alert-${classList}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        // Vanish in 3 sec
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }
    
    static clearFields(){
        document.querySelector('#title').value='';
        document.querySelector('#author').value='';
        document.querySelector('#isbn    ').value='';
    }

    static deleteBooks(ele){
        if(ele.classList.contains('delete')){
            ele.parentElement.parentElement.remove();
        }
        
    }

}

// Local storage

class Store {
    
    static getBooks(){
        let books;
        if(localStorage.getItem('books')=== null){
            books = [];
        }
        else{
            books =JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book) {
  
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books',JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books',JSON.stringify(books));

    }

}

// Event: Display Books

document.addEventListener('DOMContentLoaded', UI.displayBooks());

// Event: Add Books

document.querySelector('#book-form').addEventListener('submit',(e) => {

    e.preventDefault();

    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // Validate 
    if(title =='' || author ==''|| isbn == ''){
        UI.setAlert('Please enter all fields', 'danger');
    }
    else{
        const book = new Book(title, author, isbn);

        // Add book to UI
        UI.addBookToList(book);

        // Add book to local storage
        Store.addBook(book);

        UI.clearFields();

        UI.setAlert('Book Added', 'success');
    }
    
});

// Event: Remove Books

document.querySelector('#book-list').addEventListener('click', (e) => {
    UI.deleteBooks(e.target);

       // Remove book from local storage
       Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

 
    UI.setAlert('Book Deleted', 'success');
})