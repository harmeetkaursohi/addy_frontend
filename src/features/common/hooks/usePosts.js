import {useState, useEffect} from 'react'
import {getPostsPageAction} from "../../../app/actions/postActions/postActions";
import {useDispatch} from "react-redux";
import {getToken} from "../../../app/auth/auth";

const usePosts = (pageNum = 0) => {
    const [results, setResults] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState({})
    const [hasNextPage, setHasNextPage] = useState(false)
    console.log("setResults----->",results);

    const dispatch = useDispatch();
    const token=getToken();

    useEffect(() => {
        setIsLoading(true)
        setIsError(false)
        setError({})

        const controller = new AbortController()
        const {signal} = controller

        const requestBody = {
            options: {signal},
            postStatus:"PUBLISHED",
            token:token
        }

        dispatch(getPostsPageAction(requestBody))
            .then((response) => {
                if (response.meta.requestStatus === "fulfilled") {
                    console.log("response---",response);
                    setResults((prev) => [...prev, ...response?.payload]);
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

        return () => controller.abort()

    }, [pageNum])

    return {isLoading, isError, error, results, hasNextPage}
}

export default usePosts;