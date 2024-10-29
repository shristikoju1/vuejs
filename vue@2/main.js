// Event Bus
var eventBus = new Vue();

// Product Component
Vue.component("product", {
    props: {
        premium: {
            type: Boolean,
            required: true,
        },
    },
    template: `
        <div class="product">
            <div class="product-image">
                <img v-bind:src='image' alt="shoes">
            </div>
            <div class="product-info">
                <h1>{{ title }}</h1>
                <p v-if="inStock">In Stock</p> 
                <p v-else :class="{outofstock: !inStock}">Out of Stock</p>
                <p>{{ sale }}</p>
                <p>Shipping: {{ shipping }}</p>
                <ul>
                    <li v-for="detail in details">{{ detail }}</li>
                </ul>

                <div 
                    class="color-box"
                    v-for="(variant, index) in variants" 
                    :key="variant.variantId"
                    :style="{backgroundColor: variant.variantColor}"
                    @mouseover="updateProduct(index)"
                >
                </div>

                <button 
                    v-on:click="addToCart"
                    :disabled="!inStock"
                    :class="{disabledButton: !inStock}"
                >
                    Add to cart
                </button>
            </div>

            <!-- Passing reviews as prop to product-tabs -->
            <product-tabs :reviews="reviews"></product-tabs>
        </div>
    `,
    data() {
        return {
            product: "Socks",
            brand: "Vue Mastery",
            selectedVariant: 0,
            details: ["80% cotton", "20% polyester", "Gender-neutral"],
            variants: [
                {
                    variantId: 2234,
                    variantColor: "green",
                    variantImage: "./assets/vmSocks-green.png",
                    variantQuantity: 10,
                },
                {
                    variantId: 2235,
                    variantColor: "blue",
                    variantImage: "./assets/vmSocks-blue.png",
                    variantQuantity: 0,
                },
            ],
            onSale: true,
            reviews: [], // Make sure this is here to hold reviews
        };
    },
    methods: {
        addToCart() {
            this.$emit("add-to-cart", this.variants[this.selectedVariant].variantId);
        },
        updateProduct(index) {
            this.selectedVariant = index;
        },
    },
    computed: {
        title() {
            return this.brand + " " + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity > 0;
        },
        sale() {
            return this.onSale ? `${this.brand} ${this.product} are on sale!` : `${this.brand} ${this.product} are not on sale`;
        },
        shipping() {
            return this.premium ? "Free" : "2.99";
        },
    },
    mounted() {
        eventBus.$on("review-submitted", productReview => {
            this.reviews.push(productReview); // Add review to reviews array
        });
    }
});

// Product Review Component
Vue.component("product-review", {
    template: `
        <form class="review-form" @submit.prevent="onSubmit">
            <p v-if="errors.length">
                <b>Please correct the following error(s):</b>
                <ul>
                    <li v-for="error in errors">{{ error }}</li>
                </ul>
            </p>

            <p>
                <label for="name">Name:</label>
                <input id="name" v-model="name" placeholder="name">
            </p>
            
            <p>
                <label for="review">Review:</label>      
                <textarea id="review" v-model="review"></textarea>
            </p>
            
            <p>
                <label for="rating">Rating:</label>
                <select id="rating" v-model.number="rating">
                    <option>5</option>
                    <option>4</option>
                    <option>3</option>
                    <option>2</option>
                    <option>1</option>
                </select>
            </p>

            <p>Would you recommend this product?</p>
            <div class='input-field'>
                            <input type="radio" id="yes" value="Yes" v-model="recommend">
            <label for="yes">Yes</label>


            </div>

            <div class='input-field'>
            <input type="radio" id="no" value="No" v-model="recommend">
            <label for="no">No</label>
            </div>

            <p>
                <input type="submit" value="Submit">  
            </p>
        </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommend: null,
            errors: [],
        };
    },
    methods: {
        onSubmit() {
            this.errors = [];
            if (this.name && this.review && this.rating && this.recommend) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommend: this.recommend,
                };
                eventBus.$emit("review-submitted", productReview); // Emit review-submitted event
                this.name = null;
                this.review = null;
                this.rating = null;
                this.recommend = null;
            } else {
                if (!this.name) this.errors.push("Name required.");
                if (!this.review) this.errors.push("Review required.");
                if (!this.rating) this.errors.push("Rating required.");
                if (!this.recommend) this.errors.push("Recommendation required.");
            }
        },
    }
});

// Product Tabs Component
Vue.component("product-tabs", {
    props: {
        reviews: {
            type: Array,
            required: false,
        }
    },
    template: `
        <div class='tab-container'>
            <span 
                class="tab" 
                v-for="(tab, index) in tabs" 
                :key="index" 
                @click="selectedTab = tab" 
                :class="{ activeTab: selectedTab === tab }"
            >
                {{ tab }}
            </span>

            <div v-show="selectedTab === 'Reviews'">
                <p v-if="!reviews.length">There are no reviews yet.</p>
                <ul v-else>
                    <li v-for="review in reviews" :key="review.name">
                        <p><strong>{{ review.name }}</strong></p>
                        <p>Rating: {{ review.rating }}</p>
                        <p>{{ review.review }}</p>
                        <p>Recommendation: {{ review.recommend }}</p>
                    </li>
                </ul>
            </div>

            <product-review v-show="selectedTab === 'Make a Review'"></product-review> 
        </div>
    `,
    data() {
        return {
            tabs: ["Reviews", "Make a Review"],
            selectedTab: "Reviews",
        };
    }
});

// Main Vue Instance
let app = new Vue({
    el: "#app",
    data: {
        premium: true,
        cart: [],
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
    }
});
