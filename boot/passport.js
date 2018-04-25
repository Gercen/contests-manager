let nconf = require("nconf");
let passport = require("passport");
let User = require("../models/user.js");
let VKontakteStrategy = require("passport-vkontakte").Strategy;

module.exports = function (app) {
    passport.use(new VKontakteStrategy(
        {
            clientID:     nconf.get("vk:app_id"),
            clientSecret: nconf.get("vk:secret"),
            callbackURL:  nconf.get("vk:callback")
        },
        function myVerifyCallbackFn(accessToken, refreshToken, params, profile, done) {
            User.findOrCreate({ vkID: profile.id }, (err, result)=>{
                done(null, result);
            })
        }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
};