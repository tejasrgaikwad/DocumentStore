const data = require('./data.json');

const version = Object.keys(data['time']).filter(key=>{
    return !key.includes('-');
})

const sorted = version;
const getLastMajorVersion=(lastReleasedList) => {

    const lastVersion =  lastReleasedList[lastReleasedList.length-1].split(".");
    let previousRelease = sorted[sorted.length-4];
    let current =parseInt(lastVersion[0]); 
    let prev = current -1;
    let previousVersion = [];
    for(i=sorted.length-4;i>0;i--)
    {
        previousVersion = sorted[i].split(".");
        if((current - parseInt(previousVersion[0])>1))
        {
            prev = parseInt(previousVersion[0]);
        }
        if(sorted[i].startsWith(prev))
        {
            previousRelease= sorted[i];
            break;
        }
    }

}
