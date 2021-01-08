let height = 12;
let width = 12;

let maze = [];

let offsetX = [ -2, 2, 0, 0 ];
let offsetY = [ 0, 0, -2, 2 ];

function initMaze()
{
    for (let i = 0; i < 2 * height + 1; i++)
    {
        maze[i] = [];

        for (let j = 0; j < 2 * width + 1; j++)
        {

            if (i % 2 == 1 && j % 2 == 1)
                maze[i][j] = '?';
            else
                maze[i][j] = '#';
        }
    }
    maze[1][1] = ' ';
    maze[2 * height - 1][2 * width] = ' ';
}

function createMaze(x, y)
{
    while (1)
    {
        let num = 0;
        let d;

        for(let i = 0; i < 4; i++)
        {
            if(x + offsetX[i] >= 0 && x + offsetX[i] < 2 * width + 1 && y + offsetY[i] >= 0 && y + offsetY[i] < 2 * width + 1)
                if (maze[x + offsetX[i]][y + offsetY[i]] == '?')
                    num += 1;
        }

        if (!num)
            break;
        
        while (1)
        { 
            d = Math.floor(Math.random() * 4);

            if(x + offsetX[d] >= 0 && x + offsetX[d] < 2 * width + 1 && y + offsetY[d] >= 0 && y + offsetY[d] < 2 * width + 1)
                if(maze[x + offsetX[d]][y + offsetY[d]] == '?')
                    break;
        }

        maze[x + offsetX[d]][y + offsetY[d]] = ' ';
        maze[x + offsetX[d] / 2][y + offsetY[d] / 2] = ' ';

        createMaze(x + offsetX[d], y + offsetY[d]);
    }
}

function printMaze()
{
    let wallGroup = new THREE.Group();
    let message = "";

    for (let i = 0; i < 2 * height + 1; i++)
    {
        
        for (let j = 0; j < 2 * width + 1; j++)
        {
            if(maze[i][j] == "#")
                createWall(i, j, wallGroup);

            message += maze[i][j];
        }

        message += "\n";
    }
    console.log(message);
    setMaze(wallGroup);
}

function main()
{
    initMaze();
    createMaze(1, 1);
    printMaze();
}

