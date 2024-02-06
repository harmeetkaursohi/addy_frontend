const CommentText = ({comment, className = "", socialMediaType, usernames = [],setShowText,showText}) => {


    const showTextHandler=()=>{        
        if(comment.length > 200){
            setShowText(!showText)
        }
    }   
    if (socialMediaType === "INSTAGRAM") {
        const words = comment.split(' ');
        return words.map((word, index) => {            
            if (word.startsWith('@') || word.startsWith('#')) {
                return (<span key={index} className={className} onClick={showTextHandler}>{word}{' '}</span>);
            }
            return <span onClick={showTextHandler} key={index}>{word} </span>;
        });
    } else if (socialMediaType === "FACEBOOK") {
        const pattern = new RegExp(`(${usernames.join('|')})|(#\\w+)`, 'g');
        const parts = comment.split(pattern);
        const highlightedSentence = parts.map((part, index) => {

            if (usernames.includes(part)) {
                return <span key={index} className={className} >{part}</span>;
            } else if (part?.startsWith('#')) {
                return <span key={index} className={className}>{part}</span>;
            } else {
                return part;
            }
        });

        return <div>{highlightedSentence}</div>;
    }
    return <></>;
}
export default CommentText