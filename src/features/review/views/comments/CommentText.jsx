const CommentText=({comment,className=""})=>{
    const words = comment.split(' ');
    return words.map((word, index) => {
        if (word.startsWith('@') || word.startsWith('#')) {
            return (
                <span key={index} className={className}>
            {word}{' '}
          </span>
            );
        }
        return <span key={index}>{word} </span>;
    });
}
export default CommentText