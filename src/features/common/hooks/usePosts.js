import {useState, useEffect} from 'react'
import {getPostsPageAction} from "../../../app/actions/postActions/postActions";
import {useDispatch} from "react-redux";
import {getToken} from "../../../app/auth/auth";

const usePosts = (pageNum = 0, filter = null) => {
    const [results, setResults] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState({})
    const [hasNextPage, setHasNextPage] = useState(false)

    const dispatch = useDispatch();
    const token = getToken();


    console.log("@@@ filter ::: ", filter)

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
            pageNumber: pageNum
        }

        if (filter) {
            requestBody.socialMediaType = filter;
        }

        dispatch(getPostsPageAction(requestBody))
            .then((response) => {
                if (response.meta.requestStatus === "fulfilled") {
                    if (pageNum === 0) {
                        setResults(response?.payload);
                    } else if(pageNum>1 ){
                        setResults((prev) => [...prev, ...response?.payload]);
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

        return () => controller.abort()

    }, [pageNum, filter])

    return {isLoading, isError, error, results, hasNextPage}
}

export default usePosts;