

const body = document.querySelector('body')
const dogBar = body.querySelector('#dog-bar')

//Fetches dog data from API and passes the data sent into the renderDogs function and showOrHideGoodDogs function
fetch('http://localhost:3000/pups')
    .then((res) => res.json())
    .then((data) => {
        renderDogs(data)
        showOrHideGoodDogs(data)
    })

    //? Function
    //This function renders the array of dogs that is passed into it 
function renderDogs(dogArray) {
    dogBar.innerHTML = ''
    //for each dog this adds a span element that pushes its name into it and appends to DOM within the dog bar
    dogArray.forEach(dog => {
        const spanEl = document.createElement('span')
        spanEl.textContent = dog.name
        spanEl.id = `${dog.id}`
        dogBar.appendChild(spanEl)

        spanEl.addEventListener('click', e => {  //add event listener to display the dog you click on
            displaySelectedDog(e.target.id);
        })
    })

    //? Function 
    //Pulls the span element id that is linked to the specific dog and appends the dog to the found dog container 
    function displaySelectedDog(selectedDogId) { 
      
        const foundDogToDisplay = dogArray.find(dog => dog.id === selectedDogId)

        const foundDogContainer = body.querySelector('#dog-info')
        foundDogContainer.innerHTML = ''
        const img = document.createElement('img')
        const h2 = document.createElement('h2')
        const goodOrBadBtn = document.createElement('button')
        goodOrBadBtn.id = `${foundDogToDisplay.id}`
        img.src = foundDogToDisplay.image
        h2.textContent = foundDogToDisplay.name
        foundDogToDisplay.isGoodDog === true ? goodOrBadBtn.textContent = "Good Dog" : goodOrBadBtn.textContent = "Bad Dog"
        foundDogContainer.append(img, h2, goodOrBadBtn)


        goodOrBadBtn.addEventListener('click', e => updateSelectedDog(e)) //event listener to update if the dog is good or bad by calling a function updateSelectedDog


        //? Function 
        //Uses a patch request to update the boolean within each dog to true or false (if the dog is good or not)
        function updateSelectedDog(e) {
            e.preventDefault()
            const dogId = e.target.id
                fetch("http://localhost:3000/pups/" + dogId, {
                    method: 'PATCH',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({ isGoodDog: !foundDogToDisplay.isGoodDog })
                })
                    .then((resp) => resp.json())
                    .then((data) => {
                        foundDogToDisplay.isGoodDog = data.isGoodDog;
                        goodOrBadBtn.textContent = foundDogToDisplay.isGoodDog ? "Good Dog" : "Bad Dog"; //changes text from good dog to bad when clicked or vise versa
                       displaySelectedDog(data.id) //displays selected dog with updated isGoodDog in api
                       if (isClicked) { //if isClicked is true then find all good dogs after patch update and re-render them to the dog bar
                        const goodDogsArray = dogArray.filter(dog => dog.isGoodDog === true) 
                        renderDogs(goodDogsArray)
                       }
                    })

            }

        }
    }

    const goodDogFilter = body.querySelector('#good-dog-filter')
    let isClicked = false
    
    //? Function
    //Allows you to click the filter bar for good dogs and only display good dogs or turn it off and display all dogs 
    function showOrHideGoodDogs(dogArray) {

    goodDogFilter.addEventListener('click', () => {
       const goodDogsArray = dogArray.filter(dog => dog.isGoodDog === true)
       if (!isClicked) {
        renderDogs(goodDogsArray)
        goodDogFilter.textContent = "Filter good dogs: ON"
        return isClicked = true
    } else {
        renderDogs(dogArray)
        goodDogFilter.textContent = "Filter good dogs: OFF"
       return  isClicked = false
    }
       
       
    })

    }


