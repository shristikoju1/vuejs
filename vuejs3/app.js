const app = Vue.createApp({
    data(){
        return {
            url: 'https://netninja.dev/',
            showBooks: true,
            books: [
                {title: 'Name of the wind', author: 'Patrick Rothfuss', img: 'assets/name-of-the-wind.jpg', isFav: true},
                {title: 'The way of kings', author: 'Brandon Sanderson', img: 'assets/the-way-of-kings.jpeg', isFav: false},
                {title: 'The Final Empire', author: 'Brandon Sanderson', img: 'assets/the-final-empire.jpg', isFav: true},
            ]
        }
    },
    methods: {
        toggleShowBooks() {
            this.showBooks = !this.showBooks
        },
        handleEvent(e, data) {
            console.log(e, e.type)
            if (data) {
                console.log(data);
            }
        },
        handleMousemove(e) {
            this.x = e.offsetX
            this.y = e.offsetY
        },
        toggleFav(book){
            book.isFav = !book.isFav
        }        
    },
    computed: {
        filteredBooks(){
            return this.books.filter((book) => book.isFav )
        }
    }
})

app.mount('#app')