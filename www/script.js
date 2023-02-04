/**
 * Obtains parameters from the hash of the URL
 * @return Object
 */
function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while (e = r.exec(q)) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
}



function addDevice(devaddress, state = 'of') {
    var template = $("#device-list-item-template").clone();
    var linumber = document.getElementsByClassName("dev-list-item").length;
    // console.log(linumber)
    template.attr("id", "device-item-" + linumber);

    var remove = template.find(".dev-list-item-delete");
    remove.click(function(event) {
        event.stopPropagation();
        devicesToSend = devicesToSend.filter(dev => dev != devaddress + 'on');
        devicesToSend = devicesToSend.filter(dev => dev != devaddress + 'of');
        settingschanged = true;
        document.getElementById("device-item-" + linumber).remove();
    });

    var onoffswitch = template.find(".dev-list-item-switch");
    onoffswitch.checked = false;

    if (state == 'on') {
        onoffswitch.trigger('click');
        onoffswitch.checked = true;
    }

    onoffswitch.change(function() {
        onoffswitch.checked = !onoffswitch.checked;
        if (onoffswitch.checked) {
            devicesToSend.push(devaddress + 'on');
            devicesToSend = devicesToSend.filter(dev => dev != devaddress + 'of');
        } else {
            devicesToSend.push(devaddress + 'of');
            devicesToSend = devicesToSend.filter(dev => dev != devaddress + 'on');
        }
        settingschanged = true;
    });

    var link = template.find(".dev-list-item-url");
    link.text(devaddress);

    $.ajax({
        url: "http://" + devaddress + "/config.json",
        crossDomain: true,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            var hostname = template.find(".dev-list-item-text");
            hostname.text(data[14].value.deviceHostname);
        }
    });
    // devicesToSend.push(devaddress);
    // settingschanged = true;
    $("#settings-devicelist-panel").append(template);
}

var userProfileSource = document.getElementById('user-profile-template').innerHTML,
    userProfileTemplate = Handlebars.compile(userProfileSource),
    userProfilePlaceholder = document.getElementById('user-profile');

var oauthSource = document.getElementById('oauth-template').innerHTML,
    oauthTemplate = Handlebars.compile(oauthSource),
    oauthPlaceholder = document.getElementById('oauth');

var params = getHashParams();

var shuffle = false;
var repeat = "off";
var playing = false;

var access_token = params.access_token,
    refresh_token = params.refresh_token,
    error = params.error;

if (error) {
    alert('There was an error during the authentication');
} else {
    if (access_token) {
        // render oauth info


        $.ajax({
            url: 'https://api.spotify.com/v1/me',
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function(response) {
                userProfilePlaceholder.innerHTML = userProfileTemplate(response);

                $('#login').hide();
                $('#loggedin').show();
            }
        });

        document.getElementById("song-shuffle").addEventListener('click', function() {
            const urltoput = "https://api.spotify.com/v1/me/player/shuffle?state=" + (shuffle ? "false" : "true");
            $.ajax({
                url: urltoput,
                type: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
        }, false);
        document.getElementById("song-repeat").addEventListener('click', function() {
            var urltoput = "https://api.spotify.com/v1/me/player/repeat?state=";
            if (repeat === "track") urltoput += "off";
            else if (repeat === "context") urltoput += "track";
            else urltoput += "context";
            $.ajax({
                url: urltoput,
                type: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
        }, false);

        document.getElementById("song-repeat-inf").addEventListener('click', function() {
            var urltoput = "https://api.spotify.com/v1/me/player/repeat?state=";
            if (repeat === "track") urltoput += "off";
            else if (repeat === "context") urltoput += "track";
            else urltoput += "context";
            $.ajax({
                url: urltoput,
                type: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
        }, false);

        document.getElementById("song-play").addEventListener('click', function() {
            var urltoput = playing ? "https://api.spotify.com/v1/me/player/pause" : "https://api.spotify.com/v1/me/player/play";
            $.ajax({
                url: urltoput,
                type: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
        }, false);

        document.getElementById("song-pause").addEventListener('click', function() {
            var urltoput = playing ? "https://api.spotify.com/v1/me/player/pause" : "https://api.spotify.com/v1/me/player/play";
            $.ajax({
                url: urltoput,
                type: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
        }, false);

        document.getElementById("song-next").addEventListener('click', function() {
            var urltoput = "https://api.spotify.com/v1/me/player/next";
            $.ajax({
                url: urltoput,
                type: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
        }, false);

        document.getElementById("song-prev").addEventListener('click', function() {
            var urltoput = "https://api.spotify.com/v1/me/player/previous";
            $.ajax({
                url: urltoput,
                type: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
        }, false);

        setInterval(() => {
            var trackID = "";
            $.ajax({
                url: 'https://api.spotify.com/v1/me/player/',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                data: {
                    additional_types: 'track'
                },
                success: function(response) {
                    var songimg = document.getElementById("song-img");
                    var songshuffle = document.getElementById("song-shuffle");
                    var songartist = document.getElementById("song-artist");
                    var songtitle = document.getElementById("song-title");
                    var songrepeat = document.getElementById("song-repeat");
                    var songrepeatinf = document.getElementById("song-repeat-inf");
                    var songplay = document.getElementById("song-play");
                    var songpause = document.getElementById("song-pause");
                    var deviceplaying = document.getElementById("playing-device");
                    // console.log(response);
                    try {
                        songimg.src = response.item.album.images[0].url;
                    } catch (e) {
                        songimg.src = "assets/not-playing.png";
                        // console.log(e);
                    }

                    try {
                        trackID = response.item.id;
                        // console.log(trackID);
                        songtitle.innerHTML = response.item.name;
                        songartist.innerHTML = response.item.artists[0].name;
                        deviceplaying.innerHTML = response.device.name;


                        if (response.shuffle_state) {
                            songshuffle.classList = "song-control-icons";
                            shuffle = true;
                        } else {
                            songshuffle.classList = "song-control-icons-inactive";
                            shuffle = false;
                        }

                        if (response.is_playing) {
                            songplay.style.display = "none";
                            songpause.style.display = "initial";
                            playing = true;
                        } else {
                            songplay.style.display = "initial";
                            songpause.style.display = "none";
                            playing = false;
                        }

                        if (response.repeat_state === "track") {
                            songrepeat.style.display = "none";
                            songrepeatinf.style.display = "initial";
                            songrepeat.classList = "song-control-icons";
                            repeat = "track";
                        } else if (response.repeat_state === "context") {
                            songrepeat.style.display = "initial";
                            songrepeatinf.style.display = "none";
                            songrepeat.classList = "song-control-icons";
                            repeat = "context";
                        } else {
                            songrepeat.style.display = "initial";
                            songrepeatinf.style.display = "none";
                            songrepeat.classList = "song-control-icons-inactive";
                            repeat = "off";
                        }

                        $.ajax({
                            url: 'https://api.spotify.com/v1/audio-features',
                            headers: {
                                'Authorization': 'Bearer ' + access_token
                            },
                            data: {
                                ids: trackID
                            },
                            success: function(response) {
                                // console.log(response);
                                try {
                                    if (useBPM) {
                                        postValue("speed", Math.round(response.audio_features[0].tempo));
                                        updateFieldValue("speed", Math.round(response.audio_features[0].tempo));
                                    }
                                } catch (e) {
                                    // console.log(e)
                                }

                            }
                        });
                    } catch (e) {

                    }
                }
            });
        }, 1000);

        // setInterval(() => {
        //     $.ajax({
        //         url: '/refresh_token',
        //         data: {
        //             'refresh_token': refresh_token
        //         }
        //     }).done(function(data) {
        //         access_token = data.access_token;
        //         oauthPlaceholder.innerHTML = oauthTemplate({
        //             access_token: access_token,
        //             refresh_token: refresh_token
        //         });
        //     });
        // }, 3500);

    } else {
        // render initial screen
        $('#login').show();
        $('#loggedin').hide();
    }


    setTimeout(function() {

        $('#add-btn').click(function(event) {
            event.stopPropagation();
            var usrinput = document.getElementById('add-input').value;
            if (usrinput != "") addDevice(usrinput);
        });
        $('#add-input').click(function(event) {
            event.stopPropagation();
        });
        $('#settings').click(function(event) {
            event.stopPropagation();
        });

        $('#settings-devices-btn').click(function(event) {
            event.stopPropagation();
            document.getElementById("settings-right-devices").style.display = "block"
            document.getElementById("settings-right-page").style.display = "none"
            document.getElementById("settings-right-design").style.display = "none"

            document.getElementById("settings-devices-btn").style.border = "2px solid var(--accent)"
            document.getElementById("settings-devices-btn").style.backgroundColor = "var(--border)"

            document.getElementById("settings-page-btn").style.backgroundColor = "var(--bg)"
            document.getElementById("settings-page-btn").style.border = "unset"
            document.getElementById("settings-design-btn").style.backgroundColor = "var(--bg)"
            document.getElementById("settings-design-btn").style.border = "unset"
            document.getElementById("settings-close-btn").style.backgroundColor = "var(--bg)"
            document.getElementById("settings-close-btn").style.border = "unset"
        });

        $('#settings-page-btn').click(function(event) {
            event.stopPropagation();
            document.getElementById("settings-right-page").style.display = "block"
            document.getElementById("settings-right-devices").style.display = "none"
            document.getElementById("settings-right-design").style.display = "none"

            document.getElementById("settings-page-btn").style.border = "2px solid var(--accent)"
            document.getElementById("settings-page-btn").style.backgroundColor = "var(--border)"


            document.getElementById("settings-design-btn").style.backgroundColor = "var(--bg)"
            document.getElementById("settings-design-btn").style.border = "unset"
            document.getElementById("settings-devices-btn").style.backgroundColor = "var(--bg)"
            document.getElementById("settings-devices-btn").style.border = "unset"
            document.getElementById("settings-close-btn").style.backgroundColor = "var(--bg)"
            document.getElementById("settings-close-btn").style.border = "unset"
        });

        $('#settings-design-btn').click(function(event) {
            event.stopPropagation();
            document.getElementById("settings-right-page").style.display = "none"
            document.getElementById("settings-right-devices").style.display = "none"
            document.getElementById("settings-right-design").style.display = "flex"

            document.getElementById("settings-design-btn").style.border = "2px solid var(--accent)"
            document.getElementById("settings-design-btn").style.backgroundColor = "var(--border)"

            document.getElementById("settings-page-btn").style.backgroundColor = "var(--bg)"
            document.getElementById("settings-page-btn").style.border = "unset"
            document.getElementById("settings-devices-btn").style.backgroundColor = "var(--bg)"
            document.getElementById("settings-devices-btn").style.border = "unset"
            document.getElementById("settings-close-btn").style.backgroundColor = "var(--bg)"
            document.getElementById("settings-close-btn").style.border = "unset"
        });

        $('#settings-close-btn').click(function(event) {
            event.stopPropagation();
            document.getElementById("settings").style.visibility = "hidden"
            document.getElementById("makedark").style.visibility = "hidden"

            document.getElementById("settings-right-devices").style.display = "inline-block"
            document.getElementById("settings-right-page").style.display = "none"
            document.getElementById("settings-right-design").style.display = "none"

            document.getElementById("settings-devices-btn").style.border = "2px solid var(--accent)"
            document.getElementById("settings-devices-btn").style.backgroundColor = "var(--border)"

            document.getElementById("settings-page-btn").style.backgroundColor = "var(--bg)"
            document.getElementById("settings-page-btn").style.border = "unset"
            document.getElementById("settings-design-btn").style.backgroundColor = "var(--bg)"
            document.getElementById("settings-design-btn").style.border = "unset"
            document.getElementById("settings-close-btn").style.backgroundColor = "var(--bg)"
            document.getElementById("settings-close-btn").style.border = "unset"
        });

        $(window).click(function() {
            document.getElementById("settings").style.visibility = "hidden"
            document.getElementById("makedark").style.visibility = "hidden"
        });

        $('#img-settings').click(function(event) {
            // document.getElementById("settings").classList.toggle("isopen");
            document.getElementById("settings").style.visibility = "visible";
            document.getElementById("makedark").style.visibility = "visible";
            event.stopPropagation();
        });

        $('#img-settings2').click(function(event) {
            // document.getElementById("settings").classList.toggle("isopen");
            document.getElementById("settings").style.visibility = "visible";
            document.getElementById("makedark").style.visibility = "visible";
            event.stopPropagation();
        });

        var accent = document.getElementById("in-accent");
        var text = document.getElementById("in-text");
        var bg = document.getElementById("in-bg");
        var border = document.getElementById("in-border");
        var textdark = document.getElementById("in-textdark");
        var bgl = document.getElementById("in-bgl");

        var root = document.querySelector(':root');

        accent.addEventListener("change", (event) => {
            root.style.setProperty("--accent", accent.value);
            localStorage.setItem("accent", accent.value);
        });
        text.addEventListener("change", (event) => {
            root.style.setProperty("--text", text.value);
            localStorage.setItem("text", text.value);
        });
        bg.addEventListener("change", (event) => {
            root.style.setProperty("--bg", bg.value);
            localStorage.setItem("bg", bg.value);
        });
        border.addEventListener("change", (event) => {
            root.style.setProperty("--border", border.value);
            localStorage.setItem("border", border.value);
        });
        textdark.addEventListener("change", (event) => {
            root.style.setProperty("--textDark", textdark.value);
            localStorage.setItem("textDark", textdark.value);
        });
        bgl.addEventListener("change", (event) => {
            root.style.setProperty("--bgl", bgl.value);
            localStorage.setItem("bgl", bgl.value);
        });
        // console.log(localStorage.getItem("accent") + "hery");
        root.style.setProperty("--accent", localStorage.getItem("accent"));
        root.style.setProperty("--text", localStorage.getItem("text"));
        root.style.setProperty("--bg", localStorage.getItem("bg"));
        root.style.setProperty("--border", localStorage.getItem("border"));
        root.style.setProperty("--textDark", localStorage.getItem("textDark"));
        root.style.setProperty("--bgl", localStorage.getItem("bgl"));

        accent.value = localStorage.getItem("accent");
        accent.text = localStorage.getItem("text");
        accent.bg = localStorage.getItem("bg");
        accent.border = localStorage.getItem("border");
        accent.textdark = localStorage.getItem("textDark");
        accent.bgl = localStorage.getItem("bgl");

    }, 300);
}