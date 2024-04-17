import {useState, useEffect} from 'react'
import {getPostsPageAction} from "../../../app/actions/postActions/postActions";
import {useDispatch} from "react-redux";
import {getToken} from "../../../app/auth/auth";

const usePosts = (searchQuery) => {
    const [results, setResults] = useState(null)
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

        const requestBody = {
            postStatus: ["PUBLISHED"],
            token: token,
            socialMediaType: searchQuery?.socialMediaType,
            pageIds:searchQuery?.pageIds,
            pageSize:searchQuery?.pageSize,
            offSet:searchQuery?.offSet
        }


        if (searchQuery?.offSet >= 0 && error) {
            dispatch(getPostsPageAction(requestBody)).then((response) => {
                if (response.meta.requestStatus === "fulfilled") {
                    if (response?.payload?.data === null) {
                        setResults([]);
                    } else if (searchQuery?.offSet === 0) {
                        setResults(response?.payload?.data);
                    } else if (searchQuery?.offSet > 0) {
                        setResults((prev) => [...prev, ...response?.payload?.data]);
                    }
                    setHasNextPage(response?.payload?.hasNext);
                }
                if(response.meta.requestStatus === "rejected"){
                    setIsError(true);
                    setError({message: response?.payload?.data?.message})
                }
                setIsLoading(false);
            })
        }


    }, [searchQuery])

    return {isLoading, isError, error, results, setResults, hasNextPage}
}

export default usePosts;

