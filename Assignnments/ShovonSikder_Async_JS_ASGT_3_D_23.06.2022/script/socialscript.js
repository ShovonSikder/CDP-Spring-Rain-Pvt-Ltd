//post template
class Post {
    constructor(userName, date, content, postId) {
        this.userName = userName;
        this.date = date;
        this.content = content;
        this.numOfLikes = 0;
        this.postId = postId;
    }
    getLocation() {
        // split the full date string and gate country
        return this.date.toString().split(" ")[6].replace("(", "");
    }
    getTime() {
        // split the full date string and gate time then split it to get hour,min,seconds
        const time = this.date.toString().split(" ")[4].split(":");
        var x;
        if (time[0] > 11) {
            time[0] = time[0] % 13 + 1
            x = " PM";
        }
        else {
            if (time[0] == 0)
                time[0] = 12;
            x = " AM";
        }
        if (time[0] < 10)
            return "0" + time[0] + ":" + time[1] + x;

        return time[0] + ":" + time[1] + x;
    }

}

//user template
class User {
    constructor(name, profileImg) {
        this.name = name;
        this.profileImg = profileImg;
    }
}


//array of post objects
var postList = [];
var videoPostList = [];
var liveReact = 0;

//current user
var user;

//buttons
const postButton = document.getElementById("post");
const uploadButton = document.getElementById("upload");
const regButton = document.getElementById("submit");
const logOut = document.getElementById("log-out");

//nav links
const home = document.getElementById("home");
const video = document.getElementById("video");
const live = document.getElementById("live");
const navLinks = [home, video, live];

//button listenners
postButton.addEventListener("click", addPost);
uploadButton.addEventListener('click', uploadVideo);
regButton.addEventListener('click', addUser);
logOut.addEventListener('click', () => { location.reload(); })

//add new user
function addUser() {
    const name = document.getElementById("userName");
    const profileImg = document.getElementById("profileImg");
    if (name.value == "" || profileImg.value == "") {
        alert("Name and image requires");
        return;
    }

    user = new User(name.value, profileImg.files[0]);
    document.getElementsByClassName("reg-form")[0].setAttribute("style", "display:none");
    document.getElementById("profile").setAttribute("src", URL.createObjectURL(user.profileImg));
    document.getElementsByClassName("root-container")[0].setAttribute("style", "display:block");
}

//nav bar listenners
//home nav item
home.addEventListener('click', () => {
    addPostElement();
    navigationTo(0);
    //re display the post list
    if (postList.length > 0) {
        for (var i = 0; i < postList.length; i++) {
            displayPost(postList[i]);
        }
    }
});

//video nav item
video.addEventListener('click', () => {
    navigationTo(1)
    addVideoUpElement();

    //re display the video post list
    videoPostList.forEach(post => {
        displayPost(post, true);
    });

});

//live nav item
live.addEventListener('click', () => {
    navigationTo(2);
    const newPost = new Post(user.name, new Date(), "Live", 1);
    displayPost(newPost, true, true);
});

//for changing nav style
function navigationTo(index) {
    document.getElementById("content-container").innerHTML = "<div><br><br>Theres always more!!!</div>";
    if (index == 2)
        navLinks[index].setAttribute("style", "color:rgb(183, 8, 8);");
    else
        navLinks[index].setAttribute("style", "color:blue;");

    for (var i = 0; i < 3; i++) {
        if (i == index) continue;
        navLinks[i].setAttribute("style", "color:black;");
    }

}

//modify input field for file upload
function addVideoUpElement() {
    document.getElementById("status").setAttribute("type", "file");
    document.getElementById("post").setAttribute("style", "display:none");
    document.getElementById("upload").setAttribute("style", "display:inline");
}

//modify input field for text input
function addPostElement() {
    document.getElementById("status").setAttribute("type", "text");
    document.getElementById("post").setAttribute("style", "display:inline");
    document.getElementById("upload").setAttribute("style", "display:none");
}

//add new text post
function addPost() {
    const content = document.getElementById("status");
    if (content.value != "") {
        const newPost = new Post(user.name, new Date(), content.value, postList.length);
        postList.push(newPost);
        displayPost(postList[postList.length - 1]);
    }

    content.value = "";

}

//upload video and watch
function uploadVideo() {
    const content = document.getElementById("status");
    if (content.value != "") {
        const newPost = new Post(user.name, new Date(), content.files[0], videoPostList.length);
        videoPostList.push(newPost);
        displayPost(videoPostList[videoPostList.length - 1], true);
    }
    content.value = "";
}

//organize and display the post in a card
function displayPost(post, video = false, live = false) {
    const contentContainer = document.getElementById("content-container");
    const postCard = document.createElement("div");
    const name = document.createElement("div");
    const nameBold = document.createElement("b");
    const locAnddate = document.createElement("div");
    const locSmall = document.createElement("small");
    const reacts = document.createElement("div");
    const reactButton = document.createElement("button");
    const dislikeButton = document.createElement("button");
    const countLikes = document.createElement("span");

    var content;


    countLikes.innerHTML = " " + post.numOfLikes + " like";

    reactButton.textContent = "Like";
    dislikeButton.innerText = "Dislike";


    reacts.appendChild(reactButton);
    reacts.appendChild(dislikeButton);
    reacts.appendChild(countLikes);

    //if the post is for video
    if (video) {
        content = document.createElement("video");
        if (live) {
            content.setAttribute("id", "live-video");
            content.autoplay = true;
            goLive(content);

            //dynamic event listener for likes
            reactButton.addEventListener('click', () => {
                liveReact++;
                if (liveReact < 0)
                    countLikes.innerHTML = " " + (liveReact * -1) + (liveReact > 1 ? " Dislikes" : " Dislike");
                else
                    countLikes.innerHTML = " " + liveReact + (liveReact > 1 ? " likes" : " like");
            });

            //dynamic event for dislikes
            dislikeButton.addEventListener('click', () => {
                liveReact--;

                if (liveReact < 0)
                    countLikes.innerHTML = " " + (liveReact * -1) + (liveReact * -1 > 1 ? " Dislikes" : " Dislike");
                else
                    countLikes.innerHTML = " " + liveReact + (liveReact > 1 ? " likes" : " like");
            });

        } else {
            content.src = URL.createObjectURL(post.content);
            content.autoplay = false;
            //dynamic event listener for likes
            reactButton.addEventListener('click', () => {
                videoPostList[post.postId].numOfLikes++;
                if (videoPostList[post.postId].numOfLikes < 0)
                    countLikes.innerHTML = " " + (videoPostList[post.postId].numOfLikes * -1) + (videoPostList[post.postId].numOfLikes * -1 > 1 ? " Dislikes" : " Dislike");
                else
                    countLikes.innerHTML = " " + videoPostList[post.postId].numOfLikes + (videoPostList[post.postId].numOfLikes > 1 ? " likes" : " like");
            });
            //dynamic event listener for dislikes
            dislikeButton.addEventListener('click', () => {
                videoPostList[post.postId].numOfLikes--;

                if (videoPostList[post.postId].numOfLikes < 0)
                    countLikes.innerHTML = " " + (videoPostList[post.postId].numOfLikes * -1) + (videoPostList[post.postId].numOfLikes * -1 > 1 ? " Dislikes" : " Dislike");
                else
                    countLikes.innerHTML = " " + videoPostList[post.postId].numOfLikes + (videoPostList[post.postId].numOfLikes > 1 ? " likes" : " like");
            });
        }
        content.controls = true;


    }
    else {

        //dynamic event listener for likes
        reactButton.addEventListener('click', () => {
            postList[post.postId].numOfLikes++;
            if (postList[post.postId].numOfLikes < 0)
                countLikes.innerHTML = " " + (postList[post.postId].numOfLikes * -1) + (postList[post.postId].numOfLikes * -1 > 1 ? " Dislikes" : " Dislike");
            else
                countLikes.innerHTML = " " + postList[post.postId].numOfLikes + (postList[post.postId].numOfLikes > 1 ? " likes" : " like");
        });
        //dynamic event listener for dislikes
        dislikeButton.addEventListener('click', () => {
            postList[post.postId].numOfLikes--;

            if (postList[post.postId].numOfLikes < 0)
                countLikes.innerHTML = " " + (postList[post.postId].numOfLikes * -1) + (postList[post.postId].numOfLikes * -1 > 1 ? " Dislikes" : " Dislike");
            else
                countLikes.innerHTML = " " + postList[post.postId].numOfLikes + (postList[post.postId].numOfLikes > 1 ? " likes" : " like");
        });
        content = document.createElement("p");
        content.innerHTML = post.content;
    }



    locSmall.innerHTML = post.getLocation() + " | " + post.getTime();
    locAnddate.appendChild(locSmall);

    nameBold.innerHTML = post.userName;
    name.appendChild(nameBold);

    postCard.appendChild(name);
    postCard.appendChild(locAnddate);
    postCard.appendChild(content);
    postCard.appendChild(reacts);

    postCard.setAttribute("class", "post-card");

    contentContainer.insertBefore(postCard, contentContainer.firstChild);



}

//live feeding
function goLive(videoElement) {

    window.navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            videoElement.srcObject = stream;

        })
        .catch(error => {
            alert('You have to enable the mike and the camera');
        });
}

//to stop the live stream. Reload page instead
// function stopLive(videoElement){
//   const tracks =videoElement.srcObject.getTracks();

//   tracks.forEach(function(track) {
//     track.stop();
//   });

//   videoElem.srcObject = null;
// }


