import React, { useEffect , useState} from "react";
import api
 from "../component/AxiosInstance";
const useFetchAPI = () =>{

    const [movies, setMovies] = useState({
        moviesArr:[],
        totalResults:0
    });
    const [dataLoader, setDataLoader] = useState(false);
    const [error, setError] = useState("");

    

    const getMovieDetails = async (searchTerm,pageNo) =>{

        if(searchTerm===''){
            alert('Please Enter a movie name');
            return ;
        }

        try{
            
            setDataLoader(true);
            const response = await api.get(`/?s=${searchTerm.trim()}`,{params:{
                apiKey: "2149ed44",
                page: pageNo,
            }},);
            
            const movieData = response.data;
            console.log(movieData);
            setMovies({
                moviesArr:movieData.Search || [],
                totalResults:movieData.totalResults || 0});
            
            // setTotalResults(Math.ceil(response.data.totalResults / 10));




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