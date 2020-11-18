import React from 'react'

import Filters from './Filters'
import PetBrowser from './PetBrowser'
const PETS_ENDPOINT = `/api/pets`;

class App extends React.Component {
  constructor() {
    super()

    this.state = {
      pets: [],
      filteredPets: [],
      filters: {
        type: 'all'
      }
    }
  }

  constructURL = () => {
    const { type } = this.state.filters
    let finalURL = ""
    if (type === "all") {
      finalURL = PETS_ENDPOINT
    } else {
      const queryString = `?type=${type}`
      finalURL = PETS_ENDPOINT + queryString
    }
    return finalURL
  }

  componentDidMount(){
    fetch(PETS_ENDPOINT)
      .then(resp => resp.json())
      .then(data => {
        this.setState({
          pets: data
        })
      })
      .catch(err => console.log(err))
  }

  onChangeType = (e) => {
    console.log(e.target.value)
    this.setState({
      filters: {
        ...this.state.filters,
        type: e.target.value
      }
    })
  }

  onFindPetsClick = () => {
    fetch(this.constructURL())
      .then(resp => resp.json())
      .then(data => {
        this.setState({
          pets: data
        })
      })
      .catch(err => console.log(err))
  }

  onAdoptPet = (id) => {
    console.log("adopting", id)
    // find pet with this id
    // update isAdopted to true
    // set state
    const petToUpdate = this.state.pets.find(pet => pet.id === id)
    const idx = this.state.pets.indexOf(petToUpdate)
    const newState = {
      pets: [
        ...this.state.pets.slice(0, idx),
        {
          ...this.state.pets[idx],
          isAdopted: true
        },
        ...this.state.pets.slice(idx + 1)
      ]
      
    }
    this.setState(newState)
  }

  render() {
    console.log(this.state.pets)
    return (
      <div className="ui container">
        <header>
          <h1 className="ui dividing header">React Animal Shelter</h1>
        </header>
        <div className="ui container">
          <div className="ui grid">
            <div className="four wide column">
              <Filters pets={this.state.pets} filters={this.state.filters} onChangeType={this.onChangeType} onFindPetsClick={this.onFindPetsClick}/>
            </div>
            <div className="twelve wide column">
              <PetBrowser pets={this.state.pets} onAdoptPet={this.onAdoptPet} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App
