import React, { useEffect , useState} from "react";
import api from "../component/AxiosInstance";

const useFetchAPI = () =>{

    const [movies, setMovies] = useState(null)
    const [dataLoader, setDataLoader] = useState(false);
    const [error, setError] = useState("");

    const getMovieDetails = async (endpoint,params) =>{

        try{
            setDataLoader(true);
            const response = await api.get(endpoint,{params});
            const movieData = response.data;
            console.log(movieData);
            setMovies(movieData);
        }catch(err){
            if(err.response){
                console.log(err.response.status);
            }else if(err.request){
                console.log('no internet connection');
            }else{
                console.log('Unexpected Error');
            }
        }finally{
             setDataLoader(false);
        }

    }


    return [movies,setMovies,dataLoader,error,getMovieDetails];
   


}


export default useFetchAPI;