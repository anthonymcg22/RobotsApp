"use strict";
var RobotApp = {};            //  robot app object
RobotApp.robot = function (name, metal, img) {      // robot constructor function
    this.name = name;
    this.metal = metal;
    this.img = img;
};
RobotApp.robots = [];             // array of robots
RobotApp.makeRobot = function () {
    var name = document.getElementById("name");         // grab values of input fields
    var metal = document.getElementById("metal");
    var img = document.getElementById("img");
    if (name.value !== "" && metal.value !== "" && img !== "") {
        var newRobot = new RobotApp.robot(name.value, metal.value, img.value);  // make new robot object         // add robot to array
        RobotApp.masterAJAX('POST', "https://robotjavascript.firebaseio.com/.json", function (data) { RobotApp.getKey(data, newRobot) }, newRobot);  //add to database
    }
    document.getElementById("name").value = "";         // grab values of input fields
    document.getElementById("metal").value = "";
    document.getElementById("img").value = "";
};
RobotApp.makeTable = function () {                   //making the table body robotized
    var tbody = document.getElementById("tableBody");     //grabbing table body and setting it to empty
    tbody.innerHTML = "";
    for (var i = 0; i < RobotApp.robots.length; i++) {    // loops through objects in array
        var row = '<tr><td>' + RobotApp.robots[i].name + '</td><td>' + RobotApp.robots[i].metal + '</td><td><img src=\"' + RobotApp.robots[i]["img"] + '\"/></td><td><span class="btn btn-danger" onclick="RobotApp.editRobot(' + i + ')">Edit</span></td><td><span onclick="RobotApp.deleteRobot(' + i + ',\'' + RobotApp.robots[i].key + '\')" class="btn btn-success">Delete</span></td></tr>';
        tbody.innerHTML += row;
    };
};
RobotApp.sort = function () {
    var sort = document.getElementById("sort").value;
    RobotApp.robots.sort(function (a, b) {
        if (a[sort].toLowerCase() > b[sort].toLowerCase())
            return 1;
        else if (a[sort].toLowerCase() < b[sort].toLowerCase())
            return -1;
        else
            return 0;
    });
    var order = document.getElementById("order").value;
    if (order === "descending")
        RobotApp.robots.reverse();
    RobotApp.makeTable();
};
RobotApp.deleteRobot = function (index, key) {
    RobotApp.robots.splice(index, 1);
    RobotApp.masterAJAX('DELETE', "https://robotjavascript.firebaseio.com/" + key + ".json", function () { RobotApp.makeTable(); });
};
RobotApp.editRobot = function (index) {
    var tbody = document.getElementById("tableBody");
    tbody.childNodes[index].innerHTML = '<tr><td><input id="1" type="text" value="' + RobotApp.robots[index]["name"] + '"></td><td><input id="2" type="text" value="' + RobotApp.robots[index]["metal"] + '"></td><td><input id="3" type="text" value="' + RobotApp.robots[index]["img"] + '"></td><td><span class="btn btn-danger" onclick="RobotApp.saveEdit(' + index + ',\'' + RobotApp.robots[index].key + '\')">Save Edit</span></td><td><span onclick="RobotApp.makeTable()" class="btn btn-success">Cancel Edit</span></td></tr>';
};
RobotApp.saveEdit = function (i, key) {
    var name = document.getElementById("1").value;
    var metal = document.getElementById("2").value;
    var img = document.getElementById("3").value;
    RobotApp.robots.splice(i, 1);
    RobotApp.robots.splice(i, 0, { name: name, metal: metal, img: img, key: key });
    RobotApp.masterAJAX('PUT', "https://robotjavascript.firebaseio.com/" + key + ".json", function () { RobotApp.sort(); }, { name: name, metal: metal, img: img });
};
RobotApp.getKey = function (data, robot) {
    robot.key = data.name;
    RobotApp.robots.push(robot);
    RobotApp.sort();
};
RobotApp.getting = function (data) {
    for (var x in data) {
        data[x].key = x;
        RobotApp.robots.push(data[x]);
    }
    RobotApp.sort();
};
RobotApp.masterAJAX = function (method, url, callback, data) {       //master ajax call
    var request = new XMLHttpRequest();
    request.open(method, url, true);
    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            if (callback) {
                callback(JSON.parse(this.response));
            }
        }
        else {
            alert(this.response);
        }
    };
    request.onerror = function () {
        alert("error dude");
    }
    if (data)
        request.send(JSON.stringify(data));
    else
        request.send();
};
RobotApp.masterAJAX('GET', "https://robotjavascript.firebaseio.com/.json", RobotApp.getting);