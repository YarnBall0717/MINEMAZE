var BS=document.getElementById("bestScore");
var FI=document.getElementById("newScore");
var tags=[];
var i;
for(i=0;i<localStorage.length;i++)
{
    tags[i]=localStorage.key(i);
}
var NewTemp,BestTemp;
for (tag in tags)
{
    var temp=tags[tag].substring(0,15);
    if(temp=='NEW_GAME_RESULT')
    {
        NewTemp=parseInt(JSON.parse(localStorage.getItem(tags[tag]))["AccumulatingTime"]);
    }
    if(temp=='BEST_GAME_RESUL')
    {
        BestTemp=parseInt(JSON.parse(localStorage.getItem(tags[tag]))["AccumulatingTime"]);
    }
    if(NewTemp&&BestTemp)
        break;
}

if(BestTemp>NewTemp||!BestTemp)
{
    var gameData={
        AccumulatingTime: NewTemp
    }
    localStorage.setItem('BEST_GAME_RESULT', JSON.stringify(gameData))
    BS.textContent=parseInt(NewTemp/1000)+"sec";
    FI.textContent=parseInt(NewTemp/1000)+"sec";
}
else
{
    BS.textContent=parseInt(BestTemp/1000)+"sec";
    FI.textContent=parseInt(NewTemp/1000)+"sec";
}
