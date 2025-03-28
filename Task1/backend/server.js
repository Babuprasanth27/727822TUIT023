const express = require('express');

const app = express();
const port = 9876;
const window_size = 10;
const windows = { 'p': [], 'f': [], 'e': [], 'r': [] };


const generatePrimes=(count)=>{
    const primes=[];
    let num = 2;
    while (primes.length < count) {
        if (primes.every((p) => num % p !== 0)) primes.push(num);
        num++;
    }
    return primes;
}

const generateFibonacci = (count) => {
    let fib=[0, 1];
    while (fib.length<count) {
        fib.push(fib[fib.length-1]+fib[fib.length-2]);
    }
    return fib.slice(0, count);
}

const generateEvenNumbers = (count)=>{
    return Array.from({ length: count },(_, i)=>(i + 1) * 2);
}

const generateRandomNumbers = (count, min = 1, max = 100) => {
    return Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1) + min));
}

const getNumbers = (type) => {
    switch (type) {
        case 'p': return generatePrimes(10);
        case 'f': return generateFibonacci(10);
        case 'e': return generateEvenNumbers(10);
        case 'r': return generateRandomNumbers(10);
        default: return [];
    }
};

const updateWindow=(type, newNums) => {
    const prevState=[...windows[type]];
    const uniqueNum=newNums.filter((num)=>!windows[type].includes(num));
    windows[type].push(...uniqueNum);
    if (windows[type].length > window_size) {
        windows[type]=windows[type].slice(-window_size);
    }
    return prevState;
}

const calculateAverage = (nums) => {
    if (nums.length === 0) return 0;
    return (nums.reduce((sum, num) => sum + num, 0) / nums.length).toFixed(2);
};

app.get('/numbers/:type', async (req, res) => {
    const type = req.params.type;
    if (!['p', 'f', 'e', 'r'].includes(type)) {
        return res.status(400).json({ error: "Invalid type. Use 'p', 'f', 'e', or 'r'." });
    }

    const fetchedNumbers = getNumbers(type);
    const prevState = updateWindow(type, fetchedNumbers);
    const currState = [...windows[type]];
    const avg = calculateAverage(currState);

    res.json({
        windowPrevState: prevState,
        windowCurrState: currState,
        numbers: fetchedNumbers,
        avg: parseFloat(avg)
    });
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));


