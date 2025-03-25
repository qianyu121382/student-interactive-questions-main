let selectedOptions = [];
let answers = {};

// 显示选择的类别
function displaySelectedCategory() {
    const {category} = getQueryParams();
    const categoryText = document.getElementById('categoryText');
    categoryText.innerText = `Category ${category}`;
}

// 获取查询参数
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        category: params.get('category') || 'A',
        difficulty: params.get('difficulty') || 'easy'
    };
}

// 更新查询参数并跳转
function updateLocation(category, difficulty) {
    const baseUrl = window.location.pathname;
    window.location.href = `${baseUrl}?category=${category}&difficulty=${difficulty}`;
}

// 加载题目选择框
function loadDifficultyQuestions() {
    const {category, difficulty} = getQueryParams();
    const questionSelect = document.getElementById('questionSelect');
    const questions = questionData[category][difficulty];

    // 清空题目选择框
    questionSelect.innerHTML = '';

    // 加载对应难度的题目
    questions.forEach((question, index) => {
        const option = document.createElement('option');
        option.value = index + 1; // 选项值为题目编号
        option.text = `${question.title}`; // 显示问题标题
        questionSelect.appendChild(option);
    });

    // 默认加载第一个题目
    loadQuestion();
}

// 更新难度显示
function updateDifficultyDisplay(difficulty) {
    const difficultyDisplay = document.getElementById('difficultyDisplay');
    const difficultyIndex = {easy: 0, medium: 1, hard: 2}[difficulty];
    difficultyDisplay.innerText = questionGrade[difficultyIndex];
}

// 提示按钮逻辑
document.getElementById('hintButton').addEventListener('click', function () {
    const hintList = document.getElementById('hintList');
    if (hintList.classList.contains('hidden')) {
        hintList.classList.remove('hidden'); // 显示提示列表
    } else {
        hintList.classList.add('hidden'); // 隐藏提示列表
    }
});

function loadImage(question) {
    // 更新图片
    const questionImage = document.getElementById('questionImage');
    if (question.image) {
        questionImage.src = question.image;
        questionImage.style.display = 'block';
    } else {
        questionImage.src = '';
        questionImage.style.display = 'none';
    }

}

function loadHint(question) {
    const hintList = document.getElementById('hintList');
    hintList.innerHTML = ''; // 清空之前的列表项
    const hints = question.hint.split('\n'); // 以换行符分割提示文本
    hints.forEach(hint => {
        if (hint.trim() !== '') { // 忽略空行
            const listItem = document.createElement('li');
            listItem.innerHTML = hint.trim();
            hintList.appendChild(listItem);
        }
    });
}

function loadTextArea(question) {
    const textDescriptionDiv = document.getElementById('text-description');
    textDescriptionDiv.innerHTML = '';
    if (question.textarea === 'true') {
        // 获取文本描述区域的 DOM 元素
        if (textDescriptionDiv) { // 确保文本描述区域存在
            if (question.text_question) { // 先判断 text_question 是否存在
                // 存在的话，渲染一个包含 text_question 值的 <p> 标签
                const questionParagraph = document.createElement('p');
                questionParagraph.innerText = question.text_question;
                questionParagraph.style.marginLeft = '2vh';
                questionParagraph.style.textAlign = 'left';
                textDescriptionDiv.appendChild(questionParagraph);
            }
            // 创建输入框区域
            const answerSection = document.createElement('div');
            answerSection.className = 'answer-section';
            answerSection.innerHTML = '<textarea id="answerInput" placeholder="Enter your answer here"></textarea>';
            textDescriptionDiv.appendChild(answerSection);
        }
    }
}

function loadSelect(question) {
    const selectDiv = document.getElementById('select');
    selectDiv.innerHTML = '';
    if (question.select_question) {
        const selectData = question.select_question;
// 获取目标<div>元素


        // 清空<div>元素的内容（如果需要）
        selectDiv.innerHTML = '';

        // 创建问题部分
        const questionParagraph = document.createElement('p');
        questionParagraph.textContent = selectData.question;
        questionParagraph.className = 'question-container'; // 添加CSS类
        selectDiv.appendChild(questionParagraph);

        // 创建答案选项部分
        const answersDiv = document.createElement('div');
        answersDiv.className = 'answer-container'; // 添加CSS类
        selectData.answers.forEach((answer, index) => {
            const label = document.createElement('label');
            label.innerHTML = `
                <input type="radio" name="answer" value="${answer}" />
                ${answer}
            `;
            answersDiv.appendChild(label);
        });
        selectDiv.appendChild(answersDiv);
    }

}

// 加载题目内容
function loadQuestion() {
    const {category, difficulty} = getQueryParams();
    const questionSelect = document.getElementById('questionSelect');
    const selectedQuestionIndex = parseInt(questionSelect.value) - 1;
    const question = questionData[category][difficulty][selectedQuestionIndex];

    // 更新问题描述
    document.getElementById('questionText').innerHTML = question.text;
    // 加载图片
    loadImage(question);
    // 更新提示列表
    loadHint(question);
    // 加载金字塔结构
    generatePyramid(question);
    // 加载文本描述区域
    loadTextArea(question);
    // 加载选择框
    loadSelect(question);
    document.getElementById('questionOther').innerHTML = ""
    if (question.other !== "") {
        document.getElementById('questionOther').innerHTML = question.other;
    }
}

function calculateNumRows(totalBricks) {
    let n = (-1 + Math.sqrt(1 + 8 * totalBricks)) / 2;
    return Math.floor(n);
}

// 动态生成金字塔结构
function generatePyramid(question) {
    const values = question.pyramid.split(',').map(value => value.trim());
    const colors = question.pyramid_color.split(',').map(color => color.trim());
    const pyramidContainer = document.querySelector('.pyramid-container');
    pyramidContainer.innerHTML = ''; // 清空现有的金字塔结构

    if (values.length !== 1) {

        // 计算行数
        const numRows = calculateNumRows(values.length);

        for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
            const row = document.createElement('div');
            row.className = 'row';
            for (let colIndex = 0; colIndex <= rowIndex; colIndex++) {
                const index = rowIndex * (rowIndex + 1) / 2 + colIndex;
                console.log(index)
                if (index < values.length) {
                    const box = document.createElement('div');
                    box.className = 'box';
                    // 设置背景颜色
                    if (colors[index] === 'true') {
                        box.classList.add('highlight');
                    }
                    // 根据values中的值设置box内容
                    if (values[index] === '-1') {
                        const input = document.createElement('input');
                        input.type = 'text';
                        box.appendChild(input);
                    } else if (values[index] === '-2') {
                        box.textContent = ''; // 空白内容的砖块
                    } else if (values[index] === '?') {
                        const input = document.createElement('input');
                        input.type = 'text';
                        input.value = '?'; // 默认内容是?的输入框
                        box.appendChild(input);
                    } else {
                        box.textContent = values[index]; // 数值砖块
                    }
                    row.appendChild(box);
                }
            }
            pyramidContainer.appendChild(row);
        }

    }
}

// 提交答案
function submitAnswer() {
    const {category, difficulty} = getQueryParams();
    const nextDifficulty = {
        easy: 'medium',
        medium: 'hard',
        hard: 'end'
    };

    if (nextDifficulty[difficulty] === 'end') {
        alert("Congratulations! You have completed all levels.");
        window.location.href = 'index.html';
    } else {
        updateLocation(category, nextDifficulty[difficulty]); // 更新查询参数并跳转
    }
}

// 提示按钮逻辑
document.getElementById('hintButton').addEventListener('click', function () {
    const hintText = document.getElementById('hintText');
    if (hintText.classList.contains('hidden')) {
        hintText.classList.remove('hidden'); // 显示提示文本
    } else {
        hintText.classList.add('hidden'); // 隐藏提示文本
    }
});

// 返回上一页
function goBack() {
    const {category, difficulty} = getQueryParams();
    const difficultyDisplay = document.getElementById('difficultyDisplay');

    if (history.length > 1) {
        history.back(); // 返回上一页
    } else {
        window.location.href = 'index.html'; // 如果没有上一页，返回到 index.html
    }
}

// 初始化页面
window.onload = function () {
    const {category, difficulty} = getQueryParams();
    updateDifficultyDisplay(difficulty); // 更新难度显示
    loadDifficultyQuestions(); // 加载难度对应的题目选择框
    displaySelectedCategory(); // 显示选择的类别
};
const questionGrade = ["Elementary  level", "Medium Level", "Advanced level"]
const questionData = {
    A: {
        easy: [
            {
                title: "Question 1: Solve the 5-Level Pyramid with a Given Value",
                text: "Welcome to the Brick Pyramid Challenge! In this problem, you will apply logical reasoning and step-by-step calculations to fill in missing values in a 5-level pyramid.<br>\n" +
                    "Each brick follows a simple rule:<br>\n" +
                    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Every brick is the sum of the two bricks directly below it.<br>\n<br>" +
                    "In this pyramid, one value is already given—the bottom-left brick is 5. Your task is to fill in the missing numbers so that the pyramid follows the rule.",
                image: "",
                other: "Main task:<br>" +
                    "Use the pyramid rule to determine all missing values and complete the pyramid.",
                hint: "Start from the bottom row—you already know the first number (5). Use the rule to find the next brick in that row.<br>\n" +
                    "Move upward step by step, using the sum rule to fill in the second row, then the third, and so on.<br>\n" +
                    "Check your calculations—each brick must be the sum of the two below it.",
                textarea: "false",
                pyramid: "280," +
                    "-1,-1," +
                    "-1,75,-1," +
                    "31,-1,-1,-1," +
                    "5,-1,13,-1,-1",
                pyramid_color: "true," +
                    "false,false," +
                    "false,true,false," +
                    "true,false,false,false," +
                    "false,false,true,false,false"
            },
        ],
        medium: [
            {
                title: "Question 2: Identify the Solution Type of the 5-Level Pyramid",
                text: "In our pyramid problem, we have three different types of solutions:<br>\n" +
                    "<ul>\n" +
                    "<li>Unique Solution: The pyramid has a unique solution, meaning that there is only one possible way to fill in the missing values.</li>\n" +
                    "<li>Multiple Solutions: The pyramid has multiple solutions, meaning that there are many different possible ways to fill in the missing values.</li>\n" +
                    "<li>No Solution: The pyramid has no solution, meaning that there is no possible way to assign values to the missing bricks while satisfying the pyramid rule.</li>\n" +
                    "</ul>",
                image: "",
                other: "Main task:<br>\n" +
                    "Whether the above pyramid has a unique solution, multiple solutions, or no solution.",
                hint: "Try to find one solution—fill in the missing numbers step by step using the pyramid rule.\n" +
                    "Check if you can find another solution—try adjusting some of the missing numbers while still following the pyramid rule.\n" +
                    "Determine the solution type—if multiple valid solutions exist, the problem has multiple solutions; if only one solution is possible, it has a unique solution; if no numbers satisfy the pyramid rule, it has no solution.",
                textarea: "true",
                select_question: {
                    question: "What type of solution does the pyramid have?",
                    answers: ["unique solution", "multiple solutions", "no solution"]
                },
                text_question: "Please explain the reason(s)",
                pyramid: "280," +
                    "-1,-1," +
                    "-1,75,-1," +
                    "31,-1,-1,-1," +
                    "-1,-1,13,-1,-1",
                pyramid_color: "true," +
                    "false,false," +
                    "false,true,false," +
                    "true,false,false,false," +
                    "false,false,true,false,false"
            },
            {
                title: "Question 3: Changing the Position of the Additional Given Number",
                text: "In the previous problem A1, we explored how adding an extra number to the bottom row affected the solution type of the pyramid.<br>\n<br>" +
                    "Now, let's take a step further: What happens when we change the position of this additional number?<br>\n<br>" +
                    "Main task:<br>\n" +
                    "Try to solve the following pyramid by filling in the missing values while following the pyramid rule.",
                image: "",
                other: "",
                hint: "Observe how your new solution compares to the previous one.\n" +
                    "Try selecting a different brick and repeat the previous steps.\n" +
                    "Did the solution change?",
                textarea: "true",
                text_question: "Please explain how you found the solution.",
                pyramid: "280," +
                    "-1,-1," +
                    "-1,75,-1," +
                    "31,-1,-1,-1," +
                    "-1,-1,13,-1,1",
                pyramid_color: "true," +
                    "false,false," +
                    "false,true,false," +
                    "true,false,false,false," +
                    "false,false,true,false,false"
            },
            {
                title: "Question 4: The Mysterious Brick Pyramid Challenge",
                text: "You are a puzzle master at the Mathematical Pyramid Tournament. Two contestants, A\n" +
                    "and B, have submitted their completed 5-level Brick Pyramid solutions. However, the\n" +
                    "judges are unsure whether their solutions are correct.\n<br>" +
                    "Your role? Act as the final verifier—check their pyramids, and correct any mistakes.\n<br><br>" +
                    "Main task:<br>" +
                    "Verify whether both pyramids are correct, can you fix the mistakes?",
                image: "img/A/A4.png",
                other: "",
                select_question: {
                    question: "",
                    answers: ["A is correct", "B is correct", "Both A and B", "Neither A nor B"]
                },
                hint: "Check each row carefully—does every brick follow the sum rule?" +
                    "If an error is found, modify the necessary numbers while keeping the\n" +
                    "pyramid consistent.",
                textarea: "true",
                text_question:"Please explain your reason(s)",
                pyramid: "",
                pyramid_color: "",
            },
        ],
        hard: [
            {
                title: "Question 5 (Exploring Multiple Solutions):",
                text: "Based on the previous experiment, when modifying the pyramid, can you design a pyramid with a unique solution? Think about where the arbitrariness of the solution comes from. （At least 5 given numbers in the pyramid you designed.)",
                image: "",
                other: "",
                hint: "The positions of these numbers are also crucial—placing them strategically affects whether the solution is unique.\n" +
                    "How can you eliminate the arbitrariness of the solution?",
                textarea: "false",
                pyramid: "-1," +
                    "-1,-1," +
                    "-1,-1,-1," +
                    "-1,-1,-1,-1," +
                    "-1,-1,-1,-1,-1",
                pyramid_color: "false," +
                    "false,false," +
                    "false,false,false," +
                    "false,false,false,false," +
                    "false,false,false,false,false"
            },
            {
                title: "Question 6 (System of Equations):",
                text: "If we fill in the bottom blank with a, b, c, d, can you use a system of equations to reach the previous conclusion? Think about how to eliminate the arbitrariness of the solution.",
                image: "",
                other: "",
                hint: "Try to use the Pyramid‘s rule to fill in each block.\n" +
                    "Can you construct the system of equations based on the known numbers?\n" +
                    "What is the form of the solutions to the system of equations?",
                textarea: "false",
                pyramid: "-1," +
                    "-1,-1," +
                    "-1,-1,-1," +
                    "-1,-1,-1,-1," +
                    "-1,-1,-1,-1,-1",
                pyramid_color: "false," +
                    "false,false," +
                    "false,false,false," +
                    "false,false,false,false," +
                    "false,false,false,false,false"
            }
        ]
    },
    B: {
        easy: [
            {
                title: "Question B1 (Solving a 3-Level Pyramid):",
                text: "Try to solve the following three-level pyramid using the given bottom-row numbers.",
                image: "",
                other: "",
                hint: "Follow the pyramid’s rule: each brick is the sum of the two bricks below it.\n" +
                    "Compute 280-195 and place the result in the empty space.\n" +
                    "Verify your answer by checking whether the numbers follow the pyramid's rule.",
                textarea: "false",
                pyramid: "280," +
                    "195,-1," +
                    "-1,-1,10,",
                pyramid_color: "true," +
                    "false,false," +
                    "false,false,false,",
            }
        ],
        medium: [
            {
                title: "Question 2 (Exploring Solutions for a 3-Level Pyramid):",
                text: "How can you determine whether the given values provide a sufficient number of equations to solve for all unknowns?",
                image: "",
                other: "",
                hint: "Count how many numbers are already provided in the pyramid.\n" +
                    "Determine how many unknown numbers need to be solved.",
                textarea: "true",
                pyramid: "280," +
                    "195,-1," +
                    "-1,-1,10,",
                pyramid_color: "true," +
                    "false,false," +
                    "false,false,false,",
            },
            {
                title: "Question 3 (A Different Type of Solutions in a 3-Level Pyramid):",
                text: "Does a 3-level pyramid always have a unique solution and why?",
                image: "",
                other: "",
                hint: "Think about whether having fewer or more given numbers affects the type of solutions.\n" +
                    "Try solving a 3-level pyramid with only one given number—does it always lead to a unique answer?",
                textarea: "true",
                pyramid: "280," +
                    "195,-1," +
                    "-1,-1,10,",
                pyramid_color: "true," +
                    "false,false," +
                    "false,false,false,",
            },
            {
                title: "Question 4 (A Different Type of Solutions in a 3-Level Pyramid):",
                text: "If you were given too many numbers in the pyramid, what would happen?",
                image: "",
                other: "",
                hint: "If the problem provides more numbers than necessary, can you still find a solution?\n" +
                    "Can extra numbers cause contradictions, meaning the pyramid is overdetermined and cannot be solved?\n" +
                    "Try adding an extra number to a solved pyramid and check if it still satisfies all the rules.",
                textarea: "true",
                pyramid: "-1," +
                    "-1,-1," +
                    "-1,-1,-1," +
                    "-1,-1,-1,-1," +
                    "-1,-1,-1,-1,-1",
                pyramid_color: "false," +
                    "false,false," +
                    "false,true,false," +
                    "false,false,false,false," +
                    "false,false,false,false,false"
            }
        ],
        hard: [
            {
                title: "Question 5 (Extension to 4-Level Pyramid):",
                text: "If we have a 4-Level pyramid, how does this affect the number of unknowns and equations?",
                image: "",
                other: "",
                hint: "A 3-level pyramid has fewer numbers to solve than a 4-level or 5-level pyramid.\n" +
                    "Every additional level introduces more unknowns—but does it also provide more equations?\n" +
                    "Can you build a formula that relates the number of unknowns to the number of given values needed for a unique solution?",
                textarea: "true",
                pyramid: "280," +
                    "-1,-1," +
                    "-1,75,-1," +
                    "31,-1,-1,-1,",
                pyramid_color: "true," +
                    "false,false," +
                    "false,true,false," +
                    "true,false,false,false,"
            },
            {
                title: "Question 6 (Design your 5-Level Pyramid):",
                text: "Try to design your own pyramid: one that has a unique solution and another that has infinitely many solutions.",
                image: "",
                other: "",
                hint: "What is the key difference between a pyramid with a unique solution and one with infinitely many solutions?\n" +
                    "Use this difference as a guideline when designing your pyramids.\n" +
                    "Are there any other types of solutions? If so, what characteristics do they have?",
                textarea: "true",
                pyramid: "-1," +
                    "-1,-1," +
                    "-1,-1,-1," +
                    "-1,-1,-1,-1," +
                    "-1,-1,-1,-1,-1",
                pyramid_color: "false," +
                    "false,false," +
                    "false,true,false," +
                    "false,false,false,false," +
                    "false,false,false,false,false"
            }
        ]
    },
    C: {
        easy: [
            {
                title: "Question C1 (Recalling Systems of Equations):",
                text: "Try to recall how we solve a system of equations. Consider:",
                image: "img/C/elementary_c.png",
                other: "Solve the system of equations.",
                hint: "Use substitution or elimination to solve for x and y.\n" +
                    "Solve one equation for a variable (e.g., x=10−y) and substitute it into the second equation.\n" +
                    "Keep this method in mind as we apply it to the pyramid problem.",
                textarea: "true",
                pyramid: "",
                pyramid_color: "",
            }
        ],
        medium: [
            {
                title: "Question 2 (Defining Variables for the Pyramid):",
                text: "Try to define unknowns for the bottom row of the pyramid. How many variables do we need?",
                image: "",
                other: "",
                hint: "Assign letters like a,b,c, and d to represent the unknown numbers in the bottom row.\n" +
                    "Look at how each number in the upper layers is calculated based on these variables.\n" +
                    "Think about how many unknowns we have and how many equations we need to solve for them.",
                textarea: "true",
                pyramid: "280," +
                    "-1,-1," +
                    "-1,75,-1," +
                    "31,-1,-1,-1," +
                    "-1,-1,13,-1,-1",
                pyramid_color: "true," +
                    "false,false," +
                    "false,true,false," +
                    "true,false,false,false," +
                    "false,false,true,false,false"
            },
            {
                title: "Question 3 (Setting Up the Equations):",
                text: "Try to write equations based on the pyramid rule: each number is the sum of the two below it. Can you set up equations for the second row? e.g. a+b=10, c+d=20",
                image: "",
                other: "",
                hint: "Use the given numbers in the pyramid to help set up equations.\n" +
                    "If two numbers on the bottom row are a and b, then the number above them is a+b.\n" +
                    "Continue writing equations for all layers of the pyramid.",
                textarea: "true",
                pyramid: "280," +
                    "-1,-1," +
                    "-1,75,-1," +
                    "31,-1,-1,-1," +
                    "-1,-1,13,-1,-1",
                pyramid_color: "true," +
                    "false,false," +
                    "false,true,false," +
                    "true,false,false,false," +
                    "false,false,true,false,false"
            },
            {
                title: "Question 4 (Solving for the Unknowns):",
                text: "Try to build a system of equations to solve a pyramid problem. What are the values you determine for the bottom row?",
                image: "",
                other: "",
                hint: "Use substitution or elimination as you did in Question 1.",
                textarea: "true",
                pyramid: "280," +
                    "-1,-1," +
                    "-1,75,-1," +
                    "31,-1,-1,-1," +
                    "-1,-1,13,-1,-1",
                pyramid_color: "true," +
                    "false,false," +
                    "false,true,false," +
                    "true,false,false,false," +
                    "false,false,true,false,false"
            }
        ],
        hard: [
            {
                title: "Question 5 (Exploring Uniqueness):",
                text: "What is the difference between a unique solution and multiple solutions?",
                image: "",
                other: "",
                hint: "Try substituting a=10 into the equation and solve for the remaining variables.\n" +
                    "Compare your results with the previous solution.\n" +
                    "Check if the system has a unique solution or multiple solutions.\n" +
                    "Does the system always produce a unique solution, or are there multiple possibilities?",
                textarea: "true",
                pyramid: "",
                pyramid_color: "",
            },
            {
                title: "Question 6 (Design your own Pyramid):",
                text: "Try to design your own pyramid: one that has a unique solution and another that has infinitely many solutions",
                image: "",
                other: "",
                hint: "What is the key difference between a pyramid with a unique solution and one with infinitely many solutions?\n" +
                    "Use this difference as a guideline when designing your pyramids.\n" +
                    "Are there any other types of solutions? If so, what characteristics do they have?",
                textarea: "true",
                pyramid: "-1," +
                    "-1,-1," +
                    "-1,-1,-1," +
                    "-1,-1,-1,-1," +
                    "-1,-1,-1,-1,-1",
                pyramid_color: "false," +
                    "false,false," +
                    "false,true,false," +
                    "false,false,false,false," +
                    "false,false,false,false,false"
            }
        ]
    }
};