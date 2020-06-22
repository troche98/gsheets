function removeDuplicates(array) {
    let obj = {};
    for (var  y = 0; y < array.length; y++) {
        var key = array[y][0] + '|' + array[y][1] + '|' + array[y][2];
        if (!obj[key]) {
            obj[key] = [];
            for (var i = 3; i < array[0].length; i++) {
                if (array[y][i])
                    obj[key].push(array[y][i]);
                else
                    obj[key].push('');
            }
        }
    }
    return obj;
};

function mergeProfiles(profilesA, profilesB) {
    var obj = {}
    for (var key in profilesA) {
        if (profilesB[key]) {
            obj[key] = profilesA[key].concat(profilesB[key]);
        } else {
            obj[key] = profilesA[key].concat(['', '', '']);
        }
    }
    for (var key in profilesB) {
        if (!obj[key]) {
            obj[key] = profilesB[key].concat(['', '', '']);
        }
    }
    for (var key in obj) {
        var list = obj[key];
        if (list[0] == '' && list[3] != '')
            list[0] = list[3];
        if (list[1] == '' && list[4] != '')
            list[1] = list[4];
        var newL = list.slice(0, -2);
        obj[key] = newL;
    }
    return obj;
}

function hashTableToList(obj) {
    var newProfiles = [];
    for (var key in obj) {
        var values = obj[key];
        var keys = key.split('|');
        newProfiles.push(keys.concat(values));
    }
    return newProfiles;
}

exports.Deduplicate = (tabA, tabB) => {
    try {
        var profilesA = removeDuplicates(tabA);
        var profilesB = removeDuplicates(tabB);
        var profiles = mergeProfiles(profilesA, profilesB);
        var newProfiles = hashTableToList(profiles);
    } catch(err) {
        var newProfiles = null;
    }
    return newProfiles;
}