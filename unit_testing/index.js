function div (a, b){
    return a / b;
}
  
function containsNumbers(text){
for (let i = 0; i < text.length; i++) {
    //Have to check to make sure it is not a space and it is a number
    if (text.charAt(i) !== " " && !isNaN(text.charAt(i))){
        return true;
    }
}
return false;
}

exports.div = div;
exports.containsNumbers = containsNumbers;