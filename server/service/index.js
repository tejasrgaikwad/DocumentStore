import { rejects } from 'assert';
import { resolve } from 'path';

const packageReader = require('./package-reader');
const lineReader = require('line-reader');

const axios = require('axios');
const NPM_QUERY_URL = 'https://www.npmjs.com/search/suggestions?q=';
const NPM_REPOSITORY = 'https://registry.npmjs.org/';
const fs = require('fs');
const constants = require('../constants');
const readline = require('readline');
const basePath = constants.BASE_PATH + "/files/";

export const getPackageSuggestions = async (packageName) => {
    const response = await axios.get(NPM_QUERY_URL + packageName);
    return response.data;
}

function readFiles(dir){
    try {
    const arrayOfFiles = fs.readdirSync(dir)
    return arrayOfFiles;
    } catch(e) {
    console.log(e)
    }
}

function readAllFilesInDir(fileList) {
    var arrayOfFiles =new Array();
    var tmp = new Array();
    var data = {}

    fileList.forEach(function(file) {
        const userdir = basePath + file
        if (fs.statSync(userdir).isDirectory()) {
            const metafile = userdir+"/metadata.txt";
            if(fs.existsSync(metafile)) {
                const filedata = fs.readFileSync(metafile, 'utf8');            
                const arr = filedata.toString().replace(/\r\n/g,'\n').split('\n');
                for(let i of arr) {
                    if(!i)
                    continue;
                    const lineItem = i.split("|");
                    const obj = {
                        "DocumentName": lineItem[0],
                        "UploadedBy": lineItem[1],
                        "CreatedAt": lineItem[2],
                        "Notes": lineItem[4],
                        "Size": lineItem[3],
                        "Document":`http://localhost:3000/api/v1/files/${lineItem[1]}/${lineItem[0]}`
                    }
                    arrayOfFiles.push(obj);
                }
            }
            
        }
        console.log('before return', arrayOfFiles);
    });
    return arrayOfFiles;

}




export const getAllDocuments = async (packageName) => {
    const allFiles = readFiles(basePath);
    var arr = {};
    const data = readAllFilesInDir(allFiles);
    return data;
}

export const saveFile = async (req, res) => {
    console.log('req.files=', req.body.user);
    const fileData = req.files.selectedFile;
    console.log('fileData=', fileData);
    console.log(' process.env.PWD',  constants.BASE_PATH);
    const filename = fileData.name;
    const fileUser = req.body.user;

    const comments = req.body.comments;
    const newpath = constants.BASE_PATH + "/files/" + fileUser;
    console.log('newPath=', newpath);
    const metadataFile = newpath + "/metadata.txt";
    const size =  newpath + "/size.txt";
    const MAX_LIMIT_PER_FILE = 200 * 1024 * 1024;
    const MAX_LIMIT = 5 * 1024 * 1024 * 1024;
    if(!fileUser)
    {
        return res.status(500).send("No user specified");
    }
    if(!fileData)
    {
        return res.status(500).send("No files found");
    }
    
    if(fileData.size> MAX_LIMIT_PER_FILE)
    {
        return res.status(200).send('Maximum limit is 200MB per file.');
    }


    // create directy for user if not exist.
    if (!fs.existsSync(newpath)) {
        fs.mkdirSync(newpath, { recursive: true });
        console.log('Folder Created Successfully.');
    }

    console.log('calculating old size');
    // calculate total size including new file.
    var oldSize = 0;
    if(fs.existsSync(size))
    {
        oldSize = fs.readFileSync(size, 'utf8');
    }
    console.log('oldSize=', oldSize);
    const currentfilesize = fileData.size/1024;
    const newSize = (currentfilesize) + oldSize;
    
    console.log('newSize=', newSize);
    if(newSize>(MAX_LIMIT))
    {
        return res.status(500).send("Maximum file limit of 50GB exceeded.");
    }

    console.log('writing metadata file')
    // if file already present return error.
    if(!fs.existsSync(metadataFile))
    {
        fs.writeFileSync(metadataFile, "");
    }

    console.log('reading metadata', metadataFile);
    const data = fs.readFileSync(metadataFile, 'utf8');
    if (data.includes(filename)) {
        console.log('file already exist');
        return res.status(500).send("File already exist.");
    }

    // else write metadata.
    var date_ob = new Date();
    
    const writeData =`${filename}|${fileUser}|${date_ob}|${currentfilesize}|${comments}\n`
    console.log('writing new metadata', writeData);
    fs.appendFileSync(metadataFile, writeData);


    // write total directyr size.
    fs.writeFile(size, newSize, { flag: 'a+' }, err => {});
    const out = await fileData.mv(`${newpath}/${filename}`, (err) => {
        if (err) {
            console.log('error in file');
            return res.status(500).send("File upload failed");
        }
        console.log('fileUPloaded succesfully')
        return res.send("File Uploaded");
    });
    console.log('out =', out);
    return out;
}

export const getPackageMetadata = async (module) => {
    const response = await axios.get(`${NPM_REPOSITORY}/${module}`);
    const packageData = response.data;
    const availableVersions = packageData['time'];
    const versions = Object.keys(availableVersions).filter(key => !key.includes('-'));
    const lastReleasedList = versions.slice(versions.length - 3, versions.length);
    const previousVersion = getPreviousMajorVersion(lastReleasedList, versions)

    lastReleasedList.push(previousVersion);

    const allVersionsDetails = []
    let i = 0;
    for (i = 0; i < lastReleasedList.length; i++) {
        const tarball = packageData['versions'][lastReleasedList[i]]['dist']['tarball'];
        try {
            const metaData = await packageReader.getMinifiedCompressedSize(tarball);
            metaData.version = lastReleasedList[i];
            metaData.name = module;
            allVersionsDetails.push({ ...metaData });
        } catch (error) {
            allVersionsDetails.push({
                moduleSize: 0,
                minifiedSize: 0,
                minifiedGzippedSize: 0,
                version: astReleasedList[i],
                name: module
            })
        }
    }
    return allVersionsDetails;
}


const getPreviousMajorVersion = (lastReleasedList, versions) => {
    const lastVersion = lastReleasedList[lastReleasedList.length - 1].split(".");
    let previousRelease = versions[versions.length - 4];
    let current = parseInt(lastVersion[0]);
    let prev = current - 1;
    let previousVersion = [];
    let i = 0;
    for (i = versions.length - 4; i > 0; i--) {
        previousVersion = versions[i].split(".");
        if ((current - parseInt(previousVersion[0]) > 1)) {
            prev = parseInt(previousVersion[0]);
        }
        if (versions[i].startsWith(prev)) {
            previousRelease = versions[i];
            break;
        }
    }
    return previousRelease;
}
