import {useState, useEffect} from 'react'
import {getPostsPageAction} from "../../../app/actions/postActions/postActions";
import {useDispatch} from "react-redux";
import {getToken} from "../../../app/auth/auth";

const usePosts = (pageNum = 0, filter = null,isResetData,resetData) => {
    const [results, setResults] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState({})
    const [hasNextPage, setHasNextPage] = useState(false)

    const dispatch = useDispatch();
    const token = getToken();

    useEffect(() => {
        setIsLoading(true)
        setIsError(false)
        setError({})

        const controller = new AbortController()
        const {signal} = controller

        const requestBody = {
            options: {signal},
            postStatus: ["PUBLISHED"],
            token: token,
            pageNumber: pageNum,
            socialMediaType:filter
        }

       if(resetData){
console.log(resetData,"resetData======>")
           dispatch(getPostsPageAction(requestBody))
               .then((response) => {
                   if (response.meta.requestStatus === "fulfilled") {
                       if (pageNum === 0) {
                           if (filter) {
                               setResults(response?.payload?.filter(data => data.socialMediaType === filter));
                           } else {
                               setResults(response?.payload);
                           }
                       } else if (pageNum > 1) {
                           if (filter) {
                               setResults((prev) => [...prev, ...response?.payload?.filter(data => data.socialMediaType === filter)]);
                           } else {
                               setResults((prev) => [...prev, ...response?.payload]);
                           }
                       }
                       setHasNextPage(Boolean(response?.payload.length));
                       setIsLoading(false);
                   }
               })
               .catch((e) => {
                   setIsLoading(false);
                   if (signal.aborted) return;
                   setIsError(true);
                   setError({message: e.message});
               });
               isResetData(false)
               return () => controller.abort()
       }
     

    }, [pageNum, filter,resetData])

    return {isLoading, isError, error, results, setResults, hasNextPage,resetData}
}

export default usePosts;