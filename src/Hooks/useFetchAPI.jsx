import React, { useEffect , useState} from "react";
import api from "../component/AxiosInstance";

const useFetchAPI = () =>{

    const [movies, setMovies] = useState(null)
    const [dataLoader, setDataLoader] = useState(false);
    const [error, setError] = useState("");

    const getMovieDetails = async (endpoint,params) =>{

            console.log('Fetching data from API...');
        try{
            setDataLoader(true);
            const response = await api.get(endpoint,{params});
            const movieData = response.data;
            console.log(movieData);
            setMovies(movieData);
        }catch(err){
            if(err.response){
                // console.log(err.response.status);
                setError('Error while fetching data from server.');
            }else if(err.request){
                // console.log('no internet connection');
                setError('No Internet Connection.Please check your connection.');
            }else{
                // console.log('Unexpected Error');
                setError('Unexpected Error Occurred.');
            }
        }finally{
             setDataLoader(false);
        }

    }


    return [movies,setMovies,dataLoader,error,setError,getMovieDetails];
   


}


export default useFetchAPI;