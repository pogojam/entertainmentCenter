import { observable, action, autorun, flow } from "mobx";
import { client } from "../../../App";
import { QUERY_Movies } from "./api/Api_Querys";
import { persist } from "mobx-persist";

class MovieStore{
    @observable showPreview = true 
    @observable activePreviewMovie = {}
    @observable showPlayer = false
    @action setPreview = (newState) => {
       this.showPreview = newState 
    }
    @action setPlayer= (newState) => {
       this.showPlayer= newState 
    }
    
    @action getMoviesByCategory = () => {
       const {data}= client.query({query:QUERY_Movies}) 

    }
    @action setActivePreviewMovie = (data) => {
       this.activePreviewMovie = data 
    }
    

     
}

const store = (window.store = new MovieStore());
export default store;

autorun(() => {});
