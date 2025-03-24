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
// 加载题目内容
// 加载题目内容
function loadQuestion() {
    const {category, difficulty} = getQueryParams();
    const questionSelect = document.getElementById('questionSelect');
    const selectedQuestionIndex = parseInt(questionSelect.value) - 1;
    const question = questionData[category][difficulty][selectedQuestionIndex];

    // 更新问题描述
    document.getElementById('questionText').innerHTML = question.text;

    // 更新图片
    const questionImage = document.getElementById('questionImage');
    if (question.image) {
        questionImage.src = question.image;
        questionImage.style.display = 'block';
    } else {
        questionImage.src = '';
        questionImage.style.display = 'none';
    }

    // 更新提示列表
    const hintList = document.getElementById('hintList');
    hintList.innerHTML = ''; // 清空之前的列表项
    const hints = question.hint.split('\n'); // 以换行符分割提示文本
    hints.forEach(hint => {
        if (hint.trim() !== '') { // 忽略空行
            const listItem = document.createElement('li');
            listItem.innerText = hint.trim();
            hintList.appendChild(listItem);
        }
    });
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
                text: "Welcome to the <b>Brick Pyramid Challenge</b>! In this problem, you will apply logical reasoning and step-by-step calculations to <b>fill in missing values</b> in a <b>5-level pyramid</b>.<br>\n" +
                    "Each brick follows a simple rule:<br>\n" +
                    "Every brick is the <b>sum of the two bricks directly below it</b>.<br>\n" +
                    "In this pyramid, <b>one value is already given</b>—the bottom-left brick is <b>5</b>. Your task is to <b>fill in the missing numbers</b> so that the pyramid follows the rule.",
                image: "img/A/elementary_a.png",
                hint: "Follow the pyramid’s rule: each brick is the sum of the two bricks below it.\n" +
                    "Compute 31-10 and place the result in the empty space."
            },
        ],
        medium: [
            {
                title: "Question 2 (Filling Empty Bricks):",
                text: "Try to complete the entire brick pyramid by filling in the empty bricks.",
                image: "img/A/medium_a.png",
                hint: "Use the pyramid rule: Each brick is the sum of the two bricks directly below it.\n" +
                    "Start from the given numbers and work your way up\n" +
                    "Check your calculations by ensuring each level follows the rule correctly."
            },
            {
                title: "Question 3 (Exploring Multiple Solutions):",
                text: "Try to change the initial number in the bottom-left corner and solve the pyramid again.",
                image: "",
                hint: "Observe how your new solution compares to the previous one.\n" +
                    "Try selecting a different brick and repeat the previous steps.\n" +
                    "Did the solution change?"
            },
            {
                title: "Question 4 (Exploring Multiple Solutions):",
                text: "Choose a different brick to set the initial value. Will we still get a valid solution?",
                image: "",
                hint: "Try selecting a different empty brick as a starting point and observe how the pyramid changes.\n" +
                    "Pay special attention to the bottom-right corner.\n" +
                    "Can you determine if the solution is always unique?"
            },
        ],
        hard: [
            {
                title: "Question 5 (Exploring Multiple Solutions):",
                text: "Based on the previous experiment, when modifying the pyramid, can you design a pyramid with a unique solution? Think about where the arbitrariness of the solution comes from. （At least 5 given numbers in the pyramid you designed.)",
                image: "",
                hint: "The positions of these numbers are also crucial—placing them strategically affects whether the solution is unique.\n" +
                    "How can you eliminate the arbitrariness of the solution?"
            },
            {
                title: "Question 6 (System of Equations):",
                text: "If we fill in the bottom blank with a, b, c, d, can you use a system of equations to reach the previous conclusion? Think about how to eliminate the arbitrariness of the solution.",
                image: "",
                hint: "Try to use the Pyramid‘s rule to fill in each block.\n" +
                    "Can you construct the system of equations based on the known numbers?\n" +
                    "What is the form of the solutions to the system of equations?"
            }
        ]
    },
    B: {
        easy: [
            {
                title: "Question B1 (Solving a 3-Level Pyramid):",
                text: "Try to solve the following three-level pyramid using the given bottom-row numbers.",
                image: "img/B/elementary_b.png",
                hint: "Follow the pyramid’s rule: each brick is the sum of the two bricks below it.\n" +
                    "Compute 280-195 and place the result in the empty space.\n" +
                    "Verify your answer by checking whether the numbers follow the pyramid's rule."
            }
        ],
        medium: [
            {
                title: "Question 2 (Exploring Solutions for a 3-Level Pyramid):",
                text: "How can you determine whether the given values provide a sufficient number of equations to solve for all unknowns?",
                image: "",
                hint: "Count how many numbers are already provided in the pyramid.\n" +
                    "Determine how many unknown numbers need to be solved."
            },
            {
                title: "Question 3 (A Different Type of Solutions in a 3-Level Pyramid):",
                text: "Does a 3-level pyramid always have a unique solution and why?",
                image: "",
                hint: "Think about whether having fewer or more given numbers affects the type of solutions.\n" +
                    "Try solving a 3-level pyramid with only one given number—does it always lead to a unique answer?"
            },
            {
                title: "Question 4 (A Different Type of Solutions in a 3-Level Pyramid):",
                text: "If you were given too many numbers in the pyramid, what would happen?",
                image: "",
                hint: "If the problem provides more numbers than necessary, can you still find a solution?\n" +
                    "Can extra numbers cause contradictions, meaning the pyramid is overdetermined and cannot be solved?\n" +
                    "Try adding an extra number to a solved pyramid and check if it still satisfies all the rules."
            }
        ],
        hard: [
            {
                title: "Question 5 (Extension to 4-Level Pyramid):",
                text: "If we have a 4-Level pyramid, how does this affect the number of unknowns and equations?",
                image: "img/B/advanced_b.png",
                hint: "A 3-level pyramid has fewer numbers to solve than a 4-level or 5-level pyramid.\n" +
                    "Every additional level introduces more unknowns—but does it also provide more equations?\n" +
                    "Can you build a formula that relates the number of unknowns to the number of given values needed for a unique solution?"
            },
            {
                title: "Question 6 (Design your 5-Level Pyramid):",
                text: "Try to design your own pyramid: one that has a unique solution and another that has infinitely many solutions.",
                image: "",
                hint: "What is the key difference between a pyramid with a unique solution and one with infinitely many solutions?\n" +
                    "Use this difference as a guideline when designing your pyramids.\n" +
                    "Are there any other types of solutions? If so, what characteristics do they have?"
            }
        ]
    },
    C: {
        easy: [
            {
                title: "Question C1 (Recalling Systems of Equations):",
                text: "Try to recall how we solve a system of equations. Consider:",
                image: "img/C/elementary_c.png",
                hint: "Use substitution or elimination to solve for x and y.\n" +
                    "Solve one equation for a variable (e.g., x=10−y) and substitute it into the second equation.\n" +
                    "Keep this method in mind as we apply it to the pyramid problem."
            }
        ],
        medium: [
            {
                title: "Question 2 (Defining Variables for the Pyramid):",
                text: "Try to define unknowns for the bottom row of the pyramid. How many variables do we need?",
                image: "",
                hint: "Assign letters like a,b,c, and d to represent the unknown numbers in the bottom row.\n" +
                    "Look at how each number in the upper layers is calculated based on these variables.\n" +
                    "Think about how many unknowns we have and how many equations we need to solve for them."
            },
            {
                title: "Question 3 (Setting Up the Equations):",
                text: "Try to write equations based on the pyramid rule: each number is the sum of the two below it. Can you set up equations for the second row? e.g. a+b=10, c+d=20",
                image: "",
                hint: "Use the given numbers in the pyramid to help set up equations.\n" +
                    "If two numbers on the bottom row are a and b, then the number above them is a+b.\n" +
                    "Continue writing equations for all layers of the pyramid."
            },
            {
                title: "Question 4 (Solving for the Unknowns):",
                text: "Try to solve the system of equations you set up. What are the values you determine for the bottom row?",
                image: "",
                hint: "Use substitution or elimination as you did in Question 1."
            }
        ],
        hard: [
            {
                title: "Question 5 (Exploring Uniqueness):",
                text: "What is the difference between a unique solution and multiple solutions?",
                image: "",
                hint: "Try substituting a=10 into the equation and solve for the remaining variables.\n" +
                    "Compare your results with the previous solution.\n" +
                    "Check if the system has a unique solution or multiple solutions.\n" +
                    "Does the system always produce a unique solution, or are there multiple possibilities?"
            },
            {
                title: "Question 6 (Design your own Pyramid):",
                text: "Try to design your own pyramid: one that has a unique solution and another that has infinitely many solutions",
                image: "",
                hint: "What is the key difference between a pyramid with a unique solution and one with infinitely many solutions?\n" +
                    "Use this difference as a guideline when designing your pyramids.\n" +
                    "Are there any other types of solutions? If so, what characteristics do they have?"
            }
        ]
    }
};