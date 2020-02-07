function removeParentheses(str){
	// Stack of indexes of open parentheses to match with closed
	let stack=new Array();
	let lowerBound = 0;
	let upperBound = 0;
	let i = 0;
	//remove all whitespace
	str = str.replace(/\s/g, "");
	for(let i = 0; i < str.length; i++){
		if(str[i] === '('){
			stack.push(i);
		}else if(str[i] === ')'){
			let lowerBound = stack.pop();
			let upperBound = i;
			let leftRequiresParen = false;
			let rightRequiresParen = false;
			let innerSign = getInnerSign(str, lowerBound, upperBound);
			if(lowerBound - 1 > 0 && 
				str[lowerBound-1] != '(' && 
				str[lowerBound-1] != ')'){
				leftRequiresParen = needParentheses(str[lowerBound - 1], innerSign, 'left');
			}
			if(upperBound + 1 < str.length && 
				str[upperBound+1] != '(' && 
				str[upperBound+1] != ')'){
				rightRequiresParen = needParentheses(innerSign, str[upperBound +1], 'right');
			}
			// remove the 2 parentheses and go back 2 characters for index i 
			if(!(leftRequiresParen || rightRequiresParen)){
				str = str.slice(0, lowerBound) + str.slice(lowerBound + 1);
				str = str.slice(0, upperBound - 1) + str.slice(upperBound);
				i = i - 2;
			}
		}
	}
	return str;
}

/* getInnerSign returns a sign (+,-,*,/) within two bounds that is 
not nested within other parentheses and is the lowest order of opperation */

function getInnerSign(str, lowerBound, upperBound){
	let innerSign = '/';
	// do not assign innerSign to a nested paraentheses sign 
	let innerStack= new Array();
	let map = {'+': 0, '-': 1, '*': 2, '/': 3};
	// assign innerSign to the lowest order of opperation
	for(let j=lowerBound + 1; j < upperBound; j++){
		if(str[j] === '+' && innerStack.length === 0){
			innerSign = '+';
		}else if(str[j] === '-' && 
			map[innerSign] > map['-'] &&
			innerStack.length === 0 &&
			!'+-*/('.includes(str[j-1])){ // in the case of a negative sign do not set innerSign to minus
			innerSign = '-';
		}else if(str[j] === '*' && 
			map[innerSign] > map['*'] &&
			innerStack.length === 0){
			innerSign = '*';
		}else if(str[j] === '('){
			innerStack.push('(');
		}else if(str[j] === ')'){
			innerStack.pop();
		}
	}
	return innerSign;
}

/* needParentheses returns true if parentheses are needed, false if not
first: is the first sign in the equation ex: 1*(2+3) first='*'
second: second sign in the equation ex: 1*(2+3) second='+'
side: left if outside sign is on the left ex: 1*(2+3)
side: right if outside sign is on the right ex: (1+2)*3 */

function needParentheses(first, second, side){
	let map = {'+': 0, '-': 1, '*': 2, '/': 3};

	let firstInt = map[first];
	let secondInt = map[second];
	
	let left = new Array(4);
	let right = new Array(4);
	
	left[0] = [false, false, false, false];
	left[1] = [true, true, false, false];
	left[2] = [true, true, false, false];
	left[3] = [true, true, true, true];
	right[0] = [false, false, true, true];
	right[1] = [false, false, true, true];
	right[2] = [false, false, false, false];
	right[3] = [false, false, false, false];

	if(side === 'left'){
		return left[firstInt][secondInt];
	}else{
		return right[firstInt][secondInt];
	}
}


console.log(removeParentheses("2+(3/-5)"));
console.log(removeParentheses("1*(2+(3*(4+5)))"));
console.log(removeParentheses("x+(y+-z)+(t+(v+w))"));
console.log(removeParentheses("a  / b * c+ ( d+e*f ) + g"));
console.log(removeParentheses("(((1*7)/(4+2)*(9+4)))/(2+(3*(4+5)))"));
console.log(removeParentheses("((((((((3+2))))))))"));
console.log(removeParentheses("4*(3*(3+2))"));
console.log(removeParentheses("(5*-4)/3"));

