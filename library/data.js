const fs = require('fs');
const path = require('path');

const lib = {};
lib.baseDir = path.join(__dirname, '/../.data/');

// write Data to file
lib.create = function (dir, file, data, callback) {
    fs.open(lib.baseDir + dir + '/' + file + '.json', 'wx', function (err, fileDescriptor) {
        if (!err && fileDescriptor) {
            const stringData = JSON.stringify(data);

            fs.writeFile(fileDescriptor, stringData, function (err) {
                if (!err) {
                    fs.close(fileDescriptor, function (err) {
                        if (!err) {
                            callback(false)
                        } else {
                            callback('Error closing the new file!', err)
                        }
                    })
                } else {
                    callback('Error writing to new file!', err)
                }
            })
        } else {
            callback('Could not create new file. It may already exist.', err)
        }
    })
};

// read data from file
lib.read = (dir, file, callback) => {
    fs.readFile(lib.baseDir + dir + '/' + file + '.json', 'utf8', (err, data) => {
        callback(err, data)
    })
}

// update data from file
lib.update = (dir, file, data, callback) => {
    fs.open(lib.baseDir + dir + '/' + file + '.json', 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            const stringData = JSON.stringify(data);
            fs.ftruncate(fileDescriptor, (err) => {
                if (!err) {
                    fs.writeFile(fileDescriptor, stringData, (err) => {
                        if (!err) {
                            fs.close(fileDescriptor, (err) => {
                                if (!err) {
                                    callback(false)
                                } else {
                                    callback('Error in file close')
                                }
                            })
                        } else {
                            callback('Error writing file!')
                        }
                    })
                } else {
                    callback('Error Truncating file!')
                }
            })
        } else {
            callback("Cant't update. File may not Exist!")
        }
    })
}

// delete data from file
lib.delete = (dir, file, callback) => {
    fs.unlink(lib.baseDir + dir + '/' + file + '.json', (err) => {
        if (!err) {
            callback(false)
        } else {
            callback('Error in delete!')
        }
    })
}

module.exports = lib;