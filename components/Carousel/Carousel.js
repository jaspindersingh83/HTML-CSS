class CarouselItem {
    constructor(element){
        this.element = element;
    }

    select(){
        this.element.classList.add("Carousel__item--focused");
    }

    deselect(){
        this.element.classList.remove("Carousel__item--focused");
    }
}

class CarouselLeft{
    constructor(element){
        this.element = element;
        this.element.addEventListener('click',(event) =>{
            event.data = 0;
        })
    }
}
class CarouselRight{
    constructor(element){
        this.element = element;
        this.element.addEventListener('click',(event) =>{
            event.data = 1;
        })
    }
}

class Carousel {
    constructor(element){
        this.element = element;
        // Get Array of all the carousel items
        this.carouselitems = this.element.querySelectorAll('.Carousel__item');
        this.carouselitems = Array.from(this.carouselitems);
        // Find which carousel item is active and find its index
        this.active = this.element.querySelectorAll('.Carousel__item--focused');
        this.maxactiveindex = this.carouselitems.indexOf(this.active[this.active.length-1]);
        //Keep a reference of initially loaded items for a scalable solution.
        this.left = new CarouselLeft(this.element.querySelector('.Carousel__arrow--left'));
        this.right = new CarouselRight(this.element.querySelector('.Carousel__arrow--right'));
        this.element.addEventListener('click',(event) => {
            console.log(event.data)
            console.log(this.maxactiveindex);
            if(event.data === 0 || event.data === 1) {
                this.updateitem(event.data);
                event.stopPropagation();
            }    
        })
    }
    updateitem(data) {
        if(data === 1 && this.maxactiveindex < this.carouselitems.length-1) {
            console.log('moving right')
            for (let i = 0; i < this.active.length; i++){
                let current = new CarouselItem(this.active[i]);
                current.deselect();
            }
            let maxMovePossible = Math.min(this.active.length,(this.carouselitems.length - this.maxactiveindex-1))
            for (let i = 0; i < maxMovePossible; i++){
                let next = new CarouselItem(this.carouselitems[this.maxactiveindex+1+i]);
                next.select();  
            }
        }
        if(data === 0 && this.maxactiveindex > this.active.length) {
            console.log('moving left');
            console.log(this.active.length);    
            for (let i = 0; i < this.active.length; i++){
                let current = new CarouselItem(this.active[i]);
                console.log(current);
                current.deselect();
            }
            ///3 because no. of projects visible in one go are 3
            for (let i = 0; i < 3; i++){
                let previous = new CarouselItem(this.carouselitems[this.maxactiveindex-this.active.length-i]);
                previous.select();
            }
        }
        this.active = this.element.querySelectorAll('.Carousel__item--focused');
        this.maxactiveindex = this.carouselitems.indexOf(this.active[this.active.length-1]);
    }
}

let carousels = document.querySelectorAll(".Carousel");
carousels = Array.from(carousels).map(carousel => new Carousel(carousel));
