"use client";
import { useEffect } from "react";

export default function MessengerChat() {
    useEffect(() => {
        if (document.getElementById("facebook-jssdk")) return;

        window.fbAsyncInit = function () {
            window.FB.init({
                xfbml: true,
                version: "v17.0",
            });
        };

        const script = document.createElement("script");
        script.id = "facebook-jssdk";
        script.src = "https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js";
        document.body.appendChild(script);
    }, []);

    return (
        <>
            <div id="fb-root"></div>
            <div
                className="fb-customerchat"
                attribution="biz_inbox"
                page_id="747421228445481"
                theme_color="#0084FF"
                logged_in_greeting="Hi! How can we help you?"
                logged_out_greeting="Hi! Please log in to chat with us."
            ></div>
        </>
    );
}
